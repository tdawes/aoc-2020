const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");
const readTestInput = async (num) =>
  readFile(path.join(__dirname, `test-input-${num}`), "utf-8");

const parseInput = (input, part2) => {
  const lines = input.split("\n");
  return lines;
};

const computeSimplified = (expression, advanced) => {
  if (!advanced) {
    let value = expression[0];
    for (let i = 1; i < expression.length; i += 2) {
      const op = expression[i];
      const v = expression[i + 1];
      if (op === "+") {
        value += v;
      } else if (op === "-") {
        value -= v;
      } else if (op === "*") {
        value *= v;
      } else if (op === "/") {
        value /= v;
      }
    }
    return value;
  } else {
    let e = [...expression];
    while (e.includes("+")) {
      const i = e.indexOf("+");
      e = [...e.slice(0, i - 1), e[i - 1] + e[i + 1], ...e.slice(i + 2)];
    }
    return computeSimplified(e, false);
  }
};

const _compute = (expression, advanced) => {
  const simplified = [];
  let pointer = 0;
  while (pointer < expression.length) {
    const c = expression[pointer];
    if (["+", "-", "*", "/"].includes(c)) {
      simplified.push(c);
    } else if (/^\d$/.test(c)) {
      simplified.push(parseInt(c, 10));
    } else if (c === "(") {
      const [result, l] = _compute(expression.slice(pointer + 1), advanced);
      simplified.push(result);
      pointer += l + 1;
    } else if (c === ")") {
      break;
    }
    pointer++;
  }
  return [computeSimplified(simplified, advanced), pointer];
};

const compute = (expression, advanced) => {
  const [result] = _compute(expression, advanced);
  return result;
};

const part1 = async () => {
  const input = await readInput();
  const expressions = parseInput(input);
  const values = expressions.map(compute);
  return values.reduce((a, b) => a + b, 0);
};

const part2 = async () => {
  const input = await readInput();
  const expressions = parseInput(input);
  const values = expressions.map((i) => {
    return compute(i, true);
  });
  return values.reduce((a, b) => a + b, 0);
};

part1().then(console.log).then(part2).then(console.log);
