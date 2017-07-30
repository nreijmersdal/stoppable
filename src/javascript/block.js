(function() {
	"use strict";

	var PLACEHOLDER = "Type reason\u2934 to continue your visit...";
	var UNSTOP_BUTTON = "Unstop for 15 minutes";

	chrome.storage.sync.get({
		list: getDefaultsToUseWhenEmpty()
	}, function(items) {
		var site = isCurrentSiteInStoplist(items.list);
		if (site) {
			var header = createHeader(site.url, "stoppable_header");
			var reason = createCanvasText(site.reason, "stoppable_reason");
			var input = createInput(PLACEHOLDER, "stoppable_input");
			var unlockButton = createHiddenButton(UNSTOP_BUTTON, "stoppable_button");

			if (!document.body) {
				var pageObserver = new MutationObserver(function() {
					if (document.body) {
						initializeAndShowStopScreen(header, reason, input, unlockButton, site);
						pageObserver.disconnect();
					}
				});
				pageObserver.observe(document.documentElement, {childList: true});
			} else {
				initializeAndShowStopScreen(header, reason, input, unlockButton, site);
			}

		}
	});		

	function initializeAndShowStopScreen(header, reason, input, unlockButton, site) {
		var stopScreen = createStopScreen(header, reason, input, unlockButton);
		input.onkeyup = addUnlockCheckEvent(site, input, unlockButton);
		unlockButton.onclick = unlockSiteFor15Minutes(site, stopScreen);
		atEndOfLoadingFocus(input);
	}

	function unlockSiteFor15Minutes(site, stopScreen) {
		return function(event) {
			chrome.storage.sync.get({
				// default if empty.
				list: [{url:"facebook.com", reason: "I would rather plan a real social visit then waste my time here...", unlockedTill:0}]
			}, function(items) {
				// update current website to add 15 minutes.
				items.list.forEach((item, index) => {
						if(item.url === site.url) {
								items.list[index] = {
									url: site.url,
									reason: site.reason,
									unlockedTill: getTimestampMinutesInTheFuture(15)
								};
						}
				});	

				// store full list
				chrome.storage.sync.set({
					list: items.list,
				}, function() {
					stopScreen.remove();
				});
			});  					
		};
	}

	function addUnlockCheckEvent(site, input, visitButton) {
		return function(event) {
			if(event.target.value === site.reason) {
				hide(input);
				show(visitButton);
			}
		};
	}

	function createStopScreen(header, reason, input, visitButton) {
		var container = createContainer();
		container.appendChild(header);
		container.appendChild(reason);
		container.appendChild(input);
		container.appendChild(visitButton);		
		return container;
	}

	function isCurrentSiteInStoplist(stopList) {
		var url = window.location;
		if (stopList === undefined) return false;
		var result = stopList.filter(function (item) {
			var isOnStopList = url.href.includes(item.url);
			var isNotUnlocked = true;
			if(isOnStopList) {
				if(item.unlockedTill && getTimeInSeconds() < item.unlockedTill) {
					return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		});

		return result[0];
	}

	function getTimeInSeconds() {
		return Math.round(+new Date()/1000);
	}

	function getTimestampMinutesInTheFuture(minutes) {
		return (getTimeInSeconds() + (minutes * 60));
	}

	function createContainer() {
		var div = document.createElement("div");
		div.classList.add("stoppable_block");
		document.body.appendChild(div);
		return div;
	}

	function createHeader(text, className) {
		var h1 = document.createElement("h1");
		h1.innerHTML = text;
		h1.classList.add(className);
		return h1;
	}

	function createCanvasText(text, className) {
		var canvas = createHiResCanvas(800, 75);
		canvas.classList.add(className);
		var ctx = canvas.getContext("2d");
		ctx.font = "25px Helvetica Neue, Helvetica, sans-serif";
		ctx.fillStyle = "#AACCFF";
		ctx.fillText(text,0,50, 800);
		return canvas;
	}

	function createInput(placeholder, className) {
		var input = document.createElement("input");
		input.placeholder= placeholder;
		input.classList.add(className);
		return input;	
	}

	function createHiddenButton(text, className) {
		var button = document.createElement("button");
		button.innerHTML= text;
		button.classList.add(className);
		hide(button);
		return button;	
	}

	function createHiResCanvas(width, height) {
			var canvas = document.createElement("canvas");	
			var ratio = window.devicePixelRatio;
			canvas.width = width * ratio;
			canvas.height = height * ratio;
			canvas.style.width = width + "px";
			canvas.style.height = height + "px";
			canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
			return canvas;
	}

	function hide(element) {
		element.style.display = "none";
	}

	function show(element) {
		element.style.display = "";
	}

	function atEndOfLoadingFocus(input) {
		input.focus();
		window.onload = function() {
			// Wait some milliseconds because some sites have their own focus.
			sleep(200).then(function() {
				input.focus();
			});
		};
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}	

	function getDefaultsToUseWhenEmpty() {
		return [{url:"facebook.com", reason: "I would rather plan a real social visit then waste my time here...", unlockedTill:0}];
	}
}());