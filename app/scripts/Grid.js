(function(window) {

  function Grid(cursorHandle) {
    this.initialize();
    this.cursor = cursorHandle;
  }

  var p = Grid.prototype = new createjs.Container();

  // public properties:
  Grid.WIDTH = 7;
  Grid.HEIGHT = 14;
  Grid.CLIMB_SPEED = .5;

  // public properties:
  p.color;
  p.gridBody;
  p.climbHeight;
  p.cursor;

  // 2d array of blocks
  p.blockGrid;

  p.blockContainer;

  // constructor:
  p.Container_initialize = p.initialize; //unique to avoid overiding base class

  p.initialize = function() {
    this.Container_initialize();

    this.color = "#0066cc";
    this.gridBody = new createjs.Shape();
    this.addChild(this.gridBody);

    this.makeShape();

    this.climbHeight = 0;

    this.blockGrid = [];
    for (var i = 0; i < Grid.WIDTH; i++) {
      this.blockGrid[i] = [];
    }

    this.blockContainer = new createjs.Container();
    this.addChild(this.blockContainer);
  }

  // public methods:
  p.makeShape = function() {
    //draw square outline for body
    var g = this.gridBody.graphics;
    g.clear();
    g.beginFill(this.color);

    g.moveTo(0, 0); //top-left
    g.lineTo(Grid.WIDTH * Block.WIDTH, 0); //top-right
    g.lineTo(Grid.WIDTH * Block.WIDTH, Grid.HEIGHT * Block.HEIGHT); //bottom-right
    g.lineTo(0, Grid.HEIGHT * Block.HEIGHT); //bottom-left
    g.closePath(); //top-left

  }

  // put a block into the blockGrid at position
  p.createBlock = function(col, row, blockType) {

    if (!this.getBlock(col, row)) {
      var block = new window.Block(col, row, blockType);
      this.blockGrid[col][row] = block;
      block.setPosition(col, row);
      console.log(block.col);
      console.log(block.row);
      block.setGrid(this);
      this.blockContainer.addChild(block.shape);
    }
  };

  // swap a block with block to the right
  p.swapBlocks = function(col, row) {
    block1 = this.getBlock(col, row);
    block2 = this.getBlock(col + 1, row);

    // TODO deal with swapping state

    this.setBlockPosition(block1, col + 1, row);
    this.setBlockPosition(block2, col, row);
  };

  // delete the block in position
  p.deleteBlock = function(col, row) {
    this.blockGrid[col][row] = null;
    //remove block container
  }

  // set the blocks x and y coords based on grid cell
  p.setBlockPosition = function(block, col, row) {
    if (block != null) {
      block.setPosition(col, row);
    }
    this.blockGrid[col][row] = block;
  }

  p.getBlock = function(col, row) {
    return this.blockGrid[col][row];
  }

  // the block falls if it is able to
  p.dropBlock = function(col, row) {
    if (row > 0 && this.getBlock(col, row - 1) == null) {
      block1 = this.getBlock(col, row);
      block2 = null

      // TODO deal with falling state

      this.setBlockPosition(block1, col, row - 1);
      this.setBlockPosition(block2, col, row);
    }
  }

  // blocks fall up
  p.raiseBlock = function(col, row) {
    if (row < Grid.HEIGHT && this.getBlock(col, row + 1) == null) {
      block1 = this.getBlock(col, row);
      block2 = null

      // TODO states

      this.setBlockPosition(block1, col, row + 1);
      this.setBlockPosition(block2, col, row);
    }
  }


  // create a new row of inactive blocks

  p.generateRow = function() {
    for (var i = 0; i < Grid.WIDTH; i++) {
      var randomnumber = Math.floor(Math.random() * 5)
      this.createBlock(i, 0, randomnumber);
    }

  }

  // shift all blocks up 1 grid coordinate

  p.shiftAllBlocksUp = function() {
    for (var i = 0; i < Grid.WIDTH; i++) {
      for (var j = Grid.HEIGHT - 2; j >= 0; j--) {
        this.raiseBlock(i, j);
      }
    }
  }

  /*
    grid slowly moves up
    at 1 block height:
        - drop grid back to start position
        - shift all blocks up
        - create new row of blocks
    */

  p.handleClimb = function() {
    this.y -= Grid.CLIMB_SPEED;
    this.climbHeight += Grid.CLIMB_SPEED;
    if (this.climbHeight >= Block.HEIGHT) {
      this.shiftAllBlocksUp();
      this.y += Block.HEIGHT;
      this.climbHeight -= Block.HEIGHT;
      this.generateRow();
      // TODO shift cursor up
      this.cursor.attemptMoveUp(); // hacky temp approach (avoid implicitely calling globals) this is only for checking the functionality
    }
  }

  // check block to find matches
  p.getMatch = function(col, row) {
    //while (

  }

  p.tick = function(event) {
    //TODO climb will need refactored after implementing block statefullness -Matthew
    this.handleClimb();

    //block.tick(event); // disabled until further notice -Matthew

    //tick all blocks
    //try to let blocks fall
    for (var i = 0; i < Grid.WIDTH; i++) {
      for (var j = 1; j < Grid.HEIGHT; j++) {
        block = this.getBlock(i, j);
        if (block != null) {
          block.tick(event);
          this.dropBlock(i, j);
        }
      }
    }
  };

  window.Grid = Grid;

}(window));
