import { Engine } from './engine.js';

import { player } from './player.js';

const game = Engine({
  size: {
    width: 400,
    height: 500,
  },
  scale: 1,
  backgroundColor: '#000000',
});

player(game);

game.start();
