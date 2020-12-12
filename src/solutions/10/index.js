const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");
const readTestInput = async (num) =>
  readFile(path.join(__dirname, `test-input-${num}`), "utf-8");

const parseInput = (input) => {
  const lines = input.split("\n");
  return lines.map((x) => parseInt(x, 10));
};

const part1 = async () => {
  const input = await readInput();
  const nums = parseInput(input);

  nums.sort((a, b) => a - b);
  let counter = { 1: 0, 2: 0, 3: 0 };
  counter[nums[0]]++;
  for (let i = 1; i < nums.length; i++) {
    const diff = nums[i] - nums[i - 1];
    counter[diff]++;
  }
  counter[3]++;
  return counter[1] * counter[3];
};

const part2 = async () => {
  const input = await readInput();
  const nums = parseInput(input);
  const target = _.max(nums) + 3;
  nums.sort((a, b) => a - b);
  const routes = [1];
  for (let i = 1; i <= target; i++) {
    if (i !== target && !nums.includes(i)) {
      routes.push(0);
    } else {
      routes.push(
        routes[i - 1] +
          (i >= 2 ? routes[i - 2] : 0) +
          (i >= 3 ? routes[i - 3] : 0)
      );
    }
  }
  return routes[routes.length - 1];
};

part1().then(console.log).then(part2).then(console.log);
