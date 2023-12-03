const fs = require('fs');

(() => {
  const COL_MAX = 140;
  const ROW_MAX = 140;

  let col = 0;
  let row = 0;
  let digitString = '';
  let digitMap = {};
  let asterisks = [];

  function storeDigit({ row, col }) {
    if (digitString !== '') {
      digitMap[row] ||= [];
      digitMap[row].push({ start: col - digitString.length, end: col - 1, digit: digitString });
      digitString = '';
    }
  }

  function multiply({ row, col }) {
    let firstDigit = null;

    for (let j = Math.max(row - 1, 0); j <= Math.min(row + 1, ROW_MAX - 1); j++) {
      let i = Math.max(col - 1, 0);
      while (i <= Math.min(col + 1, COL_MAX - 1)) {
        if (digitMap[j].length > 0) {
          const record = digitMap[j].find(({ start, end }) => {
            return i >= start && i <= end;
          });

          if (record) {
            if (firstDigit === null) {
              firstDigit = parseInt(record.digit, 10);
            } else {
              console.log(`${firstDigit} * ${parseInt(record.digit, 10)}`);
              return firstDigit * parseInt(record.digit, 10);
            }

            i = record.end + 1;
          } else {
            i = i + 1;
          }

        }
      }
    }
    return 0;
  }

  const src = fs.createReadStream('input-1.txt', 'utf8');
  src.on('data', chunk => {
    const chars = chunk.split('');

    chars.forEach(c => {
      if (c === '\n') {
        storeDigit({ row, col });

        col = 0;
        row = row + 1;
      } else {
        if (c === '.') {
          storeDigit({ row, col });
        } else {
          if (Number.isNaN(parseInt(c, 10))) {
            storeDigit({ row, col });

            if (c === '*') {
              asterisks.push({ row, col });
            }
          } else {
            digitString = digitString + c;
          }
        }
        col = col + 1;
      }
    });
  });

  src.on('end', chunk => {
    const sum = asterisks.reduce((acc, { row, col }) => {
      const product = multiply({ row, col })
      return acc + product;
    }, 0);
    console.log(sum);
  });
})();
