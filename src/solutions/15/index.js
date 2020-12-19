const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");
const readTestInput = async (num) =>
  readFile(path.join(__dirname, `test-input-${num}`), "utf-8");

const parseInput = (input) => {
  return input.split(",").map((x) => parseInt(x, 10));
};

const part1 = async () => {
  const input = await readInput();
  const nums = parseInput(input);

  const memory = {};
  let counter = 0;

  let last;
  nums.forEach((num) => {
    if (last != null) {
      memory[last] = counter;
    }
    counter++;
    last = num;
  });

  while (counter < 2020) {
    const previous = last;
    if (memory[last] == null) {
      last = 0;
    } else {
      last = counter - memory[last];
    }
    memory[previous] = counter;
    counter++;
  }
  return last;
};

const part2 = async () => {
  const input = await readInput();
  const nums = parseInput(input);

  const memory = {};
  let counter = 0;

  let last;
  nums.forEach((num) => {
    if (last != null) {
      memory[last] = counter;
    }
    counter++;
    last = num;
  });

  while (counter < 30000000) {
    const previous = last;
    if (memory[last] == null) {
      last = 0;
    } else {
      last = counter - memory[last];
    }
    memory[previous] = counter;
    counter++;
  }
  return last;
};

part1().then(console.log).then(part2).then(console.log);
