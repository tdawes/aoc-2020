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
  return lines.map((line) => {
    if (/^mask = [X01]+$/.test(line)) {
      const match = /^mask = ([X01]+)$/.exec(line);
      const mask = match[1].split("");
      return { type: "mask", mask };
    } else {
      const match = /^mem\[(\d+)\] = (\d+)$/.exec(line);
      const i = parseInt(match[1], 10);
      const v = parseInt(match[2], 10);
      return { type: "set", position: i, value: v };
    }
  });
};

const toBinary = (v) => {
  const result = [];
  while (v > 0) {
    result.unshift(v % 2);
    v = v >> 1;
  }
  return [..._.repeat("0", 36 - result.length).split(""), ...result];
};

const fromBinary = (a) => {
  let r = 0;
  for (let d of a) {
    r *= 2;
    if (d === 1) [(r += 1)];
  }
  return r;
};

const apply = (mask, v) => {
  const b = toBinary(v);
  const m = b.map((k, i) => (mask[i] == null ? k : parseInt(mask[i])));
  return fromBinary(m);
};

const _unfold = (mask, value) => {
  if (mask.length === 0) {
    return [[]];
  }
  const m = mask.shift();
  const v = value.shift();
  const rs = _unfold(mask, value);
  if (m === "0") {
    return rs.map((r) => [v, ...r]);
  } else if (m === "1") {
    return rs.map((r) => [1, ...r]);
  } else {
    return _.flatMap(rs, (r) => [
      [0, ...r],
      [1, ...r],
    ]);
  }
};

const unfold = (mask, v) => _unfold([...mask], toBinary(v));

const part1 = async () => {
  const input = await readInput();
  const commands = parseInput(input);
  const mem = {};
  let mask;
  for (let command of commands) {
    if (command.type === "mask") {
      mask = command.mask;
    } else {
      mem[command.position] = apply(mask, command.value);
    }
  }

  return _.sum(Object.values(mem));
};

const part2 = async () => {
  const input = await readInput();
  const commands = parseInput(input);
  const mem = {};
  let mask;
  for (let command of commands) {
    if (command.type === "mask") {
      mask = command.mask;
    } else {
      const unfolded = unfold(mask, command.position);
      unfolded.forEach((l) => {
        mem[l] = command.value;
      });
    }
  }
  return _.sum(Object.values(mem));
};

part1().then(console.log).then(part2).then(console.log);
