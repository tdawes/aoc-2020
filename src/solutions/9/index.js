const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");

const parseInput = (input) => {
  const lines = input.split("\n");
  return lines.map((x) => parseInt(x, 10));
};

const findSum = (list, target) => list.some((el) => list.includes(target - el));

const part1 = async () => {
  const input = await readInput();
  const nums = parseInput(input);
  const preamble = nums.splice(0, 25);
  while (true) {
    let next = nums.shift();
    if (!findSum(preamble, next)) {
      return next;
    }
    preamble.shift();
    preamble.push(next);
  }
};

const part2 = async () => {
  const input = await readInput();
  const nums = parseInput(input);
  const numsCopy = [...nums];
  const preamble = numsCopy.splice(0, 25);
  let index = preamble.length;
  while (true) {
    let next = numsCopy.shift();
    if (!findSum(preamble, next)) {
      break;
    }
    preamble.shift();
    preamble.push(next);
    index++;
  }

  for (let i = 25; i < nums.length; i++) {
    let pointer = i + 1;
    let count = nums[i];
    while (count < nums[index]) {
      count += nums[pointer];
      if (count === nums[index]) {
        return (
          Math.min(...nums.slice(i, pointer + 1)) +
          Math.max(...nums.slice(i, pointer + 1))
        );
      }

      pointer += 1;
    }
  }
};

part1().then(console.log).then(part2).then(console.log);
