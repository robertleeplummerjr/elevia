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