import { Timer } from './timer.js';
import { Keyboard } from './keyboard.js';
import { Animate } from './animate.js';

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
    imageRendering: 'pixelated',
    transform: `scale(${props.scale})`,
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

      const sprite = {
        currentAnimation: props.animations && props.animations[Object.keys(props.animations)[0]],
        ...props,
        pos: {
          x: 0,
          y: 0,
          ...props.pos,
        },
        vel: {
          x: 0,
          y: 0,
          ...props.vel,
        },
      };

      sprites.push(sprite);

      return sprite;
    }
  };

  const update = (dt) => {
    events.update.forEach((event) => typeof event === 'function' && event());

    sprites.forEach((sprite) => {
      (events.update || []).forEach((event) => {
        const cb = event[sprite.tag];
        cb && cb(sprite);
      });

      sprite.pos.x += sprite.vel.x;
      sprite.pos.y += sprite.vel.y;
    });
  };

  const draw = () => {
    sprites.forEach((sprite) => {
      const { pos, size, currentAnimation } = sprite;

      if (currentAnimation.frame < currentAnimation.sequence.length - 1) {
        currentAnimation.frame++;
      } else {
        if (currentAnimation.repeat) currentAnimation.frame = 0;
      }

      Object.assign(sprite.node.style, {
        transform: `translate(${pos.x - size.width / 2}px, ${
          pos.y - size.height / 2
        }px)`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        backgroundPosition: `${-(
        currentAnimation.sequence[currentAnimation.frame] *
          size.width
        )}px 0px`
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
    Animate,

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
