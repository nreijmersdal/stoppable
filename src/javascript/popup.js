const status = require("./status.js");
const storage = require("./storage.js");
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
    const reason = document.getElementById('reason').value;
    addStopListItem(hostname, reason);
  };  
}

function addStopListItem(hostname, reason) {  
  storage.addStopItem({url:hostname,reason:reason}, (error) => {
    if(!error) status.showMessage('Added to stoppable websites.');
    else status.showError(error);
  });
}

function getActiveTabUrl(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
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