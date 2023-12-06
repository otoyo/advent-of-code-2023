const fs = require('fs');

(() => {
  let times = [];
  let distances = [];

  function zip(arrays) {
    return arrays[0].map((_, i) => {
      return arrays.map(arr => arr[i]);
    });
  }

  function calc(times, distances) {
    let product = 1;

    zip([times, distances]).forEach(([time, distance]) => {
      let counter = 0;
      let speed = 0;

      for (let i = 0; i <= time; i++) {
        speed = i;
        if (speed * (time - i) > distance) {
          counter = counter + 1;
        }
      }
      product = product * counter;
    });

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
          times = fields[1].split(' ').filter(s => s.trim()).map(s => parseInt(s.trim()));
        } else if (fields[0] === 'Distance') {
          distances = fields[1].split(' ').filter(s => s.trim()).map(s => parseInt(s.trim()));
        }
        line = '';
      } else {
        line = line + c;
      }
    });
  });

  src.on('end', chunk => {
    console.log(calc(times, distances));
  });
})();
