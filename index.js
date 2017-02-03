var worlds = 20;

$(function() {
  var apps = [];
  var started = 0;
  for (var i = 0; i < worlds; i++) {
    var app = createApp(function() {
      started++;
      if (started === worlds) {
        elevia.initWorlds(apps.map(function(app) { return app.world; }));
      }

    });
    apps.push(app);
  }

  var elevia = new Elevia();
});