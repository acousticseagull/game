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
    const { pos, vel, width, state } = sprite;

    if (pos.y > 0) {
      if (g.randomInt(1, 1000) === 1) {
        if (pos.x < g.width / 2) vel.x = 50;
        else vel.x = -50;
      }
    }

    if (pos.x <= 0) {
      vel.x = 50;
    }

    if (pos.x >= g.width) {
      vel.x = -50;
    }
  };

  sprite.onDestroy = () => {
    
  }
}
