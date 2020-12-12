const fs = require("fs");
const { promisify } = require("util");
const path = require("path");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");

const part1 = async () => {
  const input = await readInput();
  const numbers = input
    .trim()
    .split("\n")
    .filter((x) => x != null && x.length > 0)
    .map((x) => parseInt(x, 10));
  const set = new Set(numbers);

  for (let n of numbers) {
    if (set.has(2020 - n)) {
      return n * (2020 - n);
    }
  }
};

const part2 = async () => {
  const input = await readInput();
  const numbers = input
    .trim()
    .split("\n")
    .map((x) => parseInt(x, 10));
  const set = new Set(numbers);
  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const m = numbers[i];
      const n = numbers[j];
      const r = 2020 - m - n;
      if (set.has(r)) {
        return m * n * r;
      }
    }
  }
};

part1().then(console.log).then(part2).then(console.log);
