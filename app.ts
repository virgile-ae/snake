const darkMode = document.getElementById("darkMode");
const all = Array.from(
  document.getElementsByTagName("*") as HTMLCollectionOf<HTMLElement>
);

darkMode.addEventListener("click", () => {
  if (darkMode.innerHTML === "light") {
    all.forEach((element) => {
      element.style.color = "white";
      element.style.backgroundColor = "black";
    });
    darkMode.innerHTML = "dark";
  } else {
    all.forEach((element) => {
      element.style.color = "black";
      element.style.backgroundColor = "white";
    });
    darkMode.innerHTML = "light";
  }
});

//Enumeration (listing all possible values for something in this case Direction)
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// Block interface (could replace with class)
interface Block {
  side: number;
  xCoor: number;
  yCoor: number;
}

class Game {
  //Canvas
  private canvas: HTMLCanvasElement;
  //Canvas Rendering Context
  private ctx: CanvasRenderingContext2D;
  //Position of the leading block  (set to middle of the screen)
  private xPos: number = 370;
  private yPos: number = 370;
  //List of all blocks
  private blockList: Block[] = [];
  //Direction that the snake is moving (type is Direction (see above))
  private direction: Direction;
  //Length of the snake
  private length: number = 2;
  //Holds the setInterval function
  private run: number;
  //Score
  private score: number = 0;
  //Apple coordinates
  private _apple: Block;
  //Color of game
  //private _color: string;

  //Getter for apple
  private get apple() {
    return this._apple;
  }
  //Setter for apple that increases the length and calls the toWhite method which displays the apple onscreen
  private set apple(setTo: Block) {
    this._apple = setTo;
    this.length += 4;
    this.toWhite(this.apple);
  }

  // get color() {
  //   return this._color;
  // }

  // set color(setTo: string) {
  //   if (setTo === "black") {
  //     this._color = "white";
  //   } else {
  //     this._color = setTo;
  //   }
  // }

  //Runs when new object is created
  constructor() {
    //Creating a canvas getting canvas context
    this.canvas = document.createElement("canvas");
    //Setting the height and width of canvas
    this.canvas.width = 750;
    this.canvas.height = 750;
    //Appending the canvas to the "holder" div in the html doc
    document.getElementById("holder").append(this.canvas);
    this.canvas.style.border = "2px solid white";
    //Need this to draw on canvas Documentation:(https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)
    this.ctx = this.canvas.getContext("2d");

    // this.color = prompt("What color do you want", "white")
    //   .toLowerCase()
    //   .replace(/\s+/g, "");

    //Calling the render method (see below)
    this.render();
  }

