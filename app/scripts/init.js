window.Init = (function() {

  // global variables
  var cursor;
  var grid;

  function init(stage) {
    cursor = new Cursor();
    grid = new Grid(cursor);
    stage.addChild(grid);
    grid.x = 128;
    grid.y = 128;
    gridFrame = new GridFrame();
    stage.addChild(gridFrame);
    gridFrame.x = 128;
    gridFrame.y = 128;

    grid.createBlock(1, 0, 3);
    grid.createBlock(2, 0, 1);
    grid.createBlock(2, 2, 2);
    grid.createBlock(3, 2, 2);
    grid.createBlock(3, 3, 2);
    grid.createBlock(1, 10, 3);
    grid.createBlock(2, 10, 1);
    grid.createBlock(2, 12, 2);
    grid.createBlock(3, 12, 2);
    grid.createBlock(3, 13, 2);
    grid.swapBlocks(3, 3);
    grid.swapBlocks(4, 3);

    grid.addChild(cursor);
    cursor.setLeftPosition(2, 3);

    window.onkeydown = handleKeyDown;

    //start game timer
    if (!createjs.Ticker.hasEventListener("tick")) {
      createjs.Ticker.addEventListener("tick", tick);
    }
  }

  function handleKeyDown(e) {
    // for crossbrowser compatibility, as found in CreateJS example code
    if (!e) {
      var e = window.event;
    }

    switch (e.keyCode) {
      case KeyEvent.LEFT:
      case KeyEvent.A:
        cursor.attemptMoveLeft();
        break;
      case KeyEvent.RIGHT:
      case KeyEvent.D:
        cursor.attemptMoveRight();
        break;
      case KeyEvent.UP:
      case KeyEvent.W:
        cursor.attemptMoveUp();
        break;
      case KeyEvent.DOWN:
      case KeyEvent.S:
        cursor.attemptMoveDown();
        break;
      case KeyEvent.SPACE:
        grid.swapBlocks(cursor.getCol(), cursor.getRow());
        break;
    }
  }

  function tick(event) {
    //tick event
    grid.tick(event);
  }

  return {
    init: init,
    tick: tick,
    handleKeyDown: handleKeyDown
  };

})();
