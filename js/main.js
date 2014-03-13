var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 979;
canvas.height = 606;
document.body.appendChild(canvas);

var bgImage = new Image();
bgImage.src = "images/canvas_background.png";

var heroImage = new Image();
heroImage.src = "images/hero.png";

var monsterImage = new Image();

var hero = {};
hero.height = 32;
hero.width = 32;
hero.speed = 250;
hero.x = (canvas.width / 2) - (hero.width / 2);
hero.y = (canvas.height / 2) - (hero.height / 2);
hero.dead = false;
hero.hp = 25;
hero.pokeballs = 5;

var monster = {};
monster.width = 30;
monster.height = 32
monster.speed = 50;
monster.x = -100;
monster.y = -100;
monster.xDirection = monster.speed;
monster.yDirection = monster.speed;

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

var gates = new Array(
	new Array(canvas.width / 2, 0),
	new Array(canvas.width, canvas.height / 2),
	new Array(canvas.width / 2, canvas.height),
	new Array(0, canvas.height / 2)
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

var moveHero = function(modifier) {
	if(hero.dead == false) {
		if((38 in keysDown) || (87 in keysDown)) { // Player holding up
			hero.y -= hero.speed * modifier;
		}
		if((40 in keysDown) || (83 in keysDown)) { // Player holding down
			hero.y += hero.speed * modifier;
		}
		if((37 in keysDown) || (65 in keysDown)) { // Player holding left
			hero.x -= hero.speed * modifier;
		}
		if((39 in keysDown) || (68 in keysDown)) { // Player holding right
			hero.x += hero.speed * modifier;
		}
		resetObjectLocation(hero);
	}
};

var catchPokemon = function() {
	if(isTouchingMonster()) {
		if(32 in keysDown) { // Player holding space bar
			if(hero.pokeballs > 0) {
				++pokemon[monster.id].count;
				--hero.pokeballs;
				sendMessage("You caught a Pokemon!");
				spawnMonster();
			} else {
				sendMessage("You don't have a Pokeball!");
			}
		}
	}
};

var spawnMonster = function() {
	random = Math.floor(Math.random() * 18);
	monsterImage.src = "images/pokemon/"+(random + 1)+".png";
	monster.width = pokemon[random].dimensions[0];
	monster.height = pokemon[random].dimensions[1];
	gate = Math.floor(Math.random() * 4) + 1;
	monster.id = random;
	monster.x = gates[gate - 1][0];
	monster.y = gates[gate - 1][1];
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

var moveMonster = function (modifier) {
	monster.x += monster.xDirection * modifier;
	monster.y += monster.yDirection * modifier;
	resetObjectLocation(monster);
};

var updateMonsterAI = function() {
	if(hero.dead == false) {
		updateMonsterDirection();
		monsterAttack();
	}
};

var updateMonsterDirection = function () {
	monster.xDirection = ((Math.random() < 0.5)? -1 : 1) * Math.random() * monster.speed;
	monster.yDirection= ((Math.random() < 0.5)? -1 : 1) * Math.random() * monster.speed;
};

var monsterAttack = function() {
	if(isTouchingMonster()) {
		hero.hp -= 5;
		sendMessage("Pokemon used `Tackle`!");
	}
	checkDead();
};

var isTouchingMonster = function() {
	ret = false;
	if((hero.x <= (monster.x + monster.width)) && (monster.x <= (hero.x + monster.width)) && (hero.y <= (monster.y + monster.height)) && (monster.y <= (hero.y + monster.height))) {
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
	ctx.drawImage(monsterImage, monster.x, monster.y);
	ctx.drawImage(heroImage, hero.x, hero.y);
	$('#pokemon_caught').html(pokemonCaughtCount());
	$('#pokemon_types').html(pokemonTypesCount());
	$('#hit_points').html(hero.hp);
	$('#pokeballs').html(hero.pokeballs);
};

var main = function () {
	if(hero.dead == false) {
		var now = Date.now();
		var delta = now - then;

		moveHero(delta / 1000);
		catchPokemon();
		moveMonster(delta / 1000);
		render();

		then = now;
	}
};

var then = Date.now();
spawnMonster();
setInterval(main, 1);
setInterval(updateMonsterAI, 1750);
