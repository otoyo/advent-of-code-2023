const fs = require('fs');

(() => {
  let sum = 0;
  let firstDigit = null;
  let lastDigit = null;
  let window3 = '';
  let window4 = '';
  let window5 = '';

  const src = fs.createReadStream('input-2.csv', 'utf8');
  src.on('data', chunk => {
    const chars = chunk.split('');

    chars.forEach(c => {
      if (c === '\n') {
        if (firstDigit && lastDigit) {
          const digit = firstDigit * 10 + lastDigit;
          sum = sum + digit;
          console.log(digit);
        }
        firstDigit = null;
        lastDigit = null;
        window3 = '';
        window4 = '';
        window5 = '';
      } else {
        let n = parseInt(c, 10);
        if (Number.isNaN(n)) {
          window3 = window3 + c;
          if (window3.length > 3) {
            window3 = window3.slice(1, 4);
          }
          window4 = window4 + c;
          if (window4.length > 4) {
            window4 = window4.slice(1, 5);
          }
          window5 = window5 + c;
          if (window5.length > 5) {
            window5 = window5.slice(1, 6);
          }
          n = {one: 1, two: 2, six: 6}[window3] || {four: 4, five: 5, nine: 9}[window4] || {three: 3, seven: 7, eight: 8}[window5];
        }

        if (Number.isInteger(n)) {
          if (firstDigit === null) {
            firstDigit = n;
          }
          lastDigit = n;
        }
      }
    });
    console.log(sum);
  });
})();
