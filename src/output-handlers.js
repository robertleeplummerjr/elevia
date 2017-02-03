import FlatArray from './flat-array';

export default class extends FlatArray {
  run(outputs) {
    this.forEach((outputHandler, i) => {
      outputHandler(outputs[i]);
    });
  }
}
