// const secondsDelay = document.querySelector('[data-seconds]');
// const minutesDelay = document.querySelector('[data-minutes]');
// const hoursDelay = document.querySelector('[data-hours]');

const sendBtn = document.querySelector('.send__btn');
const timeInput = document.querySelector('.send__time');
const dataUnits = document.querySelectorAll('[data-unit]');
const delayContainer = document.querySelector('[data-delay-container]');
const sendField = document.querySelector('.send__field');
const tableInfoContent = document.querySelector('.table__info');

delayContainer.addEventListener('click', chooseDelay);

function chooseDelay(event) {
  const btn = event.target;
  if (!btn.hasAttribute('data-unit')) return;

  dataUnits.forEach((unit) => unit.classList.remove('send__time-btn--active'));
  btn.classList.add('send__time-btn--active');
}

function getSelectedUnit() {
  const activeUnit = document.querySelector('.send__time-btn--active');
  return activeUnit ? activeUnit.getAttribute('data-unit') : 'seconds';
}

function createRow(message, delayInMs) {
  const row = document.createElement('tr');
  setTimeout(() => {
    row.classList.add('table__info-inner');
  }, 10);

  const messageItem = document.createElement('td');
  messageItem.classList.add('table__info-message');
  messageItem.textContent = message;

  const timeItem = document.createElement('td');
  timeItem.classList.add('table__info-remain');

  const statusItem = document.createElement('td');
  statusItem.classList.add('table__info-status');
  statusItem.textContent = 'Pending';

  row.appendChild(messageItem);
  row.appendChild(timeItem);
  row.appendChild(statusItem);
  tableInfoContent.appendChild(row);

  const emptyInfo = document.querySelector('.table__empty');
  const headerRow = document.querySelector('.table__header');

  if (tableInfoContent.children.length > 0) {
    emptyInfo.classList.add('none');
    headerRow.classList.remove('none');
  }

  const endTime = Date.now() + delayInMs;

  function updateCountdown() {
    const timeLeft = endTime - Date.now();
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      timeItem.textContent = '-';
      statusItem.textContent = 'Sended';
      return;
    }
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));

    if (hours > 0) {
      timeItem.textContent = `${hours} h ${minutes % 60} m`;
    } else if (minutes > 0) {
      timeItem.textContent = `${minutes} m`;
    } else {
      timeItem.textContent = 'Less than a minute';
    }
  }

  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
}

function sendMessage() {
  const timeValue = parseInt(timeInput.value, 10);
  const selectedUnit = getSelectedUnit();
  if (isNaN(timeValue) || timeValue <= 0) return;

  const messageText = sendField.value.trim();

  if (messageText === '') return;

  let delayInMs;
  switch (selectedUnit) {
    case 'minutes':
      delayInMs = timeValue * 60 * 1000;
      break;
    case 'hours':
      delayInMs = timeValue * 60 * 60 * 1000;
      break;
    default:
      delayInMs = timeValue * 1000;
  }

  createRow(messageText, delayInMs);

  timeInput.value = '';
  sendField.value = '';
}

sendBtn.addEventListener('click', sendMessage);
