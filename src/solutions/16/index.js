const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");
const readTestInput = async (num) =>
  readFile(path.join(__dirname, `test-input-${num}`), "utf-8");

const parseRules = (input) => {
  const lines = input.split("\n");
  return lines.map((line) => {
    const match = /^([\w\s]+): (\d+)-(\d+) or (\d+)-(\d+)$/.exec(line);
    return {
      name: match[1],
      ranges: [
        [parseInt(match[2], 10), parseInt(match[3], 10)],
        [parseInt(match[4], 10), parseInt(match[5], 10)],
      ],
    };
  });
};

const parseTicket = (input) => {
  const ticket = input.split("\n")[1];
  return ticket.split(",").map((x) => parseInt(x, 10));
};

const parseNearby = (input) => {
  const tickets = input.split("\n").slice(1);
  return tickets.map((ticket) => ticket.split(",").map((x) => parseInt(x, 10)));
};

const parseInput = (input) => {
  const parts = input.split("\n\n");
  const rules = parseRules(parts[0]);
  const ticket = parseTicket(parts[1]);
  const nearby = parseNearby(parts[2]);
  return { rules, ticket, nearby };
};

const part1 = async () => {
  const input = await readInput();
  const { rules, ticket, nearby } = parseInput(input);
  return _.sum(
    nearby.flatMap((t) =>
      t.filter((n) =>
        rules.every((rule) => rule.ranges.every(([x, y]) => x > n || y < n))
      )
    )
  );
};

const cartesian = (list) => {
  if (list.length === 1) {
    return list.map((l) => [l]);
  }
  return list[0].flatMap((n) =>
    cartesian(list.slice(1))
      .filter((l) => !l.includes(n))
      .map((l) => [n, ...l])
  );
};

const part2 = async () => {
  const input = await readInput();
  const { rules, ticket, nearby } = parseInput(input);
  const valid = nearby.filter((t) =>
    t.every((n) =>
      rules.some((rule) => rule.ranges.some(([x, y]) => x <= n && n <= y))
    )
  );
  const allValues = _.range(0, ticket.length).map((i) =>
    _.uniq(valid.map((t) => t[i]))
  );
  let possibleIndexes = allValues.map((possible) =>
    _.range(0, rules.length).filter((i) =>
      possible.every((p) => rules[i].ranges.some(([x, y]) => x <= p && p <= y))
    )
  );
  const mapping = {};
  while (possibleIndexes.some((x) => x.length > 0)) {
    const i = possibleIndexes.findIndex((x) => x.length === 1);
    if (i === -1) {
      throw new Error("Bad method");
    }
    const v = possibleIndexes[i][0];
    mapping[i] = v;
    possibleIndexes = possibleIndexes.map((x) => x.filter((n) => n !== v));
  }
  return ticket
    .filter((n, i) => /^departure /.test(rules[mapping[i]].name))
    .reduce((a, b) => a * b, 1);
};

part1().then(console.log).then(part2).then(console.log);
