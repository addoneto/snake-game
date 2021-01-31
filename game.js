let canvas, ctx;
const tiles = 30, width = 800, heigth = width;
const tileSize = width / tiles;

const FPS = 8;
let fpsInterval = 1000 / FPS, now, then, elapsed;

let player, fruit;

window.onload = () => {
    canvas = document.getElementsByTagName('canvas')[0];
    ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = heigth;

    player = new Snake();
    fruit = createFruit();

    background('black');

    then = Date.now();
    fixedUpdate();
}

function background(c) {
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function fixedUpdate() {
    requestAnimationFrame(fixedUpdate);

    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        background('black');

        drawFruit();

        player.update();
        player.checkFruit();
    }
}

function drawFruit(){
    ctx.fillStyle = 'purple';
    ctx.fillRect(fruit.x * tileSize, fruit.y * tileSize, tileSize, tileSize);
}

function createFruit(){
    return {x: randint(0, tiles), y: randint(0, tiles)};
}

function randint(min, max) {
    min = Math.ceil(min); max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
  

class Snake {
    constructor() {
        this.pos = { x: tiles / 2, y: tiles / 2 };
        this.dir = { x: 0, y: 0 }

        this.tailLength = 0;
        this.tailPositions = [];
    }

    setDir(x, y) {
        // TODO: implement previous moves for more fluid motion

        this.dir.x = x;
        this.dir.y = y;
    }

    update() {
        // inverse update positions

        for(let i = 1; i < this.tailLength; i++){
            let previousPos = this.tailPositions[this.tailLength - 1 - i];
            this.tailPositions[this.tailLength - i] = {x: previousPos.x, y: previousPos.y};
        }

        if(this.tailLength > 0) this.tailPositions[0] = {x: this.pos.x, y: this.pos.y}

        this.pos.x += this.dir.x;
        this.pos.y += this.dir.y;

        if(this.pos.y < 0) this.pos.y = tiles;
        if(this.pos.y > tiles) this.pos.y = 0;

        if(this.pos.x < 0) this.pos.x = tiles;
        if(this.pos.x > tiles) this.pos.x = 0;

        this.checkTailCollision();

        this.draw();
    }

    checkTailCollision(){
        for(let i = 0; i < this.tailPositions.length; i++){
            let cTailPos = this.tailPositions[i];
            if(this.pos.x === cTailPos.x && this.pos.y === cTailPos.y){
                location.reload();
            }
        }
    }

    checkFruit() {
        if(this.pos.x === fruit.x && this.pos.y === fruit.y){
            this.tailLength++;
            fruit = createFruit();
        }
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(this.pos.x * tileSize, this.pos.y * tileSize, tileSize, tileSize);

        // draw tail tiles
        for(let i = 0; i < this.tailPositions.length; i++){
            let p = this.tailPositions[i];
            ctx.fillRect(p.x * tileSize, p.y * tileSize, tileSize, tileSize);
        }
    }
}

document.addEventListener('keydown', function (event) {
    let key = event.code;

    switch (key) {
        case 'ArrowRight':
            player.setDir(1, 0);
            break;
        case 'ArrowLeft':
            player.setDir(-1, 0);
            break;
        case 'ArrowUp':
            player.setDir(0, -1);
            break;
        case 'ArrowDown':
            player.setDir(0, 1);
    }
});