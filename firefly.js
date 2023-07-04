import addSpark from './spark.js';
import addExplosion from './explosion.js';
import addEnergy from './energy.js';

export default function addFireFly(g, settings) {
  const { pos } = settings;
  const sprite = g.add(
    g.sprite('firefly.png', 15, 15),
    g.pos(pos),
    g.vel({ y: 120 }),
    g.state('start'),
    g.area(),
    g.animation({
      idle: {
        sequence: [0, 2, 1, 3],
        delay: 0.05,
        repeat: true,
      },
    }),
    {
      z: 2,

      level: 3,

      hull: {
        actual: 20,
      },

      timers: {
        weapon: {
          cooldown: g.timer(0),
        },
      },

      weapon: {
        sprite: null,
        active: false,
      },

      counters: {
        hover: 5,
      },
    },
    'firefly',
    'enemy'
  );

  sprite.onAdd = () => {};

  sprite.onUpdate = () => {
    const { pos, vel, height, state, timers, counters } = sprite;

    if (pos.y > -height) {
      if (state.is('start')) {
        if (pos.y < 60) {
          vel.y = 40;
        }

        if (pos.y > 60) {
          vel.y = 10;
          vel.x = -5;

          pos.origin = { ...pos };

          state.set('hover');
        }
      }

      if (state.is('hover')) {
        if (pos.x <= pos.origin.x - 20 && vel.x <= 0) {
          vel.x = 5;
        }

        if (pos.x >= pos.origin.x + 20 && vel.x >= 0) {
          vel.x = -5;
          counters.hover--;
        }

        if (pos.y <= pos.origin.y - 20 && vel.y <= 0) {
          vel.y = 10;
        }

        if (pos.y >= pos.origin.y + 20 && vel.y >= 0) {
          vel.y = -10;
        }

        if (counters.hover === 0) {
          state.set('end');
        }

        if (!sprite.weapon.active) {
          sprite.weapon.active = true;
          timers.weapon.cooldown.set(5);
          sprite.weapon.sprite = addFireflyPrimaryWeapon(g, { pos });
        }
      }

      if (state.is('end')) {
        vel.x = 0;
        vel.y = 80;
      }
    }

    if (sprite.weapon.sprite) {
      sprite.weapon.sprite.pos = pos;
    }

    if (timers.weapon.cooldown.expired()) {
      sprite.weapon.active = false;
      timers.weapon.cooldown.reset();
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

    if (pos.y > g.height) return;

    addExplosion(g, {
      pos: {
        x: pos.x - 10,
        y: pos.y,
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

function addFireflyPrimaryWeapon(g, settings) {
  const { pos } = settings;

  const sprite = g.add(
    g.sprite('firefly-primary-weapon.png', 9, 720),
    g.pos(pos),
    g.area(),
    g.animation({
      idle: {
        sequence: [6, 9, 7, 8],
        delay: 0.05,
        repeat: true,
      },
    }),
    {
      damage: 3,
    },
    'fireflyPrimaryWeapon'
  );

  sprite.onAdd = () => {};

  sprite.onUpdate = () => {};

  sprite.onCollide = (other) => {
    if (other.hasTag('player')) {
      other.receiveDamage(sprite.damage);
    }
  };

  sprite.onDestroy = () => {
    const { pos, vel } = sprite;

    // if (sprite.isOnCamera())
    //   addSpark(g, {
    //     pos: {
    //       x: pos.x - 10,
    //       y: pos.y - 10,
    //     },
    //     vel: {
    //       x: vel.x * 0.25,
    //       y: vel.y * 0.25,
    //     },
    //   });
  };

  return sprite;
}
