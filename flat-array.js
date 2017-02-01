export default class extends Array {
  constructor() {
    super();
    this.pushFlatten(Array.prototype.slice.call(arguments, 0));
  }

  pushFlatten(value) {
    if (Array.isArray(value)) {
      value.forEach(this.pushFlatten);
      return;
    }
    this.push(value);
  }
}
