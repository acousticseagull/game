import addSpark from './spark.js';
import addExplosion from './explosion.js';
import addEnergy from './energy.js';

export default function addFighter(g, settings) {
  const { pos } = settings;
  const sprite = g.add(
    g.sprite('fighter.png', 21, 26),
    g.pos(pos),
    g.vel({ y: 120 }),
    g.area(),
    {
      z: 2,

      hull: {
        actual: 10,
      },

      level: 1,

      turn: g.randomInt(1, 10) > 5 ? true : false,
    },
    'fighter',
    'enemy'
  );

  sprite.onAdd = () => {};

  sprite.onUpdate = () => {
    const { pos, vel, width, turn } = sprite;

    if (pos.y > 0) {
      vel.y = 120;

      if (turn && pos.y > g.randomInt(80, 140)) {
        if (pos.origin.x < 160) {
          vel.x = 60;
        }

        if (pos.origin.x > 160) {
          vel.x = -60;
        }
      }

      if (pos.y > g.randomInt(260, 280)) vel.x = 0;

      if (pos.x < 0) vel.x = 20;

      if (pos.x > g.width - width) vel.x = -20;

      if (pos.y > 100 && g.randomInt(1, 250) === 1) {
        if (g.global.player.isActive()) addFighterPrimaryWeapon(g, { pos });
      }

      if (pos.y > g.height) {
        sprite.destroy();
      }
    }
  };

  sprite.onCollide = (other) => {
    if (other.hasTag('player')) {
      sprite.receiveDamage(10);
      other.receiveDamage(10);
    }
  };

  sprite.onReceiveDamage = (amount) => {
    sprite.hull.actual -= amount;
    if (sprite.hull.actual <= 0) sprite.destroy();
  };

  sprite.onDestroy = () => {
    const { pos } = sprite;

    if (sprite.isOnCamera()) {
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
    }
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
    'fighterPrimaryWeapon'
  );

  sprite.onAdd = () => {
    const player = g.global.player;
    const angle = sprite.angleTo(player);

    sprite.vel = {
      x: Math.cos(angle) * 160,
      y: Math.sin(angle) * 160,
    };
  };

  sprite.onUpdate = () => {
    if (!sprite.isOnCamera()) sprite.destroy();
  };

  sprite.onCollide = (other) => {
    const { pos, vel } = sprite;

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

  sprite.onDestroy = () => {};
}
