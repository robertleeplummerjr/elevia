export default class {
  constructor(inputs) {
    this.inputs = inputs;
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
}
