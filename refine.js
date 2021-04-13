var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
class Game {
    constructor() {
        this.xPos = 370;
        this.yPos = 370;
        this.blockList = [];
        this.length = 2;
        this.score = 0;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 750;
        this.canvas.height = 750;
        document.getElementById("holder").append(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.render();
    }
    get apple() {
        return this._apple;
    }
    set apple(setTo) {
        this._apple = setTo;
        this.length = this.length += 4;
        this.toWhite(this.apple);
    }
    render() {
        window.addEventListener("keydown", (e) => {
            this.direction = this.findDirection(e.key);
        });
        this.run = setInterval(() => {
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, 0, 750, 750);
            for (let i = 0; i < this.blockList.length; i++) {
                this.toWhite(this.blockList[i]);
            }
            this.addSquaresToBlockList();
            this.adjustLength();
            this.toWhite(this.apple);
            this.consumeApple();
        }, 50);
        this.randomAppleCoord();
    }
    randomAppleCoord() {
        let x = Math.floor(Math.random() * 50) * 10;
        while (x <= 20 || x >= 470) {
            x = Math.floor(Math.random() * 50) * 10;
        }
        let y = Math.floor(Math.random() * 50) * 10;
        while (y <= 20 || y >= 470) {
            x = Math.floor(Math.random() * 50) * 10;
        }
        for (let i = 0; i < this.blockList.length; i++) {
            while (this.blockList[i].xCoor === x) {
                x = Math.floor(Math.random() * 50) * 10;
            }
            while (this.blockList[i].yCoor === y) {
                y = Math.floor(Math.random() * 50) * 10;
            }
        }
        this.apple = {
            side: 10,
            xCoor: x,
            yCoor: y,
        };
    }
    addSquaresToBlockList() {
        if (this.xPos >= 0 &&
            this.xPos <= 750 &&
            this.yPos >= 0 &&
            this.yPos <= 750) {
            switch (this.direction) {
                case Direction.Up:
                    this.newBlock(this.xPos, this.yPos);
                    this.yPos -= 10;
                    break;
                case Direction.Right:
                    this.newBlock(this.xPos, this.yPos);
                    this.xPos += 10;
                    break;
                case Direction.Down:
                    this.newBlock(this.xPos, this.yPos);
                    this.yPos += 10;
                    break;
                case Direction.Left:
                    this.newBlock(this.xPos, this.yPos);
                    this.xPos -= 10;
                    break;
            }
        }
        else {
            this.endPage(false);
        }
    }
    findDirection(input) {
        switch (input.toLowerCase()) {
            case "w":
                return Direction.Up;
            case "d":
                return Direction.Right;
            case "s":
                return Direction.Down;
            case "a":
                return Direction.Left;
            default:
                return this.direction;
        }
    }
    toWhite(pixel) {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(pixel.xCoor, pixel.yCoor, pixel.side, pixel.side);
    }
    newBlock(x, y) {
        let thisSquare = {
            side: 10,
            xCoor: x,
            yCoor: y,
        };
        this.blockList.forEach((item) => {
            if (item.xCoor === thisSquare.xCoor && item.yCoor === thisSquare.yCoor) {
                this.endPage(false);
            }
        });
        this.blockList.push(thisSquare);
        return thisSquare;
    }
    adjustLength() {
        if (this.length < this.blockList.length) {
            this.blockList.shift();
        }
    }
    endPage(ifWon) {
        let message = ifWon ? "you win" : "you lose";
        clearInterval(this.run);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, 750, 750);
        this.ctx.font = "20px Oxygen";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(message, 330, 355);
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
    consumeApple() {
        if (this.apple.xCoor === this.xPos && this.apple.yCoor === this.yPos) {
            ++this.score >= 15 ? this.endPage(true) : this.randomAppleCoord();
        }
    }
}
const game = new Game();
