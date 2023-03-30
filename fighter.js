export const fighter = (game) => {
  return {
    tags: ['fighter', 'enemy'],
    src: 'https://stephenpruitt.com/rayborn/assets/fighter.png',
    size: {
      width: 21,
      height: 26,
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

    on: {
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
  };
};
