var createParamsUrl = function(current, overrides) {
    return '#' + _.map(_.merge(current, overrides), function(val, key) {
        return key + '=' + val;
    }).join(',');
};

var codeObj = {
  init: function() {},
  update: function() {}
};

function createApp(options) {
  var tsKey = 'elevatorTimeScale';
  var params = {};
  var $worlds = $('#worlds');
  var $world = $(document.getElementById('world-template').innerHTML.trim()).appendTo($worlds);
  var $innerworld = $world.find('.innerworld');
  var $stats = $world.find('.statscontainer');
  var $feedback = $world.find('.feedbackcontainer');
  var $challenge = $world.find('.challenge');

  var floorTempl = document.getElementById('floor-template').innerHTML.trim();
  var elevatorTempl = document.getElementById('elevator-template').innerHTML.trim();
  var elevatorButtonTempl = document.getElementById('elevatorbutton-template').innerHTML.trim();
  var userTempl = document.getElementById('user-template').innerHTML.trim();
  var challengeTempl = document.getElementById('challenge-template').innerHTML.trim();
  var feedbackTempl = document.getElementById('feedback-template').innerHTML.trim();

  var app = riot.observable({});
  app.worldController = createWorldController(1.0 / 60.0);
  app.worldController.on('usercode_error', function(e) {
    console.log('World raised code error', e);
  });

  app.worldCreator = createWorldCreator();
  app.world = undefined;

  app.currentChallengeIndex = 0;

  app.startStopOrRestart = function() {
    if(app.world.challengeEnded) {
      app.startChallenge(app.currentChallengeIndex);
    } else {
      app.worldController.setPaused(!app.worldController.isPaused);
    }
  };

  app.startChallenge = function(challengeIndex, autoStart) {
    if(typeof app.world !== 'undefined') {
      app.world.unWind();
      // TODO: Investigate if memory leaks happen here
    }
    app.currentChallengeIndex = challengeIndex;
    app.world = app.worldCreator.createWorld(challenges[challengeIndex].options);
    window.world = app.world;

    clearAll([$innerworld, $feedback]);
    presentStats($stats, app.world);
    presentChallenge($challenge, challenges[challengeIndex], app, app.world, app.worldController, challengeIndex + 1, challengeTempl);
    presentWorld($innerworld, app.world, floorTempl, elevatorTempl, elevatorButtonTempl, userTempl);

    app.worldController.on('timescale_changed', function() {
      localStorage.setItem(tsKey, app.worldController.timeScale);
      presentChallenge($challenge, challenges[challengeIndex], app, app.world, app.worldController, challengeIndex + 1, challengeTempl);
    });

    app.world.on('stats_changed', function() {
      var challengeStatus = challenges[challengeIndex].condition.evaluate(app.world);
      if(challengeStatus !== null) {
        app.world.challengeEnded = true;
        app.worldController.setPaused(true);
        if(challengeStatus) {
          presentFeedback($feedback, feedbackTempl, app.world, 'Success!', 'Challenge completed', createParamsUrl(params, { challenge: (challengeIndex + 2)}));
        } else {
          presentFeedback($feedback, feedbackTempl, app.world, 'Challenge failed', 'Maybe your program needs an improvement?', '');
        }
      }
    });

    console.log('Starting...');
    app.worldController.start(app.world, codeObj, window.requestAnimationFrame, autoStart);
  };

  riot.route(function(path) {
    params = _.reduce(path.split(','), function(result, p) {
      var match = p.match(/(\w+)=(\w+$)/);
      if(match) { result[match[1]] = match[2]; } return result;
    }, {});
    var requestedChallenge = 0;
    var autoStart = false;
    var timeScale = parseFloat(localStorage.getItem(tsKey)) || 2.0;
    _.each(params, function(val, key) {
      if(key === 'challenge') {
        requestedChallenge = _.parseInt(val) - 1;
        if(requestedChallenge < 0 || requestedChallenge >= challenges.length) {
          console.log('Invalid challenge index', requestedChallenge);
          console.log('Defaulting to first challenge');
          requestedChallenge = 0;
        }
      } else if(key === 'autostart') {
        autoStart = val === 'false' ? false : true;
      } else if(key === 'timescale') {
        timeScale = parseFloat(val);
      } else if(key === 'fullscreen') {
        makeDemoFullscreen();
      }
    });
    app.worldController.setTimeScale(timeScale);
    app.startChallenge(requestedChallenge, autoStart);
  });
  return app;
}
