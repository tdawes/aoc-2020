const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");
const P = require("parsimmon");
const { Parser } = require("parsimmon");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");
const readTestInput = async (num) =>
  readFile(path.join(__dirname, `test-input-${num}`), "utf-8");

const parseInput = (input) => input.split("").map((x) => parseInt(x, 10));

const part1 = async () => {
  const input = await readInput();
  const cups = parseInput(input);
  let currentCup = cups[0];
  for (let t = 0; t < 100; t++) {
    const currentCupIndex = cups.indexOf(currentCup);
    const removed = cups.splice(currentCupIndex + 1, 3);
    if (removed.length < 3) {
      removed.push(...cups.splice(0, 3 - removed.length));
    }
    let insertIndex = -1;
    let target = currentCup;
    while (insertIndex < 0) {
      target--;
      if (target <= 0) {
        target += cups.length + 3;
      }
      insertIndex = cups.indexOf(target);
    }
    cups.splice(insertIndex + 1, 0, ...removed);
    currentCup = cups[(cups.indexOf(currentCup) + 1) % cups.length];
  }
  const start = cups.indexOf(1);
  return [...cups.slice(start + 1), ...cups.slice(0, start)].join("");
};

const part2 = async () => {
  const input = await readInput();
  const original = parseInput(input);
  const cups = [...original, ..._.range(original.length + 1, 1000001)].map(
    (i) => i - 1
  );

  const next = _.range(0, cups.length).map((i) =>
    i < original.length
      ? cups[cups.indexOf(i) + 1]
      : cups[(i + 1) % cups.length]
  );

  let currentCup = cups[0];
  for (let t = 0; t < 10000000; t++) {
    const a = next[currentCup];
    const b = next[a];
    const c = next[b];
    next[currentCup] = next[c];
    let target = currentCup - 1;
    if (target < 0) {
      target += cups.length;
    }
    while ([a, b, c].includes(target)) {
      target--;
      if (target < 0) {
        target += cups.length;
      }
    }
    next[c] = next[target];
    next[target] = a;

    currentCup = next[currentCup];
  }
  return (next[0] + 1) * (next[next[0]] + 1);
};

part1().then(console.log).then(part2).then(console.log);
