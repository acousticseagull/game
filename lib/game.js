import { timer } from './timer.js';
import * as keyboard from './keyboard.js';
import * as gamepad from './gamepad.js';

export default (opts = {}) => {
  const { width, height, backgroundColor, plugins = [] } = opts;

  let scale = opts.scale;

  let dt;
  let time = timer();
  let sprites = [];
  let imagesSrcs = [];
  let images = [];
  let texts = [];
  let loadedImages = [];

  const scenes = {};
  const events = {};
  const camera = {
    pos: {},
    following: null,
  };

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  context.imageSmoothingEnabled = false;

  document.body.prepend(canvas);

  function loadImage(src) {
    imagesSrcs.push(src);
  }

  function add(...components) {
    const obj = {
      ...components.reduce((a, c) => {
        if (typeof c === 'string')
          return { ...a, tags: [...(a.tags || []), c] };

        return {
          ...a,
          ...c,
          new: true,
        };
      }, {}),
    };

    if (obj.id === 'sprite') {
      sprites.push(obj);
    }

    if (obj.id === 'image') {
      images.push(obj);
    }

    if (obj.id === 'text') {
      texts.push(obj);
    }

    return obj;
  }

  function sprite(src, width, height) {
    const image = loadedImages.find((image) => image.currentSrc.endsWith(src));

    function setAngleAccel(value) {
      this.accel.x = Math.sin(degreesToRadians(this.angle)) * value;
      this.accel.y = -Math.cos(degreesToRadians(this.angle)) * value;
      return this;
    }

    function setAngleVel(value) {
      this.vel.x = Math.sin(degreesToRadians(this.angle)) * value;
      this.vel.y = -Math.cos(degreesToRadians(this.angle)) * value;
      return this;
    }

    function setAngle(value) {
      this.angle = value;
      return this;
    }

    function destroy() {
      this.status = 'destroyed';
      this.trigger('destroy', this);
    }

    function setScale(value) {
      this.scale = value;
      this.width *= value;
      this.height *= value;
    }

    return {
      id: 'sprite',
      tags: [],
      src,
      image,
      width: width || image.width,
      height: height || image.height,
      angle: 0,
      rotate: 0,
      mass: (height || image.height) * (width || image.width),
      pos: {
        x: 0,
        y: 0,
      },
      vel: {
        x: 0,
        y: 0,
        max: Infinity,
      },
      accel: {
        x: 0,
        y: 0,
      },
      animation: {
        animations: {},
        current: {
          sequence: [0],
          frame: 0,
          delay: 1,
          repeat: false,
        },
        timer: timer(),
      },
      status: 'added',
      destroy,
      setAngle,
      setScale,
      setVel(value) {
        this.vel.x = value;
        this.vel.y = value;
      },
      setAccel(value) {
        this.accel.x = value;
        this.accel.y = value;
      },
      setAngleAccel,
      setAngleVel,
      trigger(event, ...args) {
        events[event]?.forEach(
          ({ tag, handle }) => this.tags.includes(tag) && handle(...args)
        );
      },
    };
  }

  function area(width, height) {
    return {
      area: {
        width,
        height,
      },
    };
  }

  function pos(pos) {
    return {
      pos: {
        ...pos,
      },
    };
  }

  function vel(vel) {
    return {
      vel: {
        x: 0,
        y: 0,
        max: Infinity,
        ...vel,
      },
    };
  }

  function accel(accel) {
    return {
      accel: {
        x: 0,
        y: 0,
        max: Infinity,
        ...accel,
      },
    };
  }

  function animation(animations) {
    return {
      animation: {
        animations,
        current: animations[Object.keys(animations)[0]],
        play(name) {
          this.current = this.animations[name];
        },
        timer: timer(),
      },
    };
  }

  function image(src, x, y, width, height) {
    const image = loadedImages.find((image) => image.currentSrc.endsWith(src));

    return {
      id: 'image',
      image,
      pos: {
        x,
        y,
      },
      width: width || image.width,
      height: height || image.height,
      distance: 1,
    };
  }

  function comb(func, x, y, width, height) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    func().forEach(({ image, pos, width, height }) => {
      context.drawImage(image, pos.x, pos.y, width, height);
    });

    return {
      id: 'image',
      image: canvas,
      pos: {
        x,
        y,
      },
      width,
      height,
      distance: 1,
    };
  }

  function scene(tag, cb) {
    scenes[tag] = cb;
  }

  const getSpriteByTag = (tag) => sprites.find((i) => i.tags.includes(tag));
  const getSpritesByTag = (...tag) =>
    sprites.filter((s) => tag.some((t) => s.tags.includes(t)));

  const spriteOnCamera = (sprite) => {
    return (
      sprite.pos.x + sprite.width / scale > -camera.pos.x / scale &&
      sprite.pos.x / scale < -camera.pos.x + canvas.width / scale &&
      sprite.pos.y + sprite.height / scale > -camera.pos.y / scale &&
      sprite.pos.y / scale < -camera.pos.y + canvas.height / scale
    );
  };

  const repeat = (cb, count) => {
    for (let i = 0; i < count; i++) cb();
  };

  function setScale(cb) {
    scale = cb(scale);
  }

  const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  function distance(a, b) {
    return Math.sqrt(
      Math.pow(a.pos.x - b.pos.x, 2) + Math.pow(a.pos.y - b.pos.y, 2)
    );
  }

  const degreesToRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
  };

  const checkForCollision = (a, b) => {
    return (
      a.pos.x < b.pos.x + b.width &&
      a.pos.x + a.width > b.pos.x &&
      a.pos.y < b.pos.y + b.height - 1 &&
      a.pos.y + a.height - 1 > b.pos.y
    );
  };

  const setCameraToFollow = (sprite) => {
    camera.following = sprite;
  };

  const on = (event, handle, tag) => {
    events[event] ??= [];
    if (tag) events[event].push({ tag, handle });
    else events[event].push(handle);
  };

  const trigger = (event, ...args) => {
    events[event]?.forEach(
      (handle) => typeof handle === 'function' && handle(...args)
    );
  };

  // UPDATE
  const update = (dt) => {
    trigger('update', dt);

    sprites = sprites.filter((sprite) => {
      return sprite.status !== 'destroyed';
    });

    sprites.forEach((sprite) => {
      if (sprite.status === 'added') {
        sprite.status = 'active';
        sprite.animation.timer.set(sprite.animation.current.delay);
        sprite.trigger('add', sprite);
      }

      sprite.trigger('update', sprite, dt);

      // animate
      if (sprite.animation.timer.expired()) {
        if (
          sprite.animation.current.frame <
          sprite.animation.current.sequence.length - 1
        ) {
          sprite.animation.current.frame++;
        } else {
          if (sprite.animation.current.repeat)
            sprite.animation.current.frame = 0;
          else
            sprite.animation.current.onComplete &&
              sprite.animation.current.onComplete(sprite);
        }

        sprite.animation.timer.set(sprite.animation.current.delay);
      }

      // collision
      sprites.forEach((other) => {
        if (
          sprite !== other &&
          sprite.area &&
          other.area &&
          checkForCollision(sprite, other)
        ) {
          sprite.trigger('collides', sprite, other);
        }
      });

      // max velocity
      const vel = Math.sqrt(
        sprite.vel.x * sprite.vel.x + sprite.vel.y * sprite.vel.y
      );
      if (vel > sprite.vel.max) {
        const ratio = sprite.vel.max / vel;
        sprite.vel.x *= ratio;
        sprite.vel.y *= ratio;
      }

      sprite.vel.x += sprite.accel.x;
      sprite.vel.y += sprite.accel.y;

      sprite.pos.x += sprite.vel.x * dt;
      sprite.pos.y += sprite.vel.y * dt;
    });

    if (camera.following)
      camera.pos = {
        x: -camera.following.pos.x + canvas.width / 2 / scale,
        y: -camera.following.pos.y + canvas.height / 2 / scale,
      };
  };

  // DRAW
  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    images.forEach(({ image, pos, width, height, distance }) => {
      context.scale(scale, scale);
      //context.translate(camera.pos.x * distance, camera.pos.y * distance);

      context.drawImage(image, pos.x, pos.y, width, height);

      context.setTransform(1, 0, 0, 1, 0, 0);
    });

    sprites.forEach((sprite) => {
      const center = {
        x: sprite.pos.x + sprite.width / 2,
        y: sprite.pos.y + sprite.height / 2,
      };

      const frame =
        sprite.animation.current.sequence[sprite.animation.current.frame];

      context.scale(scale, scale);
      //context.translate(camera.pos.x, camera.pos.y);
      context.translate(center.x, center.y);
      context.rotate(degreesToRadians(sprite.rotate));
      context.translate(-center.x, -center.y);

      context.drawImage(
        sprite.image,
        sprite.width * frame,
        0,
        sprite.width,
        sprite.height,
        sprite.pos.x,
        sprite.pos.y,
        sprite.width,
        sprite.height
      );

      context.setTransform(1, 0, 0, 1, 0, 0);
    });

    context.scale(scale, scale);
    //context.translate(camera.pos.x, camera.pos.y);
    // context.strokeStyle = '#ffffff';
    // context.lineWidth = 1;
    // context.strokeRect(0, 0, canvas.width, canvas.height);
    context.setTransform(1, 0, 0, 1, 0, 0);
  };

  // ANIMATE
  const animate = () => {
    dt = time.delta() / 1000;

    update(dt);
    draw();

    keyboard.clear();
    gamepad.poll();

    time.reset();

    window.requestAnimationFrame(animate);
  };

  // START
  const start = (scene) => {
    time.reset();

    let loaded = 0;

    imagesSrcs.forEach((src) => {
      const image = new Image();

      image.onload = function () {
        loadedImages.push(image);
        loaded++;
        if (loaded === imagesSrcs.length) {
          scene && scenes[scene] && scenes[scene]();
          animate();
        }
      };

      image.src = src;
    });
  };

  return {
    ...keyboard,
    gamepad,

    width: () => width,
    height: () => height,

    dt: () => dt,
    time: () => time,
    timer,

    add,
    comb,

    loadImage,

    sprite,
    image,

    pos,
    vel,
    area,
    accel,
    animation,

    getSpriteByTag,
    getSpritesByTag,

    on,
    trigger,

    repeat,

    degreesToRadians,
    randomInt,
    distance,

    setScale,
    setCameraToFollow,
    spriteOnCamera,

    scene,

    start,
  };
};
