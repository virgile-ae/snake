enum Direction {
  Up,
  Down,
  Left,
  Right,
}

interface Square {
  side: number;
  xCoor: number;
  yCoor: number;
}

class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private xPos: number = 370;
  private yPos: number = 370;
  private blockList: Square[] = [];
  private direction: Direction;
  private length: number = 2;
  private run: number;
  private score: number = 0;
  private _apple;

  private get apple() {
    return this._apple;
  }
  private set apple(setTo) {
    this._apple = setTo;
    this.length = this.length += 4;
    this.toWhite(this.apple);
  }

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 750;
    this.canvas.height = 750;
    document.getElementById("holder").append(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.render();
  }

  render(): void {
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

  private randomAppleCoord(): void {
    let x: number = Math.floor(Math.random() * 50) * 10;
    while (x <= 10 || x >= 480) {
      x = Math.floor(Math.random() * 50) * 10;
    }
    let y: number = Math.floor(Math.random() * 50) * 10;
    while (y <= 10 || y >= 480) {
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

  private addSquaresToBlockList() {
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
      this.endPage(false);
    }
  }

  private findDirection(input): Direction {
    switch (input.toLowerCase() as String) {
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
  private toWhite(pixel: Square): void {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(pixel.xCoor, pixel.yCoor, pixel.side, pixel.side);
  }

  private newBlock(x: number, y: number): Square {
    let thisSquare: Square = {
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

  private adjustLength(): void {
    if (this.length < this.blockList.length) {
      this.blockList.shift();
    }
  }

  private endPage(ifWon: Boolean): void {
    let message: string = ifWon ? "you win" : "you lose";
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

  private consumeApple(): void {
    if (this.apple.xCoor === this.xPos && this.apple.yCoor === this.yPos) {
      if (++this.score >= 15) {
        this.endPage(true);
      } else {
        this.randomAppleCoord();
      }
    }
  }
}

const game = new Game();
