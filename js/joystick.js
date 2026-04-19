const joystickElement = document.querySelector('.joystick');
const activeKeys = new Set();
const keyMap = {
  arrowup: 'up',
  arrowdown: 'down',
  arrowleft: 'left',
  arrowright: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right'
};

function updateJoystick() {
  if (!joystickElement) return;

  let x = 0;
  let y = 0;

  if (activeKeys.has('left')) x -= 1;
  if (activeKeys.has('right')) x += 1;
  if (activeKeys.has('up')) y -= 1;
  if (activeKeys.has('down')) y += 1;

  const maxOffset = 12;
  joystickElement.style.transform = `translate(calc(-50% + ${x * maxOffset}px), ${y * maxOffset}px)`;
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const direction = keyMap[key];
  if (direction) {
    activeKeys.add(direction);
    updateJoystick();
    event.preventDefault();
  }
});

window.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  const direction = keyMap[key];
  if (direction) {
    activeKeys.delete(direction);
    updateJoystick();
    event.preventDefault();
  }
});
