(function(window) {
  function GridFrame() {
    this.initialize();
  }
  var p = GridFrame.prototype = new createjs.Container(); // public properties: // public properties:
  p.color;
  p.gridFrame; // constructor:
  p.Container_initialize = p.initialize; //unique to avoid overiding base class
  p.initialize = function() {
    this.Container_initialize();
    this.color = "#999999";
    this.gridFrame = new createjs.Shape();
    this.addChild(this.gridFrame);
    this.makeShape();
  } // public methods:
  p.makeShape = function() { //draw the frame
    var f = this.gridFrame.graphics;
    f.clear();
    f.beginFill("ffffff"); //bottom bar
    f.moveTo(0, (Grid.HEIGHT - 1) * Block.HEIGHT); //top-left
    f.lineTo(Grid.WIDTH * Block.HEIGHT, (Grid.HEIGHT - 1) * Block.HEIGHT);
    f.lineTo(Grid.WIDTH * Block.HEIGHT, (Grid.HEIGHT + 1) * Block.HEIGHT);
    f.lineTo(0, (Grid.HEIGHT + 1) * Block.HEIGHT);
    f.closePath(); //top bar
    f.moveTo(0, -Block.HEIGHT);
    f.lineTo(Grid.WIDTH * Block.HEIGHT, -Block.HEIGHT);
    f.lineTo(Grid.WIDTH * Block.HEIGHT, 0);
    f.lineTo(0, 0);
    f.closePath(); //left bar
    f.moveTo(-Block.WIDTH, -Block.HEIGHT);
    f.lineTo(0, -Block.HEIGHT);
    f.lineTo(0, (Grid.HEIGHT + 1) * Block.HEIGHT);
    f.lineTo(-Block.WIDTH, (Grid.HEIGHT + 1) * Block.HEIGHT);
    f.closePath(); //right bar
    f.moveTo(Grid.WIDTH * Block.HEIGHT, -Block.HEIGHT);
    f.lineTo((Grid.WIDTH + 1) * Block.HEIGHT, -Block.HEIGHT);
    f.lineTo((Grid.WIDTH + 1) * Block.HEIGHT, (Grid.HEIGHT + 1) * Block.HEIGHT);
    f.lineTo(Grid.WIDTH * Block.HEIGHT, (Grid.HEIGHT + 1) * Block.HEIGHT);
    f.closePath();
  }
  window.GridFrame = GridFrame;
}(window));
