var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 979;
canvas.height = 606;
document.body.appendChild(canvas);

var bgImage = new Image();
bgImage.src = "images/canvas_background.png";

var heroImage = new Image();
heroImage.src = "images/hero.png";

var pokemon = new Array(
	{count: 0, dimensions: new Array(27, 32)},
	{count: 0, dimensions: new Array(27, 32)},
	{count: 0, dimensions: new Array(29, 32)},
	{count: 0, dimensions: new Array(27, 32)},
	{count: 0, dimensions: new Array(21, 32)},
	{count: 0, dimensions: new Array(32, 24)},
	{count: 0, dimensions: new Array(31, 32)},
	{count: 0, dimensions: new Array(32, 30)},
	{count: 0, dimensions: new Array(30, 32)},
	{count: 0, dimensions: new Array(27, 32)},
	{count: 0, dimensions: new Array(26, 32)},
	{count: 0, dimensions: new Array(28, 32)},
	{count: 0, dimensions: new Array(30, 32)},
	{count: 0, dimensions: new Array(32, 24)},
	{count: 0, dimensions: new Array(32, 30)},
	{count: 0, dimensions: new Array(24, 32)},
	{count: 0, dimensions: new Array(32, 26)},
	{count: 0, dimensions: new Array(18, 32)}
);

var monsterImages = [];
for(var i = 0; i < pokemon.length; i++) {
	monsterImages[i] = new Image();
	monsterImages[i].src = "images/pokemon/" + (i + 1) + ".png";
}

var pokeballImage = new Image();
pokeballImage.src = "images/pokeball.png";

var explosionImage = new Image();
explosionImage.src = "images/explosion.png";

var hero = {};
hero.height = 32;
hero.width = 32;
hero.speed = 1.5;
hero.x = (canvas.width / 2) - (hero.width / 2);
hero.y = (canvas.height / 2) - (hero.height / 2);
hero.dead = false;
hero.hp = 25;
hero.pokeballs = 5;

var monsters = [];

var pokeball = {};
pokeball.x = -100;
pokeball.y = -100;
pokeball.width = 30;
pokeball.height = 30;


var gates = new Array(
	{x: canvas.width / 2, y: 0},
	{x: canvas.width, y: canvas.height / 2},
	{x: canvas.width / 2, y: canvas.height},
	{x: 0, y: canvas.height / 2}
);

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var sendMessage = function(message) {
	$('#messages').html(message);
};

var moveHero = function() {
	if(hero.dead == false) {
		if((38 in keysDown) || (87 in keysDown)) { // Player holding up
			hero.y -= hero.speed;
		}
		if((40 in keysDown) || (83 in keysDown)) { // Player holding down
			hero.y += hero.speed;
		}
		if((37 in keysDown) || (65 in keysDown)) { // Player holding left
			hero.x -= hero.speed;
		}
		if((39 in keysDown) || (68 in keysDown)) { // Player holding right
			hero.x += hero.speed;
		}
		resetObjectLocation(hero);
	}
};

var catchPokemon = function() {
	for(var i = 0; i < monsters.length; i++) {
		if(isTouching(hero, monsters[i])) {
			if(32 in keysDown) { // Player holding space bar
				if(hero.pokeballs > 0) {
					++pokemon[monsters[i].id].count;
					--hero.pokeballs;
					removeMonster(i);
					sendMessage("You caught a Pokemon!");
				} else {
					sendMessage("You don't have a Pokeball!");
				}
			}
		}
	}
};

var catchPokeball = function() {
	if(isTouching(pokeball, hero)) {
		if(16 in keysDown) { // Player holding shift
			if(Math.random() > 0.75) {
				hero.hp = 0;
				ctx.drawImage(explosionImage, pokeball.x, pokeball.y);
				pokeball.x = -100;
				pokeball.y = -100;
				sendMessage('Voltorb exploded!');
				checkDead();
			} else {
				++hero.pokeballs;
				pokeball.x = -100;
				pokeball.y = -100;
			}
		}
	}
};

var spawnMonster = function() {
	if(monsters.length < 5) {
		random = Math.floor(Math.random() * 18);
		gate = Math.floor(Math.random() * 4) + 1;
		monsters.push({
			width: pokemon[random].dimensions[0],
			height: pokemon[random].dimensions[1],
			speed: 2,
			id: random,
			x: gates[gate - 1].x,
			y: gates[gate - 1].y,
			xDirection: 2,
			yDirection: 2
		});
	}
};

