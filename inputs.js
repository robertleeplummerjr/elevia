import FlatArray from './flat-array';

export default class Inputs extends FlatArray {
  reset() {
    this.forEach((input) => {
      input.resetValue();
    });
  }

  toPrimitives() {
    return this.map((input) => {
      return input.value;
    });
  }
}