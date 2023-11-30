/* eslint-disable no-return-assign */

const numberMines = {
  easy: [10, 10],
  medium: [30, 15],
  hard: [90, 25],
};

const lose = new Audio('./assets/audio/lose.mp3');
const win = new Audio('./assets/audio/win.mp3');

function createLine(n, index) {
  const line = document.createElement('div');
  line.classList.add(`${index}`);
  line.classList.add('line');

  for (let i = 0; i < n; i += 1) {
    const square = document.createElement('div');
    const squareWrap = document.createElement('div');
    const child = document.createElement('p');
    squareWrap.classList.add('square-wrap');
    square.classList.add(`${index}_${i}`);
    square.classList.add('square');
    square.appendChild(child);
    squareWrap.appendChild(square);
    line.appendChild(squareWrap);
  }
  return line;
}

function timerOn(n) {
  const timerWindow = document.querySelector('.timer-window');
  let time = n || 0;
  const timer = () => {
    time += 1;
    const hours = (Math.floor(time / 3600)).toString().padStart(2, '0');
    const minutes = (Math.floor((time % 3600) / 60)).toString().padStart(2, '0');
    const sec = ((time % 3600) % 60).toString().padStart(2, '0');
    const timeText = `${hours}:${minutes}:${sec}`;
    timerWindow.innerHTML = timeText;
    return setTimeout(timer, 1000);
  };
  return timer();
}

function getTime() {
  const timerWindow = document.querySelector('.timer-window');
  const [h, m, s] = (timerWindow.innerHTML).split(':');
  const time = +h * 3600 + +m * 60 + +s;
  return time;
}

function createNode(tag, clas, inner) {
  const node = document.createElement(`${tag}`);
  if (clas) node.classList.add(clas);
  if (inner) node.innerHTML = inner;
  return node;
}

function createHtml() {
  const body = document.querySelector('body');
  const game = createNode('div', 'game');
  const plate = createNode('div', 'plate');
  const scoreWindow = createNode('div', 'score-window');
  const timerWindow = createNode('div', 'timer-window');
  const counter = createNode('div', 'counter', `actions: <span id="1"></span> 
  mines left: <span id="2"></span> 
  mines checked: <span id="3"></span>`);
  const restart = createNode('div', 'restart', 'Restart Game');
  scoreWindow.appendChild(timerWindow);
  scoreWindow.appendChild(counter);
  game.appendChild(scoreWindow);
  game.appendChild(restart);
  game.appendChild(plate);
  body.appendChild(game);
}

function startPage() {
  const body = document.querySelector('body');
  const star = createNode('div', 'start');
  const rules = createNode('div', 'rules', 'Rules');
  const size = createNode('ul', 'size');
  const easy = createNode('li', 'easy', 'Easy');
  const medium = createNode('li', 'medium', 'Medium');
  const hard = createNode('li', 'hard', 'Hard');
  const resume = createNode('div', 'resume', 'Resume saved game');
  const sound = createNode('div', 'sound', 'Sound');
  const theme = createNode('div', 'theme');
  const result = createNode('div', 'result', 'Result');
  star.appendChild(rules);
  size.appendChild(easy);
  size.appendChild(medium);
  size.appendChild(hard);
  star.appendChild(size);
  star.appendChild(resume);
  star.appendChild(sound);
  star.appendChild(theme);
  star.appendChild(result);
  body.appendChild(star);
}

function gameOver(sound) {
  if (sound === 'on') lose.play();
  const game = document.querySelector('.game');
  game.remove();
  const star = document.querySelector('.start');
  star.classList.remove('hiden');
  const mesage = createNode('div', 'mesage', '<p>You Lose!</p>');
  star.appendChild(mesage);
  mesage.addEventListener('click', () => {
    mesage.remove();
  });
}

function makeCounter(n = 0) {
  let count = n;
  return () => count += 1;
}

function checkFlag(nMines, n = 0) {
  let notUsed = nMines;
  let used = n;
  return (key) => {
    if (key === '+') {
      notUsed -= 1;
      used += 1;
    }
    if (key === '-') {
      notUsed += 1;
      used -= 1;
    }

    return [notUsed, used];
  };
}

function showRules() {
  const star = document.querySelector('.start');
  const text = `Вам необходимо найти все мины. При нажатии на ячейки будут открываться подсказки. <br>
    Если клетка пуста - значит рядом с ней нет мин. <br>
    Если в клетке цифра - это количество соседних клеток с минами. <br>
    Если хотите установить флажек - необходимо кликнуть на ячейку с зажатой кнопкой CTRL на клавиатуре.<br>
    У Вас есть возможность выбора сложности игры. Также Вы можете продолжить прошлую игру. <br>
    Настройки предусматривают возможность отключить звук или изменить тему на темную. <br>
    Для продолжения нажммите н это окно. <br>
    Удачи найти все мины!`;
  const rules = createNode('div', 'rule', text);
  star.appendChild(rules);
  rules.addEventListener('click', () => {
    const rul = document.querySelector('.rule');
    rul.remove();
  });
}

function showResult() {
  const star = document.querySelector('.start');
  let text = '';
  const winers = JSON.parse(localStorage.getItem('score'));
  if (winers) {
    for (let i = 0; i < winers.length; i += 1) {
      text += `${i} - ${winers[i]} <br>`;
    }
  } else {
    text = 'Таблица победителей пуста';
  }
  const results = createNode('div', 'results', text);
  star.appendChild(results);
  results.addEventListener('click', () => {
    results.remove();
  });
}

function youWin(mines, sound) {
  if (sound === 'on') win.play();
  const time = getTime();
  const result = (3600 - time) * mines;
  const scoreLoad = JSON.parse(localStorage.getItem('score'));
  const score = scoreLoad || [];
  if (score.length <= 10) {
    score.push(result);
  } else {
    score.pop();
    score.push(result);
  }
  score.sort((a, b) => b - a);
  localStorage.setItem('score', JSON.stringify(score));
  const game = document.querySelector('.game');
  game.remove();
  const star = document.querySelector('.start');
  star.classList.remove('hiden');
  const mesage = createNode('div', 'mesage', `<p>You Win your result ${result}</p>`);
  star.appendChild(mesage);
  mesage.addEventListener('click', () => {
    mesage.remove();
  });
}

export {
  createLine, createHtml, timerOn, numberMines, gameOver, makeCounter,
  checkFlag, startPage, showRules, showResult, youWin, getTime,
};
