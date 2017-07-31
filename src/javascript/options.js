var DEFAULT_REASON = "This page is nice, but also wasteful, I visit it wisely!";

document.addEventListener('DOMContentLoaded', function() {
  loadOptions();
  saveButtonOnClickHandler();
  addButtonOnClickHandler();
});

function loadOptions() {
  chrome.storage.sync.get({
    // default if empty.
    list: [{url:"facebook.com", reason: "I would rather plan a real social visit than waste my time here...", unlockedTill:0}],
    redirectUrl: "https://app.weekplan.net"
  }, function(items) {
    items.list.forEach(function(item) {
      var stopItem = createStopItem(true, item.url, item.reason);
      document.getElementById('list').appendChild(stopItem);
    });
    document.getElementById('redirectUrl').value = items.redirectUrl;
  });
}

function saveOptions() {
  var list = getCheckedListItems();
  var redirectUrl = document.getElementById('redirectUrl').value;
  if (redirectUrl.length <= 0) return;
  if (list.length <= 0) return;

  chrome.storage.sync.set({
    list: list,
    redirectUrl: redirectUrl
  }, function() {
    showMessage('Options saved.');
  });
}

function getCheckedListItems() {
  var result = [];
  var checkboxes = document.getElementsByName("selected");
  var urls = document.getElementsByName("url");
  var reasons = document.getElementsByName("reason");

  try {
    checkboxes.forEach(function(checkbox, index) {
      if(checkbox.checked) {
        if(urls[index].value && reasons[index].value) {
          if (reasons[index].value.length <= 19) throw Error("Reason to short, minumum is 20");
          result.push({
            url: urls[index].value,
            reason: reasons[index].value
          });    
        }
      }
    });
  } catch (e) {
    showError('Reason to short, minumum is 20 chars.');
    return [];
  }

  return result;
}

function addButtonOnClickHandler() {
  var addButton = document.getElementById('add');
  addButton.onclick = function(event) {
    var stopItem = createStopItem(true,"",DEFAULT_REASON);
    document.getElementById('list').appendChild(stopItem);
  };  
}

function saveButtonOnClickHandler() {
  document.getElementById('save').addEventListener('click', saveOptions);
}


function createStopItem(state, urlText, reasonText) {
    var listItem = document.createElement("li");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "selected";
    checkbox.checked = state;
    var url = document.createElement("input");
    url.type = "text";
    url.name = "url";
    url.value = urlText;
		var reason = document.createElement("input");            
    reason.type = "text";
    reason.name = "reason";
    reason.value = reasonText;

    listItem.appendChild(checkbox);
    listItem.appendChild(createSpace());
    listItem.appendChild(url);
    listItem.appendChild(createSpace());
    listItem.appendChild(reason);
      
		return listItem;	  
}

function createSpace() {
  var span = document.createElement("span");
  span.innerHTML = "&nbsp;";
  return span;
}

function showError(text) {
  updateStatus(text, true);
}

function showMessage(text) {
  updateStatus(text, false);
}

function updateStatus(text, showError) {
  var status = document.getElementById('status');
  if(showError) {
    status.style.color = "red";
  } else {
    status.style.color = "black";    
  }
  status.textContent = text;
  setTimeout(function() {
    status.textContent = '';
  }, 5000);  
}