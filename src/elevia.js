import ElevatorNervousSystem from './elevator-nervous-system';

export default class Elevia {
  constructor() {
    var index = 0;
    this.worlds = null;
    this.hive = null;
  }

  initWorlds(worlds) {
    let index = 0;
    this.hive = new ann.Hive({
      count: worlds.length,
      initType: () => {
        var world = worlds[index];
        world.elevators.forEach((elevator) => new ElevatorNervousSystem(world, elevator));
        index++;
      },
      sort: (elevatorNervousSystems) => {
        elevatorNervousSystems.sort((a, b) => {
          return a.moves > b.moves;
        });
      }
    });
  }
}
