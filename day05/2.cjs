const fs = require('fs');

(() => {
  let sourceRangeBuffer = [];
  let diffBuffer = [];

  const eachSlice = (arr, n = 2) => {
    let dup = [...arr];
    let result = [];
    let len = dup.length;

    while (0 < len) {
      result.push(dup.splice(0, n));
      len = dup.length;
    }
    return result;
  };

  function updateSourceRangeBuffer(line) {
    const fields = line.split(' ');
    const destinationStart = parseInt(fields[0], 10);
    const sourceStart = parseInt(fields[1], 10);
    const rangeLength = parseInt(fields[2], 10);

    diffBuffer.push([sourceStart, rangeLength, destinationStart - sourceStart]);

    sourceRangeBuffer = sourceRangeBuffer.reduce((acc, [start, range]) => {
      if (sourceStart >= start && sourceStart < start + range && sourceStart + rangeLength > start + range) {
        acc.push([start, sourceStart - start]);
        acc.push([sourceStart, range - (sourceStart - start)]);
      } else if (sourceStart >= start && sourceStart + rangeLength <= start + range) {
        acc.push([start, sourceStart - start]);
        acc.push([sourceStart, rangeLength]);
        acc.push([sourceStart + rangeLength, range - (sourceStart - start + rangeLength)]);
      } else if (sourceStart + rangeLength > start && sourceStart + rangeLength <= start + range) {
        acc.push([start, rangeLength - (start - sourceStart)]);
        acc.push([sourceStart + rangeLength, range - (rangeLength - (start - sourceStart))]);
      } else {
        acc.push([start, range]);
      }
      return acc;
    }, []).filter(([_start, range]) => range > 0);
  }

  function applyDiffToSourceRangeBuffer() {
    sourceRangeBuffer = sourceRangeBuffer.map(([start, range]) => {
      let s = start;
      diffBuffer.forEach(([destStart, destRange, diff]) => {
        if (start >= destStart && start < destStart + destRange) {
          s = start + diff;
        }
      });
      return [s, range];
    });
  }

  function dispatchHandler(line) {
    if (line === '') {
      return;
    }

    const fields = line.split(':');
    if (fields[0] === 'seeds') {
      sourceRangeBuffer = [...eachSlice(fields[1].trim().split(' ').map(s => parseInt(s, 10)))];
    } else if (fields[0] === 'seed-to-soil map') {
      // noop
    } else if (
      fields[0] === 'soil-to-fertilizer map' ||
      fields[0] === 'fertilizer-to-water map' ||
      fields[0] === 'water-to-light map' ||
      fields[0] === 'light-to-temperature map' ||
      fields[0] === 'temperature-to-humidity map' ||
      fields[0] === 'humidity-to-location map'
    ) {
      applyDiffToSourceRangeBuffer();
      diffBuffer = [];
    } else {
      updateSourceRangeBuffer(line);
    }
  }

  const src = fs.createReadStream('input-1.txt', 'utf8');
  src.on('data', chunk => {
    const chars = chunk.split('');

    let line = '';
    chars.forEach(c => {
      if (c === '\n') {
        dispatchHandler(line);
        line = '';
      } else {
        line = line + c;
      }
    });
  });

  src.on('end', chunk => {
    applyDiffToSourceRangeBuffer();
    console.log(Math.min(...sourceRangeBuffer.map(([source, range]) => source)));
  });
})();
