'use strict';

(function(BlockState, createjs, Color, Grid) {

  function Block(grid, x, y, type) {
    var self = this;

    var SWAP_SPEED = 1;

    var _state,
      _color,
      _col,
      _row,
      _type,
      _grid,
      _shape;

    var initialize = function(grid, x, y, type) {
      _state = BlockState.CREATING;
      _shape = new createjs.Shape();
      _color = '#ff0000';
      _col = 0;
      _row = 0;

      _grid = grid;
      self.setPosition(x, y);
      setType(type);

      makeShape();
    };

    var swapToCol = function(targetCol) {
      var targetX = targetCol * Block.WIDTH;
      var direction = _shape.x < targetX ? 1 : -1;
      var doneSwapping = Math.abs(targetX - _shape.x) <= SWAP_SPEED;
      if (doneSwapping) {
        self.setPosition(targetCol, _row);
        self.setState(BlockState.SITTING);
        _grid.setSwapping(false);
      } else {
        _shape.x += direction * SWAP_SPEED;
      }
    };

    var setDebugColor = function() {
      switch (_state) {
        case BlockState.CREATING:
          _color = 'green';
          break;
        case BlockState.FALLING:
          _color = 'blue';
          break;
        case BlockState.SITTING:
          _color = 'orange';
          break;
        case BlockState.SWAPPING_LEFT:
          _color = 'red';
          break;
        case BlockState.SWAPPING_RIGHT:
          _color = 'purple';
          break;
        case BlockState.DYING:
          _color = 'yellow';
          break;
      }
    };

    var makeShape = function() {
      //draw square outline for body
      var g = _shape.graphics;
      g.clear();
      g.beginFill(_color);
      g.beginStroke('#fff');
      g.setStrokeStyle(1.5);
      g.moveTo(0, 0); //top-left
      g.lineTo(Block.WIDTH, 0); //top-right
      g.lineTo(Block.WIDTH, Block.HEIGHT); //bottom-right
      g.lineTo(0, Block.HEIGHT); //bottom-left
      g.closePath(); //top-left

    };

    var setType = function(blockType) {
      _type = blockType;
      switch (blockType) {
        case Color.GREEN:
          _color = 'green';
          break;
        case Color.BLUE:
          _color = 'blue';
          break;
        case Color.PURPLE:
          _color = 'purple';
          break;
        case Color.RED:
          _color = 'red';
          break;
        case Color.YELLOW:
          _color = 'yellow';
          break;
      }
      makeShape();
    };

    /////////////////////////////////
    ////// PUBLIC METHODS ///////////
    /////////////////////////////////
    self.setPosition = function(col, row) {
      var oldCol = _col;
      var oldRow = _row;
      _col = col;
      _row = row;
      _shape.x = col * Block.WIDTH;
      _shape.y = (Grid.HEIGHT - row - 1) * Block.HEIGHT;

      _grid.setBlockPosition(self, oldCol, oldRow, col, row);
    };

    self.getPosition = function() {
      return {
        col: _col,
        row: _row
      };
    };

    self.setState = function(nstate) {
      _state = nstate;
    };

    self.getShape = function() {
      return _shape;
    };

    self.tick = function() {
      if (_state === BlockState.SWAPPING_LEFT) {
        swapToCol(_col - 1);
      } else if (_state === BlockState.SWAPPING_RIGHT) {
        swapToCol(_col + 1);
      }
      if (window.DEBUG_MODE) {
        setDebugColor();
        makeShape();
      }
    };

    initialize(grid, x, y, type);
  }

  // public properties:
  Block.WIDTH = 32;
  Block.HEIGHT = 32;

  window.Block = Block;

}(window.BlockState, window.createjs, window.Color, window.Grid));
