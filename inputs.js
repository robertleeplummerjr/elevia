export default class extends Array {
  constructor() {
    super();
    this.add(Array.prototype.slice.call(arguments, 0));
  }
  
  reset() {
    this.inputs.forEach((input) => {
      input.resetValue();
    });
  }
  
  toArray() {
    return this.inputs.map((input) => {
      return input.value;
    });
  }
  
  add(input) {
    if (typeof input === 'array') {
      input.forEach((input) => this.add(input));
      return;
    }
    this.push(input);
  }
}
