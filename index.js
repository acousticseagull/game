import Game from './lib/game.js';
import addPlayer from './player.js';
import addFighter from './fighter.js';
import addDemon from './demon.js';
import addImperial from './imperial.js';
import addCarrier from './carrier.js';
import addBlackwidow from './blackwidow.js';
import addStareater from './stareater.js';
import addFirefly from './firefly.js';

import level from './level.js';

const g = Game({
  width: 480,
  height: 720,
  scale: 1,
  debug: false,
});

const baseURL = '//stephenpruitt.com/rayborn/assets/';

g.load.image(baseURL + 'player.png');
g.load.image(baseURL + 'stars.png');
g.load.image(baseURL + 'dust.png');
g.load.image(baseURL + 'gas.png');
g.load.image(baseURL + 'player-primary-weapon.png');
g.load.image(baseURL + 'player-secondary-weapon.png');
g.load.image(baseURL + 'player-missle.png');
g.load.image(baseURL + 'player-beam-weapon.png');
g.load.image(baseURL + 'player-energy-meter.png');
g.load.image(baseURL + 'health.png');
g.load.image(baseURL + 'explosion.png');
g.load.image(baseURL + 'energy.png');
g.load.image(baseURL + 'fighter.png');
g.load.image(baseURL + 'imperial.png');
g.load.image(baseURL + 'firefly.png');
g.load.image(baseURL + 'blackwidow.png');
g.load.image(baseURL + 'carrier.png');
g.load.image(baseURL + 'star-eater.png');
g.load.image(baseURL + 'demon.png');
g.load.image(baseURL + 'demon-mine.png');
g.load.image(baseURL + 'enemy-primary-weapon.png');
g.load.image(baseURL + 'firefly-primary-weapon.png');

g.scene('main', () => {
  g.global.player = addPlayer(g);

  const stars = {
    pos: {
      x: 0,
      y: 0,
    },
    vel: {
      y: 30,
    },
  };

  const dust = {
    pos: {
      x: 0,
      y: 0,
    },
    vel: {
      y: 60 * 3,
    },
  };

  const gas = {
    pos: {
      x: 0,
      y: 0,
    },
    vel: {
      y: 60,
    },
  };

  g.on('update', (dt) => {
    stars.pos.y += stars.vel.y * dt;
    dust.pos.y += dust.vel.y * dt;
    gas.pos.y += gas.vel.y * dt;
  });

  g.on('draw', () => {
    g.drawTile('stars.png', stars.pos.x, stars.pos.y - 720, 480, 720, 0);
    g.drawTile('stars.png', stars.pos.x, stars.pos.y, 480, 720, 0);

    g.drawTile('dust.png', dust.pos.x, dust.pos.y - 720, 480, 720, 0);
    g.drawTile('dust.png', dust.pos.x, dust.pos.y, 480, 720, 0);

    g.drawTile('gas.png', gas.pos.x, gas.pos.y - 1920, 480, 1920, 0);
    g.drawTile('gas.png', gas.pos.x, gas.pos.y, 480, 1920, 0);

    if (stars.pos.y >= g.height) {
      stars.pos.y -= 720;
    }

    if (dust.pos.y >= g.height) {
      dust.pos.y -= 720;
    }

    if (gas.pos.y >= g.height) {
      gas.pos.y -= 1920;
    }

    if (!g.global.player) return;

    g.drawTile('player-energy-meter.png', 20, g.height - 40, 74, 20, 0);

    let x = 23;
    for (let i = 0; i < g.global.player.energy.actual; i++) {
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

  const objects = {
    fighter: addFighter,
    carrier: addCarrier,
    imperial: addImperial,
    blackwidow: addBlackwidow,
    demon: addDemon,
    stareater: addStareater,
    firefly: addFirefly,
  };

  level.forEach(({ tag, x, y }) => {
    objects[tag](g, { pos: { x, y } });
  });
});

g.start('main');
