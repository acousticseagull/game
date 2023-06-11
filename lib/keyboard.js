let keyIsDown = {};
let keyIsReleased = {};
let keyIsPressed = {};

document.addEventListener('keydown', (e) => {
  e.stopPropagation();

  keyIsDown[e.key] = true;
  if (keyIsPressed[e.key] === undefined) keyIsPressed[e.key] = true;

  return false;
});

document.addEventListener('keyup', (e) => {
  e.stopPropagation();

  if (keyIsDown[e.key]) keyIsReleased[e.key] = true;

  delete keyIsPressed[e.key];
  delete keyIsDown[e.key];

  return false;
});

function keyDown(key) {
  return keyIsDown[key];
}

function keyPressed(key) {
  return keyIsPressed[key];
}

function keyReleased(key) {
  return keyIsReleased[key];
}

function clear() {
  for (const k in keyIsPressed) {
    keyIsPressed[k] = false;
  }

  keyIsReleased = {};
}

export { keyDown, keyPressed, keyReleased, clear };
