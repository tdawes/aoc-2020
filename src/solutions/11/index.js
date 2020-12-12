const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");
const readTestInput = async (num) =>
  readFile(path.join(__dirname, `test-input-${num}`), "utf-8");

const Seat = {
  FLOOR: 0,
  EMPTY: 1,
  OCCUPIED: 2,
};

const parseInput = (input) => {
  const lines = input.split("\n");
  return lines.map((line) =>
    line.split("").map((c) => {
      if (c === ".") {
        return Seat.FLOOR;
      } else if (c === "L") {
        return Seat.EMPTY;
      } else {
        return Seat.OCCUPIED;
      }
    })
  );
};

const getNeighbours = (seats, i, j) => {
  return _.range(Math.max(0, j - 1), Math.min(seats.length, j + 2))
    .flatMap((y) =>
      _.range(Math.max(0, i - 1), Math.min(seats[y].length, i + 2)).map((x) => [
        x,
        y,
      ])
    )
    .filter(([x, y]) => x !== i || y !== j);
};

const getVisibleNeighbours = (seats, i, j) => {
  const directions = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ];
  return directions
    .map(([dx, dy]) => {
      let [x, y] = [i + dx, j + dy];
      while (0 <= y && y < seats.length && 0 <= x && x < seats[y].length) {
        if (seats[y][x] !== Seat.FLOOR) {
          return [x, y];
        }
        [x, y] = [x + dx, y + dy];
      }
      return null;
    })
    .filter((c) => c != null);
};

const part1 = async () => {
  const input = await readInput();
  let seats = parseInput(input);

  while (true) {
    let changed = false;

    const next = seats.map((row, y) =>
      row.map((seat, x) => {
        if (seat === Seat.FLOOR) {
          return seat;
        }
        const neighbours = getNeighbours(seats, x, y);
        const count = neighbours.filter(
          ([i, j]) => seats[j][i] === Seat.OCCUPIED
        ).length;
        if (seat === Seat.EMPTY && count === 0) {
          changed = true;
          return Seat.OCCUPIED;
        } else if (seat === Seat.OCCUPIED && count >= 4) {
          changed = true;
          return Seat.EMPTY;
        }
        return seat;
      })
    );

    if (!changed) {
      break;
    }
    seats = next;
  }

  return _.sum(
    seats.map((row) => row.filter((s) => s === Seat.OCCUPIED).length)
  );
};

const part2 = async () => {
  const input = await readInput();
  let seats = parseInput(input);

  while (true) {
    let changed = false;

    const next = seats.map((row, y) =>
      row.map((seat, x) => {
        if (seat === Seat.FLOOR) {
          return seat;
        }
        const neighbours = getVisibleNeighbours(seats, x, y);
        const count = neighbours.filter(
          ([i, j]) => seats[j][i] === Seat.OCCUPIED
        ).length;
        if (seat === Seat.EMPTY && count === 0) {
          changed = true;
          return Seat.OCCUPIED;
        } else if (seat === Seat.OCCUPIED && count >= 5) {
          changed = true;
          return Seat.EMPTY;
        }
        return seat;
      })
    );

    if (!changed) {
      break;
    }
    seats = next;
  }

  return _.sum(
    seats.map((row) => row.filter((s) => s === Seat.OCCUPIED).length)
  );
};

part1().then(console.log).then(part2).then(console.log);
