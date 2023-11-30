/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */

import Game from './assets/js/game.js';
import {
  createHtml, timerOn, makeCounter, checkFlag, startPage, numberMines,
  showRules, showResult, youWin, getTime,
} from './assets/js/functions.js';

let timer;
let q;
let mines;
let count;
let flag;
let sound;
let theme;

const open = new Audio('./assets/audio/open.mp3');

function ctrlClick(index, square) {
  const stat = q.charStat(index);
  const nMH = document.getElementById('2');
  const nFH = document.getElementById('3');
  let ans = [];
  if (stat === 0) {
    square.classList.add('checked');
    ans = flag('+');
  }

  if (stat === 2) {
    square.classList.remove('checked');
    ans = flag('-');
  }
  q.chengeCharStat(index);
  const [nM, nF] = ans;
  nMH.innerHTML = nM;
  nFH.innerHTML = nF;
}

function openSquare(event) {
  const square = event.target.closest('.square');
  if (!square) return;

  const index = square.classList[0];
  const click = count();
  const counter = document.getElementById('1');

  if (!timer) {
    timer = !timer;
    timerOn();
    q.startGame(index);
  }

  if (event.ctrlKey === true) {
    return ctrlClick(index, square);
  }

  counter.innerHTML = click;
  q.openSqr(index);
  if (q.getNotOpenSqr() === mines) {
    const difficult = q.getMines();
    youWin(difficult, sound);
  }
  if (sound === 'on') open.play();
}

function start(opt, n) {
  timer = false;
  createHtml();
  if (n) {
    q = new Game(opt, n[0], n[1]);
    count = makeCounter();
    flag = checkFlag(q.getMines());
  } else {
    const stat = JSON.parse(localStorage.getItem('stat'));
    const counter = document.getElementById('1');
    const nMH = document.getElementById('2');
    const nFH = document.getElementById('3');
    [nMH.innerHTML, nFH.innerHTML, counter.innerHTML] = stat;
    q = new Game(opt);
    count = makeCounter(stat[2]);
    flag = checkFlag(stat[0], stat[1]);
    timer = true;
    timerOn(stat[3]);
  }
  q.setSound(sound);
  mines = q.getMines();
  const restart = document.querySelector('.restart');
  q.createPlate();
  const plate = document.querySelector('.plate');
  plate.addEventListener('click', openSquare);
  restart.addEventListener('click', restartGame);
  return {
    timer,
    q,
    mines,
    count,
    flag,
  };
}

function restartGame() {
  const game = document.querySelector('.game');
  const star = document.querySelector('.start');
  game.remove();
  star.classList.remove('hiden');
}

window.addEventListener('load', () => {
  const body = document.querySelector('body');
  const optionsLoad = localStorage.getItem('options');
  const soundLoad = localStorage.getItem('sound');
  const themeLoad = localStorage.getItem('theme');
  let options = {};
  sound = soundLoad || 'on';
  theme = themeLoad || 'Light';

  startPage();

  try {
    options = JSON.parse(optionsLoad);
  } catch (e) {
    options = {};
  }

  const easy = document.querySelector('.easy');
  easy.addEventListener('click', () => {
    const star = document.querySelector('.start');
    const n = numberMines.easy;
    star.classList.add('hiden');
    start('', n);
  });

  const medium = document.querySelector('.medium');
  medium.addEventListener('click', () => {
    const star = document.querySelector('.start');
    const n = numberMines.medium;
    star.classList.add('hiden');
    start('', n);
  });

  const hard = document.querySelector('.hard');
  hard.addEventListener('click', () => {
    const star = document.querySelector('.start');
    const n = numberMines.hard;
    star.classList.add('hiden');
    start('', n);
  });

  const rules = document.querySelector('.rules');
  rules.addEventListener('click', showRules);

  const soundBtn = document.querySelector('.sound');
  if (sound === 'off') soundBtn.classList.add('off');
  soundBtn.addEventListener('click', () => {
    sound = (sound === 'off') ? 'on' : 'off';
    soundBtn.classList.toggle('off');
  });

  const themeBtn = document.querySelector('.theme');
  if (theme === 'Dark') body.classList.add('dark');
  themeBtn.innerHTML = theme;
  themeBtn.addEventListener('click', () => {
    theme = (theme === 'Dark') ? 'Light' : 'Dark';
    body.classList.toggle('dark');
    themeBtn.innerHTML = theme;
  });

  const result = document.querySelector('.result');
  result.addEventListener('click', showResult);

  const resume = document.querySelector('.resume');
  resume.addEventListener('click', () => {
    const star = document.querySelector('.start');
    star.classList.add('hiden');
    start(options);
    q.resumeGame();
  });
});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('theme', theme);
  localStorage.setItem('sound', sound);
  const options = q.getOptions();
  const optionsSave = JSON.stringify(options);
  const time = getTime();
  const stat = [...flag(), count() - 1, time];
  localStorage.setItem('options', optionsSave);
  localStorage.setItem('stat', JSON.stringify(stat));
});
