const fs = require('fs');

(() => {
  const COL_MAX = 140;
  const ROW_MAX = 140;

  let col = 0;
  let row = 0;
  let digitString = '';
  let digits = [];
  let symbolMap = {};

  function storeDigit() {
    if (digitString !== '') {
      digits.push({ digit: digitString, row, col: col - digitString.length });
      digitString = '';
    }
  }

  function isAdjacent({ digit, row, col }) {
    for (let j = Math.max(row - 1, 0); j <= Math.min(row + 1, ROW_MAX - 1); j++) {
      for (let i = Math.max(col - 1, 0); i <= Math.min(col + digit.length, COL_MAX - 1); i++) {
        if (symbolMap[j] && symbolMap[j][i]) {
          console.log(digit);
          return true;
        }
      }
    }
    return false;
  }

  const src = fs.createReadStream('input-1.txt', 'utf8');
  src.on('data', chunk => {
    const chars = chunk.split('');

    chars.forEach(c => {
      if (c === '\n') {
        storeDigit();

        col = 0;
        row = row + 1;
      } else {
        if (c === '.') {
          storeDigit();
        } else {
          if (Number.isNaN(parseInt(c, 10))) {
            storeDigit();

            symbolMap[row] ||= {};
            symbolMap[row][col] = c;
          } else {
            digitString = digitString + c;
          }
        }
        col = col + 1;
      }
    });
  });

  src.on('end', chunk => {
    const sum = digits.reduce((acc, { digit, row, col }) => {
      if (isAdjacent({ digit, row, col })) {
        return acc + parseInt(digit, 10);
      }
      return acc;
    }, 0);
    console.log(sum);
  });
})();
