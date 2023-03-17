const Game = (props) => {
  const node = document.createElement('div');

  Object.assign(node.style, {
    position: 'relative',
    overflow: 'hidden',
    width: `${props.size.width}px`,
    height: `${props.size.height}px`,
    backgroundColor: props.backgroundColor,
  });

  document.body.append(node);

  const events = {};
  const sprites = [];

  const add = (name, props) => {
    if (name === 'sprite') {
      sprites.push({
        ...props,
      });
    }
  };

  const update = () => {
    sprites.forEach((sprite) => {
      if (events.update)
        events.update.forEach((target) => target[sprite.name](sprite));
    });
  };

  const draw = () => {
    sprites.forEach((sprite) => {
      const { pos, size } = sprite;

      Object.assign(sprite.node.style, {
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      });
    });
  };

  const loop = () => {
    update();
    draw();

    window.requestAnimationFrame(loop);
  };

  const on = (name, event, cb) => {
    (events[event] ??= []).push({
      [name]: cb,
    });
  };

  return {
    add,
    on,

    start: () => {
      // load assets
      // once complete ...

      sprites.forEach((sprite) => {
        const { pos, size, color } = sprite;

        sprite.node = document.createElement('div');

        Object.assign(sprite.node.style, {
          position: 'absolute',
          overflow: 'hidden',
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          backgroundColor: color,
        });

        node.append(sprite.node);
      });

      window.requestAnimationFrame(loop);
    },
  };
};

const game = Game({
  size: {
    width: 600,
    height: 800,
  },
});

game.on('player', 'update', (sprite) => {
  const { pos, vel, size } = sprite;

  pos.x += vel.x;
});

game.add('sprite', {
  name: 'player',
  color: '#000000',
  size: {
    width: 20,
    height: 20,
  },
  pos: {
    x: 0,
    y: 0,
  },
  vel: {
    x: 3,
  },
});

game.start();
