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