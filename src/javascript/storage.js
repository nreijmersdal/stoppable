(function() {
	"use strict";

	exports.getSettings = function getSettings(callback) {
		chrome.storage.sync.get(
			getDefaults(),
			callback
		);
	}

	exports.saveSettings = function saveSettings(data, callback) {
		chrome.storage.sync.set(data, callback);
	}

	function getDefaults() {
		return {
			list: [{url:"facebook.com", reason: "I would rather plan a real social visit than waste my time here...", unlockedTill:0}],
			redirectUrl: "https://app.weekplan.net"
		}
	}

}());