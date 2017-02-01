export default class {
  constructor(outputHandlers) {
    this.outputHandlers = outputHandlers;
  }
  
  handle(outputs) {
    this.outputHandlers.forEach((outputHandler, i) => {
      outputHandler(outputs[i]);
    });
  }
  
  add(outputHandler) {
    this.outputHandlers.push(outputHandler);
  }
}
