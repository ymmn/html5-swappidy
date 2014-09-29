'use strict';

(function(window) {

  function Cursor() {
    this.initialize();
  }

  var p = Cursor.prototype = new window.createjs.Container();

  // public properties:
  Cursor.BLOCK_WIDTH = 32;
  Cursor.BLOCK_HEIGHT = 32;
  Cursor.RIGHT_MAX_COL = 7;
  Cursor.MAX_ROW = 14;

  p.row = 0;
  p.col = 0;

  // constructor:
  p.Container_initialize = p.initialize; //unique to avoid overiding base class

  p.initialize = function() {
    this.Container_initialize();

    this.cursorBody = new window.createjs.Shape();
    this.addChild(this.cursorBody);
    this.color = '#eee';
    this.thickness = 4;
    this.row = 0;
    this.col = 0;

    this.makeShape();
  };

  // public methods:
  p.makeShape = function() {
    //draw square outline for body
    var g = this.cursorBody.graphics;
    g.clear();
    g.beginStroke(this.color);
    g.setStrokeStyle(this.thickness);
    g.moveTo(0, 0); //top-left
    g.lineTo(Cursor.BLOCK_WIDTH, 0); //top-right
    g.lineTo(Cursor.BLOCK_WIDTH, Cursor.BLOCK_HEIGHT); //bottom-right
    g.lineTo(0, Cursor.BLOCK_HEIGHT); //bottom-left
    g.closePath(); //top-left
    g.beginStroke(this.color);
    g.setStrokeStyle(this.thickness);
    g.moveTo(Cursor.BLOCK_WIDTH, 0); //top-left
    g.lineTo(Cursor.BLOCK_WIDTH * 2, 0); //top-right
    g.lineTo(Cursor.BLOCK_WIDTH * 2, Cursor.BLOCK_HEIGHT); //bottom-right
    g.lineTo(Cursor.BLOCK_WIDTH, Cursor.BLOCK_HEIGHT); //bottom-left
    g.closePath(); //top-left
  };

  p.setLeftPosition = function(col, row) {
    this.col = col;
    this.row = row;
    this.x = col * Cursor.BLOCK_WIDTH;
    this.y = row * Cursor.BLOCK_HEIGHT;
  };

  p.attemptMoveLeft = function() {
    if (this.col > 0) {
      this.setLeftPosition(this.col - 1, this.row);
    }
  };

  p.attemptMoveRight = function() {
    if (this.col < Cursor.RIGHT_MAX_COL - 2) {
      this.setLeftPosition(this.col + 1, this.row);
    }
  };

  p.attemptMoveUp = function() {
    if (this.row > 0) {
      this.setLeftPosition(this.col, this.row - 1);
    }
  };

  p.attemptMoveDown = function() {
    if (this.row < Cursor.MAX_ROW - 1) {
      this.setLeftPosition(this.col, this.row + 1);
    }
  };

  p.getRow = function() {
    return this.row;
  };

  p.getCol = function() {
    return this.col;
  };

  window.Cursor = Cursor;

}(window));
