export const constructBeamWeapon = (game) => {
  return {
    tags: ['beam', 'enemy'],
    src: 'https://stephenpruitt.com/rayborn/assets/construct-beam-weapon.png',
    size: {
      width: 9,
      height: 0,
    },
    pos: {
      x: game.size.width / 2,
      y: 100,
      origin: 'top center',
    },
    animations: {
      idle: {
        sequence: [6, 7],
        frame: 0,
        delay: 0.1,
        repeat: true,
      },
    },
    backgroundRepeat: 'repeat-y',
    on: {
      update(sprite) {
        const { pos, size, collides } = sprite;

        size.height = game.size.height - pos.y;

        collides('player', (other) => {
          size.height = other.pos.y - pos.y;
        });
      },
    },
  };
};
