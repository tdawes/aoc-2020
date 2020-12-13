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
  const t = parseInt(lines[0], 10);
  const busses = lines[1].split(",").map((x) => {
    if (x === "x") {
      return null;
    }
    return parseInt(x, 10);
  });
  return { t, busses };
};

const calculateRemainder = (x, n) => {
  const d = Math.floor(n / x);
  const w = d * x;
  return x - (n - w);
};

const part1 = async () => {
  const input = await readInput();
  const { t, busses } = parseInput(input);
  let bestBus = undefined;
  let delay = Number.MAX_VALUE;
  for (let bus of busses.filter((x) => x != null)) {
    const remainder = calculateRemainder(bus, t);
    if (remainder < delay) {
      bestBus = bus;
      delay = remainder;
    }
  }
  return bestBus * delay;
};

const part2 = async () => {
  const input = await readInput();
  const { busses } = parseInput(input);
  const bs = busses
    .map((bus, t) => ({ bus, t }))
    .filter(({ bus }) => bus != null);
  let s = { x: busses[0], n: busses[0] };
  bs.slice(1).forEach(({ bus, t }) => {
    let x = s.x;
    while (true) {
      if (x % bus === bus - (t % bus)) {
        s = { x, n: s.n * bus };
        return;
      }
      x += s.n;
    }
  });
  return s.x;
};

part1().then(console.log).then(part2).then(console.log);
