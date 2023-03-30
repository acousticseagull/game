import { Timer } from './timer.js';
import { Keyboard } from './keyboard.js';

export const Engine = (props) => {
  const { size, scale, backgroundColor, on } = props;

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
      const { src, color, backgroundRepeat } = props;

      props.node = document.createElement('div');

      Object.assign(props.node.style, {
        position: 'absolute',
        boxSizing: 'border-box',
        overflow: 'hidden',
        backgroundColor: color || 'transparent',
        backgroundImage: `url(${src})`,
        backgroundRepeat: `${backgroundRepeat || 'no-repeat'}`,
      });

      const sprite = {
        area: {
          ...props.size,
        },
        angle: 0,
        health: 0,
        ...props,
        pos: {
          x: 0,
          y: 0,
          z: 1,
          origin: 'center center',
          ...props.pos,
        },
        vel: {
          x: 0,
          y: 0,
          ...props.vel,
          set: function ({ x = sprite.vel.x, y = sprite.vel.y }) {
            const { vel } = sprite;
            vel.x = x;
            vel.y = y;
          },
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
        setAngleVel: function (value) {
          const { vel, angle } = sprite;
          vel.x = Math.sin(degreesToRadians(angle)) * value;
          vel.y = -Math.cos(degreesToRadians(angle)) * value;
        },
        setAngle: function (value) {
          sprite.angle = value;
        },
        on: {
          add: function () {},
          update: function () {},
          damage: function () {},
          destroy: function () {},
          ...props.on,
        },
        collides: function (tag, action) {
          getSpritesByTag(tag).forEach(
            (other) => checkCollision(sprite, other) && action(other),
            sprite
          );
        },
        damage: function (amount) {
          sprite.health -= amount;
          sprite.on.damage();
        },
        destroy: function () {
          sprite.node.remove();
          sprite.on.destroy();
        },
      };

      props.add && add('sprite', props.add(sprite));

      sprites.push(sprite);

      return sprite;
    }
  };

  const update = (dt) => {
    on?.update(dt);

    sprites = sprites.filter((sprite) => sprite.node.parentElement);

    sprites.forEach((sprite) => {
      
      sprite.on.update(sprite, dt);

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
        transform: `translate(${
          pos.x - (pos.origin === 'center center' ? size.width / 2 : 0)
        }px, ${
          pos.y - (pos.origin === 'center center' ? size.height / 2 : 0)
        }px)
                    rotate(${angle}deg)`,
        transformOrigin: pos.origin,
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

  const getSpritesByTag = (tag) => {
    return sprites.filter((sprite) => sprite.tags.includes(tag));
  };

  const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const distance = (a, b) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  };

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

    Timer,
    keyboard,

    size,

    start: () => {
      timer.reset();

      // load assets
      // once complete ...

      sprites.forEach((sprite) => {
        if (sprite.parent) {
          sprite.parent.node.append(sprite.node);
        } else {
          viewport.append(sprite.node);
        }

        sprite.on.add(sprite);
      });

      console.log(sprites);

      window.requestAnimationFrame(loop);
    },
  };
};
