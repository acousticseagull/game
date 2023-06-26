import addSpark from './spark.js';
import addExplosion from './explosion.js';

export default function addImperial(g, pos, vel) {
  const sprite = g.add(
    g.sprite('imperial.png', 17, 34),
    g.pos(pos),
    g.vel(vel),
    g.state('idle'),
    g.area(),
    {
      z: 2,

      hull: {
        actual: 40,
      },

      timers: {
        weapon: {
          cooldown: g.timer(2),
          depay: g.timer(0.3),
        },
      },
    },
    'imperial',
    'enemy'
  );

  sprite.onAdd = () => {};

  sprite.onUpdate = () => {
    const { pos, vel, width, turn } = sprite;

    if (pos.y > 0) {
      if (pos.y > 100 && g.randomInt(1, 250) === 1) {
        const player = g.getSpriteByTag('player');
        if (player) addImperialPrimaryWeapon(g, { pos });
      }
    }

    if (pos.y > g.height) {
      sprite.destroy();
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

function addImperialPrimaryWeapon(g, settings) {
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
        sequence: [1],
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
