var hostname = "";

document.addEventListener('DOMContentLoaded', function() {
  getActiveTabUrl(function(url) {
    hostname = getHostname(url);
    hostname = hostname.replace(/^www\./,'');
  	document.getElementById('url').textContent = "Stoppable website: " + hostname;
  });
  addButtonOnClickHandler();
});

function addButtonOnClickHandler() {
  var addButton = document.getElementById('add');
  addButton.onclick = function(event) {
    var reason = document.getElementById('reason').value;
    if (reason.length <= 19) {
      showError('Reason to short, minumum is 20 chars.');
    } else {
      addStopListItem(hostname, reason);
    }
  };  
}

function addStopListItem(hostname, reason) {
  chrome.storage.sync.get({
    // default if empty.
    list: [{url:"facebook.com", reason: "I would rather plan a real social visit than waste my time here...", unlockedTill:0}]
  }, function(items) {
    items.list.push({url:hostname,reason:reason});
    chrome.storage.sync.set({
      list: items.list,
    }, function() {
      showMessage('Added to stoppable websites.');
    });
  });  
}

function getActiveTabUrl(callback) {
  var options = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(options, function(tabs) {
    var url = tabs[0].url;
    console.assert(typeof url == 'string', 'url should be a string');
    callback(url);
  });
}

var getHostname = function(href) {
    var result;
    var l = document.createElement("a");
    l.href = href;
    result = l.hostname;
    l.remove();
    return result;
};

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