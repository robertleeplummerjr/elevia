var Elevia = (function() {
  function Elevia(world) {
    var self = this;
    this.waitingUserCountLast = 9999999999999;
    this.ridingUserCountLast = 0;
    this.world = world;
    this.brain = new ann.NeuralNet({
      inputCount: 15,
      outputCount: self.world.elevators.length,
      hiddenLayerCount: 3,
      sense: function() {
        return self.flatten();
      },
      goal: function() {
        var reward = 0,
          waiting = self.waitingUserCount(),
          riding = self.ridingUserCount();

        if (waiting < self.waitingUserCountLast) {
          reward++;

          self.waitingUserCountLast = waiting;
        }

        if (riding < self.ridingUserCountLast) {
          reward++;
          self.ridingUserCountLast = riding;
        }

        return reward;
      },
      action: function(controls) {
        self.world.elevators.forEach(function(elevator, i) {
          if (controls[i] > 0.01) {
            var goToFloor = Math.round(controls[i] * self.world.floors.length);
            console.log('elevator ' + ( i + 1) + ' going to floor ' + goToFloor);
            elevator.on("idle", function() { elevator.goToFloor(goToFloor + 1); });
          } else {
            console.log('no action');
          }
        });

      }
    });
  }

  Elevia.prototype = {
    ridingUserCount: function() {
      var count = 0;

      this.world.users.forEach(function(user) {
        if (user.parent === null) {
          count++;
        }
      });

      return count;
    },
    waitingUserCount: function() {
      var count = 0;

      this.world.users.forEach(function(user) {
        if (user.parent !== null) {
          count++;
        }
      });

      return count;
    },
    flatten: function() {
      var flat = [],
        usersInElevators = [],
        world = this.world,
        dfi = [], //destination floor importance
        wfi = [], //waiting floor importance
        elevators = world.elevators;

      flat.push(world.floors.length);

      world.floors.forEach(function(floor, i) {
        dfi[i] = 0;
        wfi[i] = 0;
      });

      elevators.forEach(function(elevator) {
        flat.push(elevator.currentFloor);
        flat.push(elevator.maxUsers);
        flat.push(elevator.moveCount);
        flat.push(elevator.velocityY);

        elevator.userSlots.forEach(function(slot) {
          if (slot.user !== null) {
            dfi[slot.user.destinationFloor]++;
            flat.push(slot.user.destinationFloor);
            usersInElevators.push(slot.user);
          }
        });
      });

      world.users.forEach(function(user) {
        if (usersInElevators.indexOf(user) < 0) {
          wfi[user.destinationFloor]++;
        }
      });

      return flat
        .concat(dfi)
        .concat(wfi);
    },
    think: function() {
      this.brain.think();
      return this;
    }
  };

  return Elevia;
})();