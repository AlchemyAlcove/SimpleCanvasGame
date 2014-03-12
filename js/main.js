// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 979;
canvas.height = 606;
document.body.appendChild(canvas);

// Background image
var bgImage = new Image();
bgImage.onload = function () {
	ctx.drawImage(bgImage, 0, 0);
};
bgImage.src = "images/canvas_background.png";
