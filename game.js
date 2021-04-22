var Direction;
(function (Direction) {
  Direction[(Direction["Up"] = 0)] = "Up";
  Direction[(Direction["Down"] = 1)] = "Down";
  Direction[(Direction["Left"] = 2)] = "Left";
  Direction[(Direction["Right"] = 3)] = "Right";
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
    this.length += 4;
    this.toWhite(this.apple);
  }
  render() {
    window.addEventListener("keydown", (e) => {
      this.direction = this.findDirection(e.code);
    });
    this.run = setInterval(() => {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, 750, 750);
      for (let i = 0; i < this.blockList.length; i++) {
        this.toWhite(this.blockList[i]);
      }
      this.addSquaresToBlockList();
      this.toWhite(this.apple);
      if (this.apple.xCoor === this.xPos && this.apple.yCoor === this.yPos) {
        this.randomAppleCoord();
        this.score++;
      }
      if (this.blockList.length > this.length) {
        this.blockList.shift();
      }
    }, 50);
    this.randomAppleCoord();
  }
  findDirection(input) {
    switch (input.toLowerCase()) {
      case "keyw":
        return Direction.Up;
      case "keyd":
        return Direction.Right;
      case "keys":
        return Direction.Down;
      case "keya":
        return Direction.Left;
      default:
        return this.direction;
    }
  }
  newBlock(x, y) {
    let thisSquare = {
      side: 10,
      xCoor: x,
      yCoor: y,
    };
    this.blockList.forEach((item) => {
      if (item.xCoor === thisSquare.xCoor && item.yCoor === thisSquare.yCoor) {
        this.endPage();
      }
    });
    this.blockList.push(thisSquare);
    return thisSquare;
  }
  addSquaresToBlockList() {
    if (
      this.xPos >= 0 &&
      this.xPos <= 750 &&
      this.yPos >= 0 &&
      this.yPos <= 750
    ) {
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
    } else {
      this.endPage();
    }
  }
  toWhite(pixel) {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(pixel.xCoor, pixel.yCoor, pixel.side, pixel.side);
  }
  randomAppleCoord() {
    let x = Math.floor(Math.random() * 75) * 10;
    while (x <= 20 || x >= 720) {
      x = Math.floor(Math.random() * 75) * 10;
    }
    let y = Math.floor(Math.random() * 75) * 10;
    while (y <= 20 || y >= 720) {
      y = Math.floor(Math.random() * 75) * 10;
    }
    for (let i = 0; i < this.blockList.length; i++) {
      while (this.blockList[i].xCoor === x) {
        x = Math.floor(Math.random() * 75) * 10;
        while (x <= 20 || x >= 720) {
          x = Math.floor(Math.random() * 75) * 10;
        }
      }
      while (this.blockList[i].yCoor === y) {
        y = Math.floor(Math.random() * 75) * 10;
        while (y <= 20 || y >= 720) {
          y = Math.floor(Math.random() * 75) * 10;
        }
      }
    }
    this.apple = {
      side: 10,
      xCoor: x,
      yCoor: y,
    };
  }
  endPage() {
    let message = `your score was ${this.score}`;
    clearInterval(this.run);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, 750, 750);
    this.ctx.font = "20px Oxygen";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(message, 270, 355);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}
const game = new Game();
