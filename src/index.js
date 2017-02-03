import ElevatorNervousSystem from './elevator-nervous-system';

export default class Elevia {
  constructor(count, worlds) {
    let index = -1;
    this.hives = worlds.map((world) => new idea.Hive({
      count,
      initType: () => {
        index++;
        return new ElevatorNervousSystem(world, world.elevators[index], world.floors);
      }
    }));
  }
}
