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
  return lines.map(parseLine);
};

const part1 = async () => {
  const input = await readInput();
  const parsed = parseInput(input);
  return parsed.filter(({ letter, min, max, password }) => {
    const count = password.split("").filter((c) => c === letter).length;
    return count >= min && count <= max;
  }).length;
};

const part2 = async () => {
  const input = await readInput();
  const parsed = parseInput(input);
  return parsed.filter(({ letter, min, max, password }) => {
    const letters = password.split("");
    return (
      (letters[min - 1] === letter || letters[max - 1] === letter) &&
      letters[min - 1] !== letters[max - 1]
    );
  }).length;
};

part1().then(console.log).then(part2).then(console.log);
