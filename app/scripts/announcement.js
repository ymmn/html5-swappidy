'use strict';

(function(window) {

  function Announcement() {
    var DURATION_IN_TICKS = 30 * 3;
    var self = this;

    var _container,
      _txtShapes;

    var init = function() {
      _txtShapes = [];
      _container = new window.createjs.Container();
    };

    self.getContainer = function() {
      return _container;
    };

    self.announce = function(announceTxt) {
      var txt = new window.createjs.Text(announceTxt, '28px silom');
      _txtShapes.push(txt);
      _container.addChild(txt);
    };

    self.tick = function() {
      for (var i = 0; i < _txtShapes.length; i++) {
        var txt = _txtShapes[i];
        txt.alpha -= (1 / DURATION_IN_TICKS);
        if (txt.alpha <= 0) {
          _container.removeChild(txt);
          _txtShapes = _txtShapes.slice(1);
        }
      }
    };

    init();
  }

  window.Announcement = Announcement;

}(window));
