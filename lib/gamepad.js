const gamepads = {};

function buttonPressed(gamepad, button) {
  if (!gamepads[gamepad]) return;
  return gamepads[gamepad].buttons[button].pressed;
}

function buttonDown(gamepad, button) {
  if (!gamepads[gamepad]) return;
  return gamepads[gamepad].buttons[button].locked;
}

function upPressed(gamepad) {
  if (!gamepads[gamepad]) return;
  return gamepads[gamepad].up.pressed;
}

function downPressed(gamepad) {
  if (!gamepads[gamepad]) return;
  return gamepads[gamepad].down.pressed;
}

function leftPressed(gamepad) {
  if (!gamepads[gamepad]) return;
  return gamepads[gamepad].left.pressed;
}

function rightPressed(gamepad) {
  if (!gamepads[gamepad]) return;
  return gamepads[gamepad].right.pressed;
}

function up(gamepad) {
  if (!gamepads[gamepad]) return;
  return gamepads[gamepad].up.locked;
}

function down(gamepad) {
  if (!gamepads[gamepad]) return;
  return gamepads[gamepad].down.locked;
}

function left(gamepad) {
  if (!gamepads[gamepad]) return;
  return gamepads[gamepad].left.locked;
}

function right(gamepad) {
  if (!gamepads[gamepad]) return;
  return gamepads[gamepad].right.locked;
}

function poll() {
  const gpds = navigator.getGamepads();

  for (let i in gpds) {
    let gp = gpds[i];

    if (!gp) return;

    gamepads[i] = {
      buttons: (gamepads[i] && gamepads[i].buttons) || {},
      up: (gamepads[i] && gamepads[i].up) || {},
      down: (gamepads[i] && gamepads[i].down) || {},
      left: (gamepads[i] && gamepads[i].left) || {},
      right: (gamepads[i] && gamepads[i].right) || {},
    };

    for (let j = 0; j < gp.buttons.length; j++) {
      let button = gp.buttons[j];

      gamepads[i].buttons[j] = {
        pressed:
          gamepads[i].buttons[j] && !gamepads[i].buttons[j].locked
            ? button.pressed
            : false,
        locked: button.pressed,
      };
    }

    gamepads[i].up = {
      pressed:
        gamepads[i].up && !gamepads[i].up.locked
          ? gp.axes[1].toFixed(0) < 0
          : false,
      locked: gp.axes[1].toFixed(0) < 0,
    };

    gamepads[i].down = {
      pressed:
        gamepads[i].down && !gamepads[i].down.locked
          ? gp.axes[1].toFixed(0) > 0
          : false,
      locked: gp.axes[1].toFixed(0) > 0,
    };

    gamepads[i].left = {
      pressed:
        gamepads[i].left && !gamepads[i].left.locked
          ? gp.axes[0].toFixed(0) < 0
          : false,
      locked: gp.axes[0].toFixed(0) < 0,
    };

    gamepads[i].right = {
      pressed:
        gamepads[i].right && !gamepads[i].right.locked
          ? gp.axes[0].toFixed(0) > 0
          : false,
      locked: gp.axes[0].toFixed(0) > 0,
    };
  }
}

export {
  buttonPressed,
  buttonDown,
  upPressed,
  downPressed,
  leftPressed,
  rightPressed,
  up,
  down,
  left,
  right,
  poll,
};
