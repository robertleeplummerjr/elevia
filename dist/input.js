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