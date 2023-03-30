import { Engine } from './engine.js';

import { player } from './player.js';
import { fighter } from './fighter.js';

const game = Engine({
  size: {
    width: 340,
    height: 460,
  },
  scale: 2,
  backgroundColor: '#000000',
});

game.add('sprite', player(game));
game.add('sprite', fighter(game));

game.start();
