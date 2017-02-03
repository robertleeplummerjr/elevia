import setupLayers from './setup-layers';

export default class ElevatorNervousSystem {
  constructor(world, elevator) {
    const { elevators, floors } = world;
    const { inputs, outputHandlers } = setupLayers(elevator, elevators, floors);
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
      sense: inputs.toPrimitives,
      goal: () => {
        let reward = 0;
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
      action: outputHandlers.run
    });
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
}