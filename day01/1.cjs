const fs = require('fs');

(() => {
  let sum = 0;
  let firstDigit = null;
  let lastDigit = null;

  const src = fs.createReadStream('input-1.csv', 'utf8');
  src.on('data', chunk => {
    const chars = chunk.split('');

    chars.forEach(c => {
      if (c === '\n') {
        if (firstDigit && lastDigit) {
          sum = sum + firstDigit * 10 + lastDigit;
        }
        firstDigit = null;
        lastDigit = null;
      } else {
        const n = parseInt(c, 10);
        if (!Number.isNaN(n)) {
          if (firstDigit === null) {
            firstDigit = n;
          }
          lastDigit = n;
        }
      }
      console.log(`firstDigit: ${firstDigit}, lastDigit: ${lastDigit}`);
    });
    console.log(sum);
  });
})();
