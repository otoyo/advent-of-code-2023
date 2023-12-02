const fs = require('fs');

function splitLineIntoIdAndRecordLine(line) {
  const fields = line.split(': ');
  const id = parseInt(fields[0].split('Game ')[1], 10);
  return [id, fields[1]];
}

function multiplyMaxNumbers(recordLine) {
  const sets = recordLine.split('; ').map(field => field.split(', '));
  const maxNumbers = sets.reduce((acc, records) => {
    records.forEach(record => {
      const fields = record.split(' ');
      const count = parseInt(fields[0], 10);
      const color = fields[1];
      acc[color] = Math.max(acc[color], count);
    });
    return acc;
  }, { red: 0, green: 0, blue: 0 });

  return maxNumbers.red * maxNumbers.green * maxNumbers.blue;
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
        sum = sum + multiplyMaxNumbers(recordLine);
        line = '';
      } else {
        line = line + c;
      }
    });
    console.log(sum);
  });
})();
