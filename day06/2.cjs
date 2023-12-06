const fs = require('fs');

(() => {
  let time;
  let distance;

  function calc(time, distance) {
    let product = 1;
    let counter = 0;
    let speed = 0;

    for (let i = 0; i <= time; i++) {
      speed = i;
      if (speed * (time - i) > distance) {
        counter = counter + 1;
      }
    }
    product = product * counter;

    return product;
  }

  const src = fs.createReadStream('input-1.txt', 'utf8');
  src.on('data', chunk => {
    const chars = chunk.split('');

    let line = '';
    chars.forEach(c => {
      if (c === '\n') {
        const fields = line.split(':');
        if (fields[0] === 'Time') {
          time = parseInt(fields[1], 10);
        } else if (fields[0] === 'Distance') {
          distance = parseInt(fields[1], 10);
        }
        line = '';
      } else if (c !== ' ') {
        line = line + c;
      }
    });
  });

  src.on('end', chunk => {
    console.log(calc(time, distance));
  });
})();
