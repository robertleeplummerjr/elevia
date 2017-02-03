export default class Input {
  constructor(options) {
    if (typeof options === 'function') {
      this.getValue = options;
      return;
    }
    this.getValue = null;
    this.brain = options.brain;
    this.floor = options.floor;
    this.floors = options.floors;
    this.floorEvent = options.floorEvent;
    this.floorEventFunction = options.floorEventFunction;

    this.elevator = options.elevator;
    this.elevatorEvent = options.elevatorEvent;
    this.elevatorEventFunction = options.elevatorEventFunction;

    if (this.floorEvent && this.floorEventFunction) {
      floors.forEach((floor) => {
        floor.on(this.floorEvent, (value) => {
          this.floorEventFunction(floor, this.floorEvent, value, this);
        });
      });
    }

    if (this.elevatorEvent && this.elevatorEventFunction) {
      if (this.elevator) {
        this.elevator.on(this.elevatorEvent, (value) => {
          this.elevatorEventFunction(this.elevator, this.elevatorEvent, value);
        });
      } else {
        elevators.forEach((elevator) => {
          elevator.on(this.elevatorEvent, (value) => {
            this.floorEventFunction(elevator, this.elevatorEvent, value, this);
          });
        });
      }
    }
    this.value = 0;
  }

  resetValue() {
    if (this.getValue !== null) {
      this.value = this.getValue();
      return;
    }
    this.value = 0;
  }
  
  setValue(value) {
    this.value = value;
  }
}
