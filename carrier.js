import addSpark from './spark.js';
import addExplosion from './explosion.js';
import addEnergy from './energy.js';

export default function addCarrier(g, settings) {
  const { pos } = settings;
  const sprite = g.add(
    g.sprite('carrier.png', 20, 26),
    g.pos(pos),
    g.vel({ y: 120 }),
    g.area(),
    {
      z: 2,

      level: 8,

      hull: {
        actual: 40,
      },
    },
    'carrier',
    'enemy'
  );

  sprite.onAdd = () => {};

  sprite.onUpdate = () => {
    const { pos, vel, width, height } = sprite;

    if (pos.y > -height) vel.y = 40;
  };

  sprite.onCollide = (other) => {
    sprite.receiveDamage(10);
    other.receiveDamage(10);
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

    for (let i = 0; i < sprite.level; i++) {
      addEnergy(g, {
        pos: {
          x: pos.x - 10 + g.randomInt(-20, 20),
          y: pos.y + g.randomInt(-20, 20),
        },
      });
    }
  };
}
