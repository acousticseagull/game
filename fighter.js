import addSpark from './spark.js';

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

  sprite.onUpdate = () => {
    const { pos, vel, width, height, turn, state } = sprite;

    if (pos.y > 0) {
      vel.y = 120;

      if (pos.y > 100) {
        if (pos.origin.x < g.width / 2) {
          vel.x = 60;
        }

        if (pos.origin.x > g.width / 2) {
          vel.x = -60;
        }
      }

      if (pos.y > g.randomInt(500, 600)) {
        vel.x = 0;
      }

      if (pos.x < 0) {
        vel.x = 60;
      }

      if (pos.x > g.width - width) {
        vel.x = -60;
      }

      if (pos.y > 100 && g.randomInt(1, 250) === 1) {
        const player = g.getSpriteByTag('player');
        if (player) addFighterPrimaryWeapon(g, { pos });
      }

      if (pos.y > g.height) {
        sprite.destroy();
      }
    }
  };

  sprite.onDestroy = () => {};
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
