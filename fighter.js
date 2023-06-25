import addSpark from './spark.js';
import addExplosion from './explosion.js';

export default function addFighter(g, pos, vel) {
  const sprite = g.add(
    g.sprite('fighter.png', 21, 26),
    g.pos(pos),
    g.vel(vel),
    g.state('idle'),
    g.area(),
    {
      z: 2,

      hull: {
        actual: 2,
        max: 3,
      },
    },
    'fighter',
    'enemy'
  );

  sprite.onAdd = () => {
    sprite.state.set('forward');
  };

  sprite.onUpdate = () => {
    const { pos, vel, width, height, turn, state } = sprite;

    if (pos.y > 0) {
      vel.y = 120;

      if (pos.y > 100) {
      }

      if (state.is('right')) {
        vel.x = 20;
      }

      if (state.is('left')) {
        vel.x = -20;
      }

      if (state.is('forward')) {
        vel.x = 0;
      }

      const rand = g.randomInt(1, 1000);

      if (rand < 20) {
        state.set('right');
      }

      if (rand > 980) {
        state.set('left');
      }

      if (rand > 490 && rand < 500) {
        state.set('forward');
      }

      // if (pos.y > g.randomInt(500, 600)) {
      //   state.set('forward');
      // }

      if (pos.x < 0) state.set('right');

      if (pos.x > g.width - width) state.set('left');

      if (pos.y > 100 && g.randomInt(1, 250) === 1) {
        const player = g.getSpriteByTag('player');
        if (player) addFighterPrimaryWeapon(g, { pos });
      }

      if (pos.y > g.height) {
        sprite.destroy();
      }
    }
  };

  sprite.onReceiveDamage = (amount) => {
    sprite.hull.actual -= amount;
    if (sprite.hull.actual <= 0) sprite.destroy();
  };

  sprite.onDestroy = () => {
    const { pos } = sprite;

    addExplosion(g, {
      pos: {
        x: pos.x - 10,
        y: pos.y - 10,
      },
    });
  };
}

function addFighterPrimaryWeapon(g, settings) {
  const { pos } = settings;

  const sprite = g.add(
    g.sprite('enemy-primary-weapon.png', 22, 22),
    g.pos({
      x: pos.x,
      y: pos.y,
    }),
    g.area(8, 8, 14, 14),
    g.animation({
      idle: {
        sequence: [0],
      },
    }),
    {
      damage: 1,
    },
    'enemyPrimaryWeapon'
  );

  sprite.onAdd = () => {
    const player = g.getSpriteByTag('player');
    const angle = sprite.angleTo(player);

    sprite.vel = {
      x: Math.cos(angle) * 160,
      y: Math.sin(angle) * 160,
    };
  };

  sprite.onCollide = (other) => {
    if (other.hasTag('player')) {
      sprite.destroy();
      other.receiveDamage(sprite.damage);
    }
  };

  sprite.onDestroy = () => {
    const { pos, vel } = sprite;

    addSpark(g, {
      pos: {
        x: pos.x - 10,
        y: pos.y - 10,
      },
      vel: {
        x: vel.x * 0.25,
        y: vel.y * 0.25,
      },
    });
  };
}
