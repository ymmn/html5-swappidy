'use strict';

(function(BlockState, createjs, Color, Grid) {

  function Block(x, y, type) {
    this.initialize();
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
        this.color = 'purple';
        break;
      case BlockState.SWAPPING:
        this.color = 'red';
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
    this.col = col;
    this.row = row;
    this.x = col * Block.WIDTH;
    this.y = (Grid.HEIGHT - row - 1) * Block.HEIGHT;
  };

  Block.prototype.tick = function() {
    if (window.DEBUG_MODE) {
      this.setDebugColor();
      this.makeShape();
    }
  };

  window.Block = Block;

}(window.BlockState, window.createjs, window.Color, window.Grid));
