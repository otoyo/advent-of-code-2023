const fs = require('fs');

(() => {
  let sum = 0;

  function calcWinningNumbers(line) {
    const fields = line.split(':');
    const numbersString = fields[1].split('|');
    const headNumbers = numbersString[0].split(' ').map(s => parseInt(s.trim(), 10));
    const tailNumbers = numbersString[1].split(' ').map(s => parseInt(s.trim(), 10));

    let n = 0;
    headNumbers.forEach(h => {
      tailNumbers.forEach(t => {
        if (h === t) {
          n = n + 1;
        }
      });
    });

    if (n > 0) {
      return 2 ** (n - 1);
    }
    return 0;
  }

  const src = fs.createReadStream('input-1.txt', 'utf8');
  src.on('data', chunk => {
    const chars = chunk.split('');

    let line = '';
    chars.forEach(c => {
      if (c === '\n') {
        sum = sum + calcWinningNumbers(line);
        line = '';
      } else {
        line = line + c;
      }
    });
  });

  src.on('end', chunk => {
    console.log(sum);
  });
})();
