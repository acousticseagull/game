export default (opts = {}) => {
  let dt;
  let time = timer();

  const { width, height, scale = 1 } = opts;

  const events = {
    update: [],
    add: [],
  };

  const sprites = [];
  const scenes = {};

  const keys = keyboard();

  const viewport = document.createElement('viewport');

  document.body.prepend(viewport);

  Object.assign(document.body.style, {
    backgroundColor: 'rgb(0,0,0)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    width: '100%',
    height: '100%',
  });

  Object.assign(viewport.style, {
    position: 'relative',
    imageRendering: 'pixelated',
    width: `${width}px`,
    height: `${height}px`,
    overflow: 'hidden',
    display: 'block',
    border: `1px solid rgb(255,255,255)`,
    transform: `scale(${scale})`,
  });

  function add(...components) {
    const sprite = {
      ...components.reduce((a, c) => {
        if (typeof c === 'string')
          return { ...a, tags: [...(a.tags || []), c] };

        return {
          ...a,
          ...c,
        };
      }, {}),
    };

    console.log(sprite);

    sprites.push(sprite);

    return sprite;
  }

  function pos({ x, y, ...args }) {
    return {
      moving() {
        return this.pos.vx !== 0 || this.pos.vy !== 0;
      },
      pos: {
        x,
        y,
        vx: 0,
        vy: 0,
        z: 0,
        ...args,
      },
    };
  }

  const getSpriteByTag = (tag) => sprites.find((i) => i.tags.includes(tag));
  const getSpritesByTag = (tag) => sprites.filter((i) => i.tags.includes(tag));

  const on = (event, tag, func) => {
    if (!events[event]) return;

    events[event].push({
      tag,
      func,
    });
  };

  const trigger = (event, tags, sprite) => {
    if (!events[event]) return;

    events[event].forEach((e) => {
      if (tags.includes(e.tag)) {
        e.func(sprite);
      }
    });
  };

  const update = (dt) => {
    sprites.forEach((sprite) => {
      trigger('update', sprite.tags, sprite);
      sprite.update(dt);
    });
  };

  const draw = () => {
    sprites.forEach((sprite) => sprite.draw());
  };

  const loop = () => {
    dt = time.delta() / 1000;

    update(dt);
    draw();

    keys.clearPressedKeys();

    time.reset();

    window.requestAnimationFrame(loop);
  };

  const start = () => {
    time.reset();

    sprites.forEach((sprite) => {
      viewport.append(sprite.node);

      trigger('add', sprite.tags, sprite);
    });

    loop();
  };

  return {
    width,
    height,

    time,
    timer,

    add,
    sprite,
    pos,
    animation,

    dt: () => dt,

    keys,
    on,
    getSpriteByTag,
    getSpritesByTag,
    start,
  };
};
