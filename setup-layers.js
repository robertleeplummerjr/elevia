export default const function (elevator, elevators, floors) {
  return {
    inputs: setupInputs(),
    outputs: setupOutputs()
  };
  
  function setupInputs() {
    return new Inputs(
      setupUpButtonInput(),
      setupDownButtonInput(),
      setupElevatorFloorButtonInputs(),
      setupPassingFloorInputs(),
      setupStoppedAtFloorInputs(),
      setupElevatorsAlreadyHandlingFloorsInputs(),
      setupPressedFloorsInputs(),
      setupDestinationFloorsQueueInputs(),
      setupCurrentFloorsInputs(),
      setupGoingUpInput(),
      setupGoingDownInput(),
      setupMaxPassengerCountInput(),
      setupLoadFactorInput(),
      setupDestinationDirectionInputs()
    );
  }

  function setupOutputs() {
    return new OutputHandlers(
      setupGoToFloorOutputHandlers()
    );
  }

  function setupUpButtonInput() {
    return floors.map((floor) => new Input({
      floor: floor,
      floorEvent: 'up_button_pressed',
      floorEventFunction: (_floor, eventName, value) => {
        inputs.reset();
        this.setValue(1);
      });
    });
  }

  function setupDownButtonInput() {
    return floors.map((floor) => new Input({
      floor: floor,
      floorEvent: 'down_button_pressed',
      floorEventFunction: (_floor, eventName, value) => {
        inputs.reset();
        this.setValue(1);
      });
    });
  }

  function setupElevatorFloorButtonInputs() {
    return floors.map((floor) => new Input({
      floor: floor,
      elevator: elevator,
      elevatorEvent: 'floor_button_pressed',
      elevatorEventFunction: (elevator, eventName, floorNum) => {
        if (floorNum !== floor.level) return;
        inputs.reset();
        this.setValue(1);
      });
    });
  }

  function setupPassingFloorInputs() {
    return floors.map((floor) => new Input({
      floor: floor,
      elevator: elevator,
      elevatorEvent: 'passing_floor',
      elevatorEventFunction: (elevator, eventName, floorNum) => {
        if (floorNum !== floor.level) return;
        inputs.reset();
        this.setValue(1);
      });
    });
  }

  function setupStoppedAtFloorInputs() {
    return floors.map((floor) => new Input({
      floor: floor,
      elevator: elevator,
      elevatorEvent: 'stopped_at_floor',
      elevatorEventFunction: (elevator, eventName, floorNum) => {
        if (floorNum !== floor.level) return;
        inputs.reset();
        this.setValue(1);
      });
    });
  }

  function setupElevatorsAlreadyHandlingFloorsInputs() {
    var inputs = [];
    elevators.forEach((elevator) => {
      floors.forEach((floor) => {
        inputs.push(new Input(() => {
          return elevator.checkDestinationQueue().indexOf(floor) !== -1 ? 1 : 0;
        }));
      });
    });
    return inputs;
  }

  function setupPressedFloorsInputs() {
    return floors.map((floor) => new Input(() => {
      return elevator.getPressedFloors().indexOf(floor) !== -1 ? 1 : 0;
    }));
  }

  function setupDestinationFloorsQueueInputs() {
    return floors.map((floor) => new Input(() => {
        return elevator.checkDestinationQueue().indexOf(floor) !== -1 ? 1 : 0;
      });
    });
  }

  function setupCurrentFloorsInputs() {
    return floors.map((floor) => {
      return new Input(() => {
        return elevator.currentFloor() === floor ? 1 : 0;
      });
    });
  }

  function setupGoingUpInput() {
    new Input(() => {
      return elevator.goingUpIndicator() ? 1 : 0;
    });
  }
  function setupGoingDownInput() {
    return new Input(() => {
      return elevator.goingDownIndicator() ? 1 : 0;
    });
  }
  function setupMaxPassengerCountInput() {
    return new Input(() => {
      return elevator.maxPassengerCount() / 50;
    });
  }
  function setupLoadFactorInput() {
    return new Input(() => {
      return elevator.loadFactor();
    });
  }

  function setupDestinationDirectionInputs() {
    return [
      new Input(function() {
        if (elevator.destinationDirection() === 'up') {
          return 1;
        }
        return 0;
      }),
      new Input(function() {
        if (elevator.destinationDirection() === 'down') {
          return 1;
        }
        return 0;
      }),
      new Input(function() {
        if (elevator.destinationDirection() === 'stopped') {
          return 1;
        }
        return 0;
      })
    ];
  }

  function setupGoToFloorOutputHandlers() {
    return floors.map((floor) => new OutputHandler((value) {
      //if we are REALLY sure, then go to floor
      if (value > 0.8) {
        elevator.goToFloor(floor);
      }
    }));
  }
};
