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