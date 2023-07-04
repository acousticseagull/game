import addSpark from './spark.js';
import addExplosion from './explosion.js';

export default function addPlayer(g) {
  const sprite = g.add(
    g.sprite('player.png', 21, 26),
    g.pos({ x: g.width / 2, y: g.height - 100 }),
    g.vel({ max: 500 }),
    g.area(5, 10, 10, 15),
    g.animation({
      idle: {
        sequence: [0],
        frame: 0,
        delay: 1,
        repeat: false,
      },
      left: {
        sequence: [1],
      },
      right: {
        sequence: [2],
      },
    }),
    {
      z: 2,

      hull: {
        actual: 3,
        max: 5,
      },

      energy: {
        actual: 1.3,
        max: 10,
      },

      timers: {
        primary: g.timer(0.125),
        missle: g.timer(0.5),
      },
    },
    'player'
  );

  sprite.onAdd = (sprite) => console.log(sprite);

  sprite.onUpdate = () => {
    const { pos, vel, width, height, animation, energy, timers } = sprite;

    vel.x = 0;
    vel.y = 0;

    if (g.gamepad.up(0) || g.keyDown('ArrowUp')) {
      if (pos.y > 0) vel.y = -280;
    }

    if (g.gamepad.down(0) || g.keyDown('ArrowDown')) {
      if (pos.y < g.height - height) vel.y = 200;
    }

    if (g.gamepad.left(0) || g.keyDown('ArrowLeft')) {
      if (pos.x > 0) vel.x = -240;
    }

    if (g.gamepad.right(0) || g.keyDown('ArrowRight')) {
      if (pos.x < g.width - width) vel.x = 240;
    }

    animation.play('idle');

    if (vel.x < 0) animation.play('left');
    if (vel.x > 0) animation.play('right');

    if (g.gamepad.buttonDown(0, 0) || g.keyDown('x')) {
      if (timers.primary.expired()) {
        timers.primary.reset();

        // primary weapon
        if (energy.actual < 3) {
          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 30 },
            vel: { x: -10, y: -100, max: 800 },
            sequence: [2],
            damage: 1.5,
          });
          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 30 },
            vel: { x: 10, y: -100, max: 800 },
            sequence: [2],
            damage: 1.5,
          });
        } else if (energy.actual < 4) {
          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 30 },
            vel: { x: -20, y: -100, max: 800 },
            sequence: [2],
            damage: 1.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 40 },
            vel: { y: -100, max: 800 },
            sequence: [2],
            damage: 2,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 30 },
            vel: { x: 20, y: -100, max: 800 },
            sequence: [2],
            damage: 1.5,
          });
        } else if (energy.actual < 5) {
          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 10 },
            vel: { x: -35, y: -100, max: 800 },
            sequence: [1],
            damage: 1.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 25 },
            vel: { x: -20, y: -100, max: 800 },
            sequence: [2],
            damage: 2,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 35 },
            vel: { y: -100, max: 800 },
            sequence: [3],
            damage: 2.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 25 },
            vel: { x: 20, y: -100, max: 800 },
            sequence: [2],
            damage: 2,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 10 },
            vel: { x: 35, y: -100, max: 800 },
            sequence: [1],
            damage: 1.5,
          });
        } else if (energy.actual < 7) {
          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 15 },
            vel: { x: -60, y: -100, max: 800 },
            sequence: [2],
            damage: 2,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 30 },
            vel: { x: -30, y: -100, max: 800 },
            sequence: [2],
            damage: 2,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 35 },
            vel: { x: 0, y: -100, max: 800 },
            sequence: [3],
            damage: 3,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 30 },
            vel: { x: 30, y: -100, max: 800 },
            sequence: [2],
            damage: 2,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 15 },
            vel: { x: 60, y: -100, max: 800 },
            sequence: [2],
            damage: 2,
          });
        } else if (energy.actual < 9) {
          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 20 },
            vel: { x: -60, y: -100, max: 800 },
            sequence: [2],
            damage: 2,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 40 },
            vel: { x: -30, y: -100, max: 800 },
            sequence: [3],
            damage: 2.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 60 },
            vel: { x: 0, y: -100, max: 800 },
            sequence: [4],
            damage: 3.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 40 },
            vel: { x: 30, y: -100, max: 800 },
            sequence: [3],
            damage: 2.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 20 },
            vel: { x: 60, y: -100, max: 800 },
            sequence: [2],
            damage: 2,
          });
        } else if (energy.actual < 10) {
          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 30 },
            vel: { x: -90, y: -100, max: 800 },
            sequence: [2],
            damage: 2,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 60 },
            vel: { x: -60, y: -100, max: 800 },
            sequence: [3],
            damage: 2.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 80 },
            vel: { x: -30, y: -100, max: 800 },
            sequence: [3],
            damage: 2.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 90 },
            vel: { x: 0, y: -100, max: 800 },
            sequence: [4],
            damage: 3.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 80 },
            vel: { x: 30, y: -100, max: 800 },
            sequence: [3],
            damage: 2.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 60 },
            vel: { x: 60, y: -100, max: 800 },
            sequence: [3],
            damage: 2.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 30 },
            vel: { x: 90, y: -100, max: 800 },
            sequence: [2],
            damage: 2,
          });
        } else if (energy.actual >= 10) {
          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 10 },
            vel: { x: -110, y: -100, max: 800 },
            sequence: [1],
            damage: 1.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 40 },
            vel: { x: -90, y: -100, max: 800 },
            sequence: [2],
            damage: 2,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 60 },
            vel: { x: -60, y: -100, max: 800 },
            sequence: [3],
            damage: 2.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 80 },
            vel: { x: -30, y: -100, max: 800 },
            sequence: [4],
            damage: 3,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 90 },
            vel: { x: 0, y: -100, max: 800 },
            sequence: [4],
            damage: 3,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 80 },
            vel: { x: 30, y: -100, max: 800 },
            sequence: [4],
            damage: 3,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 60 },
            vel: { x: 60, y: -100, max: 800 },
            sequence: [3],
            damage: 2.5,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 40 },
            vel: { x: 90, y: -100, max: 800 },
            sequence: [2],
            damage: 2,
          });

          addPlayerPrimaryWeapon(g, {
            pos: { x: pos.x + 4, y: pos.y - 10 },
            vel: { x: 110, y: -100, max: 800 },
            sequence: [1],
            damage: 1.5,
          });
        }
      }

      // missle
      if (energy.actual >= 10 && timers.missle.expired()) {
        timers.missle.reset();

        addPlayerMissle(g, {
          pos: { x: pos.x + 6, y: pos.y + 4 },
          vel: { x: -80, y: 200, max: 1500 },
          accel: { x: 1.5, y: -15 },
        });

        addPlayerMissle(g, {
          pos: { x: pos.x + 6, y: pos.y + 4 },
          vel: { x: 80, y: 200, max: 1500 },
          accel: { x: -1.5, y: -15 },
        });
      }
    }

    // beam
    if (g.keyPressed('b') && energy.actual === 10) {
      // addPlayerBeamWeapon(g, sprite);
    }

    // drone
  };

  sprite.onReceiveDamage = (amount) => {
    sprite.hull.actual -= amount;
    if (sprite.hull.actual <= 0) sprite.destroy();
  };

  sprite.onDestroy = () => {
    const { pos } = sprite;

    addExplosion(g, {
      pos: {
        x: pos.x - 10,
        y: pos.y - 10,
      },
    });
  };
}

