var worlds = 20;
$(function() {
  var apps = [];
  for (var i = 0; i < worlds; i++) {
    apps.push(createApp());
  }
  var elevia = new Elivia({
    count: count,
    worlds: apps.map(function(app) { return app.world; })
  });
});