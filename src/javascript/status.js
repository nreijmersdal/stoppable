(function status() {
  exports.showError = function showError(text) {
    updateStatus(text, true);
  };

  exports.showMessage = function showMessage(text) {
    updateStatus(text, false);
  };

  function updateStatus(text, showError) {
    const statusDiv = document.getElementById('status');
    if (showError) {
      statusDiv.style.color = 'red';
    } else {
      statusDiv.style.color = 'black';
    }
    statusDiv.textContent = text;
    setTimeout(() => {
      statusDiv.textContent = '';
    }, 5000);
  }
}());
