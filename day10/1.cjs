const fs = require('fs');

(() => {
  const NEIGHBORS = [
    [-1,  0], // Up
    [ 0,  1], // Right
    [ 1,  0], // Down
    [ 0, -1], // Left
  ];

  let matrix = [];
  let startPosition;

  function findNextNode(node) {
    let y, x, direction;

    if (node.next) {
      y = node.next.y;
      x = node.next.x;
      direction = { j: node.next.y - node.y, i: node.next.x - node.x };
    } else {
      const pos = NEIGHBORS.find(([j, i], k) => {
        const y = node.y + j;
        const x = node.x + i;

        if (y < 0 || x < 0 || y >= matrix.length || x >= matrix.length) {
          return false;
        }

        const tile = matrix[y][x];
        if (
          k === 0 && ['|', '7', 'F'].includes(tile) ||
          k === 1 && ['-', 'J', '7'].includes(tile) ||
          k === 2 && ['|', 'L', 'J'].includes(tile) ||
          k === 3 && ['-', 'L', 'F'].includes(tile)
        ) {
          return true;
        }
        return false;
      });

      if (!pos) {
        return null;
      }

      y = node.y + pos[0];
      x = node.x + pos[1];
      direction = { j: pos[0], i: pos[1] };
    }

    const tile = matrix[y][x];
    const nextDirection = getNextPosition(tile, direction.j, direction.i);

    return { y, x, tile, prev: node, next: { y: y + nextDirection[0], x: x + nextDirection[1] } };
  }

  function getNextPosition(tile, j, i) {
    if (tile === '|') {
      if (j === -1) {
        return [-1, 0];
      } else {
        return [1, 0];
      }
    } else if (tile === '-') {
      if (i === -1) {
        return [0, -1];
      } else {
        return [0, 1];
      }
    } else if (tile === '7') {
      if (j === -1) {
        return [0, -1];
      } else {
        return [1, 0];
      }
    } else if (tile === 'J') {
      if (j === 1) {
        return [0, -1];
      } else {
        return [-1, 0];
      }
    } else if (tile === 'L') {
      if (j === 1) {
        return [0, 1];
      } else {
        return [-1, 0];
      }
    } else if (tile === 'F') {
      if (j === -1) {
        return [0, 1];
      } else {
        return [1, 0];
      }
    }
    return [0, 0];
  }

  const src = fs.createReadStream('input-1.txt', 'utf8');
  src.on('data', chunk => {
    const chars = chunk.split('');

    let j = 0;
    let i = 0;
    chars.forEach(c => {
      if (c === '\n') {
        i = 0;
        j++;
      } else {
        if (c === 'S') {
          startPosition = { y: j, x: i };
        }
        matrix[j] ||= [];
        matrix[j][i] = c;
        i++;
      }
    });
  });

  src.on('end', chunk => {
    let counter = 1;
    let node = findNextNode(startPosition);
    while (true) {
      node = findNextNode(node);
      counter++;
      if (node.tile === 'S') {
        break;
      }
    }
    console.log(counter / 2);
  });
})();
