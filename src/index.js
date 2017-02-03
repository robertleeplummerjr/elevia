import ElevatorNervousSystem from './elevator-nervous-system';

export default class Elevia {
  constructor(count, worlds) {
    this.hives = worlds.map((world) => new idea.Hive({
      count,
      initType: () => {
        world.elevators.forEach((elevator) => new ElevatorNervousSystem(world, elevator));
      },
      sort: (elevatorNervousSystems) => {
        elevatorNervousSystems.sort((a, b) => {
          return a.moves > b.moves;
        });
      }
    }));
  }
}
