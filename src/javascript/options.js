document.addEventListener('DOMContentLoaded', function() {
  loadOptions();
  saveButtonOnClickHandler();
  addButtonOnClickHandler();
});

function loadOptions() {
  chrome.storage.sync.get({
    // default if empty.
    list: [{url:"facebook.com", reason: "Waste..."}]
  }, function(items) {
    items.list.forEach(function(item) {
      var stopItem = createStopItem(true, item.url, item.reason);
      document.getElementById('list').appendChild(stopItem);
    });
  });
}

function saveOptions() {
  var list = getCheckedListItems();
  if (list.length <= 0) return;

  chrome.storage.sync.set({
    list: list,
  }, function() {
    updateStatus('Options saved.');
  });
}

function getCheckedListItems() {
  var result = [];
  var checkboxes = document.getElementsByName("selected");
  var urls = document.getElementsByName("url");
  var reasons = document.getElementsByName("reason");

  checkboxes.forEach(function(checkbox, index) {
    if(checkbox.checked) {
      result.push({
        url: urls[index].value,
        reason: reasons[index].value
      });    
    }
  });

  return result;
}

function addButtonOnClickHandler() {
  var addButton = document.getElementById('add');
  addButton.onclick = function(event) {
    var stopItem = createStopItem(true,"","");
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

function updateStatus(text) {
  var status = document.getElementById('status');
  status.textContent = text;
  setTimeout(function() {
    status.textContent = '';
  }, 2000);  
}