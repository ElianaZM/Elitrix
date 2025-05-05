var gdx = 0;
var kdy = 0;
function Hex(sideLength) {
    this.playThrough = 0;
    this.fillColor = [44, 62, 80];
    this.tempColor = [44, 62, 80];
    this.angularVelocity = 0;
    this.position = 0;
    this.dy = 0;
    this.dt = 1;
    this.sides = 6;
    this.blocks = [];
    this.angle = 180 / this.sides;
    this.targetAngle = this.angle;
    this.shakes = [];
    this.sideLength = sideLength;
    this.strokeColor = 'blue';
    this.x = trueCanvas.width / 2;
    this.y = trueCanvas.height / 2;
    this.ct = 0;
    this.lastCombo = this.ct - settings.comboTime;
    this.lastColorScored = "#000";
    this.comboTime = 1;
    this.texts = [];
    this.lastRotate = Date.now();
    for (var i = 0; i < this.sides; i++) {
        this.blocks.push([]);
    }

    this.shake = function(obj) {
        var angle = 30 + obj.lane * 60;
        angle *= Math.PI / 180;
        var dx = Math.cos(angle) * obj.magnitude;
        var dy = Math.sin(angle) * obj.magnitude;
        gdx -= dx;
        kdy += dy;
        obj.magnitude /= 2 * (this.dt + 0.5);
        if (obj.magnitude < 1) {
            this.shakes = this.shakes.filter(shakeObj => shakeObj !== obj);
        }
    };

    this.addBlock = function(block) {
        if (!(gameState == 1 || gameState === 0)) return;
        block.settled = 1;
        block.tint = 0.6;
        var lane = this.sides - block.fallingLane;
        this.shakes.push({ lane: block.fallingLane, magnitude: 4.5 * (window.devicePixelRatio ? window.devicePixelRatio : 1) * (settings.scale) });
        lane += this.position;
        lane = (lane + this.sides) % this.sides;
        block.distFromHex = MainHex.sideLength / 2 * Math.sqrt(3) + block.height * this.blocks[lane].length;
        this.blocks[lane].push(block);
        block.attachedLane = lane;
        block.checked = 1;
    };

    this.doesBlockCollide = function(block, position, tArr) {
        if (block.settled) return;
        if (position !== undefined) {
            let arr ;
            if (position <= 0 && block.distFromHex - block.iter * this.dt * settings.scale - (this.sideLength / 2) * Math.sqrt(3) <= 0) {
                block.distFromHex = (this.sideLength / 2) * Math.sqrt(3);
                block.settled = 1;
                block.checked = 1;
                saveEvent('collision',0);
            }
        }
    };

    this.rotate = function(steps) {
        if (Date.now() - this.lastRotate < 75 && !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) return;
        if (!(gameState === 1 || gameState === 0)) return;
        
        this.position += steps;
        if (!history[this.ct]) {
            history[this.ct] = {};
        }

        if (!history[this.ct].rotate) {
            history[this.ct].rotate = steps;
        } else {
            history[this.ct].rotate += steps;
        }

        while (this.position < 0) {
            this.position += 6;
        }

        this.position = this.position % this.sides;
        this.blocks.forEach(blocks => {
            blocks.forEach(block => {
                block.targetAngle -= steps * 60;
            });
        });

        this.targetAngle -= steps * 60;
        this.lastRotate = Date.now();
        saveEvent('rotate',0);
    };

    this.draw = function() {
        this.x = trueCanvas.width / 2;
        if (gameState != -2) {
            this.y = trueCanvas.height / 2;
        }
        this.sideLength = settings.hexWidth;
        gdx = 0;
        kdy = 0;
        this.shakes.forEach(shakeObj => this.shake(shakeObj));
        
        if (this.angle > this.targetAngle) {
            this.angularVelocity -= angularVelocityConst * this.dt;
        } else if (this.angle < this.targetAngle) {
            this.angularVelocity += angularVelocityConst * this.dt;
        }

        if (Math.abs(this.angle - this.targetAngle + this.angularVelocity) <= Math.abs(this.angularVelocity)) {
            this.angle = this.targetAngle;
            this.angularVelocity = 0;
        } else {
            this.angle += this.angularVelocity;
        }

        drawPolygon(this.x + gdx, this.y + kdy + this.dy, this.sides, this.sideLength, this.angle, arrayToColor(this.fillColor), 0, 'rgba(0,0,0,0)');
    };
}

function arrayToColor(arr) {
    return 'rgb(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ')';
}
// // function saveEvent(eventName,value = 0) {
    function saveEvent(eventName) {
    // console.log("Evento guardado:", eventName, "Valor:", value);
    console.log("Evento guardado:", eventName);
    var dataEvent={
        "game":"Hetrix",
        "player":playerName,
        "event":eventName,
        "value": 9
    }


    if (ws.readyState === WebSocket.OPEN) {
         ws.send(JSON.stringify(dataEvent));
         console.log("Enviado:", dataEvent);
         } else {
            console.log("WebSocket no esta conectado");
            connectws();
         }

}
window.Hex = Hex;
Hex.prototype.update = function () {
    if (this.currentBlock === null) {
        this.createBlock();
        return;
    }

    this.currentBlock.radius -= this.speed;

    const COLLISION_RADIUS = 35;

    if (this.currentBlock.radius <= COLLISION_RADIUS) {
        this.currentBlock.radius = COLLISION_RADIUS;
        this.place();
        this.currentBlock = null;
    }
};
