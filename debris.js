export default function addDebris(g, settings) {
  const { pos } = settings;

  g.add(
    g.sprite('explosion.png', 44, 42),
    g.pos(pos),
    g.vel({
      x: g.randomInt(-75, 75),
      y: g.randomInt(-75, 75),
    }),
    g.animation({
      idle: {
        sequence: [2, 3, 4, 5],
        delay: g.randomFloat(0.2, 0.5),
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
}
