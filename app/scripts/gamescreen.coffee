class window.GameScreen
  
  constructor: (stage) ->
    @container = new createjs.Container()

  activateScreen: (stage) ->
    stage.addChild @container

  removeScreen: (stage) ->
    stage.removeChild @container

  tick: () ->
