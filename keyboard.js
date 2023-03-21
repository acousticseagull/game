export function Keyboard() {
  let keyIsDown = {};
  let keyIsPressed = {};

  window.addEventListener('keydown', (e) => {
    e.preventDefault();
    e.stopPropagation();

    keyIsDown[e.key] = true;

    return false;
  });

  window.addEventListener('keyup', (e) => {
    e.preventDefault();
    e.stopPropagation();

    keyIsPressed[e.key] = true;
    delete keyIsDown[e.key];

    return false;
  });

  function isDown(key) {
    if (keyIsDown[key]) return true;
  }

  function isPressed(key) {
    if (keyIsPressed[key]) return true;
  }

  function clearPressedKeys() {
    keyIsPressed = {};
  }

  return {
    isDown,
    isPressed,
    clearPressedKeys,
  };
}
