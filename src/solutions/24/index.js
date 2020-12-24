const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");
const { keyBy } = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");
const readTestInput = async (num) =>
  readFile(path.join(__dirname, `test-input-${num}`), "utf-8");

const parseInput = (input) =>
  input.split("\n").map((line) => {
    const chars = line.split("");
    const directions = [];
    let i = 0;
    while (i < chars.length) {
      if (chars[i] === "n" || chars[i] === "s") {
        directions.push(`${chars[i]}${chars[i + 1]}`);
        i += 2;
      } else {
        directions.push(chars[i]);
        i += 1;
      }
    }
    return directions;
  });

const key = ({ x, y, z }) => `${x}:${y}:${z}`;
const x = (key) => parseInt(key.split(":")[0], 10);
const y = (key) => parseInt(key.split(":")[1], 10);
const z = (key) => parseInt(key.split(":")[2], 10);

const getNeighbours = (position) =>
  [
    [0, 1, 1],
    [-1, 0, 1],
    [-1, -1, 0],
    [0, -1, -1],
    [1, 0, -1],
    [1, 1, 0],
  ].map(([dx, dy, dz]) => ({
    x: position.x + dx,
    y: position.y + dy,
    z: position.z + dz,
  }));

const part1 = async () => {
  const input = await readInput();
  const directions = parseInput(input);
  const tiles = {};
  for (let direction of directions) {
    let position = { x: 0, y: 0, z: 0 };
    for (let d of direction) {
      if (d === "ne") {
        position = {
          x: position.x,
          y: position.y + 1,
          z: position.z + 1,
        };
      } else if (d === "nw") {
        position = {
          x: position.x - 1,
          y: position.y,
          z: position.z + 1,
        };
      } else if (d === "w") {
        position = {
          x: position.x - 1,
          y: position.y - 1,
          z: position.z,
        };
      } else if (d === "sw") {
        position = {
          x: position.x,
          y: position.y - 1,
          z: position.z - 1,
        };
      } else if (d === "se") {
        position = {
          x: position.x + 1,
          y: position.y,
          z: position.z - 1,
        };
      } else if (d === "e") {
        position = {
          x: position.x + 1,
          y: position.y + 1,
          z: position.z,
        };
      }
    }
    tiles[key(position)] = !tiles[key(position)];
  }
  return Object.values(tiles).filter((x) => !!x).length;
};

const part2 = async () => {
  const input = await readInput();
  const directions = parseInput(input);
  let tiles = {};
  for (let direction of directions) {
    let position = { x: 0, y: 0, z: 0 };
    for (let d of direction) {
      if (d === "ne") {
        position = {
          x: position.x,
          y: position.y + 1,
          z: position.z + 1,
        };
      } else if (d === "nw") {
        position = {
          x: position.x - 1,
          y: position.y,
          z: position.z + 1,
        };
      } else if (d === "w") {
        position = {
          x: position.x - 1,
          y: position.y - 1,
          z: position.z,
        };
      } else if (d === "sw") {
        position = {
          x: position.x,
          y: position.y - 1,
          z: position.z - 1,
        };
      } else if (d === "se") {
        position = {
          x: position.x + 1,
          y: position.y,
          z: position.z - 1,
        };
      } else if (d === "e") {
        position = {
          x: position.x + 1,
          y: position.y + 1,
          z: position.z,
        };
      }
    }
    tiles[key(position)] = !tiles[key(position)];
  }

  for (let t = 0; t < 100; t++) {
    const next = {};
    const minX = _.min(Object.keys(tiles).map(x));
    const maxX = _.max(Object.keys(tiles).map(x));
    const minY = _.min(Object.keys(tiles).map(y));
    const maxY = _.max(Object.keys(tiles).map(y));
    const minZ = _.min(Object.keys(tiles).map(z));
    const maxZ = _.max(Object.keys(tiles).map(z));

    _.uniqBy(
      Object.keys(tiles).flatMap((key) =>
        getNeighbours({ x: x(key), y: y(key), z: z(key) })
      ),
      key
    ).forEach((position) => {
      const count = getNeighbours(position).filter(
        (neighbour) => tiles[key(neighbour)]
      ).length;
      if (
        (tiles[key(position)] && (count === 1 || count === 2)) ||
        (!tiles[key(position)] && count === 2)
      ) {
        next[key(position)] = true;
      }
    });
    tiles = next;
  }

  return Object.keys(tiles).filter((x) => !!x).length;
};

part1().then(console.log).then(part2).then(console.log);
