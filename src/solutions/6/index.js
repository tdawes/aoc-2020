const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");

const parseInput = (input) => {
  const groups = input.split("\n\n");
  return groups.map((group) => group.split("\n").map((line) => line.split("")));
};

const part1 = async () => {
  const input = await readInput();
  const groups = parseInput(input);
  return _.sum(groups.map((group) => new Set(_.flatten(group)).size));
};

const part2 = async () => {
  const input = await readInput();
  const groups = parseInput(input);

  return _.sum(
    groups.map((group) => {
      const questions = Array.from(new Set(_.flatten(group)));
      return questions.filter((question) =>
        group.every((line) => line.includes(question))
      ).length;
    })
  );
};

part1().then(console.log).then(part2).then(console.log);
