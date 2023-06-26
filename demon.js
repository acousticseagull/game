import addExplosion from './explosion.js';

export default function addDemon(g, pos, vel) {
  const sprite = g.add(
    g.sprite('demon.png', 24, 13),
    g.pos(pos),
    g.vel({
      x: 0,
      y: 60,
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
    const { pos, vel, timers } = sprite;

    if (pos.y > g.height / 2) {
      vel.y = 40;
      vel.x = -400;
    }

    if (vel.x < 0 && pos.x < g.width && pos.x > 0 && timers.primary.expired()) {
      addDemonMine(g, { pos });
      timers.primary.reset();
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
    g.area(8, 8, 14, 14),
    g.animation({
      idle: {
        sequence: [0, 1],
        delay: 0.25,
      },
    }),
    {
      damage: 10,
    },
    'demonMine'
  );

  sprite.onAdd = () => {};

  sprite.onUpdate = () => {
    if (pos.y > g.height) sprite.destroy();
  };

  sprite.onCollide = (other) => {
    if (other.hasTag('player')) {
      sprite.destroy();
      other.receiveDamage(sprite.damage);
    }
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
