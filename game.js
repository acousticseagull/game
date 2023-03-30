import { Engine } from './engine.js';

import { player } from './player.js';

const game = Engine({
  size: {
    width: 340,
    height: 460,
  },
  scale: 2,
  backgroundColor: '#000000',
});

player(game);

game.start();
