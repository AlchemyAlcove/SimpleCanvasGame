var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 979;
canvas.height = 606;
document.body.appendChild(canvas);

var bgImage = new Image();
bgImage.src = "images/canvas_background.png";

var heroImage = new Image();
heroImage.src = "images/hero.png";

var hero = {};
hero.height = 32;
hero.width = 32;
hero.speed = 250;
hero.x = (canvas.width / 2) - (hero.width / 2);
hero.y = (canvas.height / 2) - (hero.height / 2);

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var moveHero = function (modifier) {
	if(38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if(40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if(37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if(39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	if(hero.y < 0) {
		hero.y = 0;
	}
	if(hero.x < 0) {
		hero.x = 0;
	}
	if(hero.y > (canvas.height - hero.height)) {
		hero.y = canvas.height - hero.height;
	}
	if(hero.x > (canvas.width - hero.width)) {
		hero.x = canvas.width - hero.width;
	}
};

var drawn_hero = null;

var render = function () {
	ctx.clearRect (0, 0, canvas.width, canvas.height);
	ctx.drawImage(bgImage, 0, 0);
	ctx.drawImage(heroImage, hero.x, hero.y);
};

var main = function () {
	var now = Date.now();
	var delta = now - then;

	moveHero(delta / 1000);
	render();

	then = now;
};

var then = Date.now();
setInterval(main, 1);
