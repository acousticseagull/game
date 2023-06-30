import addSpark from './spark.js';
import addExplosion from './explosion.js';
import addEnergy from './energy.js';

export default function addStareater(g, settings) {
  const { pos } = settings;
  const sprite = g.add(
    g.sprite('star-eater.png', 39, 59),
    g.pos(pos),
    g.vel({ y: 120 }),
    g.state('start'),
    g.area(),
    {
      z: 2,

      level: 10,

      hull: {
        actual: 200,
      },

      timers: {
        weapon: {
          cooldown: g.timer(2),
          delay: g.timer(0.5),
        },
      },

      counters: {
        weapon: 3,
        hover: 3,
      },
    },
    'stareater',
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
      }

      if (state.is('end')) {
        vel.x = 0;
        vel.y = 40;
      }

      if (timers.weapon.cooldown.expired()) {
        if (timers.weapon.delay.expired()) {
          if (g.global.player) {
            addStareaterPrimaryWeapon(g, {
              pos: { x: pos.x - 10, y: pos.y + 15 },
            });
            addStareaterPrimaryWeapon(g, {
              pos: { x: pos.x + 25, y: pos.y + 15 },
            });
          }

          counters.weapon--;
          timers.weapon.delay.reset();
        }

        if (counters.weapon === 0) {
          counters.weapon = 5;
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

function addStareaterPrimaryWeapon(g, settings) {
  const { pos } = settings;

  const sprite = g.add(
    g.sprite('enemy-primary-weapon.png', 22, 22),
    g.pos(pos),
    g.area(8, 8, 14, 14),
    g.animation({
      idle: {
        sequence: [2],
      },
    }),
    {
      damage: 5,
    },
    'stareaterPrimaryWeapon'
  );

  sprite.onAdd = () => {
    const angle = sprite.angleTo(g.global.player);

    sprite.vel = {
      x: Math.cos(angle) * 300,
      y: Math.sin(angle) * 300,
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
