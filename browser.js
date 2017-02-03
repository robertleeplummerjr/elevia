(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _setupLayers2 = require('./setup-layers');

var _setupLayers3 = _interopRequireDefault(_setupLayers2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ElevatorNervousSystem = function () {
  function ElevatorNervousSystem(world, elevator) {
    var _this = this;

    _classCallCheck(this, ElevatorNervousSystem);

    var elevators = world.elevatorInterfaces,
        floors = world.floors;

    var _setupLayers = (0, _setupLayers3.default)({ elevator: elevators[world.elevators.indexOf(elevator)], elevators: elevators, floors: floors }),
        inputs = _setupLayers.inputs,
        outputHandlers = _setupLayers.outputHandlers,
        insertBrain = _setupLayers.insertBrain;

    this.moves = 0;
    this.inputs = inputs;
    this.outputHandlers = outputHandlers;
    this.world = world;
    this.elevator = elevator;
    this.waitingUserCountLast = 9999999999999;
    this.ridingUserCountLast = 0;
    this.world = world;
    this.brain = new ann.NeuralNet({
      inputCount: inputs.length,
      outputCount: outputHandlers.length,
      hiddenLayerCount: 3,
      sense: inputs.toPrimitives.bind(inputs),
      goal: function goal() {
        var reward = 0;
        _this.moves++;
        var waiting = _this.waitingUserCount();
        var riding = _this.ridingUserCount();

        if (waiting < _this.waitingUserCountLast) {
          reward++;

          _this.waitingUserCountLast = waiting;
        }

        if (riding < _this.ridingUserCountLast) {
          reward++;
          _this.ridingUserCountLast = riding;
        }

        return reward;
      },
      action: outputHandlers.run.bind(outputHandlers)
    });
    insertBrain(this.brain);
  }

  _createClass(ElevatorNervousSystem, [{
    key: 'ridingUserCount',
    value: function ridingUserCount() {
      var count = 0;

      this.elevator.userSlots.forEach(function (userSlot) {
        if (userSlot.user === null) return;
        count++;
      });

      return count;
    }
  }, {
    key: 'waitingUserCount',
    value: function waitingUserCount() {
      var count = 0;

      this.world.users.forEach(function (user) {
        if (user.parent === null) return;
        count++;
      });

      return count;
    }
  }, {
    key: 'averageWaitingTimeCount',
    value: function averageWaitingTimeCount() {}
  }, {
    key: 'resetMoves',
    value: function resetMoves() {
      this.moves = 0;
    }
  }]);

  return ElevatorNervousSystem;
}();

exports.default = ElevatorNervousSystem;
},{"./setup-layers":8}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _elevatorNervousSystem = require('./elevator-nervous-system');

var _elevatorNervousSystem2 = _interopRequireDefault(_elevatorNervousSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Elevia = function () {
  function Elevia() {
    _classCallCheck(this, Elevia);

    var index = 0;
    this.worlds = null;
    this.hive = null;
  }

  _createClass(Elevia, [{
    key: 'initWorlds',
    value: function initWorlds(worlds) {
      var index = 0;
      this.hive = new ann.Hive({
        count: worlds.length,
        initType: function initType() {
          var world = worlds[index];
          world.elevators.forEach(function (elevator) {
            return new _elevatorNervousSystem2.default(world, elevator);
          });
          index++;
        },
        sort: function sort(elevatorNervousSystems) {
          elevatorNervousSystems.sort(function (a, b) {
            return a.moves > b.moves;
          });
        }
      });
    }
  }]);

  return Elevia;
}();

exports.default = Elevia;
},{"./elevator-nervous-system":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlatArray = function () {
  function FlatArray() {
    _classCallCheck(this, FlatArray);

    this.collection = [];
    this.pushFlatten(Array.prototype.slice.call(arguments, 0));
  }

  _createClass(FlatArray, [{
    key: 'pushFlatten',
    value: function pushFlatten(value) {
      if (typeof value === 'undefined') return;
      if (Array.isArray(value)) {
        value.forEach(this.pushFlatten.bind(this));
        return;
      }
      this.push(value);
    }
  }, {
    key: 'push',
    value: function push(item) {
      this.collection.push(item);
    }
  }, {
    key: 'forEach',
    value: function forEach(fn) {
      this.collection.forEach(fn);
    }
  }, {
    key: 'map',
    value: function map(fn) {
      return this.collection.map(fn);
    }
  }, {
    key: 'length',
    get: function get() {
      return this.collection.length;
    }
  }]);

  return FlatArray;
}();

exports.default = FlatArray;
},{}],4:[function(require,module,exports){
'use strict';

window.Elevia = require('./elevia').default;
},{"./elevia":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Input = function () {
  function Input(options) {
    var _this = this;

    _classCallCheck(this, Input);

    if (typeof options === 'function') {
      this.getValue = options;
      return;
    }
    this.getValue = null;
    this.brain = options.brain;
    this.floor = options.floor;
    this.floors = options.floors;
    this.floorEvent = options.floorEvent;
    this.floorEventFunction = options.floorEventFunction;

    this.elevator = options.elevator;
    this.elevatorEvent = options.elevatorEvent;
    this.elevatorEventFunction = options.elevatorEventFunction;

    if (this.floorEvent && this.floorEventFunction) {
      this.floors.forEach(function (floor) {
        floor.on(_this.floorEvent, function (value) {
          _this.floorEventFunction(floor, _this.floorEvent, value, _this);
        });
      });
    }

    if (this.elevatorEvent && this.elevatorEventFunction) {
      if (this.elevator) {
        this.elevator.on(this.elevatorEvent, function (value) {
          _this.elevatorEventFunction(_this.elevator, _this.elevatorEvent, value, _this);
        });
      } else {
        this.elevators.forEach(function (elevator) {
          elevator.on(_this.elevatorEvent, function (value) {
            _this.floorEventFunction(elevator, _this.elevatorEvent, value, _this);
          });
        });
      }
    }
    this.value = 0;
  }

  _createClass(Input, [{
    key: 'resetValue',
    value: function resetValue() {
      if (this.getValue !== null) {
        this.value = this.getValue();
        return;
      }
      this.value = 0;
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.value = value;
    }
  }]);

  return Input;
}();

exports.default = Input;
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flatArray = require('./flat-array');

var _flatArray2 = _interopRequireDefault(_flatArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Inputs = function (_FlatArray) {
  _inherits(Inputs, _FlatArray);

  function Inputs() {
    _classCallCheck(this, Inputs);

    return _possibleConstructorReturn(this, (Inputs.__proto__ || Object.getPrototypeOf(Inputs)).apply(this, arguments));
  }

  _createClass(Inputs, [{
    key: 'reset',
    value: function reset() {
      this.forEach(function (input) {
        input.resetValue();
      });
    }
  }, {
    key: 'toPrimitives',
    value: function toPrimitives() {
      return this.map(function (input) {
        return input.value;
      });
    }
  }]);

  return Inputs;
}(_flatArray2.default);

exports.default = Inputs;
},{"./flat-array":3}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flatArray = require('./flat-array');

var _flatArray2 = _interopRequireDefault(_flatArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_FlatArray) {
  _inherits(_class, _FlatArray);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
  }

  _createClass(_class, [{
    key: 'run',
    value: function run(outputs) {
      this.forEach(function (outputHandler, i) {
        outputHandler(outputs[i]);
      });
    }
  }]);

  return _class;
}(_flatArray2.default);

exports.default = _class;
},{"./flat-array":3}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inputs = require('./inputs');

