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



g.scene('main', () => {
  addPlayer(g);

  //game.add('sprite', mothership(game));
});

g.start('main');
