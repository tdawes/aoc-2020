const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");

const parseInput = (input) => {
  const lines = input.split("\n");
  return lines.map((line) => {
    const chars = line.split("");
    const front = chars
      .slice(0, 7)
      .map((c) => (c === "B" ? 1 : 0))
      .join("");
    const back = chars
      .slice(7)
      .map((c) => (c === "R" ? 1 : 0))
      .join("");
    return {
      row: parseInt(front, 2),
      column: parseInt(back, 2),
    };
  });
};

const part1 = async () => {
  const input = await readInput();
  const seats = parseInput(input);
  return _.max(seats.map((seat) => seat.row * 8 + seat.column));
};

const part2 = async () => {
  const input = await readInput();
  const seats = parseInput(input);

  const rowRange = [
    _.min(seats.map((seat) => seat.row)),
    _.max(seats.map((seat) => seat.row)) + 1,
  ];
  const columnRange = [
    _.min(seats.map((seat) => seat.column)),
    _.max(seats.map((seat) => seat.column)) + 1,
  ];

  const firstFullRow = _.range(...rowRange).find((row) =>
    _.range(...columnRange).every((column) =>
      seats.some((seat) => seat.row === row && seat.column === column)
    )
  );

  const lastFullRow = _.findLast(_.range(...rowRange), (row) =>
    _.range(...columnRange).every((column) =>
      seats.some((seat) => seat.row === row && seat.column === column)
    )
  );

  for (let row of _.range(firstFullRow, lastFullRow + 1)) {
    for (let column of _.range(...columnRange)) {
      if (!seats.some((seat) => seat.column === column && seat.row === row)) {
        return 8 * row + column;
      }
    }
  }
};

part1().then(console.log).then(part2).then(console.log);
