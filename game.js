import { Engine } from './engine.js';

import { player } from './player.js';
import { fighter } from './fighter.js';
import { mothership } from './mothership.js';

const game = Engine({
  size: {
    width: 340,
    height: 460,
  },
  scale: 2,
  backgroundColor: '#000000',
  on: {
    update: () => {},
  },
});

game.add('sprite', player(game));
game.add('sprite', mothership(game));

game.start();
