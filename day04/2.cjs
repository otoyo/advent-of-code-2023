const fs = require('fs');

(() => {
  let sum = 0;
  let numbersOfCopiedCards = [0];

  function calcWinningNumbers(line) {
    const fields = line.split(':');
    const cardNumber = parseInt(fields[0].split('Card')[1].trim(), 10);
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

    for (let i = cardNumber; i < cardNumber + n; i++) {
      numbersOfCopiedCards[i] = (numbersOfCopiedCards[i] || 0) + 1 + (numbersOfCopiedCards[cardNumber - 1] || 0);
    }

    const score = 1 + (numbersOfCopiedCards[cardNumber - 1] || 0);
    console.log(`cardNumber: ${cardNumber}, score: ${score}, numbersOfCopiedCards: ${numbersOfCopiedCards}`);
    return score;
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
