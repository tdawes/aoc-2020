const fs = require("fs");
const { promisify } = require("util");
const path = require("path");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");

const parseLine = (line) => {
  const match = /^(\d+)-(\d+) (\w): (.*)$/.exec(line);
  return {
    letter: match[3],
    min: parseInt(match[1]),
    max: parseInt(match[2]),
    password: match[4],
  };
};

const parseInput = (input) => {
  const lines = input.split("\n");
  return lines.map((line) => line.split("").map((x) => x === "#"));
};

const part1 = async () => {
  const input = await readInput();
  const map = parseInput(input);

  let x = 0;
  let y = 0;
  let count = 0;

  while (y < map.length) {
    if (map[y][x]) {
      count++;
    }
    x += 3;
    x = x % map[y].length;
    y += 1;
  }
  return count;
};

const part2 = async () => {
  const input = await readInput();
  const map = parseInput(input);

  let total = 1;

  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];

  for (let slope of slopes) {
    let count = 0;
    let x = 0;
    let y = 0;
    while (y < map.length) {
      if (map[y][x]) {
        count++;
      }
      x += slope[0];
      x = x % map[y].length;
      y += slope[1];
    }
    total *= count;
  }

  return total;
};

part1().then(console.log).then(part2).then(console.log);
