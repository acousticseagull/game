import { Timer } from './timer.js';
import { Keyboard } from './keyboard.js';

export const Engine = (props) => {
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
        backgroundRepeat: 'no-repeat',
      });

      const sprite = {
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
        animation: {
          current: props.animations
            ? props.animations[Object.keys(props.animations)[0]]
            : {
                sequence: [0],
                frame: 0,
                delay: 1,
                repeat: false,
              },

          play: function (name) {
            this.current = sprite.animations[name];
          },
          timer: Timer(),
        },
      };

      sprites.push(sprite);

      return sprite;
    }
  };

  const update = (dt) => {
    sprites.forEach((sprite) => {
      const { pos, vel, animation } = sprite;

      trigger('update', sprite.tags, sprite);

      // animate
      if (animation.timer.delta() >= animation.current.delay * 1000) {
        if (animation.current.frame < animation.current.sequence.length - 1) {
          animation.current.frame++;
        } else {
          if (animation.current.repeat) animation.current.frame = 0;
        }

        animation.timer.reset();
      }

      pos.x += vel.x * dt;
      pos.y += vel.y * dt;
    });

    //trigger('update');
  };

  const draw = () => {
    sprites.forEach((sprite) => {
      const { pos, size, animation } = sprite;

      Object.assign(sprite.node.style, {
        transform: `translate(${pos.x - size.width / 2}px, ${
          pos.y - size.height / 2
        }px)`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        backgroundPosition: `${-(
          animation.current.sequence[animation.current.frame] * size.width
        )}px 0px`,
      });
    });
  };

  const loop = () => {
    update(timer.delta() / 1000);
    draw();

    keyboard.clearPressedKeys();

    timer.reset();

    window.requestAnimationFrame(loop);
  };

  const on = (event, tag, action) => {
    (events[event] ??= []).push(
      typeof tag === 'function'
        ? {
            action: tag,
          }
        : {
            tag,
            action,
          }
    );
  };

  const trigger = (event, tags, sprite) => {
    if (!events[event]) return;

    events[event].forEach((event) => {
      if ((tags || []).includes(event.tag)) {
        event.action(sprite);
      }

      //if (!event.tag) event.action && event.action();
    });
  };

  return {
    add,
    on,

    Timer,
    keyboard,

    size: props.size,

    start: () => {
      timer.reset();

      // load assets
      // once complete ...

      sprites.forEach((sprite) => {
        node.append(sprite.node);
      });

      window.requestAnimationFrame(loop);
    },
  };
};
