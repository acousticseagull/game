import { Engine } from './engine.js';

const game = Engine({
  size: {
    width: 600,
    height: 800,
  },
  scale: 2,
  backgroundColor: '#000000',
});

game.on({ event: 'update' }, () => {});

game.on({ target: 'player', event: 'update' }, (sprite) => {
  const { pos, vel, size } = sprite;

  sprite.animation.play('idle');

  vel.x = 0;
  vel.y = 0;

  if (game.keyboard.isDown('ArrowUp')) {
    vel.y = -1;
  }

  if (game.keyboard.isDown('ArrowDown')) {
    vel.y = 1;
  }

  if (game.keyboard.isDown('ArrowLeft')) {
    sprite.animation.play('left');
    vel.x = -1;
  }

  if (game.keyboard.isDown('ArrowRight')) {
    sprite.animation.play('right');
    vel.x = 1;
  }
});

const player = game.add('sprite', {
  tag: 'player',
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
});

console.log(player);

// game.add('sprite', {
//   tag: 'fighter',
//   src: 'https://stephenpruitt.com/rayborn/assets/fighter.png',
//   size: {
//     width: 21,
//     height: 26,
//   },
//   pos: {
//     x: game.size.width / 2,
//     y: 100,
//   },
//   vel: {
//     y: 0.5,
//   },
// });

// game.add('sprite', {
//   tag: 'fighter',
//   src: 'https://stephenpruitt.com/rayborn/assets/fighter.png',
//   size: {
//     width: 21,
//     height: 26,
//   },
//   pos: {
//     x: 100,
//     y: 100,
//   },
//   vel: {
//     y: 0.5,
//   },
// });

// game.add('sprite', {
//   tag: 'fighter',
//   src: 'https://stephenpruitt.com/rayborn/assets/fighter.png',
//   size: {
//     width: 21,
//     height: 26,
//   },
//   pos: {
//     x: game.size.width - 100,
//     y: 100,
//   },
//   vel: {
//     y: 0.5,
//   },
// });

game.start();
