import { Engine } from './engine.js';

const game = Engine({
  size: {
    width: 400,
    height: 500,
  },
  scale: 1,
  backgroundColor: '#000000',
});

game.on('add', 'player', (sprite) => {
  console.log({ sprite });
});

game.on('update', 'player', (sprite) => {
  const { pos, vel, size } = sprite;

  sprite.animate.play('idle');

  vel.x = 0;
  vel.y = 0;

  if (game.keyboard.isDown('ArrowUp')) {
    vel.y = -100;
  }

  if (game.keyboard.isDown('ArrowDown')) {
    vel.y = 100;
  }

  if (game.keyboard.isDown('ArrowLeft')) {
    sprite.animate.play('left');
    vel.x = -100;
  }

  if (game.keyboard.isDown('ArrowRight')) {
    sprite.animate.play('right');
    vel.x = 100;
  }

  sprite.on.collides('enemy', (other) => {
    // sprite.destroy();
  });
});

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
});

game.on('update', 'fighter', (sprite) => {
  sprite.on.collides('player', (other) => {
    sprite.on.destroy();
  });
});

game.add('sprite', {
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
    y: 50,
  },
  state: {
    current: 'idle',
    states: ['idle', 'forward'],
  },
});

game.add('sprite', {
  tags: ['fighter'],
  src: 'https://stephenpruitt.com/rayborn/assets/fighter.png',
  size: {
    width: 21,
    height: 26,
  },
  pos: {
    x: 100,
    y: 100,
  },
  vel: {
    y: 25,
  },
});

game.start();
