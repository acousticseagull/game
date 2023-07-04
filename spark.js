export default function addSpark(g, settings) {
  const { pos, vel } = settings;

  g.add(
    g.sprite('explosion.png', 44, 42),
    g.pos({
      x: pos.x + g.randomInt(-2, 2),
      y: pos.y + g.randomInt(-2, 2),
    }),
    g.vel(vel),
    g.animation({
      idle: {
        sequence: [2, 3, 4, 5],
        delay: 0.15,
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
