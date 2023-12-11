const fs = require('fs');

(() => {
  const LR_INDEX = { 'L': 0, 'R': 1 }

  let instructions = [];
  let map = {};

  const src = fs.createReadStream('input-1.txt', 'utf8');
  src.on('data', chunk => {
    const chars = chunk.split('');

    let line = '';
    chars.forEach(c => {
      if (c === '\n') {
        if (instructions.length === 0) {
          instructions = line.split('');
        } else if (line !== '') {
          const fields = line.split('=');
          const key = fields[0].trim();
          const value = fields[1].replace('(', '').replace(')', '').split(',').map(v => v.trim());
          map[key] = value;
        }
        line = '';
      } else {
        line = line + c;
      }
    });
  });

  src.on('end', chunk => {
    let i = 0;
    let counter = 1;
    let position = 'AAA';
    while (true) {
      position = map[position][LR_INDEX[instructions[i]]];

      if (position === 'ZZZ') {
        break;
      }

      counter++;
      i++;
      if (i === instructions.length) {
        i = 0;
      }
    }

    console.log(counter);
  });
})();
