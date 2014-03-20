class window.GameMenu extends GameScreen

  BACKGROUND_COLOR: "#090"
  DEFAULT_FONT = '28px silom'

  class RoundedButton

    constructor: (btnText, x, y, onclick) ->
      btnWidth = 200
      btnHeight = 40

      @container = new createjs.Container()
      rect = new createjs.Shape()

      # make rectangle draw about center
      rect.regX = btnWidth / 2
      rect.regY = btnHeight / 2
      rect.graphics.beginFill("#ccc").drawRoundRect(x, y, btnWidth, btnHeight, 5)

      txt = new createjs.Text btnText, DEFAULT_FONT
      txt.textAlign = "center";
      txt.x = x 
      txt.y = y - (txt.getMeasuredHeight() / 2)

      @container.addChild rect
      @container.addChild txt

      @container.addEventListener "click", onclick


  createButton: (btnProperty) ->
    return new RoundedButton btnProperty.text, btnProperty.x, btnProperty.y, btnProperty.onclick

  createSolidBackground: (color, alpha) ->
    background = new createjs.Shape()
    background.graphics.beginFill(color).drawRect 0, 0, game.CANVAS_WIDTH, game.CANVAS_HEIGHT
    background.alpha = alpha if alpha
    return background