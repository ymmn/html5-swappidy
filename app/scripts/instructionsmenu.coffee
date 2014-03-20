class window.InstructionsMenu extends GameMenu

  _backBtnOnClick = () ->
    game.switchToStartMenuScreen()

  BUTTON_PROPERTIES =
    back:
      x: game.CANVAS_WIDTH / 2
      y: game.CANVAS_HEIGHT - 200
      onclick: _backBtnOnClick
      text: "Back"


  constructor: () ->
    super()

    # add background
    background = @createSolidBackground @BACKGROUND_COLOR
    @container.addChild background

    # text
    instructionText = new createjs.Text "Do and this and\n do that then you win!", "30px Arial"
    instructionText.x = game.CANVAS_WIDTH / 2
    instructionText.y = 100
    instructionText.textAlign = "center"
    @container.addChild instructionText

    # back button
    backBtn = @createButton BUTTON_PROPERTIES.back
    @container.addChild backBtn.container
