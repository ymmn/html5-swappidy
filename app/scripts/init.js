window.Init = (function() {

  // global variables
  var cursor1;
  var cursor2;
  var grid1;
  var grid2;

  function initGrid(x, y, cursor, grid, stage) {
    var gridContainer = grid.getContainer();
    stage.addChild(gridContainer);
    gridContainer.x = x;
    gridContainer.y = y;
    gridFrame = new GridFrame();
    stage.addChild(gridFrame);
    gridFrame.x = x;
    gridFrame.y = y;

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

    gridContainer.addChild(cursor);
    cursor.setLeftPosition(2, 3);


  }

  function init(stage) {
    cursor1 = new Cursor();
    grid1 = new Grid(cursor1);
    cursor2 = new Cursor();
    grid2 = new Grid(cursor2);
    initGrid(64, 128, cursor1, grid1, stage);
    initGrid(400, 128, cursor2, grid2, stage);

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
        cursor1.attemptMoveLeft();
        break;
      case KeyEvent.RIGHT:
      case KeyEvent.D:
        cursor1.attemptMoveRight();
        break;
      case KeyEvent.UP:
      case KeyEvent.W:
        cursor1.attemptMoveUp();
        break;
      case KeyEvent.DOWN:
      case KeyEvent.S:
        cursor1.attemptMoveDown();
        break;
      case KeyEvent.X:
        grid1.generateRow();
        break;
      case KeyEvent.SPACE:
        grid1.swapBlocks(cursor1.getCol(), cursor1.getRow());
        break;
    }
  }

  function tick(event) {
    //tick event
    grid1.tick(event);
    grid2.tick(event);
  }

  return {
    init: init,
    tick: tick,
    handleKeyDown: handleKeyDown
  };

})();
