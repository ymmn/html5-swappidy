class window.StartMenu extends GameMenu


  _startBtnOnClick = () ->
    game.switchToPlayScreen()

  _instructionsBtnOnClick = () ->
    game.switchToInstructionsScreen()

  BUTTON_PROPERTIES =
    start:
      x: game.CANVAS_WIDTH / 2
      y: game.CANVAS_HEIGHT / 2 - 50
      onclick: _startBtnOnClick
      text: "Start"
    instructions:
      x: game.CANVAS_WIDTH / 2
      y: game.CANVAS_HEIGHT / 2 + 50
      onclick: _instructionsBtnOnClick
      text: "Instructions"

  constructor: () ->
    super()

    # add background
    background = @createSolidBackground @BACKGROUND_COLOR
    @container.addChild background

    # start button
    startBtn = @createButton BUTTON_PROPERTIES.start
    @container.addChild startBtn.container

    # instructions button
    instructionsBtn = @createButton BUTTON_PROPERTIES.instructions
    @container.addChild instructionsBtn.container
