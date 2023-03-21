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

  vel.x = 0;
  vel.y = 0;

  if (game.keyboard.isDown('ArrowUp')) {
    vel.y = -1;
  }

  if (game.keyboard.isDown('ArrowDown')) {
    vel.y = 1;
  }

  if (game.keyboard.isDown('ArrowLeft')) {
    vel.x = -1;
  }

  if (game.keyboard.isDown('ArrowRight')) {
    vel.x = 1;
  }
});

game.add('sprite', {
  name: 'player',
  color: '#ffffff',
  //src: 'assets/player.png',
  size: {
    width: 21,
    height: 26,
  },
  pos: {
    x: game.size.width / 2,
    y: game.size.height - 100,
  },
});

game.add('sprite', {
  name: 'fighter',
  color: '#ffffff',
  //src: 'assets/fighter.png',
  size: {
    width: 21,
    height: 26,
  },
  pos: {
    x: game.size.width / 2,
    y: 100,
  },
  vel: {
    y: 0.5,
  },
});

game.add('sprite', {
  name: 'fighter',
  color: '#ffffff',
  //src: 'assets/fighter.png',
  size: {
    width: 21,
    height: 26,
  },
  pos: {
    x: 100,
    y: 100,
  },
  vel: {
    y: 0.5,
  },
});

game.add('sprite', {
  name: 'fighter',
  color: '#ffffff',
  //src: 'assets/fighter.png',
  size: {
    width: 21,
    height: 26,
  },
  pos: {
    x: game.size.width - 100,
    y: 100,
  },
  vel: {
    y: 0.5,
  },
});

game.start();
