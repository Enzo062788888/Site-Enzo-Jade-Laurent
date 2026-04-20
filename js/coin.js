const coin = document.getElementById('coin');
const coinSlot = document.querySelector('.coin-slot');
const coinMessage = document.getElementById('coinMessage');
let draggingCoin = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

function isCoinOverSlot() {
  if (!coin || !coinSlot) return false;
  const coinRect = coin.getBoundingClientRect();
  const slotRect = coinSlot.getBoundingClientRect();
  return (
    coinRect.left < slotRect.right &&
    coinRect.right > slotRect.left &&
    coinRect.top < slotRect.bottom &&
    coinRect.bottom > slotRect.top
  );
}

function activateCoinAction() {
  if (!coinMessage) return;
  coinMessage.textContent = 'Pièce déposée ! Action activée.';
  coinMessage.style.background = 'rgba(10, 120, 10, 0.9)';
  window.location.href = 'jeux.html';
}

function resetCoinMessage() {
  if (!coinMessage) return;
  coinMessage.textContent = 'Dépose la pièce dans la fente pour activer l\'action.';
  coinMessage.style.background = 'rgba(0, 0, 0, 0.45)';
}

function stopCoinDrag() {
  if (!draggingCoin) return;
  draggingCoin = false;
  coin.classList.remove('dragging');

  if (isCoinOverSlot()) {
    const padRect = coin.parentElement.getBoundingClientRect();
    const targetLeft = (padRect.width - coin.offsetWidth) / 2;
    const targetTop = padRect.height - coin.offsetHeight - 34;
    coin.style.left = `${targetLeft}px`;
    coin.style.top = `${targetTop}px`;
    activateCoinAction();
  } else {
    coin.style.left = 'calc(50% - 35px)';
    coin.style.top = '28px';
    resetCoinMessage();
  }
}

function onPointerMove(event) {
  if (!draggingCoin) return;
  const padRect = coin.parentElement.getBoundingClientRect();
  const x = event.clientX - padRect.left - dragOffsetX;
  const y = event.clientY - padRect.top - dragOffsetY;
  const maxX = padRect.width - coin.offsetWidth;
  const maxY = padRect.height - coin.offsetHeight;
  coin.style.left = `${Math.min(Math.max(0, x), maxX)}px`;
  coin.style.top = `${Math.min(Math.max(0, y), maxY)}px`;
}

function onPointerUp(event) {
  if (!draggingCoin) return;
  if (coin.releasePointerCapture) {
    try {
      coin.releasePointerCapture(event.pointerId);
    } catch (e) {
      // ignore
    }
  }
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
  stopCoinDrag();
}

if (coin) {
  coin.addEventListener('pointerdown', (event) => {
    draggingCoin = true;
    coin.setPointerCapture(event.pointerId);
    const rect = coin.getBoundingClientRect();
    dragOffsetX = event.clientX - rect.left;
    dragOffsetY = event.clientY - rect.top;
    coin.classList.add('dragging');
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    event.preventDefault();
  });
}