var _inputs2 = _interopRequireDefault(_inputs);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _outputHandlers = require('./output-handlers');

var _outputHandlers2 = _interopRequireDefault(_outputHandlers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (options) {
  var elevator = options.elevator,
      elevators = options.elevators,
      floors = options.floors;

  var brain = void 0;
  var inputs = setupInputs();
  var outputHandlers = setupOutputHandlers();

  return {
    inputs: inputs,
    outputHandlers: outputHandlers,
    insertBrain: function insertBrain(_brain) {
      brain = _brain;
    }
  };

  function setupInputs() {
    return new _inputs2.default(setupUpButtonInput(), setupDownButtonInput(), setupElevatorFloorButtonInputs(), setupPassingFloorInputs(), setupStoppedAtFloorInputs(), setupAlreadyHandlingFloorsInputs(), setupElevatorsAlreadyHandlingFloorsInputs(), setupPressedFloorsInputs(), setupDestinationFloorsQueueInputs(), setupCurrentFloorsInputs(), setupGoingUpInput(), setupGoingDownInput(), setupMaxPassengerCountInput(), setupLoadFactorInput(), setupElevatorsLoadFactor(), setupDestinationDirectionInputs());
  }

  function setupOutputHandlers() {
    return new _outputHandlers2.default(setupGoToFloorOutputHandlers(), setupStopElevatorHandler());
  }

  function setupUpButtonInput() {
    return floors.map(function (floor) {
      return new _input2.default({
        floor: floor,
        floors: floors,
        floorEvent: 'up_button_pressed',
        floorEventFunction: function floorEventFunction(_floor, eventName, value, input) {
          inputs.reset();
          input.setValue(1);
          brain.think();
        }
      });
    });
  }

  function setupDownButtonInput() {
    return floors.map(function (floor) {
      return new _input2.default({
        floor: floor,
        floors: floors,
        floorEvent: 'down_button_pressed',
        floorEventFunction: function floorEventFunction(_floor, eventName, value, input) {
          inputs.reset();
          input.setValue(1);
          brain.think();
        }
      });
    });
  }

  function setupElevatorFloorButtonInputs() {
    return floors.map(function (floor) {
      return new _input2.default({
        floor: floor,
        floors: floors,
        elevator: elevator,
        elevatorEvent: 'floor_button_pressed',
        elevatorEventFunction: function elevatorEventFunction(elevator, eventName, floorNum, input) {
          if (floorNum !== floor.level) return;
          inputs.reset();
          input.setValue(1);
          brain.think();
        }
      });
    });
  }

  function setupPassingFloorInputs() {
    return floors.map(function (floor) {
      return new _input2.default({
        floor: floor,
        floors: floors,
        elevator: elevator,
        elevatorEvent: 'passing_floor',
        elevatorEventFunction: function elevatorEventFunction(elevator, eventName, floorNum, input) {
          if (floorNum !== floor.level) return;
          inputs.reset();
          input.setValue(1);
          brain.think();
        }
      });
    });
  }

  function setupStoppedAtFloorInputs() {
    return floors.map(function (floor) {
      return new _input2.default({
        floor: floor,
        floors: floors,
        elevator: elevator,
        elevatorEvent: 'stopped_at_floor',
        elevatorEventFunction: function elevatorEventFunction(elevator, eventName, floorNum, input) {
          if (floorNum !== floor.level) return;
          inputs.reset();
          input.setValue(1);
          brain.think();
        }
      });
    });
  }

  function setupAlreadyHandlingFloorsInputs() {
    var inputs = [];
    floors.forEach(function (floor) {
      inputs.push(new _input2.default(function () {
        var queue = elevator.checkDestinationQueue();
        if (!queue) return 0;
        return queue.indexOf(floor) !== -1 ? 1 : 0;
      }));
    });
    return inputs;
  }

  function setupElevatorsAlreadyHandlingFloorsInputs() {
    var inputs = [];
    elevators.forEach(function (_elevator) {
      if (_elevator === elevator) return;
      floors.forEach(function (floor) {
        inputs.push(new _input2.default(function () {
          var queue = _elevator.checkDestinationQueue();
          if (!queue) return 0;
          return queue.indexOf(floor) !== -1 ? 1 : 0;
        }));
      });
    });
    return inputs;
  }

  function setupPressedFloorsInputs() {
    return floors.map(function (floor) {
      return new _input2.default(function () {
        return elevator.getPressedFloors().indexOf(floor) !== -1 ? 1 : 0;
      });
    });
  }

  function setupDestinationFloorsQueueInputs() {
    return floors.map(function (floor) {
      return new _input2.default(function () {
        var queue = elevator.checkDestinationQueue();
        if (!queue) return 0;
        return queue.indexOf(floor) !== -1 ? 1 : 0;
      });
    });
  }

  function setupCurrentFloorsInputs() {
    return floors.map(function (floor) {
      return new _input2.default(function () {
        return elevator.currentFloor() === floor ? 1 : 0;
      });
    });
  }

  function setupGoingUpInput() {
    new _input2.default(function () {
      return elevator.goingUpIndicator() ? 1 : 0;
    });
  }
  function setupGoingDownInput() {
    return new _input2.default(function () {
      return elevator.goingDownIndicator() ? 1 : 0;
    });
  }
  function setupMaxPassengerCountInput() {
    return new _input2.default(function () {
      return elevator.maxPassengerCount() / 50;
    });
  }
  function setupLoadFactorInput() {
    return new _input2.default(function () {
      return elevator.loadFactor();
    });
  }

  function setupElevatorsLoadFactor() {
    var result = [];
    return elevators.forEach(function (_elevator) {
      if (_elevator === elevator) return;
      result.push(new _input2.default(function () {
        return _elevator.loadFactor();
      }));
    });
  }

  function setupDestinationDirectionInputs() {
    return [new _input2.default(function () {
      if (elevator.destinationDirection() === 'up') {
        return 1;
      }
      return 0;
    }), new _input2.default(function () {
      if (elevator.destinationDirection() === 'down') {
        return 1;
      }
      return 0;
    }), new _input2.default(function () {
      if (elevator.destinationDirection() === 'stopped') {
        return 1;
      }
      return 0;
    })];
  }

  function setupGoToFloorOutputHandlers() {
    return floors.map(function (floor) {
      return function (value) {
        console.log(value);
        //if we are not REALLY sure, then do nothing
        if (value < 0.5) return;

        elevator.goToFloor(floor.level);
      };
    });
  }

  function setupStopElevatorHandler() {
    return function (value) {
      if (value < 0.9) return;
      elevator.stop();
    };
  }
};
},{"./input":5,"./inputs":6,"./output-handlers":7}]},{},[4]);
