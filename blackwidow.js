import addSpark from './spark.js';
import addExplosion from './explosion.js';
import addEnergy from './energy.js';

export default function addBlackwidow(g, settings) {
  const { pos } = settings;
  const sprite = g.add(
    g.sprite('blackwidow.png', 29, 27),
    g.pos(pos),
    g.vel({ y: 120 }),
    g.state('start'),
    g.area(),
    {
      z: 2,

      level: 8,

      hull: {
        actual: 100,
      },

      timers: {
        weapon: {
          cooldown: g.timer(2),
          delay: g.timer(0.7),
        },
      },

      counters: {
        weapon: 2,
      },
    },
    'blackwidow',
    'enemy'
  );

  sprite.onAdd = () => {};

  sprite.onUpdate = () => {
    const { pos, vel, height, state, timers, counters } = sprite;

    if (pos.y > -height) {
      if (state.is('start')) {
        if (pos.y > 10) {
          vel.y = 20;
          vel.x = -40;

          pos.origin = { ...pos };

          state.set('hover');
        }
      }

      if (state.is('hover')) {
        if (pos.x <= pos.origin.x - 40 && vel.x <= 0) {
          vel.x = 40;
        }

        if (pos.x >= pos.origin.x + 40 && vel.x >= 0) {
          vel.x = -40;
        }

        if (pos.x < 0) vel.x = 40;
        if (pos.x > g.width) vel.x = -40;
      }

      if (timers.weapon.cooldown.expired()) {
        if (timers.weapon.delay.expired()) {
          if (g.global.player.isActive()) {
            addBlackwidowPrimaryWeapon(g, {
              pos: { x: pos.x - 10, y: pos.y + 15 },
              vel: { x: -5 },
            });
            addBlackwidowPrimaryWeapon(g, {
              pos: { x: pos.x + 3, y: pos.y + 20 },
              vel: { x: 0 },
            });
            addBlackwidowPrimaryWeapon(g, {
              pos: { x: pos.x + 15, y: pos.y + 15 },
              vel: { x: 5 },
            });
          }

          counters.weapon--;
          timers.weapon.delay.reset();
        }

        if (counters.weapon === 0) {
          counters.weapon = 2;
          timers.weapon.cooldown.reset();
        }
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

function addBlackwidowPrimaryWeapon(g, settings) {
  const { pos, vel } = settings;

  const sprite = g.add(
    g.sprite('enemy-primary-weapon.png', 22, 22),
    g.pos(pos),
    g.vel({
      x: vel.x,
      y: 100,
    }),
    g.area(8, 8, 14, 14),
    g.animation({
      idle: {
        sequence: [0],
      },
    }),
    {
      damage: 3,
    },
    'blackwidowPrimaryWeapon'
  );

  sprite.onUpdate = () => {
    if (!sprite.isOnCamera()) sprite.destroy();
  };

  sprite.onCollide = (other) => {
    if (other.hasTag('player')) {
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

      sprite.destroy();
      other.receiveDamage(sprite.damage);
    }
  };
}
