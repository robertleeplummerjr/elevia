export default class OutputHandler {
  constructor(fn) {
    this.fn = fn.bind(this);
  }
  
  run() {
    this.fn();
  }
  
  addTo(outputHandlers) {
    outputHandlers.add(this);
  }
}