function addPlayerPrimaryWeapon(g, settings) {
  const { pos, vel, sequence, damage } = settings;

  const sprite = g.add(
    g.sprite('player-primary-weapon.png', 11, 70),
    g.pos(pos),
    g.accel({
      y: -100,
    }),
    g.vel(vel),
    g.area(),
    g.animation({
      idle: {
        sequence,
      },
    }),
    {
      damage,
    },
    'playerPrimaryWeapon'
  );

  sprite.onUpdate = () => {
    const { pos } = sprite;

    if (pos.y < 0) sprite.destroy();
  };

  sprite.onCollide = (other) => {
    if (other.hasTag('enemy')) {
      const { pos, damage } = sprite;

      other.receiveDamage(damage);

      addSpark(g, {
        pos: {
          x: pos.x - 10,
          y: pos.y - 10,
        },
        vel: {
          x: vel.x * g.randomInt(-0.25, 0.25),
          y: vel.y * 0.25,
        },
      });

      sprite.destroy();
    }
  };
}

function addPlayerMissle(g, settings) {
  const { pos, vel, accel } = settings;

  const sprite = g.add(
    g.sprite('player-missle.png', 9, 38),
    g.pos(pos),
    g.accel(accel),
    g.vel(vel),
    g.area(),
    g.animation({
      idle: {
        sequence: [0],
      },
      ignition: {
        sequence: [1, 2],
        frame: 0,
        delay: 0.1,
        repeat: true,
      },
    }),
    {
      damage: 10,
    },
    'playerMissleWeapon'
  );

  sprite.onUpdate = () => {
    const { vel, animation } = sprite;
    if (vel.y < 0) animation.play('ignition');
  };

  sprite.onCollide = (other) => {
    if (other.hasTag('enemy')) {
      const { pos } = sprite;

      sprite.destroy();

      addExplosion(g, {
        pos: {
          x: pos.x - 10,
          y: pos.y - 10,
        },
      });
    }
  };
}

function addPlayerBeamWeapon(g, player) {
  const { pos } = player;

  g.add(
    g.sprite('player-beam-weapon.png', 48, 480),
    g.pos({
      x: pos.x - 13,
      y: pos.y - 445,
    }),
    g.animation({
      idle: {
        sequence: [0, 1, 2],
        delay: 0.01,
        repeat: true,
      },
    }),
    'playerBeamWeapon'
  );
}
