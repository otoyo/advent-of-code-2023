const fs = require('fs');

(() => {
  let sum = 0;

  function calcSecondHistory(line) {
    const numbers = line.split(' ').map(n => parseInt(n, 10));

    let diffMatrix = [numbers];
    for (let j = 0; j < numbers.length; j++) {
      let diffs = [];
      for (let i = 0; i < diffMatrix[j].length - 1; i++) {
        diffs.push(diffMatrix[j][i + 1] - diffMatrix[j][i]);
      }
      diffMatrix.push(diffs);

      const set = new Set(diffs);
      if (set.size === 1 && set.has(0)) {
        break;
      }
    }

    let firstNumber = 0;
    for (let j = diffMatrix.length - 1; j >= 0; j--) {
      firstNumber = diffMatrix[j][0] - firstNumber;
    }
    return firstNumber;
  }

  const src = fs.createReadStream('input-1.txt', 'utf8');
  src.on('data', chunk => {
    const chars = chunk.split('');

    let line = '';
    chars.forEach(c => {
      if (c === '\n') {
        sum += calcSecondHistory(line);
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
