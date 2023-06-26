import addDebris from './debris.js';

export default function addExplosion(g, settings) {
  const { pos } = settings;

  const sprite = g.add(
    g.sprite('explosion.png', 44, 42),
    g.pos(pos),
    g.animation({
      idle: {
        sequence: [6, 6, 6, 8, 8, 8, 9, 9, 10, 10],
        delay: 0.07,
        repeat: false,
        onComplete(sprite) {
          sprite.destroy();
        },
      },
    }),
    {
      z: 10,
    }
  );

  sprite.onAdd = () => {
    const { pos } = sprite;

    for (let i = 1; i < 6; i++) {
      addDebris(g, { pos });
    }
  };
}
