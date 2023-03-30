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
    width: `${size.width}px`,
    height: `${size.height}px`,
    transform: `scale(${scale})`,
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
        angle: 0,
        ...props,
        pos: {
          x: 0,
          y: 0,
          z: 1,
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
        state: {
          ...props.state,
          set: function (state) {
            this.current = state;
          },
          is: function (state) {
            return this.current === state;
          },
        },
        on: {
          add: function () {},
          update: function () {},
          ...props.on,
        },
        collides: function (tag, action) {
          getSpritesByTag(tag).forEach(
            (other) => checkCollision(sprite, other) && action(other),
            sprite
          );
        },
        destroy: function () {
          sprite.node.remove();
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

      sprite.on.update(sprite);

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
      const { node, pos, size, angle, animate } = sprite;

      Object.assign(node.style, {
        transform: `translate(${pos.x - size.width / 2}px, ${
          pos.y - size.height / 2
        }px)
                    rotate(${angle}deg)`,
        transformOrigin: 'center',
        width: `${size.width}px`,
        height: `${size.height}px`,
        backgroundPosition: `${-(
          animate.current.sequence[animate.current.frame] * size.width
        )}px 0px`,
        zIndex: pos.z,
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

  const trigger = (event, item) => {
    (events[event] || []).forEach((event) => {
      if ((item?.tags || []).includes(event.tag)) {
        event.action(item);
      }

      if (!event.tag) event?.action();
    });
  };

  const getSpritesByTag = (tag) => {
    return sprites.filter((sprite) => sprite.tags.includes(tag));
  };

  function setAngleVel(value) {
    this.vel.x = Math.sin(degreesToRadians(this.angle)) * value;
    this.vel.y = -Math.cos(degreesToRadians(this.angle)) * value;
    return this;
  }

  function setAngle(value) {
    this.angle = value;
    return this;
  }

  function setImageRepeat(value) {
    this.node.style.backgroundRepeat = value ? 'repeat' : 'no-repeat';
    return this;
  }

  function setRadius(value) {
    this.node.style.borderRadius = value;
    return this;
  }

  const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  const degreesToRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
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

        sprite.on.add(sprite);

        trigger('add', sprite);
      });

      window.requestAnimationFrame(loop);
    },
  };
};
