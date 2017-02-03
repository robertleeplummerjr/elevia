import Inputs from './inputs';
import Input from './input';
import OutputHandlers from './output-handlers';

export default (options) => {
  const { elevator, elevators, floors } = options;
  let brain;
  const inputs = setupInputs();
  const outputHandlers = setupOutputHandlers();

  return {
    inputs,
    outputHandlers,
    insertBrain: (_brain) => {
        brain = _brain;
    }
  };

  function setupInputs() {
    return new Inputs(
      setupUpButtonInput(),
      setupDownButtonInput(),
      setupElevatorFloorButtonInputs(),
      setupPassingFloorInputs(),
      setupStoppedAtFloorInputs(),
      setupAlreadyHandlingFloorsInputs(),
      setupElevatorsAlreadyHandlingFloorsInputs(),
      setupPressedFloorsInputs(),
      setupDestinationFloorsQueueInputs(),
      setupCurrentFloorsInputs(),
      setupGoingUpInput(),
      setupGoingDownInput(),
      setupMaxPassengerCountInput(),
      setupLoadFactorInput(),
      setupElevatorsLoadFactor(),
      setupDestinationDirectionInputs()
    );
  }

  function setupOutputHandlers() {
    return new OutputHandlers(
      setupGoToFloorOutputHandlers(),
      setupStopElevatorHandler()
    );
  }

  function setupUpButtonInput() {
    return floors.map((floor) => new Input({
      floor,
      floors,
      floorEvent: 'up_button_pressed',
      floorEventFunction: (_floor, eventName, value, input) => {
        inputs.reset();
        input.setValue(1);
        brain.think();
      }
    }));
  }

  function setupDownButtonInput() {
    return floors.map((floor) => new Input({
      floor,
      floors,
      floorEvent: 'down_button_pressed',
      floorEventFunction: (_floor, eventName, value, input) => {
        inputs.reset();
        input.setValue(1);
        brain.think();
      }
    }));
  }

  function setupElevatorFloorButtonInputs() {
    return floors.map((floor) => new Input({
      floor,
      floors,
      elevator,
      elevatorEvent: 'floor_button_pressed',
      elevatorEventFunction: (elevator, eventName, floorNum, input) => {
        if (floorNum !== floor.level) return;
        inputs.reset();
        input.setValue(1);
        brain.think();
      }
    }));
  }

  function setupPassingFloorInputs() {
    return floors.map((floor) => new Input({
      floor,
      floors,
      elevator,
      elevatorEvent: 'passing_floor',
      elevatorEventFunction: (elevator, eventName, floorNum, input) => {
        if (floorNum !== floor.level) return;
        inputs.reset();
        input.setValue(1);
        brain.think();
      }
    }));
  }

  function setupStoppedAtFloorInputs() {
    return floors.map((floor) => new Input({
      floor,
      floors,
      elevator,
      elevatorEvent: 'stopped_at_floor',
      elevatorEventFunction: (elevator, eventName, floorNum, input) => {
        if (floorNum !== floor.level) return;
        inputs.reset();
        input.setValue(1);
        brain.think();
      }
    }));
  }

  function setupAlreadyHandlingFloorsInputs() {
    const inputs = [];
    floors.forEach((floor) => {
      inputs.push(new Input(() => {
        const queue = elevator.checkDestinationQueue();
        if (!queue) return 0;
        return queue.indexOf(floor) !== -1 ? 1 : 0;
      }));
    });
    return inputs;
  }

  function setupElevatorsAlreadyHandlingFloorsInputs() {
    const inputs = [];
    elevators.forEach((_elevator) => {
      if (_elevator === elevator) return;
      floors.forEach((floor) => {
        inputs.push(new Input(() => {
          const queue = _elevator.checkDestinationQueue();
          if (!queue) return 0;
          return queue.indexOf(floor) !== -1 ? 1 : 0;
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
      const queue = elevator.checkDestinationQueue();
      if (!queue) return 0;
      return queue.indexOf(floor) !== -1 ? 1 : 0;
    }));
  }

  function setupCurrentFloorsInputs() {
    return floors.map((floor) => new Input(() => {
      return elevator.currentFloor() === floor ? 1 : 0;
    }));
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

  function setupElevatorsLoadFactor() {
    const result = [];
    return elevators.forEach((_elevator) => {
      if (_elevator === elevator) return;
      result.push(new Input(() => {
        return _elevator.loadFactor();
      }));
    });
  }

  function setupDestinationDirectionInputs() {
    return [
      new Input(() => {
        if (elevator.destinationDirection() === 'up') {
          return 1;
        }
        return 0;
      }),
      new Input(() => {
        if (elevator.destinationDirection() === 'down') {
          return 1;
        }
        return 0;
      }),
      new Input(() => {
        if (elevator.destinationDirection() === 'stopped') {
          return 1;
        }
        return 0;
      })
    ];
  }

  function setupGoToFloorOutputHandlers() {
    return floors.map((floor) => (value) => {
      console.log(value);
      //if we are not REALLY sure, then do nothing
      if (value < 0.5) return;

      elevator.goToFloor(floor.level);
    });
  }

  function setupStopElevatorHandler() {
    return (value) => {
      if (value < 0.9) return;
      elevator.stop();
    };
  }
};
