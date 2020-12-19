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

const parseRules = (input) => {
  const lines = input.split("\n");
  return lines.reduce((acc, line) => {
    const match = /^(\d+):((?:\s+(?:\d+|\||"\w+"))+)$/.exec(line);
    const [, key, rule] = match;
    return { ...acc, [key]: rule.split(" ").slice(1) };
  }, {});
};

const parseInput = (input) => {
  const [rules, messages] = input.split("\n\n");
  return {
    rules: parseRules(rules),
    messages: messages.split("\n"),
  };
};

const getParts = (rule) => {
  const parts = [];
  let current = [];
  for (let p of rule) {
    if (p === "|") {
      parts.push(current);
      current = [];
    } else {
      current.push(p);
    }
  }
  parts.push(current);
  return parts;
};

const createRule = (rules, rule, cache) => {
  if (rule.length === 1 && /^"\w+"$/.test(rule[0])) {
    const match = /^"(\w+)"$/.exec(rule[0]);
    return P.string(match[1]);
  } else {
    return P.seq(
      ...rule.map((part) => P.lazy(() => _parser(rules, part, cache)))
    );
  }
};

const _parser = (rules, key, cache) => {
  if (cache[key]) {
    return cache[key];
  }
  const rule = rules[key];
  const parts = getParts(rule);
  const parser = P.alt(...parts.map((part) => createRule(rules, part, cache)));

  cache[key] = parser;
  return parser;
};

const createParser = (rules, i) => _parser(rules, i, {});

const part1 = async () => {
  const input = await readInput();
  const { rules, messages } = parseInput(input);
  const parser = createParser(rules, "0");
  return messages.filter((message) => parser.parse(message).status).length;
};

const part2 = async () => {
  const input = await readInput();
  const { rules, messages } = parseInput(input);
  rules["8"] = ["42", "8", "|", "42"];
  rules["11"] = ["42", "11", "31", "|", "42", "31"];
  const p1 = createParser(rules, "8");
  const p2 = createParser(rules, "11");
  return messages.filter((message) => {
    return _.range(0, message.length).some((i) => {
      return (
        p1.parse(message.slice(0, i)).status &&
        p2.parse(message.slice(i)).status
      );
    });
  }).length;
};

part1().then(console.log).then(part2).then(console.log);
