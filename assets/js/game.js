/* eslint-disable consistent-return */
import { createLine, gameOver } from './functions.js';

const mine = new Image();
mine.src = './assets/image/mine.png';

class Game {
  constructor(options, nMines, n = 10) {
    this.sound = '';
    if (options) {
      this.size = options.size;
      this.arr = options.arr;
      this.arrStat = options.arrStat;
      this.nMines = options.nMines;
    } else {
      this.size = n;
      this.arr = [];
      this.arrStat = [];
      this.nMines = nMines;
      while (n > 0) {
        this.arr.push(new Array(this.size).fill(0));
        this.arrStat.push(new Array(this.size).fill(0));
        // eslint-disable-next-line no-param-reassign
        n -= 1;
      }
    }
  }

  setSound(sound) {
    this.sound = sound;
  }

  createPlate() {
    const plate = document.querySelector('.plate');

    for (let i = 0; i < this.size; i += 1) {
      plate.appendChild(createLine(this.size, i));
    }
  }

  startGame(pos) {
    const posKey = pos.split('_');
    const nSquare = +posKey[0] * this.size + (+posKey[1] + 1);
    const mines = [];
    for (let i = 0; i < this.nMines; i += 1) {
      const posMine = Math.floor(Math.random() * (this.size * this.size));
      if (posMine === nSquare) {
        mines.push(posMine + 1);
      } else { mines.push(posMine); }
    }

    mines.forEach((el) => {
      const line = Math.floor(el / this.size);
      const square = ((el % this.size) === 0) ? 9 : (el % this.size) - 1;
      let n = 0;
      this.arr[line][square] = 9;
      if (line - 1 >= 0) {
        if (square - 1 >= 0) {
          n = this.arr[line - 1][square - 1];
          this.arr[line - 1][square - 1] = (n === 9) ? 9 : n += 1;
        }
        if (square + 1 <= this.size - 1) {
          n = this.arr[line - 1][square + 1];
          this.arr[line - 1][square + 1] = (n === 9) ? 9 : n += 1;
        }
        n = this.arr[line - 1][square];
        this.arr[line - 1][square] = (n === 9) ? 9 : n += 1;
      }

      if (line + 1 <= this.size - 1) {
        if (square - 1 >= 0) {
          n = this.arr[line + 1][square - 1];
          this.arr[line + 1][square - 1] = (n === 9) ? 9 : n += 1;
        }
        if (square + 1 <= this.size - 1) {
          n = this.arr[line + 1][square + 1];
          this.arr[line + 1][square + 1] = (n === 9) ? 9 : n += 1;
        }
        n = this.arr[line + 1][square];
        this.arr[line + 1][square] = (n === 9) ? 9 : n += 1;
      }

      if (square - 1 >= 0) {
        n = this.arr[line][square - 1];
        this.arr[line][square - 1] = (n === 9) ? 9 : n += 1;
      }
      if (square + 1 <= this.size - 1) {
        n = this.arr[line][square + 1];
        this.arr[line][square + 1] = (n === 9) ? 9 : n += 1;
      }
    });
  }

  openSqr(pos) {
    const posKey = pos.split('_');
    const sqr = document.getElementsByClassName(pos);
    const { arrStat, arr, size } = this;
    const value = this.arr[posKey[0]][posKey[1]];

    function openClearSqr(l, s) {
      if (arrStat[l][s] === 0 && arr[l][s] === 0) {
        const position = `${l}_${s}`;
        const sqr1 = document.getElementsByClassName(position);
        sqr1[0].classList.add('open');
        arrStat[l][s] = 1;
        if ((+l - 1) >= 0) openClearSqr(+l - 1, +s);
        if (+l + 1 <= size - 1) openClearSqr(+l + 1, +s);
        if (+s - 1 >= 0) openClearSqr(+l, +s - 1);
        if (+s + 1 <= size - 1) openClearSqr(+l, +s + 1);
      }
    }

    if (value === 0) {
      openClearSqr(posKey[0], posKey[1]);
      return;
    }

    if (value === 9) {
      sqr[0].appendChild(mine);
      sqr[0].classList.add('open');
      this.arrStat[posKey[0]][posKey[1]] = 1;
      return gameOver(this.sound);
    }

    sqr[0].firstChild.innerHTML = value;
    sqr[0].classList.add('open');
    switch (value) {
      case (1): sqr[0].classList.add('_1');
        break;
      case (2): sqr[0].classList.add('_2');
        break;
      case (3): sqr[0].classList.add('_3');
        break;
      case (4): sqr[0].classList.add('_4');
        break;
      default:
    }

    this.arrStat[posKey[0]][posKey[1]] = 1;
  }

  getMines() {
    return this.nMines;
  }

  getNotOpenSqr() {
    const arr = this.arrStat.flat(2).filter((e) => (e === 0 || e === 2));
    return arr.length;
  }

  charStat(pos) {
    const [i, j] = pos.split('_');
    return this.arrStat[i][j];
  }

  chengeCharStat(pos) {
    const [i, j] = pos.split('_');
    const stat = this.arrStat[i][j];
    this.arrStat[i][j] = (stat === 0) ? 2 : 0;
  }

  getOptions() {
    const {
      size, arr, arrStat, nMines,
    } = this;
    return {
      size, arr, arrStat, nMines,
    };
  }

  resumeGame() {
    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        const position = `${i}_${j}`;
        const value = this.arr[i][j];
        const sqr1 = document.getElementsByClassName(position);
        if (this.arrStat[i][j] === 1) {
          sqr1[0].classList.add('open');
          switch (value) {
            case (1): sqr1[0].classList.add('_1');
              sqr1[0].firstChild.innerHTML = value;
              break;
            case (2): sqr1[0].classList.add('_2');
              sqr1[0].firstChild.innerHTML = value;
              break;
            case (3): sqr1[0].classList.add('_3');
              sqr1[0].firstChild.innerHTML = value;
              break;
            case (4): sqr1[0].classList.add('_4');
              sqr1[0].firstChild.innerHTML = value;
              break;
            default:
          }
        }
        if (this.arrStat[i][j] === 2) {
          sqr1[0].classList.add('checked');
        }
      }
    }
  }
}

export default Game;
