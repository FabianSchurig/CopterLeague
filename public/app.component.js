(function(app) {
  app.AppComponent =
    ng.core.Component({
      selector: 'my-app',
      templateUrl: 'app.component.pug'
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));