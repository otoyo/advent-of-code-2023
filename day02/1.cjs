const fs = require('fs');

const LIMIT = {
  red: 12,
  green: 13,
  blue: 14,
};

function splitLineIntoIdAndRecordLine(line) {
  const fields = line.split(': ');
  const id = parseInt(fields[0].split('Game ')[1], 10);
  return [id, fields[1]];
}

function isPossible(recordLine) {
  const sets = recordLine.split('; ').map(field => field.split(', '));
  return sets.every(records => {
    return records.every(record => {
      const fields = record.split(' ');
      const count = parseInt(fields[0], 10);
      const color = fields[1];
      return count <= LIMIT[color];
    });
  });
}

(() => {
  let sum = 0;
  let line = '';
  let id = '';

  const src = fs.createReadStream('input-1.txt', 'utf8');
  src.on('data', chunk => {
    const chars = chunk.split('');

    chars.forEach(c => {
      if (c === '\n') {
        const [id, recordLine] = splitLineIntoIdAndRecordLine(line);
        if (isPossible(recordLine)) {
          sum = sum + id;
          console.log(`${id}: ${recordLine}`);
        }
        line = '';
      } else {
        line = line + c;
      }
    });
    console.log(sum);
  });
})();
