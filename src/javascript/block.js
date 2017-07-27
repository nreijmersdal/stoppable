(function() {
	"use strict";

	var PLACEHOLDER = "Type the reason above to continue...";
	var VISIT_BUTTON = "VISIT PAGE ANYWAYS";

	document.addEventListener('DOMContentLoaded', function() {
		var url = window.location;
		var site = isBlocked(url);	
		if (site) {
			var container = createContainer();
			var header = createHeader(site.url, "stoppable_header");
			var reason = createCanvasText(site.reason, "stoppable_reason");
			var input = createInput(PLACEHOLDER, "stoppable_input");
			var visitButton = createButton(VISIT_BUTTON, "stoppable_button");

			input.onkeyup= function(event) {
				if(event.target.value === site.reason) {
					hide(input);
					show(visitButton);
				}
			};
			
			visitButton.onclick = function(event) {
				container.remove();
			};

			container.appendChild(header);
			container.appendChild(reason);
			container.appendChild(input);
			hide(visitButton);
			container.appendChild(visitButton);

			atEndOfLoadingFocus(input);
		}
	});

	function isBlocked(url) {
		var stopList = getStoppedList();
		if (stopList === undefined) return false;

		var result = stopList.filter(function (item) {
			return url.href.includes(item.url);
		});

		return result[0];
	}

	function getStoppedList() {
		return [
			{url:"facebook.com", reason: "Waste..."},
			{url:"linkedin.com", reason: "Hmmm..."},
			{url:"nimble.how", reason: "Yeah..."}
		];
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

	function createButton(text, className) {
		var button = document.createElement("button");
		button.innerHTML= text;
		button.classList.add(className);
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
		window.onload = function() {
			// Wait some milliseconds because some sites have their own focus.
			sleep(100).then(function() {
				input.focus();
			});
		};
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}	
}());