  // Render method
  private render(): void {
    //Listens for keypresses
    window.addEventListener("keydown", (e) => {
      //Sets direction to the keypress if it is valid (uses the findDirection to check if valid)
      this.direction = this.findDirection(e.code);
    });
    //Creates a loop that runs every 66ms
    this.run = setInterval(() => {
      //Fills in whole screen with black
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, 750, 750);
      //Renders each item in blocklist to screen
      for (let i = 0; i < this.blockList.length; i++) {
        this.toWhite(this.blockList[i]);
      }
      //Calls the addsquarestoblocklist method which changes the position of the leading block depending on the direction
      this.addSquaresToBlockList();
      //Renders apple
      this.toWhite(this.apple);

      //If the apple's coordinates match those of the leading block
      if (this.apple.xCoor === this.xPos && this.apple.yCoor === this.yPos) {
        // If the incremented score is = to or larger than 15, displays winpage, else creates new apple which automatically renders (see the setter for apple above)
        /*++this.score >= 15 ? this.endPage(true) : */
        this.randomAppleCoord();
        this.score++;
      }
      //If the length of the blocklist is longer than the length, the length gets reduced. this gives the illusion that the snake is moving although all that is happening is that a leading block is being created and the last blocks are being removed.
      if (this.blockList.length > this.length) {
        this.blockList.shift();
      }
    }, 50);
    //Creates new apple which automatically renders (see the setter for apple above)
    this.randomAppleCoord();
  }

  private randomAppleCoord(): void {
    // Random x coordinate between 0 and 490
    let x: number = Math.floor(Math.random() * 75) * 10;
    //While x <= 20 or x >= 470 a new x coordinate is generated (this is to avoid the block being too close to the edge)
    while (x <= 20 || x >= 720) {
      x = Math.floor(Math.random() * 75) * 10;
    }
    //Same as x but for y coordinate
    let y: number = Math.floor(Math.random() * 75) * 10;
    while (y <= 20 || y >= 720) {
      y = Math.floor(Math.random() * 75) * 10;
    }

    //If the coordinates are the same as those that are in the blocklist it creates new coordinates
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
    // Sets apple to those coordinates (according to the block interface)
    this.apple = {
      side: 10,
      xCoor: x,
      yCoor: y,
    };
  }

  private addSquaresToBlockList() {
    // If the coordinates of the leading block are in the canvas
    if (
      this.xPos >= 0 &&
      this.xPos <= 750 &&
      this.yPos >= 0 &&
      this.yPos <= 750
    ) {
      // Depending on what the direction is set to
      switch (this.direction) {
        //Decreases value of y coordinate by 10 (bringing it up)
        case Direction.Up:
          this.newBlock(this.xPos, this.yPos);
          this.yPos -= 10;
          break;
        //Increases value of x coordinate by 10 (bringing it right)
        case Direction.Right:
          this.newBlock(this.xPos, this.yPos);
          this.xPos += 10;
          break;
        //Increases value of y coordinate by 10 (bringing it down)
        case Direction.Down:
          this.newBlock(this.xPos, this.yPos);
          this.yPos += 10;
          break;
        //Decreases value of x coordinate by 10 (bringing it right)
        case Direction.Left:
          this.newBlock(this.xPos, this.yPos);
          this.xPos -= 10;
          break;
      }
      // If the coordinates aren't within the boundaries of the canvas
    } else {
      // Renders lose page
      this.endPage(/*false*/);
    }
  }

  private findDirection(input): Direction {
    //translates keypress inputs to Direction
    switch (input.toLowerCase() as String) {
      case "keyw":
        return Direction.Up;
      case "keyd":
        return Direction.Right;
      case "keys":
        return Direction.Down;
      case "keya":
        return Direction.Left;
      //Default is the existing direction
      default:
        return this.direction;
    }
  }
  private toWhite(pixel: Block): void {
    //Sets fill color to input color
    // try {
    //   this.ctx.fillStyle = this.color;
    // } catch (error) {
    this.ctx.fillStyle = "white";
    //}

    //Creates rectangle using properties of pixel which uses the block interface
    this.ctx.fillRect(pixel.xCoor, pixel.yCoor, pixel.side, pixel.side);
  }

  private newBlock(x: number, y: number): Block {
    //Creates a new block
    let thisSquare: Block = {
      side: 10,
      xCoor: x,
      yCoor: y,
    };
    //Iterates through blocklist
    this.blockList.forEach((item) => {
      //If the coordinates are already in blocklist it renders endPage
      if (item.xCoor === thisSquare.xCoor && item.yCoor === thisSquare.yCoor) {
        this.endPage(/*false*/);
      }
    });
    //Otherwise it adds thisSquare to blocklist and returns it (not sure if i need to return it)
    this.blockList.push(thisSquare);
    return thisSquare;
  }

  //   private endPage(ifWon: Boolean): void {
  //     //If "ifWon" is true then message is "youwin" else "youlose"
  //     let message: string = ifWon ? "you win" : "you lose";
  //     //Stops the loop that renders the snake every 66ms
  //     clearInterval(this.run);
  //     //Fills screen in black
  //     this.ctx.fillStyle = "black";
  //     this.ctx.fillRect(0, 0, 750, 750);
  //     //Writes the message in middle of page
  //     this.ctx.font = "20px Oxygen";
  //     // try {
  //     //   this.ctx.fillStyle = this.color;
  //     // } catch (error) {
  //     this.ctx.fillStyle = "white";
  //     //}
  //     this.ctx.fillText(message, 330, 355);
  //     //Reloads page after 1 second
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 1000);
  //   }
  // }
  private endPage() {
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
//Creates a new instance of the game class
const game = new Game();
