const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");

const parseInput = (input) => {
  const bags = {};
  const lines = input.split("\n");
  for (let line of lines) {
    const match = /^(\w+ \w+) bags contain ((?:no other bags|\d+ (?:\w+ \w+) bags?(?:, )?)+)\.$/.exec(
      line
    );
    const colour = match[1];
    bags[colour] = {};
    if (match[2] !== "no other bags") {
      const contents = match[2].split(", ");
      for (let content of contents) {
        const contentMatch = /^(\d+) (\w+ \w+) bags?$/.exec(content);
        bags[colour][contentMatch[2]] = parseInt(contentMatch[1]);
      }
    }
  }
  return bags;
};

const part1 = async () => {
  const input = await readInput();
  const bags = parseInput(input);
  const toVisit = Object.keys(bags).filter(
    (bag) => bags[bag]["shiny gold"] != null
  );
  const visited = new Set();
  while (toVisit.length > 0) {
    const current = toVisit.shift();
    const next = Object.keys(bags)
      .filter((bag) => bags[bag][current] != null)
      .filter((bag) => !visited.has(bag) && !toVisit.includes(bag));
    toVisit.push(...next);
    visited.add(current);
    console.log(`${next.join(", ")} can all contain ${current}`);
  }
  return visited.size;
};

const part2 = async () => {
  const input = await readInput();
  const bags = parseInput(input);
  let count = -1;
  let toVisit = [{ number: 1, bag: "shiny gold" }];
  while (toVisit.length > 0) {
    const { number, bag } = toVisit.shift();
    const nextBags = bags[bag];
    count += number;
    Object.keys(nextBags).forEach((nextBag) =>
      toVisit.push({ number: number * nextBags[nextBag], bag: nextBag })
    );
  }
  return count;
};

part1().then(console.log).then(part2).then(console.log);
