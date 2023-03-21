import { Timer } from './timer.js';
import { Keyboard } from './keyboard.js';

export const Engine = (props) => {
  let td;
  const timer = Timer();

  const keyboard = Keyboard();

  const node = document.createElement('div');

  Object.assign(document.body.style, {
    margin: 0,
  });

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
      const { src, color } = props;

      props.node = document.createElement('div');

      Object.assign(props.node.style, {
        position: 'absolute',
        boxSizing: 'border-box',
        overflow: 'hidden',
        backgroundColor: color || 'transparent',
        backgroundImage: `url(${src})`,
      });

      sprites.push({
        ...props,
        vel: {
          x: 0,
          y: 0,
          ...props.vel,
        },
      });
    }
  };

  const update = (td) => {
    events.update.forEach((event) => typeof event === 'function' && event());

    sprites.forEach((sprite) => {
      (events.update || []).forEach((event) => {
        const cb = event[sprite.name];
        cb && cb(sprite);
      });

      sprite.pos.x += sprite.vel.x;
      sprite.pos.y += sprite.vel.y;
    });
  };

  const draw = () => {
    sprites.forEach((sprite) => {
      const { pos, size } = sprite;

      Object.assign(sprite.node.style, {
        transform: `translate(${pos.x - size.width / 2}px, ${
          pos.y - size.height / 2
        }px)`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      });
    });
  };

  const loop = () => {
    td = timer.delta() / 1000;

    update(td);
    draw();

    keyboard.clearPressedKeys();

    window.requestAnimationFrame(loop);
  };

  const on = ({ target, event }, cb) => {
    (events[event] ??= []).push(
      target
        ? {
            [target]: cb,
          }
        : cb
    );
  };

  return {
    add,
    on,

    Timer,
    keyboard,

    size: props.size,

    start: () => {
      // load assets
      // once complete ...

      sprites.forEach((sprite) => {
        node.append(sprite.node);
      });

      window.requestAnimationFrame(loop);
    },
  };
};
