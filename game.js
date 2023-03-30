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
  const { pos, vel, state, animate, collides } = sprite;

  if (state.is('idle')) {
    vel.x = 0;
  }

  if (state.is('right')) {
    vel.x = 25;

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

  collides('player', (other) => {
    sprite.destroy();
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
    y: 0,
  },
  state: {
    current: 'left',
    states: ['idle', 'left', 'right'],
  },
});

game.start();
