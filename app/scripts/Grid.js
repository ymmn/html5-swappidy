'use strict';

(function(window) {

  function Grid(cursorHandle) {

    var self = this;

    // private members
    var _cursor,
      _isSwapping,
      _blocksToMove,
      _color,
      _gridBody,
      _container;

    // private methods
    var getBlock,
      applyBlocksToMove;

    var initialize = function(cursorHandle) {

      _cursor = cursorHandle;
      _isSwapping = false;
      _blocksToMove = [];

      _container = new window.createjs.Container();

      _color = '#0066cc';
      _gridBody = new window.createjs.Shape();
      _container.addChild(_gridBody);

      makeShape();

      initializeBlockGrid();

      self.blockContainer = new window.createjs.Container();
      _container.addChild(self.blockContainer);
    };

    // the block grid should not be hand edited, hence being enclosed
    // in this function's scope
    var initializeBlockGrid = function() {
      var _blockGrid = [];
      for (var col = 0; col < Grid.WIDTH; col++) {
        _blockGrid[col] = [];
      }

      getBlock = function(col, row) {
        return _blockGrid[col][row];
      };

      applyBlocksToMove = function(blocksToMove) {
        // first unset blocks, then set blocks
        var b2m, i;
        for (i = 0; i < blocksToMove.length; i++) {
          b2m = blocksToMove[i];
          _blockGrid[b2m.oldCol][b2m.oldRow] = undefined;
        }
        for (i = 0; i < blocksToMove.length; i++) {
          b2m = blocksToMove[i];
          _blockGrid[b2m.col][b2m.row] = b2m.block;
        }
      };
    };

    var forAllBlocks = function(func) {
      for (var i = 0; i < Grid.WIDTH; i++) {
        for (var j = 0; j < Grid.HEIGHT; j++) {
          var block = getBlock(i, j);
          if (block !== undefined) {
            func(block, i, j);
          }
        }
      }
    };

    var checkBlockGridConsistency = function() {
      forAllBlocks(function(block, col, row) {
        var pos = block.getPosition();
        if (pos.col !== col || pos.row !== row) {
          console.log('block[' + col + '][' + row + '] -> (' + pos.col + ', ' + pos.row + ')');
        }
      });
    };

    // public methods:
    var makeShape = function() {
      //draw square outline for body
      var g = _gridBody.graphics;
      g.clear();
      g.beginFill(_color);

      g.moveTo(0, 0); //top-left
      g.lineTo(Grid.WIDTH * window.Block.WIDTH, 0); //top-right
      g.lineTo(Grid.WIDTH * window.Block.WIDTH, Grid.HEIGHT * window.Block.HEIGHT); //bottom-right
      g.lineTo(0, Grid.HEIGHT * window.Block.HEIGHT); //bottom-left
      g.closePath(); //top-left
    };

    var makeBlocksFall = function() {
      for (var col = 0; col < Grid.WIDTH; col++) {
        var isFalling = false;
        for (var row = Grid.HEIGHT - 1; row >= 0; row--) {
          var block = getBlock(col, row);
          if (block === undefined) {
            isFalling = true;
          } else {
            if (isFalling && block.isSitting()) {
              block.setState(window.BlockState.FALLING);
            }
          }
        }
      }
    };

    // make sure the two spots above are empty too
    var canSwapIntoEmptyPosition = function(col, row) {
      for (var rrow = row; rrow > row - 3; rrow--) {
        if (rrow < 0) {
          return true;
        }
        if (getBlock(col, rrow)) {
          return false;
        }
      }
      return true;
    };


    /////////////////////////////////
    ////// PUBLIC METHODS ///////////
    /////////////////////////////////
    // put a block into the blockGrid at position
    self.createBlock = function(col, row, blockType) {
      var block = new window.Block(this, col, row, blockType);
      self.blockContainer.addChild(block.getShape());
    };

    // create a new row of inactive blocks
    self.generateRow = function() {
      // move all blocks up by one
      forAllBlocks(function(block, col, row) {
        block.setPosition(col, row - 1);
      });

      var bottomRow = Grid.HEIGHT - 1;
      for (var col = 0; col < Grid.WIDTH; col++) {
        var randomnumber = Math.floor(Math.random() * 5);
        self.createBlock(col, bottomRow, randomnumber);
      }
    };

    // swap a block with block to the right
    self.swapBlocks = function(col, row) {
      if (!_isSwapping) {
        var leftBlock = getBlock(col, row);
        var rightBlock = getBlock(col + 1, row);

        var leftBlockExists = leftBlock !== undefined;
        var canSwapIntoLeftSpot = leftBlockExists && leftBlock.isSitting();
        if (!leftBlockExists) {
          canSwapIntoLeftSpot = canSwapIntoEmptyPosition(col, row);
        }

        var rightBlockExists = rightBlock !== undefined;
        var canSwapIntoRightSpot = rightBlockExists && rightBlock.isSitting();
        if (!rightBlockExists) {
          canSwapIntoRightSpot = canSwapIntoEmptyPosition(col + 1, row);
        }

        if (canSwapIntoLeftSpot && canSwapIntoRightSpot) {
          if (leftBlockExists) {
            leftBlock.setState(window.BlockState.SWAPPING_RIGHT);
            _isSwapping = true;
          }
          if (rightBlockExists) {
            rightBlock.setState(window.BlockState.SWAPPING_LEFT);
            _isSwapping = true;
          }
        }
      }
    };

    // put the block into the appropriate blockgrid slot at the end of the tick
    self.setBlockPosition = function(block, oldCol, oldRow, col, row) {
      _blocksToMove.push({
        oldCol: oldCol,
        oldRow: oldRow,
        col: col,
        row: row,
        block: block
      });
    };

    self.setSwapping = function(isSwapping) {
      _isSwapping = isSwapping;
    };

    self.getContainer = function() {
      return _container;
    };

    self.tick = function(event) {
      forAllBlocks(function(block) {
        block.tick(event);
      });

      applyBlocksToMove(_blocksToMove);
      _blocksToMove = [];

      makeBlocksFall();

      if (window.DEBUG_MODE) {
        checkBlockGridConsistency();
        if (_isSwapping) {
          _color = '#9966cc';
        } else {
          _color = '#0066cc';
        }
        makeShape();
      }
    };

    initialize(cursorHandle);
  }

  // public properties:
  Grid.WIDTH = 7;
  Grid.HEIGHT = 14;
  Grid.CLIMB_SPEED = 0.5;

  window.Grid = Grid;
  window.DEBUG_MODE = true;

}(window));