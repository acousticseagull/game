export default function addExplosion(g, settings) {
  const { pos } = settings;

  g.add(
    g.sprite('explosion.png', 44, 42),
    g.pos(pos),
    g.animation({
      idle: {
        sequence: [6, 7, 8, 9, 10],
        delay: 0.1,
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
