import { Timer } from './timer.js';
import { Keyboard } from './keyboard.js';

export const Engine = (props) => {
  const { size, scale, backgroundColor } = props;

  const timer = Timer();

  const keyboard = Keyboard();

  const events = {};

  const viewport = document.createElement('div');

  let sprites = [];

  Object.assign(document.body.style, {
    margin: 0,
  });

  Object.assign(viewport.style, {
    position: 'relative',
    overflow: 'hidden',
    imageRendering: 'pixelated',
    transform: `scale(${scale})`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    backgroundColor: backgroundColor,
  });

  document.body.append(viewport);

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
        area: {
          ...props.size,
        },
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
        animate: {
          current: props.animations
            ? props.animations[Object.keys(props.animations)[0]]
            : {
                sequence: [0],
                frame: 0,
                delay: 1,
                repeat: false,
              },

          play: function (name) {
            sprite.animate.current = sprite.animations[name];
          },
          timer: Timer(),
        },
        on: {
          collides: function (tag, action) {
            getSpritesByTag(tag).forEach(
              (other) => checkCollision(sprite, other) && action(other),
              sprite
            );
          },
          destroy: function () {
            sprite.node.remove();
          },
        },
      };

      sprites.push(sprite);

      return sprite;
    }
  };

  const update = (dt) => {
    trigger('update');

    sprites = sprites.filter((sprite) => sprite.node.parentElement);

    sprites.forEach((sprite) => {
      trigger('update', sprite);

      const { pos, vel, animate } = sprite;

      // animate
      if (animate.timer.delta() >= animate.current.delay * 1000) {
        if (animate.current.frame < animate.current.sequence.length - 1) {
          animate.current.frame++;
        } else {
          if (animate.current.repeat) animate.current.frame = 0;
        }

        animate.timer.reset();
      }

      pos.x += vel.x * dt;
      pos.y += vel.y * dt;
    });
  };

  const draw = () => {
    sprites.forEach((sprite) => {
      const { pos, size, animate } = sprite;

      Object.assign(sprite.node.style, {
        transform: `translate(${pos.x - size.width / 2}px, ${
          pos.y - size.height / 2
        }px)`,
        transformOrigin: 'center',
        width: `${size.width}px`,
        height: `${size.height}px`,
        backgroundPosition: `${-(
          animate.current.sequence[animate.current.frame] * size.width
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

  const trigger = (event, sprite) => {
    (events[event] || []).forEach((event) => {
      if ((sprite?.tags || []).includes(event.tag)) {
        event.action(sprite);
      }

      if (!event.tag) event?.action();
    });
  };

  const getSpritesByTag = (tag) => {
    return sprites.filter((sprite) => sprite.tags.includes(tag));
  };

  const checkCollision = (a, b) => {
    return (
      a.pos.x < b.pos.x + b.size.width &&
      a.pos.x + a.size.width > b.pos.x &&
      a.pos.y < b.pos.y + b.size.height &&
      a.size.height + a.pos.y > b.pos.y
    );
  };

  return {
    add,

    on,
    trigger,

    Timer,
    keyboard,

    size,

    start: () => {
      timer.reset();

      // load assets
      // once complete ...

      sprites.forEach((sprite) => {
        viewport.append(sprite.node);

        trigger('add', sprite);
      });

      window.requestAnimationFrame(loop);
    },
  };
};
