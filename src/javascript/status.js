(function() {
	exports.showError = function showError(text) {
  	updateStatus(text, true);
	}

	exports.showMessage = function showMessage(text) {
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
}());