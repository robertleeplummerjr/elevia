import setupLayers from './setup-layers';

export default class ElevatorNervousSystem {
  constructor(world, elevator) {
    const { elevatorInterfaces: elevators, floors } = world;
    const { inputs, outputHandlers, insertBrain } = setupLayers({ elevator: elevators[world.elevators.indexOf(elevator)], elevators, floors });
    this.moves = 0;
    this.inputs = inputs;
    this.outputHandlers = outputHandlers;
    this.world = world;
    this.elevator = elevator;
    this.waitingUserCountLast = 9999999999999;
    this.ridingUserCountLast = 0;
    this.world = world;
    this.brain = new ann.NeuralNet({
      inputCount: inputs.length,
      outputCount: outputHandlers.length,
      hiddenLayerCount: 3,
      sense: inputs.toPrimitives.bind(inputs),
      goal: () => {
        let reward = 0;
        this.moves++;
        const waiting = this.waitingUserCount();
        const riding = this.ridingUserCount();

        if (waiting < this.waitingUserCountLast) {
          reward++;

          this.waitingUserCountLast = waiting;
        }

        if (riding < this.ridingUserCountLast) {
          reward++;
          this.ridingUserCountLast = riding;
        }

        return reward;
      },
      action: outputHandlers.run.bind(outputHandlers)
    });
    insertBrain(this.brain);
  }

  ridingUserCount() {
    let count = 0;

    this.elevator.userSlots.forEach((userSlot) => {
      if (userSlot.user === null) return;
      count++;
    });

    return count;
  }

  waitingUserCount() {
    let count = 0;

    this.world.users.forEach((user) => {
      if (user.parent === null) return;
      count++;
    });

    return count;
  }

  averageWaitingTimeCount() {

  }

  resetMoves() {
    this.moves = 0;
  }
}