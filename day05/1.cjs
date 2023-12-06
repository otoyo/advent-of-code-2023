const fs = require('fs');

(() => {
  let startedSeedToSoilMap = false;
  let startedSoilToFertilizerMap = false;
  let startedFertilizerToWaterMap = false;
  let startedWaterToLightMap = false;
  let startedLightToTemperatureMap = false;
  let startedTemperatureToHumidityMap = false;
  let startedHumidityToLocationMap = false;
  let seeds = [];
  let seedToSoilMap = {};
  let soilToFertilizerMap = {};
  let fertilizerToWaterMap = {};
  let waterToLightMap = {};
  let lightToTemperatureMap = {};
  let temperatureToHumidityMap = {};
  let humidityToLocationMap = {};

  function initializeMap(sources, map) {
    sources.forEach(source => {
      map[source] = source;
    });
  }

  function updateMap(line, sources, map) {
    const fields = line.split(' ');
    const destinationStart = parseInt(fields[0], 10);
    const sourceStart = parseInt(fields[1], 10);
    const rangeLength = parseInt(fields[2], 10);

    sources.forEach(source => {
      if (source >= sourceStart && source < sourceStart + rangeLength) {
        map[source] = destinationStart + source - sourceStart;
      }
    });
  }

  function dispatchHandler(line) {
    if (line === '') {
      return;
    }

    const fields = line.split(':');
    if (fields[0] === 'seeds') {
      seeds = fields[1].trim().split(' ').map(s => parseInt(s, 10));
    } else if (fields[0] === 'seed-to-soil map') {
      startedSeedToSoilMap = true;
      initializeMap(seeds, seedToSoilMap);
    } else if (fields[0] === 'soil-to-fertilizer map') {
      startedSoilToFertilizerMap = true;
      initializeMap(Object.values(seedToSoilMap), soilToFertilizerMap);
    } else if (fields[0] === 'fertilizer-to-water map') {
      startedFertilizerToWaterMap = true;
      initializeMap(Object.values(soilToFertilizerMap), fertilizerToWaterMap);
    } else if (fields[0] === 'water-to-light map') {
      startedWaterToLightMap = true;
      initializeMap(Object.values(fertilizerToWaterMap), waterToLightMap);
    } else if (fields[0] === 'light-to-temperature map') {
      startedLightToTemperatureMap = true;
      initializeMap(Object.values(waterToLightMap), lightToTemperatureMap);
    } else if (fields[0] === 'temperature-to-humidity map') {
      startedTemperatureToHumidityMap = true;
      initializeMap(Object.values(lightToTemperatureMap), temperatureToHumidityMap);
    } else if (fields[0] === 'humidity-to-location map') {
      startedHumidityToLocationMap = true;
      initializeMap(Object.values(temperatureToHumidityMap), humidityToLocationMap);
    } else {
      if (startedHumidityToLocationMap) {
        updateMap(line, Object.values(temperatureToHumidityMap), humidityToLocationMap);
      } else if (startedTemperatureToHumidityMap) {
        updateMap(line, Object.values(lightToTemperatureMap), temperatureToHumidityMap);
      } else if (startedLightToTemperatureMap) {
        updateMap(line, Object.values(waterToLightMap), lightToTemperatureMap);
      } else if (startedWaterToLightMap) {
        updateMap(line, Object.values(fertilizerToWaterMap), waterToLightMap);
      } else if (startedFertilizerToWaterMap) {
        updateMap(line, Object.values(soilToFertilizerMap), fertilizerToWaterMap);
      } else if (startedSoilToFertilizerMap) {
        updateMap(line, Object.values(seedToSoilMap), soilToFertilizerMap);
      } else if (startedSeedToSoilMap) {
        updateMap(line, seeds, seedToSoilMap);
      }
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
    console.log(Math.min(...Object.values(humidityToLocationMap)));
  });
})();
