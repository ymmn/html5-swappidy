'use strict';

(function(BlockState, createjs, Color) {

  function Block(setBlockPosition, x, y, type) {
    var self = this;

    var SWAP_SPEED = 1;
    var FALL_SPEED = 1;
    var FADE_SPEED = 0.05;
    var BLOCK_BITMAPS = [
      'images/assets/gblock_32.png',
      'images/assets/rblock_32.png',
      'images/assets/bblock_32.png',
      'images/assets/pblock_32.png',
      'images/assets/yblock_32.png'
    ];

    var _state,
      _color,
      _col,
      _row,
      _type,
      _shape,
      _isBitmap,
      _setBlockPosition,
      _onDieCompleteCb,
      _onSwapCompleteCb;

    var initialize = function(setBlockPosition, x, y, type) {
      _state = BlockState.CREATING;
      _color = '#ff0000';
      _col = 0;
      _row = 0;

      var bitmap = BLOCK_BITMAPS[type];
      if (bitmap && !window.DEBUG_MODE) {
        _isBitmap = true;
        _shape = new createjs.Bitmap(bitmap);
      } else {
        _shape = new createjs.Shape();
      }

      _setBlockPosition = setBlockPosition;
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
        _state = BlockState.SITTING;
        if (_onSwapCompleteCb) {
          _onSwapCompleteCb();
          _onSwapCompleteCb = null;
        }
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
      if (!_isBitmap) {
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
      }
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

    var fallDown = function() {
      var targetY = (_row + 1) * Block.WIDTH;
      var isDoneFalling = Math.abs(targetY - _shape.y) <= FALL_SPEED;
      if (isDoneFalling) {
        self.setPosition(_col, _row + 1);
        _state = BlockState.SITTING;
      } else {
        _shape.y += FALL_SPEED;
      }
    };

    var swap = function(newState) {
      _state = newState;
      return {
        then: function(onSwapComplete) {
          _onSwapCompleteCb = onSwapComplete;
        }
      };
    };

    var fadeOut = function() {
      var isFadedOut = (_shape.alpha <= 0);
      if (isFadedOut) {
        if (_onDieCompleteCb) {
          _onDieCompleteCb(self);
          _onDieCompleteCb = null;
        }
      } else {
        _shape.alpha -= FADE_SPEED;
      }
    }

    /////////////////////////////////
    ////// PUBLIC METHODS ///////////
    /////////////////////////////////
    self.setPosition = function(col, row) {
      var oldCol = _col;
      var oldRow = _row;
      _col = col;
      _row = row;
      _shape.x = col * Block.WIDTH;
      _shape.y = row * Block.HEIGHT;

      _setBlockPosition(self, oldCol, oldRow, col, row);
    };

    self.getPosition = function() {
      return {
        col: _col,
        row: _row
      };
    };

    self.getColor = function() {
      return _type;
    };

    self.swapLeft = function() {
      return swap(BlockState.SWAPPING_LEFT);
    };

    self.swapRight = function() {
      return swap(BlockState.SWAPPING_RIGHT);
    };

    self.fallDown = function() {
      _state = BlockState.FALLING;
    };

    self.die = function() {
      _state = BlockState.DYING;
      return {
        then: function(onDieComplete) {
          _onDieCompleteCb = onDieComplete;
        }
      };
    };

    self.isSitting = function() {
      return _state === BlockState.SITTING || _state === BlockState.CREATING;
    };

    self.getShape = function() {
      return _shape;
    };

    self.tick = function() {
      if (_state === BlockState.SWAPPING_LEFT) {
        swapToCol(_col - 1);
      } else if (_state === BlockState.SWAPPING_RIGHT) {
        swapToCol(_col + 1);
      } else if (_state === BlockState.FALLING) {
        fallDown();
      } else if (_state === BlockState.DYING) {
        fadeOut();
      }
      if (window.DEBUG_MODE) {
        setDebugColor();
        makeShape();
      }
    };

    initialize(setBlockPosition, x, y, type);
  }

  // public properties:
  Block.WIDTH = 32;
  Block.HEIGHT = 32;
  Block.NUM_DIFFERENT_TYPES = 5;

  window.Block = Block;

}(window.BlockState, window.createjs, window.Color));
