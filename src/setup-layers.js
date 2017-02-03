import Inputs from './inputs';
import Input from './input';
import OutputHandlers from './output-handlers';

export default (elevator, elevators, floors) => {
  const inputs = setupInputs();
  const outputHandlers = setupOutputHandlers();

  return {
    inputs,
    outputHandlers
  };

  function setupInputs() {
    return new Inputs(
      setupUpButtonInput(),
      setupDownButtonInput(),
      setupElevatorFloorButtonInputs(),
      setupPassingFloorInputs(),
      setupStoppedAtFloorInputs(),
      setupAlreadyHandlingFloorsInputs,
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
      floor: floor,
      floorEvent: 'up_button_pressed',
      floorEventFunction: (_floor, eventName, value, input) => {
        inputs.reset();
        input.setValue(1);
      }
    }));
  }

  function setupDownButtonInput() {
    return floors.map((floor) => new Input({
      floor: floor,
      floorEvent: 'down_button_pressed',
      floorEventFunction: (_floor, eventName, value, input) => {
        inputs.reset();
        input.setValue(1);
      }
    }));
  }

  function setupElevatorFloorButtonInputs() {
    return floors.map((floor) => new Input({
      floor: floor,
      elevator: elevator,
      elevatorEvent: 'floor_button_pressed',
      elevatorEventFunction: (elevator, eventName, floorNum, input) => {
        if (floorNum !== floor.level) return;
        inputs.reset();
        input.setValue(1);
      }
    }));
  }

  function setupPassingFloorInputs() {
    return floors.map((floor) => new Input({
      floor: floor,
      elevator: elevator,
      elevatorEvent: 'passing_floor',
      elevatorEventFunction: (elevator, eventName, floorNum, input) => {
        if (floorNum !== floor.level) return;
        inputs.reset();
        input.setValue(1);
      }
    }));
  }

  function setupStoppedAtFloorInputs() {
    return floors.map((floor) => new Input({
      floor: floor,
      elevator: elevator,
      elevatorEvent: 'stopped_at_floor',
      elevatorEventFunction: (elevator, eventName, floorNum, input) => {
        if (floorNum !== floor.level) return;
        inputs.reset();
        input.setValue(1);
      }
    }));
  }

  function setupAlreadyHandlingFloorsInputs() {
    floors.forEach((floor) => {
      inputs.push(new Input(() => {
        return elevator.checkDestinationQueue().indexOf(floor) !== -1 ? 1 : 0;
      }));
    });
  }

  function setupElevatorsAlreadyHandlingFloorsInputs() {
    const inputs = [];
    elevators.forEach((_elevator) => {
      if (_elevator === elevator) return;
      floors.forEach((floor) => {
        inputs.push(new Input(() => {
          return _elevator.checkDestinationQueue().indexOf(floor) !== -1 ? 1 : 0;
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
    return floors.map((floor) => (value) => {
      //if we are not REALLY sure, then do nothing
      if (value < 0.8) return;

      elevator.goToFloor(floor);
    });
  }

  function setupStopElevatorHandler() {
    return (value) => {
      if (value < 0.9) return;
      elevator.stop();
    };
  }
};
