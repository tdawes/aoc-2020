const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");

const parseLine = (line) => {
  const parts = line.split(" ");
  return {
    command: parts[0],
    amount: parseInt(parts[1]),
  };
};

const parseInput = (input) => {
  const lines = input.split("\n");
  return lines.map(parseLine);
};

const part1 = async () => {
  const input = await readInput();
  const commands = parseInput(input);
  let acc = 0;
  let pointer = 0;
  let seen = new Set();
  while (true) {
    if (seen.has(pointer)) {
      return acc;
    }
    seen.add(pointer);
    const { command, amount } = commands[pointer];
    if (command === "acc") {
      acc += amount;
      pointer += 1;
    } else if (command === "jmp") {
      pointer += amount;
    } else if (command === "nop") {
      pointer += 1;
    }
  }
};

const part2 = async () => {
  const input = await readInput();
  const commands = parseInput(input);
  for (let i = 0; i < commands.length; i++) {
    const swappedCommands = commands.slice(0);
    if (swappedCommands[i].command === "jmp") {
      swappedCommands[i] = { ...swappedCommands[i], command: "nop" };
    } else if (swappedCommands[i].command === "nop") {
      swappedCommands[i] = { ...swappedCommands[i], command: "jmp" };
    } else if (swappedCommands[i].command === "acc") {
      continue;
    }
    let acc = 0;
    let pointer = 0;
    let seen = new Set();
    while (true) {
      if (pointer >= swappedCommands.length) {
        return acc;
      }
      if (seen.has(pointer)) {
        break;
      }
      seen.add(pointer);
      const { command, amount } = swappedCommands[pointer];
      if (command === "acc") {
        acc += amount;
        pointer += 1;
      } else if (command === "jmp") {
        pointer += amount;
      } else if (command === "nop") {
        pointer += 1;
      }
    }
  }
};

part1().then(console.log).then(part2).then(console.log);