var pokemonCaughtCount = function() {
	count = 0;
	for(var i = 0; i < pokemon.length; i++) {
		count += pokemon[i].count;
	}
	return count;
};

var pokemonTypesCount = function() {
	count = 0;
	for(var i = 0; i < pokemon.length; i++) {
		if(pokemon[i].count > 0) {
			++count;
		}
	}
	return count;
};

var moveMonster = function () {
	for(var i = 0; i < monsters.length; i++) {
		monsters[i].x += monsters[i].xDirection;
		monsters[i].y += monsters[i].yDirection;
		monsterEscape(monsters[i], i);
		resetObjectLocation(monsters[i]);
	}
};

var monsterEscape = function(monster, index) {
	if(monsterAtGate(monster)) {
		removeMonster(index);
	}
};

var removeMonster = function(index) {
	monsters.splice(index, 1);
	monsterImages.splice(index, 1);
};

var monsterAtGate = function(monster) {
	var ret = false;
	if(isTouching(gates[0], monster) || isTouching(gates[1], monster) || isTouching(gates[2], monster) || isTouching(gates[3], monster)) {
		if(Math.random() > 0.985) {
			ret = true;
		}
	}
	return ret;
};

var updateMonsterAI = function() {
	if(hero.dead == false) {
		updateMonsterDirection();
		monsterAttack();
	}
};

var updateMonsterDirection = function () {
	for(var i = 0; i < monsters.length; i++) {
		monsters[i].xDirection = ((Math.random() < 0.5)? -1 : 1) * Math.random() * monsters[i].speed;
		monsters[i].yDirection = ((Math.random() < 0.5)? -1 : 1) * Math.random() * monsters[i].speed;
	}
};

var monsterAttack = function() {
	for(var i = 0; i < monsters.length; i++) {
		if(isTouching(hero, monsters[i])) {
			hero.hp -= 5;
			sendMessage("Pokemon used `Tackle`!");
			ctx.drawImage(explosionImage, monsters[i].x, monsters[i].y);
		}
	}
	checkDead();
};

var isTouching = function(a, b) {
	var ret = false;
	if((a.x <= (b.x + b.width)) && (b.x <= (a.x + b.width)) && (a.y <= (b.y + b.height)) && (b.y <= (a.y + b.height))) {
		ret = true;
	}
	return ret;
}

var checkDead = function() {
	if(hero.hp <= 0) {
		hero.hp = 0;
		hero.dead = true;
		$('#hit_points').html(hero.hp);
		if(window.confirm('You Died! Try again?')) {
			location.reload();
		}
	}
}

var generatePokeball = function() {
	if(hero.dead == false) {
		pokeball.x = Math.floor(Math.random() * canvas.width);
		pokeball.y = Math.floor(Math.random() * canvas.height);
		resetObjectLocation(pokeball);
	}
}

var resetObjectLocation = function(object) {
	if(object.y < 0) {
		object.y = 0;
	}
	if(object.x < 0) {
		object.x = 0;
	}
	if(object.y > (canvas.height - object.height)) {
		object.y = canvas.height - object.height;
	}
	if(object.x > (canvas.width - object.width)) {
		object.x = canvas.width - object.width;
	}
}

var render = function () {
	ctx.clearRect (0, 0, canvas.width, canvas.height);
	ctx.drawImage(bgImage, 0, 0);
	for(var i = 0; i < monsters.length; i++) {
		ctx.drawImage(monsterImages[i], monsters[i].x, monsters[i].y);
	}
	ctx.drawImage(pokeballImage, pokeball.x, pokeball.y);
	ctx.drawImage(heroImage, hero.x, hero.y);
	$('#pokemon_caught').html(pokemonCaughtCount());
	$('#pokemon_types').html(pokemonTypesCount());
	$('#hit_points').html(hero.hp);
	$('#pokeballs').html(hero.pokeballs);
};

var main = function () {
	if(hero.dead == false) {
		moveHero();
		catchPokemon();
		catchPokeball();
		moveMonster();
		render();
	}
};

spawnMonster();
setInterval(main, 1);
setInterval(updateMonsterAI, 1250);
setInterval(generatePokeball, 2500);
setInterval(spawnMonster, 4000);
