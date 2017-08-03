(function() {
	"use strict";

	exports.getSettings = function getSettings(callback) {
		chrome.storage.sync.get(getDefaults(), callback);
	}

	exports.saveSettings = function saveSettings(data, callback) {
		chrome.storage.sync.set(data, callback);
	}

	exports.addStopItem = function addStopItem(newStopItem, callback) {
		chrome.storage.sync.get(getDefaults(), items => {
			items.list.push(newStopItem);
			exports.saveSettings(items, callback);
		});  		
	}

	exports.updateStopItem = function updateStopItem(updatedStopItem, callback) {
		chrome.storage.sync.get(getDefaults(), items => {
			items.list.forEach((item, index) => {
				if(item.url === updatedStopItem.url) items.list[index] = updatedStopItem;
			});	
			exports.saveSettings(items, callback);
		});  					
	}

	function getDefaults() {
		return {
			list: [{url:"facebook.com", reason: "I would rather plan a real social visit than waste my time here...", unlockedTill:0}],
			redirectUrl: "https://app.weekplan.net"
		}
	}

}());