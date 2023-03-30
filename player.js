export const player = (game) => {
  game.add('sprite', {
    tags: ['player'],
    src: 'https://stephenpruitt.com/rayborn/assets/player.png',
    size: {
      width: 21,
      height: 26,
    },
    pos: {
      x: game.size.width / 2,
      y: game.size.height - 100,
    },
    animations: {
      idle: {
        sequence: [0],
        frame: 0,
        delay: 1,
        repeat: false,
      },
      left: {
        sequence: [1],
        frame: 0,
        delay: 0.1,
        repeat: false,
      },
      right: {
        sequence: [2],
        frame: 0,
        delay: 0.1,
        repeat: false,
      },
    },

    on: {
      add: (sprite) => {
        console.log({ sprite });
      },
      update: (sprite) => {
        const { pos, vel, size, animate, collides } = sprite;

        vel.x = 0;
        vel.y = 0;

        if (game.keyboard.isDown('ArrowUp')) {
          vel.y = -140;
        }

        if (game.keyboard.isDown('ArrowDown')) {
          vel.y = 80;
        }

        if (game.keyboard.isDown('ArrowLeft')) {
          vel.x = -100;
        }

        if (game.keyboard.isDown('ArrowRight')) {
          vel.x = 100;
        }

        animate.play('idle');

        if (vel.x < 0) animate.play('left');
        if (vel.x > 0) animate.play('right');

        collides('enemy', (other) => {
          // sprite.destroy();
        });
      },
    },
  });
};
