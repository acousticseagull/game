export const constructPrimaryWeapon = (game) => {
  return {
    src: 'https://stephenpruitt.com/rayborn/assets/enemy-primary-weapon.png',
    size: {
      width: 10,
      height: 10,
    },
    pos: {
      x: game.size.width / 2,
      y: 100,
      origin: 'top center',
    },
    animations: {
      idle: {
        sequence: [0],
        frame: 0,
        delay: 1,
        repeat: false,
      },
    },
    backgroundRepeat: 'repeat-y',
    on: {
      update(sprite) {

        collides('player', (other) => {
          size.height = other.pos.y - pos.y;
        });
      },
    },
  };
};