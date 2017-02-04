import ElevatorNervousSystem from './elevator-nervous-system';

export default class Elevia {
  constructor() {
    this.worlds = null;
    this.hive = null;
  }

  initWorlds(worlds) {
    this.worlds = worlds;
    let index = 0;
    let lookup = [];
    worlds.forEach((world) => {
      world.elevators.forEach((elevator) => {
        lookup.push({
          world,
          elevator
        });
      });
    });

    this.hive = new ann.Hive({
      count: lookup.length,
      initType: () => {
        const { world, elevator } = lookup[index];
        const elevatorNervousSystem = new ElevatorNervousSystem(world, elevator);
        index++;
        return elevatorNervousSystem;
      }
    });
  }
}
