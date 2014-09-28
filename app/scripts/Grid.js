'use strict';

(function(window) {

  function Grid(cursorHandle) {
    this.initialize();
    this.cursor = cursorHandle;
    this.isSwapping = false;
    this.blocksToMove = [];
  }

  var p = Grid.prototype = new window.createjs.Container();

  // public properties:
  Grid.WIDTH = 7;
  Grid.HEIGHT = 14;
  Grid.CLIMB_SPEED = 0.5;

  // constructor:
  p.ContainerInitialize = p.initialize; //unique to avoid overiding base class

  p.initialize = function() {
    this.ContainerInitialize();

    this.color = '#0066cc';
    this.gridBody = new window.createjs.Shape();
    this.addChild(this.gridBody);

    this.makeShape();

    this.climbHeight = 0;

    this.blockGrid = [];
    for (var i = 0; i < Grid.WIDTH; i++) {
      this.blockGrid[i] = [];
    }

    this.blockContainer = new window.createjs.Container();
    this.addChild(this.blockContainer);
  };

  // public methods:
  p.makeShape = function() {
    //draw square outline for body
    var g = this.gridBody.graphics;
    g.clear();
    g.beginFill(this.color);

    g.moveTo(0, 0); //top-left
    g.lineTo(Grid.WIDTH * window.Block.WIDTH, 0); //top-right
    g.lineTo(Grid.WIDTH * window.Block.WIDTH, Grid.HEIGHT * window.Block.HEIGHT); //bottom-right
    g.lineTo(0, Grid.HEIGHT * window.Block.HEIGHT); //bottom-left
    g.closePath(); //top-left
  };

  // put a block into the blockGrid at position
  p.createBlock = function(col, row, blockType) {
    if (!this.getBlock(col, row)) {
      var block = new window.Block(this, col, row, blockType);
      this.blockContainer.addChild(block.shape);
    }
  };

  // swap a block with block to the right
  Grid.prototype.swapBlocks = function(col, row) {
    if (!this.isSwapping) {
      var leftBlock = this.getBlock(col, row);
      var rightBlock = this.getBlock(col + 1, row);

      if (leftBlock) {
        leftBlock.setState(window.BlockState.SWAPPING_RIGHT);
        this.isSwapping = true;
      }
      if (rightBlock) {
        rightBlock.setState(window.BlockState.SWAPPING_LEFT);
        this.isSwapping = true;
      }
    }
  };

  // delete the block in position
  p.deleteBlock = function(col, row) {
    this.blockGrid[col][row] = undefined;
    //remove block container
  };

  p.getBlock = function(col, row) {
    return this.blockGrid[col][row];
  };

  // the block falls if it is able to
  p.dropBlock = function(col, row) {
    if (row > 0 && this.getBlock(col, row - 1) === undefined) {
      this.getBlock(col, row).setPosition(col, row - 1);
    }
  };

  // blocks fall up
  p.raiseBlock = function(col, row) {
    if (row < Grid.HEIGHT && this.getBlock(col, row + 1) === undefined) {
      this.getBlock(col, row).setPosition(col, row + 1);
    }
  };


  // create a new row of inactive blocks

  p.generateRow = function() {
    for (var i = 0; i < Grid.WIDTH; i++) {
      var randomnumber = Math.floor(Math.random() * 5);
      this.createBlock(i, 0, randomnumber);
    }

  };

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
    if (this.climbHeight >= window.Block.HEIGHT) {
      this.y += window.Block.HEIGHT;
      this.climbHeight -= window.Block.HEIGHT;
      this.generateRow();
      // TODO shift cursor up
      this.cursor.attemptMoveUp(); // hacky temp approach (avoid implicitely calling globals) this is only for checking the functionality
    }
  };

  // put the block into the appropriate blockgrid slot at the end of the tick
  Grid.prototype.setBlockPosition = function(block, oldCol, oldRow, col, row) {
    this.blocksToMove.push({
      oldCol: oldCol,
      oldRow: oldRow,
      col: col,
      row: row,
      block: block
    });
  };

  Grid.prototype.checkBlockGridConsistency = function() {
    for (var col = 0; col < Grid.WIDTH; col++) {
      for (var row = 0; row < Grid.HEIGHT; row++) {
        var block = this.blockGrid[col][row];
        if (block !== undefined) {
          if (block.col !== col || block.row !== row) {
            console.log('block[' + col + '][' + row + '] -> (' + block.col + ', ' + block.row + ')');
          }
        }
      }
    }
  };

  p.tick = function(event) {
    //TODO climb will need refactored after implementing block statefullness -Matthew
    // this.handleClimb();

    //tick all blocks
    for (var i = 0; i < Grid.WIDTH; i++) {
      for (var j = 0; j < Grid.HEIGHT; j++) {
        var block = this.getBlock(i, j);
        if (block !== undefined) {
          block.tick(event);
          this.dropBlock(i, j);
        }
      }
    }

    // first unset blocks, then set blocks
    var b2m;
    for (i = 0; i < this.blocksToMove.length; i++) {
      b2m = this.blocksToMove[i];
      this.blockGrid[b2m.oldCol][b2m.oldRow] = undefined;
    }
    for (i = 0; i < this.blocksToMove.length; i++) {
      b2m = this.blocksToMove[i];
      this.blockGrid[b2m.col][b2m.row] = b2m.block;
    }
    this.blocksToMove = [];

    if (window.DEBUG_MODE) {
      this.checkBlockGridConsistency();
      if (this.isSwapping) {
        this.color = '#9966cc';
      } else {
        this.color = '#0066cc';
      }
      this.makeShape();
    }
  };

  window.Grid = Grid;
  window.DEBUG_MODE = true;

}(window));
