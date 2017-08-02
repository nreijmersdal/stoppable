const status = require("./status.js");
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
      status.showError('Reason to short, minumum is 20 chars.');
    } else {
      addStopListItem(hostname, reason);
    }
  };  
}

function addStopListItem(hostname, reason) {
  // TODO: add storage addItemToList function
  chrome.storage.sync.get({
    // default if empty.
    list: [{url:"facebook.com", reason: "I would rather plan a real social visit than waste my time here...", unlockedTill:0}]
  }, function(items) {
    items.list.push({url:hostname,reason:reason});
    chrome.storage.sync.set({
      list: items.list,
    }, function() {
      status.showMessage('Added to stoppable websites.');
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