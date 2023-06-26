import Game from './lib/game.js';
import addPlayer from './player.js';
import addFighter from './fighter.js';
import addDemon from './demon.js';
import addImperial from './imperial.js';

const g = Game({
  width: window.innerWidth,
  height: window.innerHeight,
  scale: 1,
  debug: false,
});

const baseURL = '//stephenpruitt.com/rayborn/assets/';

g.loadImage(baseURL + 'player.png');
g.loadImage(baseURL + 'player-primary-weapon.png');
g.loadImage(baseURL + 'player-secondary-weapon.png');
g.loadImage(baseURL + 'player-missle.png');
g.loadImage(baseURL + 'player-beam-weapon.png');
g.loadImage(baseURL + 'player-energy-meter.png');
g.loadImage(baseURL + 'health.png');
g.loadImage(baseURL + 'explosion.png');
g.loadImage(baseURL + 'fighter.png');
g.loadImage(baseURL + 'imperial.png');
g.loadImage(baseURL + 'firefly.png');
g.loadImage(baseURL + 'blackwidow.png');
g.loadImage(baseURL + 'carrier.png');
g.loadImage(baseURL + 'wing.png');
g.loadImage(baseURL + 'star-eater.png');
g.loadImage(baseURL + 'demon.png');
g.loadImage(baseURL + 'demon-mine.png');
g.loadImage(baseURL + 'enemy-primary-weapon.png');

g.scene('main', () => {
  // draw interface
  g.on('draw', () => {
    const player = g.getSpriteByTag('player');

    if (!player) return;

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

  addFighter(g, { x: 20, y: -26 }, { x: 0, y: 100 });
  addFighter(g, { x: 200, y: -100 }, { x: 0, y: 140 });
  addFighter(g, { x: 240, y: -140 }, { x: 0, y: 140 });
  addFighter(g, { x: 280, y: -100 }, { x: 0, y: 140 });

  addImperial(g, { x: 320, y: -180 }, { x: 0, y: 140 });

  addDemon(g, { x: g.width + 100, y: 200 });

  addPlayer(g);
});

g.start('main');
