import { constructPrimaryWeapon } from './construct-primary-weapon.js';

export const mothership = (game) => {
  return {
    tags: ['mothership', 'enemy'],
    src: 'https://stephenpruitt.com/rayborn/assets/mothership-sheet.png',
    size: {
      width: 70,
      height: 70,
    },
    pos: {
      x: game.size.width / 2,
      y: -60,
    },
    vel: {
      y: 0,
    },
    state: {
      current: 'enter',
      counter: 0,
      timer: game.Timer(),
    },
    animations: {
      idle: {
        sequence: [0, 1, 2, 3],
        frame: 0,
        delay: 0.1,
        repeat: true,
      },
    },

    weapon: {
      timer: game.Timer(),
      angle: 0,
      magazine: 30,
    },

    on: {
      add: (sprite) => {
        const { pos, state } = sprite;

        pos.start = {
          x: pos.x,
          y: pos.y,
        };

        sprite.weapon.timer.set(0.5);
        state.timer.set(1);
      },
      update: (sprite) => {
        const { pos, vel, size, state, animate, collides } = sprite;

        if (state.is('enter')) {
          vel.set({
            y: 60,
          });

          if (pos.y > 40) {
            vel.set({
              y: 0,
            });
            state.set('1');
          }
        }

        if (state.is('1')) {
          if (vel.x === 0) {
            vel.set({
              x: game.chance(0.5) ? -100 : 100,
            });
          }

          if (pos.x < pos.start.x - 60 && vel.x < 0) {
            vel.x = 100;
          }

          if (pos.x > pos.start.x + 60 && vel.x > 0) {
            vel.x = -100;
            state.counter++;
          }

          if (sprite.weapon.timer.expired()) {
            let bullets = 5,
              inc = 180 / (bullets - 1),
              a = 0;

            for (let i = 0; i < bullets; i++) {
              let angle = a;

              game.add('sprite', {
                tags: ['construct-primary-weapon'],
                src: 'https://stephenpruitt.com/rayborn/assets/enemy-primary-weapon.png',
                size: {
                  width: 22,
                  height: 22,
                },
                pos: {
                  x: sprite.pos.x,
                  y: sprite.pos.y + 40,
                },
                angle,
                animations: {
                  idle: {
                    sequence: [0],
                    frame: 0,
                    delay: 0.1,
                    repeat: false,
                  },
                },

                on: {
                  add: (sprite) => {
                    sprite.setAngleVel(160);
                  },
                  update: (sprite) => {
                    const { pos } = sprite;

                    sprite.collides('player', (other) => {
                      sprite.destroy();
                      other.damage(1);
                    });

                    if (
                      pos.x < 0 ||
                      pos.x > game.size.width ||
                      pos.y < 0 ||
                      pos.y > game.size.height
                    )
                      sprite.destroy();
                  },
                },
              });

              a += inc;
            }

            sprite.weapon.timer.set(0.5);
          }
        }

        if (state.counter > 5) {
          if (vel.x > 0 && pos.x < 240 - size.width / 2) {
            vel.set({
              x: 0,
            });

            state.counter = 0;

            state.timer.reset();
            state.set('2');
          }
        }

        if (state.is('2')) {
          if (state.timer.expired()) {
            for (let i = 0; i < 5; i++) {
              // add minions
            }

            state.set('3');

            state.timer.reset();
          }
        }

        if (state.is('3')) {
          if (state.timer.expired()) {
            // add beam weapon

            state.set('4');
          }

          state.timer.reset();
        }

        if (state.is('4')) {
          if (pos.x < 60 && vel.x < 0) {
            vel.set({
              x: 0,
            });
          } else if (pos.x > 60 && vel.x > 0) {
            vel.set({
              x: 0,
            });
          }

          if (sprite.weapon.timer.expired()) {
            sprite.weapon.magazine = sprite.weapon.magazine || 30;
            sprite.weapon.angle = sprite.weapon.angle || 0;

            game.add('sprite', {
              tags: ['construct-primary-weapon'],
              src: 'https://stephenpruitt.com/rayborn/assets/enemy-primary-weapon.png',
              size: {
                width: 22,
                height: 22,
              },
              pos: {
                x: sprite.pos.x,
                y: sprite.pos.y,
              },
              angle: sprite.weapon.angle,
              animations: {
                idle: {
                  sequence: [0],
                  frame: 0,
                  delay: 0.1,
                  repeat: false,
                },
              },

              on: {
                add: (sprite) => {
                  sprite.setAngleVel(160);
                },
                update: (sprite) => {
                  const { pos } = sprite;

                  sprite.collides('player', (other) => {
                    sprite.destroy();
                    other.damage(1);
                  });

                  if (
                    pos.x < 0 ||
                    pos.x > game.size.width ||
                    pos.y < 0 ||
                    pos.y > game.size.height
                  )
                    sprite.destroy();
                },
              },
            });

            game.add('sprite', {
              tags: ['construct-primary-weapon'],
              src: 'https://stephenpruitt.com/rayborn/assets/enemy-primary-weapon.png',
              size: {
                width: 22,
                height: 22,
              },
              pos: {
                x: sprite.pos.x,
                y: sprite.pos.y,
              },
              angle: sprite.weapon.angle + 90,
              animations: {
                idle: {
                  sequence: [0],
                  frame: 0,
                  delay: 0.1,
                  repeat: false,
                },
              },

              on: {
                add: (sprite) => {
                  sprite.setAngleVel(160);
                },
                update: (sprite) => {
                  const { pos } = sprite;

                  sprite.collides('player', (other) => {
                    sprite.destroy();
                    other.damage(1);
                  });

                  if (
                    pos.x < 0 ||
                    pos.x > game.size.width ||
                    pos.y < 0 ||
                    pos.y > game.size.height
                  )
                    sprite.destroy();
                },
              },
            });

            game.add('sprite', {
              tags: ['construct-primary-weapon'],
              src: 'https://stephenpruitt.com/rayborn/assets/enemy-primary-weapon.png',
              size: {
                width: 22,
                height: 22,
              },
              pos: {
                x: sprite.pos.x,
                y: sprite.pos.y,
              },
              angle: sprite.weapon.angle + 180,
              animations: {
                idle: {
                  sequence: [0],
                  frame: 0,
                  delay: 0.1,
                  repeat: false,
                },
              },

              on: {
                add: (sprite) => {
                  sprite.setAngleVel(160);
                },
                update: (sprite) => {
                  const { pos } = sprite;

                  sprite.collides('player', (other) => {
                    sprite.destroy();
                    other.damage(1);
                  });

                  if (
                    pos.x < 0 ||
                    pos.x > game.size.width ||
                    pos.y < 0 ||
                    pos.y > game.size.height
                  )
                    sprite.destroy();
                },
              },
            });

            sprite.weapon.angle += 30;

            sprite.weapon.magazine -= 1;

            if (sprite.weapon.magazine <= 0) {
              state.set('5');
            }

            sprite.weapon.timer.set(0.5);
          }

          if (state.is('5')) {
          }

          if (state.is('6')) {
          }

          if (state.is('7')) {
          }
        }

        collides('player', () => {
          sprite.destroy();
        });
      },
    },

    add: (parent) => {
      return {
        tags: ['mothership-shield', 'enemy'],
        src: 'https://stephenpruitt.com/rayborn/assets/mothership-shield.png',
        size: {
          width: 66,
          height: 66,
        },
        pos: {
          x: parent.size.width / 2,
          y: parent.size.height / 2,
        },
        animations: {
          idle: {
            sequence: [0],
            frame: 0,
            delay: 0.5,
            repeat: false,
          },
        },
        parent,

        on: {
          update: (sprite, dt) => {
            const { setAngle, angle, collides } = sprite;

            setAngle(angle + 100 * dt);

            collides('player', () => {
              sprite.destroy();
            });
          },
        },
      };
    },
  };
};
