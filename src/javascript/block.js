
document.addEventListener('DOMContentLoaded', function() {
	var container = createContainer();
	var header = createHeader("facebook.com", "url");
	var reasonText = "I only want to visit this page for serious stuff, not to waste my time!";
	var reason = createCanvasText(reasonText, "reason");
	var input = createInput("Type the reason above to continue...", "check");
	
	container.appendChild(header);
	container.appendChild(reason);
	container.appendChild(input);
	input.focus();
});

function createContainer() {
	var div = document.createElement("div");
	div.classList.add("block");
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
	ctx.font = "25px Helvetica Neue";
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