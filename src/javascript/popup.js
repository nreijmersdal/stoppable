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

document.addEventListener('DOMContentLoaded', function() {
  getActiveTabUrl(function(url) {
  	document.getElementById('url').textContent = "Url: " + url;
  });
});
