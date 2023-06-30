import addExplosion from './explosion.js';

export default function addDemon(g, pos, vel) {
  const sprite = g.add(
    g.sprite('demon.png', 24, 13),
    g.pos(pos),
    g.vel({
      y: 120,
    }),
    g.area(),
    {
      z: 2,

      hull: {
        actual: 6,
      },

      timers: {
        primary: g.timer(0.1),
      },
    },
    'demon',
    'enemy'
  );

  sprite.onAdd = () => {};

  sprite.onUpdate = () => {
    const { pos, vel, width, timers } = sprite;

    if (pos.y > g.height / 2) {
      vel.y = 40;
      vel.x = -400;

      if (vel.x < 0 && pos.x < g.width && timers.primary.expired()) {
        addDemonMine(g, { pos });
        timers.primary.reset();
      }
    }

    if (pos.x < -width) sprite.destroy();
  };

  sprite.onReceiveDamage = (amount) => {
    sprite.hull.actual -= amount;
    if (sprite.hull.actual <= 0) sprite.destroy();
  };

  sprite.onDestroy = () => {
    const { pos } = sprite;

    if (pos.x > g.width)
      addExplosion(g, {
        pos: {
          x: pos.x - 10,
          y: pos.y - 10,
        },
      });
  };
}

function addDemonMine(g, settings) {
  const { pos } = settings;

  const sprite = g.add(
    g.sprite('demon-mine.png', 8, 8),
    g.pos({
      x: pos.x,
      y: pos.y,
    }),
    g.vel({
      y: 60,
    }),
    g.area(),
    g.animation({
      idle: {
        sequence: [0, 1],
        delay: 0.25,
      },
    }),
    {
      hull: {
        actual: 3,
      },
      damage: 10,
    },
    'demonMine',
    'enemy'
  );

  sprite.onAdd = () => {};

  sprite.onUpdate = () => {
    if (!sprite.isOnCamera()) sprite.destroy();
  };

  sprite.onCollide = (other) => {
    if (other.hasTag('player')) {
      sprite.destroy();
      other.receiveDamage(sprite.damage);
    }
  };

  sprite.onReceiveDamage = (amount) => {
    sprite.hull.actual -= amount;
    if (sprite.hull.actual <= 0) sprite.destroy();
  };

  sprite.onDestroy = () => {
    const { pos } = sprite;

    if (pos.y < g.height)
      addExplosion(g, {
        pos: {
          x: pos.x - 10,
          y: pos.y - 10,
        },
      });
  };
}
