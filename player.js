export default function addPlayer(g) {
  g.add(
    g.sprite('player.png', 21, 26),
    g.pos({ x: g.width() / 2, y: g.height() - 100, z: 2 }),
    g.vel({ max: 200 }),
    g.area(),
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
      energy: {
        actual: 15,
        max: 15,
      },

      timers: {
        primary: g.timer(0.1),
        missle: g.timer(0.5),
      },
    },
    'player'
  );

  g.on('add', (sprite) => {}, 'player');

  g.on(
    'update',
    (sprite, dt) => {
      const { pos, vel, size, animation, energy, timers } = sprite;

      vel.x = 0;
      vel.y = 0;

      if (g.keyDown('ArrowUp')) {
        vel.y = -240;
      }

      if (g.keyDown('ArrowDown')) {
        vel.y = 200;
      }

      if (g.keyDown('ArrowLeft')) {
        vel.x = -240;
      }

      if (g.keyDown('ArrowRight')) {
        vel.x = 240;
      }

      animation.play('idle');

      if (vel.x < 0) animation.play('left');
      if (vel.x > 0) animation.play('right');

      if (g.keyDown('x')) {
        if (timers.primary.expired()) {
          timers.primary.reset();

          // primary weapon
          if (energy.actual < 10) {
            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 30 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: -10, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 30 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: 10, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );
          } else if (energy.actual < 2) {
            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 30 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: -20, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 30 }),
              g.accel({
                y: -100,
              }),
              g.vel({ y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 30 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: 20, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );
          } else if (energy.actual < 4) {
            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 10 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: -35, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [1],
                  frame: 0,
                },
              }),
              {
                damage: 0.5,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 25 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: -20, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 35 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: 0, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [3],
                  frame: 0,
                },
              }),
              {
                damage: 2,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 25 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: 20, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 10 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: 35, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [1],
                  frame: 0,
                },
              }),
              {
                damage: 0.5,
              },
              'playerPrimaryWeapon'
            );
          } else if (energy.actual < 6) {
            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 30 }),
              g.accel({
                y: -90,
              }),
              g.vel({ x: -60, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [1],
                  frame: 0,
                },
              }),
              {
                damage: 0.5,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 30 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: -30, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 35 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: 0, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [3],
                  frame: 0,
                },
              }),
              {
                damage: 2,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 30 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: 30, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 30 }),
              g.accel({
                y: -90,
              }),
              g.vel({ x: 60, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [1],
                  frame: 0,
                },
              }),
              {
                damage: 0.5,
              },
              'playerPrimaryWeapon'
            );
          } else if (energy.actual < 10) {
            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 30 }),
              g.accel({
                y: -90,
              }),
              g.vel({ x: -60, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 40 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: -30, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [3],
                  frame: 0,
                },
              }),
              {
                damage: 2,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 60 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: 0, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [4],
                  frame: 0,
                },
              }),
              {
                damage: 4,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 40 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: 30, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [3],
                  frame: 0,
                },
              }),
              {
                damage: 2,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 30 }),
              g.accel({
                y: -90,
              }),
              g.vel({ x: 60, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );
          } else if (energy.actual < 12) {
            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 40 }),
              g.accel({
                y: -90,
              }),
              g.vel({ x: -90, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 60 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: -60, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [3],
                  frame: 0,
                },
              }),
              {
                damage: 2,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 80 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: -30, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [3],
                  frame: 0,
                },
              }),
              {
                damage: 2,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 90 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: 0, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [4],
                  frame: 0,
                },
              }),
              {
                damage: 4,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 80 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: 30, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [3],
                  frame: 0,
                },
              }),
              {
                damage: 2,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 60 }),
              g.accel({
                y: -90,
              }),
              g.vel({ x: 60, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [3],
                  frame: 0,
                },
              }),
              {
                damage: 2,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 40 }),
              g.accel({
                y: -90,
              }),
              g.vel({ x: 90, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );
          } else if (energy.actual <= 15) {
            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 10 }),
              g.accel({
                y: -90,
              }),
              g.vel({ x: -110, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [1],
                  frame: 0,
                },
              }),
              {
                damage: 0.5,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 40 }),
              g.accel({
                y: -90,
              }),
              g.vel({ x: -90, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 0.1,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 60 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: -60, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [3],
                  frame: 0,
                },
              }),
              {
                damage: 2,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 80 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: -30, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [3],
                  frame: 0,
                },
              }),
              {
                damage: 2,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 90 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: 0, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [4],
                  frame: 0,
                },
              }),
              {
                damage: 4,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 80 }),
              g.accel({
                y: -100,
              }),
              g.vel({ x: 30, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [3],
                  frame: 0,
                },
              }),
              {
                damage: 2,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 60 }),
              g.accel({
                y: -90,
              }),
              g.vel({ x: 60, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [3],
                  frame: 0,
                },
              }),
              {
                damage: 2,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 40 }),
              g.accel({
                y: -90,
              }),
              g.vel({ x: 90, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [2],
                  frame: 0,
                },
              }),
              {
                damage: 1,
              },
              'playerPrimaryWeapon'
            );

            g.add(
              g.sprite('player-primary-weapon.png', 11, 70),
              g.pos({ x: pos.x + 4, y: pos.y - 10 }),
              g.accel({
                y: -90,
              }),
              g.vel({ x: 110, y: -100, max: 800 }),
              g.area(),
              g.animation({
                idle: {
                  sequence: [1],
                  frame: 0,
                },
              }),
              {
                damage: 0.5,
              },
              'playerPrimaryWeapon'
            );
          }
        }

        // missle
        if (energy.actual > 13 && timers.missle.expired()) {
          timers.missle.reset();

          g.add(
            g.sprite('player-missle.png', 9, 38),
            g.pos({ x: pos.x + 6, y: pos.y + 4 }),
            g.accel({
              x: 1,
              y: -6,
            }),
            g.vel({ x: -80, y: 100, max: 800 }),
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
              damage: 6,
            },
            'playerMissleWeapon'
          );

          g.add(
            g.sprite('player-missle.png', 9, 38),
            g.pos({ x: pos.x + 6, y: pos.y + 4 }),
            g.accel({
              x: -1,
              y: -6,
            }),
            g.vel({ x: 80, y: 100, max: 800 }),
            g.area(),
            g.animation({
              idle: {
                sequence: [0],
              },
              ignition: {
                sequence: [1, 2],
                frame: 0,
                delay: 0.05,
                repeat: true,
              },
            }),
            {
              damage: 6,
            },
            'playerMissleWeapon'
          );
        }

        // beam

        // drone
      }
    },
    'player'
  );

  g.on(
    'update',
    (sprite, dt) => {
      const { pos, width, height } = sprite;

      if (pos.y <= 0) sprite.destroy();
    },
    'playerPrimaryWeapon'
  );

  g.on(
    'update',
    (sprite, dt) => {
      const { vel, animation } = sprite;

      if (vel.y < 0) animation.play('ignition');
    },
    'playerMissleWeapon'
  );
}
