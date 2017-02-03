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