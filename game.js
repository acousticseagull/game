import { Engine } from './engine.js';

const game = Engine({
  size: {
    width: 600,
    height: 800,
  },
  backgroundColor: '#000000',
});

game.on({ event: 'update' }, () => {});

game.on({ target: 'player', event: 'update' }, (sprite) => {
  const { pos, vel, size } = sprite;

  //   if (game.Keyboard.key.isHeld('ArrowUp')) {
  //     pos.y -= 1;
  //   }

  //   if (game.Keyboard.key.isHeld('ArrowDown')) {
  //     pos.y += 1;
  //   }

  //   if (game.Keyboard.key.isHeld('ArrowLeft')) {
  //     pos.x -= 1;
  //   }

  //   if (game.Keyboard.key.isHeld('ArrowRight')) {
  //     pos.x += 1;
  //   }
});

game.add('sprite', {
  name: 'player',
  src: 'assets/player.png',
  size: {
    width: 21,
    height: 26,
  },
  pos: {
    x: game.size.width / 2,
    y: game.size.height - 100,
  },
  vel: {
    x: 0.5,
  },
});

game.start();
