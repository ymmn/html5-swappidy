class window.PlayScreen extends GameScreen

  STATES =
    PLAYING: -10234
    GAMEOVER: -102334

  constructor: () ->
    super()

    # dummy rectangle
    myshape = new createjs.Shape()
    myshape.graphics.beginStroke("#F00").beginFill("#00F").drawRect(0, 0, 100, 50)
    myshape.x = 100
    myshape.y = 100
    @container.addChild myshape

    # keys pressed txt
    @keyPressedTxt = new createjs.Text "Press anything on the keyboard\nor Q to game over", "bold 24px Arial"
    @keyPressedTxt.x = 20
    @keyPressedTxt.y = 300
    @container.addChild @keyPressedTxt

    # score in top left
    @scoreTxt = new createjs.Text "Score: #{ @score }", "bold 24px Arial"
    @scoreTxt.x = game.CANVAS_WIDTH - 150
    @scoreTxt.y = 10
    @container.addChild @scoreTxt   

    @initGameState()

  updateScore: (newScore) ->
    @score = newScore
    @scoreTxt.text = "Score: #{ @score }"

  keyHandler: (e, isPressed) ->
    if @state == STATES.PLAYING
      switch e.keyCode
        when KeyEvent.LEFT then @keyPressedTxt.text = "LEFT"
        when KeyEvent.RIGHT then @keyPressedTxt.text = "RIGHT"
        when KeyEvent.DOWN then @keyPressedTxt.text = "DOWN"
        when KeyEvent.UP then @keyPressedTxt.text = "UP"
        when KeyEvent.Q then @displayGameOver()
        else 
          @keyPressedTxt.text = "Keycode #{e.keyCode} down: #{isPressed}"
      @updateScore (@score+1)

  initGameState: () ->
    # reset all values to defaults here
    @updateScore 0
    @state = STATES.PLAYING

    # no game over
    @container.removeChild @gameOverContainer

  displayGameOver: () ->
    # change state 
    @state = STATES.GAMEOVER

    # add game over overlay
    gameOverOverlay = new GameOverOverlay @
    @gameOverContainer = gameOverOverlay.container
    @container.addChild @gameOverContainer
