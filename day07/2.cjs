const fs = require('fs');

(() => {
  const TYPES = [
    'Five of a kind',
    'Four of a kind',
    'Full house',
    'Three of a kind',
    'Two pair',
    'One pair',
    'High card'
  ];
  const LABELS = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];
  let hands = [];

  function getCardsTypeIndex(cards) {
    const map = cards.reduce((acc, card) => {
      acc[card] ||= 0;
      acc[card] = acc[card] + 1;
      return acc;
    }, {});

    if (map['J']) {
      if (Object.keys(map).length <= 2) {
        return 0;
      } else if (Object.keys(map).length === 3) {
        if (Object.values(map).sort().reverse()[0] === 3) {
          return 1;
        } else if (map['J'] === 2) {
          return 1;
        }
        return 2;
      } else if (Object.keys(map).length === 4) {
        return 3;
      }
      return 5;
    }

    if (Object.keys(map).length === 1) {
      return 0;
    } else if (Object.keys(map).length === 2) {
      if (Object.values(map).sort().reverse()[0] === 4) {
        return 1;
      } else {
        return 2;
      }
    } else if (Object.keys(map).length === 3) {
      if (Object.values(map).sort().reverse()[0] === 3) {
        return 3;
      } else {
        return 4;
      }
    } else if (Object.keys(map).length === 4) {
      return 5;
    }
    return 6;
  }

  function getLabelIndex(label) {
    return LABELS.indexOf(label);
  }

  function compareLabels(a, b) {
    for (let i = 0; i < a.length; i++) {
      if (getLabelIndex(a[i]) > getLabelIndex(b[i])) {
        return -1;
      } else if (getLabelIndex(a[i]) < getLabelIndex(b[i])) {
        return 1;
      }
    }
    return 0;
  }

  function compareHands(a, b) {
    return getCardsTypeIndex(b) - getCardsTypeIndex(a);
  }

  function compare(a, b) {
    const handResult = compareHands(a[0].split(''), b[0].split(''));
    if (handResult !== 0) {
      return handResult;
    } else {
      return compareLabels(a[0].split(''), b[0].split(''));
    }
    return 0;
  }

  const src = fs.createReadStream('input-1.txt', 'utf8');
  src.on('data', chunk => {
    const chars = chunk.split('');

    let line = '';
    chars.forEach(c => {
      if (c === '\n') {
        const fields = line.split(' ');
        hands.push([fields[0], parseInt(fields[1], 10)]);
        line = '';
      } else {
        line = line + c;
      }
    });
  });

  src.on('end', chunk => {
    const total = hands.sort(compare).reduce((acc, [_, bid], i) => {
      return acc + (i + 1) * bid;
    }, 0);
    console.log(total);
  });
})();
