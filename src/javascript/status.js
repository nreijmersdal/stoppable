(function status() {
  exports.showError = function showError(text) {
    updateStatus(text, true);
  };

  exports.showMessage = function showMessage(text) {
    updateStatus(text, false);
  };

  function updateStatus(text, showError) {
    let textToDisplay = text;
    if (typeof text === typeof []) {
      textToDisplay = text.join('<br>');
    }
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = textToDisplay;

    if (showError) statusDiv.style.color = 'red';
    else statusDiv.style.color = 'black';
  }
}());
