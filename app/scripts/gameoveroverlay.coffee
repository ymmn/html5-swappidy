class window.GameOverOverlay extends GameMenu

  _backToMenuBtnOnClick = () ->
    game.switchToStartMenuScreen()

  BUTTON_PROPERTIES =
    retry:
      x: game.CANVAS_WIDTH / 2
      y: game.CANVAS_HEIGHT / 2 - 50
      onclick: undefined
      text: "Retry"
    backToMenu:
      x: game.CANVAS_WIDTH / 2
      y: game.CANVAS_HEIGHT / 2 + 50
      onclick: _backToMenuBtnOnClick
      text: "Main Menu"

  constructor: (playScreen) ->
    super()

    # create translucent background
    background = @createSolidBackground "white", 0.75
    @container.addChild background

    # game over text
    gameOverText = new createjs.Text "Game Over", "bold 24px Arial"
    gameOverText.textAlign = "center"
    gameOverText.x = game.CANVAS_WIDTH / 2
    gameOverText.y = 100
    @container.addChild gameOverText

    # final score text
    finalScoreText = new createjs.Text "Final Score: #{ playScreen.score }", "bold 24px Arial"
    finalScoreText.textAlign = "center"
    finalScoreText.x = game.CANVAS_WIDTH / 2
    finalScoreText.y = 150
    @container.addChild finalScoreText

    # retry button
    BUTTON_PROPERTIES.retry.onclick = () ->
      playScreen.initGameState()
    retryBtn = @createButton BUTTON_PROPERTIES.retry
    @container.addChild retryBtn.container

    # back to menu button
    backToMenuBtn = @createButton BUTTON_PROPERTIES.backToMenu
    @container.addChild backToMenuBtn.container