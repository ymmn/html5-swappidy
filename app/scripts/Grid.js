'use strict';

(function(window) {

  function Grid(cursorHandle) {

    var self = this;

    var _cursor,
      _isSwapping,
      _blocksToMove,
      _color,
      _climbHeight,
      _blockGrid,
      _gridBody;

    var initialize = function(cursorHandle) {

      _cursor = cursorHandle;
      _isSwapping = false;
      _blocksToMove = [];

      self.gridContainer = new window.createjs.Container();

      _color = '#0066cc';
      _gridBody = new window.createjs.Shape();
      self.gridContainer.addChild(_gridBody);

      makeShape();

      _climbHeight = 0;

      _blockGrid = [];
      for (var i = 0; i < Grid.WIDTH; i++) {
        _blockGrid[i] = [];
      }

      self.blockContainer = new window.createjs.Container();
      self.gridContainer.addChild(self.blockContainer);
    };

    var checkBlockGridConsistency = function() {
      for (var col = 0; col < Grid.WIDTH; col++) {
        for (var row = 0; row < Grid.HEIGHT; row++) {
          var block = _blockGrid[col][row];
          if (block !== undefined) {
            var pos = block.getPosition();
            if (pos.col !== col || pos.row !== row) {
              console.log('block[' + col + '][' + row + '] -> (' + pos.col + ', ' + pos.row + ')');
            }
          }
        }
      }
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

    var getBlock = function(col, row) {
      return _blockGrid[col][row];
    };

    // the block falls if it is able to
    var dropBlock = function(col, row) {
      if (row > 0 && getBlock(col, row - 1) === undefined) {
        getBlock(col, row).setPosition(col, row - 1);
      }
    };


    // create a new row of inactive blocks

    var generateRow = function() {
      for (var i = 0; i < Grid.WIDTH; i++) {
        var randomnumber = Math.floor(Math.random() * 5);
        self.createBlock(i, 0, randomnumber);
      }
    };

    /*
      grid slowly moves up
      at 1 block height:
          - drop grid back to start position
          - shift all blocks up
          - create new row of blocks
      */

    var handleClimb = function() {
      self.y -= Grid.CLIMB_SPEED;
      _climbHeight += Grid.CLIMB_SPEED;
      if (_climbHeight >= window.Block.HEIGHT) {
        self.y += window.Block.HEIGHT;
        _climbHeight -= window.Block.HEIGHT;
        generateRow();
        // TODO shift cursor up
        _cursor.attemptMoveUp(); // hacky temp approach (avoid implicitely calling globals) this is only for checking the functionality
      }
    };


    /////////////////////////////////
    ////// PUBLIC METHODS ///////////
    /////////////////////////////////
    // put a block into the blockGrid at position
    self.createBlock = function(col, row, blockType) {
      if (!getBlock(col, row)) {
        var block = new window.Block(this, col, row, blockType);
        self.blockContainer.addChild(block.getShape());
      }
    };

    // swap a block with block to the right
    self.swapBlocks = function(col, row) {
      if (!_isSwapping) {
        var leftBlock = getBlock(col, row);
        var rightBlock = getBlock(col + 1, row);

        if (leftBlock) {
          leftBlock.setState(window.BlockState.SWAPPING_RIGHT);
          _isSwapping = true;
        }
        if (rightBlock) {
          rightBlock.setState(window.BlockState.SWAPPING_LEFT);
          _isSwapping = true;
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

    self.tick = function(event) {
      //TODO climb will need refactored after implementing block statefullness -Matthew
      // handleClimb();

      //tick all blocks
      for (var i = 0; i < Grid.WIDTH; i++) {
        for (var j = 0; j < Grid.HEIGHT; j++) {
          var block = getBlock(i, j);
          if (block !== undefined) {
            block.tick(event);
            dropBlock(i, j);
          }
        }
      }

      // first unset blocks, then set blocks
      var b2m;
      for (i = 0; i < _blocksToMove.length; i++) {
        b2m = _blocksToMove[i];
        _blockGrid[b2m.oldCol][b2m.oldRow] = undefined;
      }
      for (i = 0; i < _blocksToMove.length; i++) {
        b2m = _blocksToMove[i];
        _blockGrid[b2m.col][b2m.row] = b2m.block;
      }
      _blocksToMove = [];

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
