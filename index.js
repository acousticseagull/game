import Game from './lib/game.js';

const g = Game({
  width: window.innerWidth,
  height: window.innerHeight,
  scale: 1,
});

const baseURL = 'https://stephenpruitt.com/rayborn/assets/';

g.loadImage(baseURL + 'player.png');
g.loadImage(baseURL + 'player-primary-weapon.png');

function addPlayer(g) {
  g.add(
    g.sprite('player.png', 21, 26),
    g.pos({ x: g.width() / 2, y: g.height() - 100 }),
    g.vel({ max: 160 }),
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
    }),
    'player'
  );

  g.on('add', (sprite) => {}, 'player');

  g.on(
    'update',
    (sprite, dt) => {
      const { pos, vel, size, animation, collides } = sprite;

      vel.x = 0;
      vel.y = 0;

      if (g.keyDown('ArrowUp')) {
        vel.y = -160;
      }

      if (g.keyDown('ArrowDown')) {
        vel.y = 100;
      }

      if (g.keyDown('ArrowLeft')) {
        vel.x = -100;
      }

      if (g.keyDown('ArrowRight')) {
        vel.x = 100;
      }

      animation.play('idle');

      if (vel.x < 0) animation.play('left');
      if (vel.x > 0) animation.play('right');

      if (g.keyPressed('x')) {
        addPlayerPrimaryWeapon(pos.x - 2, pos.y - 20);
        addPlayerPrimaryWeapon(pos.x + 12, pos.y - 20);
      }
    },
    'player'
  );
}

function addPlayerPrimaryWeapon(x, y) {
  g.add(
    g.sprite('player-primary-weapon.png', 11, 100),
    g.pos({ x, y }),
    g.accel({
      y: -100,
    }),
    g.vel({ y: -100, max: 800 }),
    g.area(),
    g.animation({
      idle: {
        sequence: [0],
        frame: 0,
        delay: 1,
        repeat: false,
      },
    }),
    'playerPrimaryWeapon'
  );

  g.on('update', (sprite, dt) => {
    const { pos, width, height } = sprite;

    if (pos.y <= 0) sprite.destroy();
  }, 'playerPrimaryWeapon');
}

g.scene('main', () => {
  addPlayer(g);

  //game.add('sprite', mothership(game));
});

g.start('main');
