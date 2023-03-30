import { constructPrimaryWeapon } from './construct-primary-weapon.js';

export const mothership = (game) => {
  return {
    tags: ['mothership', 'enemy'],
    src: 'https://stephenpruitt.com/rayborn/assets/mothership.png',
    size: {
      width: 71,
      height: 71,
    },
    pos: {
      x: game.size.width / 2,
      y: 100,
    },
    vel: {
      y: 0,
    },
    state: {
      current: 'left',
      states: ['idle', 'left', 'right'],
    },
    animations: {
      idle: {
        sequence: [0, 1],
        frame: 0,
        delay: 0.5,
        repeat: true,
      },
    },

    on: {
      add: (sprite) => {

        game.add('sprite', {
          src: 'https://stephenpruitt.com/rayborn/assets/enemy-primary-weapon.png',
          size: {
            width: 20,
            height: 20,
          },
          pos: {
            ...sprite.pos
          },
        });
      },
      update: (sprite) => {
        const { pos, vel, state, animate, collides } = sprite;

        if (state.is('idle')) {
          vel.x = 0;
        }

        if (state.is('right')) {
          vel.set({
            x: 25,
          });

          if (pos.x >= 200) {
            state.set('left');
          }
        }

        if (state.is('left')) {
          vel.x = -30;

          if (pos.x <= 100) {
            state.current = 'right';
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
