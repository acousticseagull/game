import Game from './lib/game.js';
import addPlayer from './player.js';

const g = Game({
  width: window.innerWidth,
  height: window.innerHeight,
  scale: 1,
});

const baseURL = 'https://stephenpruitt.com/rayborn/assets/';

g.loadImage(baseURL + 'player.png');
g.loadImage(baseURL + 'player-primary-weapon.png');
g.loadImage(baseURL + 'player-secondary-weapon.png');
g.loadImage(baseURL + 'player-missle.png');
g.loadImage(baseURL + 'player-beam-weapon.png');
g.loadImage(baseURL + 'player-energy-meter.png');
g.loadImage(baseURL + 'health.png');

g.scene('main', () => {
  addPlayer(g);

  g.on('draw', () => {
    const player = g.getSpriteByTag('player');

    g.drawTile('player-energy-meter.png', 20, g.height - 40, 74, 20, 0);

    let x = 23;
    for (let i = 0; i < player.energy.actual; i++) {
      if (i < 3) {
        g.drawTile('health.png', x, g.height - 41, 5, 18, 0);
      } else if (i < 6) {
        g.drawTile('health.png', x, g.height - 41, 5, 18, 1);
      } else if (i < 8) {
        g.drawTile('health.png', x, g.height - 41, 5, 18, 2);
      } else if (i < 10) {
        g.drawTile('health.png', x, g.height - 41, 5, 18, 3);
      }
      x += 7;
    }
  });

  //game.add('sprite', mothership(game));
});

g.start('main');
