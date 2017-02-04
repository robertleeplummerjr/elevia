var worlds = 20;

$(function() {
  var elevia = new Elevia();
  var apps = [];
  var isLearnSetup = false;
  for (var i = 0; i < worlds; i++) {
    apps.push(createApp());
  }

  $('#train-all').click(function() {
    $('.startstop').click();
    elevia.initWorlds(apps.map(function(app) {
      app.world.on('stats_changed', function() {
        if (!app.world.challengeEnded) return;
        console.log('Learning!');
        learn();
      });
      return app.world;
    }));
    isLearnSetup = true;
  });

  $('#train-faster').click(function() {
    $('.timescale_increase').click();
  });
  $('#train-slower').click(function() {
    $('.timescale_decrease').click();
  });

  function learn() {
    var hive = elevia.hive;
    var elevatorNervousSystems = hive.collection;
    hive.calcStats();
    // this.avgMinesHistory.push(this.avgMines = sweepers.reduce(function(prev, curr) {
    //     return prev + curr.hitsToday;
    //   }, 0) / sweepers.length);
    // this.bestMinesHistory.push(this.bestMines = sweepers.reduce(function(prev, curr) {
    //   return prev > curr.hitsToday ? prev : curr.hitsToday;
    // }, 0));

    hive
      .learn()
      .resetStats();
  }
});