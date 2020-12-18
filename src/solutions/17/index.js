const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");
const readTestInput = async (num) =>
  readFile(path.join(__dirname, `test-input-${num}`), "utf-8");

const key = (...parts) => parts.join("*");
const x = (key) => parseInt(key.split("*")[0], 10);
const y = (key) => parseInt(key.split("*")[1], 10);
const z = (key) => parseInt(key.split("*")[2], 10);
const t = (key) => parseInt(key.split("*")[3], 10);

const parseInput = (input, part2) => {
  const rows = input.split("\n");
  const world = {};
  rows.forEach((row, i) => {
    row.split("").forEach((c, j) => {
      if (c === "#") {
        _.set(world, part2 ? key(i, j, 0, 0) : key(i, j, 0), true);
      }
    });
  });
  return world;
};

const getNeighbourCount = (world, i, j, k) => {
  let count = 0;
  _.range(-1, 2).forEach((x) => {
    _.range(-1, 2).forEach((y) => {
      _.range(-1, 2).forEach((z) => {
        if (x !== 0 || y !== 0 || z !== 0) {
          if (world[key(i + x, j + y, k + z)]) {
            count++;
          }
        }
      });
    });
  });
  return count;
};

const getNeighbourCount2 = (world, i, j, k, t) => {
  let count = 0;
  _.range(-1, 2).forEach((x) => {
    _.range(-1, 2).forEach((y) => {
      _.range(-1, 2).forEach((z) => {
        _.range(-1, 2).forEach((w) => {
          if (x !== 0 || y !== 0 || z !== 0 || w !== 0) {
            if (world[key(i + x, j + y, k + z, t + w)]) {
              count++;
            }
          }
        });
      });
    });
  });
  return count;
};

const step = (world) => {
  const newWorld = {};
  for (
    let i = _.min(Object.keys(world).map(x)) - 1;
    i <= _.max(Object.keys(world).map(x)) + 1;
    i++
  ) {
    for (
      let j = _.min(Object.keys(world).map(y)) - 1;
      j <= _.max(Object.keys(world).map(y)) + 1;
      j++
    ) {
      for (
        let k = _.min(Object.keys(world).map(z)) - 1;
        k <= _.max(Object.keys(world).map(z)) + 1;
        k++
      ) {
        const neighbourCount = getNeighbourCount(world, i, j, k);
        if (
          world[key(i, j, k)] &&
          (neighbourCount === 2 || neighbourCount === 3)
        ) {
          newWorld[key(i, j, k)] = true;
        } else if (!world[key(i, j, k)] && neighbourCount === 3) {
          newWorld[key(i, j, k)] = true;
        }
      }
    }
  }
  return newWorld;
};

const step2 = (world) => {
  const newWorld = {};
  for (
    let i = _.min(Object.keys(world).map(x)) - 1;
    i <= _.max(Object.keys(world).map(x)) + 1;
    i++
  ) {
    for (
      let j = _.min(Object.keys(world).map(y)) - 1;
      j <= _.max(Object.keys(world).map(y)) + 1;
      j++
    ) {
      for (
        let k = _.min(Object.keys(world).map(z)) - 1;
        k <= _.max(Object.keys(world).map(z)) + 1;
        k++
      ) {
        for (
          let w = _.min(Object.keys(world).map(t)) - 1;
          w <= _.max(Object.keys(world).map(t)) + 1;
          w++
        ) {
          const neighbourCount = getNeighbourCount2(world, i, j, k, w);
          if (
            world[key(i, j, k, w)] &&
            (neighbourCount === 2 || neighbourCount === 3)
          ) {
            newWorld[key(i, j, k, w)] = true;
          } else if (!world[key(i, j, k)] && neighbourCount === 3) {
            newWorld[key(i, j, k, w)] = true;
          }
        }
      }
    }
  }
  return newWorld;
};

const part1 = async () => {
  const input = await readInput();
  let world = parseInput(input);
  for (let i = 1; i <= 6; i++) {
    world = step(world);
    // console.log(world);
  }
  return Object.keys(world).length;
};

const part2 = async () => {
  const input = await readInput();
  let world = parseInput(input, true);
  for (let i = 1; i <= 6; i++) {
    world = step2(world);
    // console.log(world);
  }
  return Object.keys(world).length;
};

part1().then(console.log).then(part2).then(console.log);
