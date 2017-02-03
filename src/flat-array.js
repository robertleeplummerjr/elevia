export default class FlatArray {
  constructor() {
    this.collection = [];
    this.pushFlatten(Array.prototype.slice.call(arguments, 0));
  }

  pushFlatten(value) {
    if (typeof value === 'undefined') return;
    if (Array.isArray(value)) {
      value.forEach(this.pushFlatten.bind(this));
      return;
    }
    this.push(value);
  }

  push(item) {
    this.collection.push(item);
  }

  forEach(fn) {
    this.collection.forEach(fn);
  }

  map(fn) {
    return this.collection.map(fn);
  }

  get length() {
    return this.collection.length;
  }
}
