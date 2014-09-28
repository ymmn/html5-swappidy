'use strict';

(function(BlockState, createjs, Color, Grid) {

  function Block(grid, x, y, type) {
    this.initialize();
    this.grid = grid;
    this.setPosition(x, y);
    this.setType(type);
  }

  // public properties:
  Block.WIDTH = 32;
  Block.HEIGHT = 32;

  Block.prototype.initialize = function() {
    this.state = BlockState.CREATING;
    this.shape = new createjs.Shape();
    this.color = '#ff0000';
    this.col = 0;
    this.row = 0;

    this.makeShape();
  };

  // public methods:
  Block.prototype.makeShape = function() {
    //draw square outline for body
    var g = this.shape.graphics;
    g.clear();
    g.beginFill(this.color);
    g.beginStroke('#fff');
    g.setStrokeStyle(1.5);
    g.moveTo(0, 0); //top-left
    g.lineTo(Block.WIDTH, 0); //top-right
    g.lineTo(Block.WIDTH, Block.HEIGHT); //bottom-right
    g.lineTo(0, Block.HEIGHT); //bottom-left
    g.closePath(); //top-left

  };

  Block.prototype.setType = function(blockType) {
    this.type = blockType;
    switch (blockType) {
      case Color.GREEN:
        this.color = 'green';
        break;
      case Color.BLUE:
        this.color = 'blue';
        break;
      case Color.PURPLE:
        this.color = 'purple';
        break;
      case Color.RED:
        this.color = 'red';
        break;
      case Color.YELLOW:
        this.color = 'yellow';
        break;
    }
    this.makeShape();
  };

  Block.prototype.setDebugColor = function() {
    switch (this.state) {
      case BlockState.CREATING:
        this.color = 'green';
        break;
      case BlockState.FALLING:
        this.color = 'blue';
        break;
      case BlockState.SITTING:
        this.color = 'orange';
        break;
      case BlockState.SWAPPING_LEFT:
        this.color = 'red';
        break;
      case BlockState.SWAPPING_RIGHT:
        this.color = 'purple';
        break;
      case BlockState.DYING:
        this.color = 'yellow';
        break;
    }
  };

  Block.prototype.getType = function() {
    return this.type;
  };

  Block.prototype.setGrid = function(grid) {
    this.grid = grid;
  };

  Block.prototype.getGrid = function() {
    return this.grid;
  };

  Block.prototype.setPosition = function(col, row) {
    var oldCol = this.col;
    var oldRow = this.row;
    this.col = col;
    this.row = row;
    this.shape.x = col * Block.WIDTH;
    this.shape.y = (Grid.HEIGHT - row - 1) * Block.HEIGHT;

    this.grid.setBlockPosition(this, oldCol, oldRow, col, row);
  };

  Block.prototype.setState = function(state) {
    this.state = state;
  };

  var SWAP_SPEED = 1;

  Block.prototype.swapToCol = function(targetCol) {
    var targetX = targetCol * Block.WIDTH;
    var direction = this.shape.x < targetX ? 1 : -1;
    var doneSwapping = Math.abs(targetX - this.shape.x) <= SWAP_SPEED;
    if (doneSwapping) {
      this.setPosition(targetCol, this.row);
      this.setState(BlockState.SITTING);
      this.grid.isSwapping = false;
    } else {
      this.shape.x += direction * SWAP_SPEED;
    }
  };

  Block.prototype.tick = function() {
    if (this.state === BlockState.SWAPPING_LEFT) {
      this.swapToCol(this.col - 1);
    } else if (this.state === BlockState.SWAPPING_RIGHT) {
      this.swapToCol(this.col + 1);
    }
    if (window.DEBUG_MODE) {
      this.setDebugColor();
      this.makeShape();
    }
  };

  window.Block = Block;

}(window.BlockState, window.createjs, window.Color, window.Grid));
