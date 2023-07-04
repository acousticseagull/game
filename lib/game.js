import { timer } from './timer.js';
import * as keyboard from './keyboard.js';
import * as gamepad from './gamepad.js';

export default (settings = {}) => {
  let { width, height, scale = 1, debug = false, global = {} } = settings;

  let dt;
  let time = timer();

  let sprites = [];
  let images = [];

  const scenes = {};
  const events = {};

  const camera = {
    pos: {
      x: 0,
      y: 0,
    },
    following: null,
  };

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  context.imageSmoothingEnabled = false;

  document.body.prepend(canvas);

  function loadImage(src) {
    images.push(src);
  }

  function drawTile(src, x, y, width, height, frame) {
    const image = images.find((image) => image.currentSrc.endsWith(src));

    context.drawImage(
      image,
      width * frame,
      0,
      width,
      height,
      x,
      y,
      width,
      height
    );
  }

  function add(...components) {
    const obj = {
      ...components.reduce((a, c) => {
        if (typeof c === 'function') {
          return { ...a, ...c.call(a) };
        }

        if (typeof c === 'string')
          return { ...a, tags: [...(a.tags || []), c] };

        return {
          ...a,
          ...c,
        };
      }, {}),
    };

    if (obj.id === 'sprite') {
      sprites.push(obj);
    }

    return obj;
  }

  function sprite(src, width, height) {
    const image = images.find((image) => image.currentSrc.endsWith(src));

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
      this.onDestroy(this);
      this.status = 'destroyed';
    }

    function setScale(value) {
      this.scale = value;
      this.width *= value;
      this.height *= value;
    }

    function isOnCamera() {
      return (
        this.pos.x + this.width / scale > -camera.pos.x / scale &&
        this.pos.x / scale < -camera.pos.x + canvas.width / scale &&
        this.pos.y + this.height / scale > -camera.pos.y / scale &&
        this.pos.y / scale < -camera.pos.y + canvas.height / scale
      );
    }

    function isActive() {
      return this.status === 'active';
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
      z: 1,
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
      lifespan: null,
      following: null,
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
      angleTo(other) {
        return Math.atan2(
          other.pos.y + other.height / 2 - (this.pos.y + this.height / 2),
          other.pos.x + other.width / 2 - (this.pos.x + this.width / 2)
        );
      },
      distanceTo(other) {
        return Math.sqrt(
          Math.pow(this.pos.x - other.pos.x, 2) +
            Math.pow(this.pos.y - other.pos.y, 2)
        );
      },
      hasTag(tag) {
        return this.tags.includes(tag);
      },
      isActive,
      isOnCamera,
      receiveDamage(amount) {
        this.onReceiveDamage(amount);
      },
      onAdd() {},
      onUpdate() {},
      onCollide() {},
      onReceiveDamage() {},
      onDestroy() {},
    };
  }

  function state(initial) {
    return {
      state: {
        current: initial,
        is(state) {
          return state === this.current;
        },
        set(state) {
          this.current = state;
        },
      },
    };
  }

  function area(x = 0, y = 0, width = 0, height = 0) {
    return {
      area: {
        x,
        y,
        width,
        height,
      },
    };
  }

  function pos(pos) {
    return {
      pos: {
        origin: {
          ...pos,
        },
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
    animations = Object.keys(animations).reduce((acc, cur) => {
      acc[cur] = {
        sequence: [0],
        frame: 0,
        delay: 0,
        repeat: false,
        ...animations[cur],
      };
      return acc;
    }, {});

    const name = Object.keys(animations)[0];
    const current = animations[name];

    return {
      animation: {
        animations,
        name,
        current,
        timer: timer(),
        play(name) {
          if (name === this.name) return;
          this.name = name;
          this.current = this.animations[name];
          this.timer.set(this.current.delay);
        },
      },
    };
  }

  function lifespan(s) {
    return {
      lifespan: timer(s),
    };
  }

  function follow(sprite, offset) {
    return function () {
      this.pos.x = sprite.pos.x + offset.x;
      this.pos.y = sprite.pos.y + offset.y;

      return {
        following: {
          sprite,
          offset,
        },
      };
    };
  }

  function image(src, x, y, width, height) {
    const image = images.find((image) => image.currentSrc.endsWith(src));

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
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const randomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
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
      a.pos.x + a.area.x < b.pos.x + b.area.x + (b.width - b.area.width) &&
      a.pos.x + a.area.x + (a.width - a.area.width) > b.pos.x + b.area.x &&
      a.pos.y + a.area.y <
        b.pos.y + b.area.y + (b.height - b.area.height) - 1 &&
      a.pos.y + a.area.y + (a.height - a.area.height) - 1 > b.pos.y + b.area.y
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

    sprites.sort((a, b) => a.z - b.z);

    sprites.forEach((sprite) => {
      if (sprite.status === 'added') {
        sprite.status = 'active';
        sprite.onAdd(sprite);
      }

      sprite.onUpdate(sprite, dt);

      if (sprite.lifespan?.expired()) sprite.destroy();

      if (sprite.following) {
        (sprite.pos.x =
          sprite.following.sprite.pos.x + sprite.following.offset.x),
          (sprite.pos.y =
            sprite.following.sprite.pos.y + sprite.following.offset.y);
      }

      // animate
      if (sprite.animation.timer.expired()) {
        const { current, timer } = sprite.animation;
        const animation = current;

        if (animation.frame < animation.sequence.length - 1) {
          animation.frame++;
        } else {
          if (animation.repeat) animation.frame = 0;
          else animation.onComplete && animation.onComplete(sprite);
        }

        timer.set(animation.delay);
      }

      // collision
      sprites.forEach((other) => {
        if (
          sprite !== other &&
          sprite.area &&
          other.area &&
          checkForCollision(sprite, other)
        ) {
          sprite.onCollide(other);
        }
      });

      // max velocity
      const vel = {
        x: Math.sqrt(sprite.vel.x * sprite.vel.x),
        y: Math.sqrt(sprite.vel.y * sprite.vel.y),
      };

      if (vel.x > sprite.vel.max) {
        const ratio = sprite.vel.max / vel.x;
        sprite.vel.x *= ratio;
      }

      if (vel.y > sprite.vel.max) {
        const ratio = sprite.vel.max / vel.y;
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

    trigger('draw');

    sprites.forEach((sprite) => {
      if (!sprite.isOnCamera()) return;

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

      if (debug) {
        if (sprite.area) {
          context.strokeStyle = 'red';
          context.strokeRect(
            sprite.pos.x + sprite.area.x,
            sprite.pos.y + sprite.area.y,
            sprite.width - sprite.area.width,
            sprite.height - sprite.area.height
          );
        }
      }

      context.setTransform(1, 0, 0, 1, 0, 0);
    });

    context.scale(scale, scale);
    //context.translate(camera.pos.x, camera.pos.y);
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

    images.forEach((src, i) => {
      const image = new Image();

      image.onload = function () {
        images[i] = image;
        loaded++;
        if (loaded === images.length) {
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

    width,
    height,

    dt: () => dt,
    time: () => time,
    timer,

    add,
    comb,

    loadImage,
    drawTile,

    sprite,
    image,

    pos,
    vel,
    area,
    accel,
    state,
    animation,
    lifespan,
    follow,

    getSpriteByTag,
    getSpritesByTag,

    on,
    trigger,

    repeat,

    degreesToRadians,
    randomInt,
    randomFloat,
    distance,

    setScale,
    setCameraToFollow,
    spriteOnCamera,

    scene,

    global,

    start,
  };
};
