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

    this.worlds = null;
    this.hive = null;
  }

  _createClass(Elevia, [{
    key: 'initWorlds',
    value: function initWorlds(worlds) {
      this.worlds = worlds;
      var index = 0;
      var lookup = [];
      worlds.forEach(function (world) {
        world.elevators.forEach(function (elevator) {
          lookup.push({
            world: world,
            elevator: elevator
          });
        });
      });

      this.hive = new ann.Hive({
        count: lookup.length,
        initType: function initType() {
          var _lookup$index = lookup[index],
              world = _lookup$index.world,
              elevator = _lookup$index.elevator;

          var elevatorNervousSystem = new _elevatorNervousSystem2.default(world, elevator);
          index++;
          return elevatorNervousSystem;
        }
      });
    }
  }]);

  return Elevia;
}();

exports.default = Elevia;