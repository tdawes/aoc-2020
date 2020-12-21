const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");
const { keyBy, takeRightWhile, valuesIn } = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");
const readTestInput = async (num) =>
  readFile(path.join(__dirname, `test-input-${num}`), "utf-8");

const parseInput = (input) => {
  const tiles = input.split("\n\n");
  return tiles.map((tile) => {
    const lines = tile.split("\n");
    const header = lines.shift();
    const [, idStr] = /^Tile (\d+):$/.exec(header);
    const id = parseInt(idStr, 10);
    const map = lines.map((row) => row.split("").map((c) => c === "#"));
    return {
      id,
      map: map
        .slice(1, map.length - 1)
        .map((row) => row.slice(1, row.length - 1)),
      ...calculateEdges(map),
    };
  });
};

const hash = (row) => {
  const normal = parseInt(row.map((c) => (c ? 1 : 0)).join(""), 2);
  const flipped = parseInt(_.reverse(row.map((c) => (c ? 1 : 0))).join(""), 2);
  return [normal, flipped];
};

const calculateEdges = (map) => {
  const [top, topFlipped] = hash(map[0]);
  const [right, rightFlipped] = hash(map.map((r) => r[r.length - 1]));
  const [bottomFlipped, bottom] = hash(map[map.length - 1]);
  const [leftFlipped, left] = hash(map.map((r) => r[0]));
  return {
    edges: {
      left,
      right,
      top,
      bottom,
    },
    flipped: {
      top: topFlipped,
      left: leftFlipped,
      right: rightFlipped,
      bottom: bottomFlipped,
    },
  };
};

const key = ({ x, y }) => `(${x},${y})`;

const flip = (tile) => ({
  id: tile.id,
  map: tile.map.map((row) => _.reverse([...row])),
  edges: {
    top: tile.flipped.top,
    left: tile.flipped.right,
    bottom: tile.flipped.bottom,
    right: tile.flipped.left,
  },
  flipped: {
    top: tile.edges.top,
    left: tile.edges.right,
    bottom: tile.edges.bottom,
    right: tile.edges.left,
  },
});

const rotateMap = (map) =>
  _.range(0, map[0].length).map((column) =>
    map.map((row) => row[row.length - 1 - column])
  );

const rotateLeft = (tile) => ({
  id: tile.id,
  map: rotateMap(tile.map),
  edges: {
    top: tile.edges.right,
    right: tile.edges.bottom,
    bottom: tile.edges.left,
    left: tile.edges.top,
  },
  flipped: {
    top: tile.flipped.right,
    right: tile.flipped.bottom,
    bottom: tile.flipped.left,
    left: tile.flipped.top,
  },
});

const getOrientations = (tile) => [
  tile,
  rotateLeft(tile),
  rotateLeft(rotateLeft(tile)),
  rotateLeft(rotateLeft(rotateLeft(tile))),
  flip(tile),
  rotateLeft(flip(tile)),
  rotateLeft(rotateLeft(flip(tile))),
  rotateLeft(rotateLeft(rotateLeft(flip(tile)))),
];

const fitTile = (tile, position, map) => {
  for (let orientation of getOrientations(tile)) {
    const left = map[key({ x: position.x - 1, y: position.y })];
    const right = map[key({ x: position.x + 1, y: position.y })];
    const top = map[key({ x: position.x, y: position.y - 1 })];
    const bottom = map[key({ x: position.x, y: position.y + 1 })];
    if (left != null && orientation.edges.left !== left.flipped.right) {
      continue;
    }
    if (right != null && orientation.edges.right !== right.flipped.left) {
      continue;
    }
    if (top != null && orientation.edges.top !== top.flipped.bottom) {
      continue;
    }
    if (bottom != null && orientation.edges.bottom !== bottom.flipped.top) {
      continue;
    }
    return orientation;
  }
};

const printMap = (map) => {
  const keys = Object.keys(map);
  const coords = keys.map((key) => {
    const match = /^\((-?\d+),(-?\d+)\)$/.exec(key);
    const x = parseInt(match[1], 10);
    const y = parseInt(match[2], 10);
    return { x, y };
  });
  const minX = _.min(coords.map(({ x }) => x));
  const maxX = _.max(coords.map(({ x }) => x));
  const minY = _.min(coords.map(({ y }) => y));
  const maxY = _.max(coords.map(({ y }) => y));

  let builder = [];
  for (let j = minY; j <= maxY; j++) {
    const topBorder = [];
    const top = [];
    const middle = _.range(0, 4).map(() => []);
    const bottom = [];
    const bottomBorder = [];
    for (let i = minX; i <= maxX; i++) {
      const cell = map[key({ x: i, y: j })];
      topBorder.push(` /${_.repeat("-", 6)}\\ `);
      top.push(`/  ${_.pad(cell?.edges?.top, 4)}  \\`);
      _.range(0, 4).forEach((i) => {
        middle[i].push(
          `|${_.pad(
            cell?.flipped?.left?.toString()?.charAt(i) ?? " ",
            1
          )}${_.repeat(" ", 1)}${_.pad(i === 1 ? cell?.id : null, 4)}${_.repeat(
            " ",
            1
          )}${_.pad(cell?.edges?.right?.toString()?.charAt(i) ?? " ", 1)}|`
        );
      });
      bottom.push(`\\  ${_.pad(cell?.flipped?.bottom, 4)}  /`);
      bottomBorder.push(` \\${_.repeat("-", 6)}/ `);
    }
    builder.push(
      topBorder.join(""),
      top.join(""),
      ...middle.map((row) => row.join("")),
      bottom.join(""),
      bottomBorder.join("")
    );
  }

  return builder.join("\n");
};

const part1 = async () => {
  const input = await readInput();
  const tiles = parseInput(input);
  const available = [{ x: 0, y: 0 }];
  const map = {};
  while (tiles.length > 0) {
    let found = false;
    for (let j = 0; j < available.length; j++) {
      const position = available[j];
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const oriented = fitTile(tile, position, map);
        if (oriented) {
          tiles.splice(i, 1);
          map[key(position)] = oriented;
          available.splice(j, 1);
          [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1],
          ].forEach(([dx, dy]) => {
            if (
              map[key({ x: position.x + dx, y: position.y + dy })] == null &&
              !available.some(
                ({ x, y }) => x === position.x + dx && y === position.y + dy
              )
            ) {
              available.push({ x: position.x + dx, y: position.y + dy });
            }
          });
          found = true;
          break;
        }
      }
      if (found) {
        break;
      }
    }
  }
  const keys = Object.keys(map).map((key) => {
    const match = /^\((-?\d+),(-?\d+)\)$/.exec(key);
    return {
      x: parseInt(match[1], 10),
      y: parseInt(match[2], 10),
    };
  });
  const minX = _.min(keys.map(({ x }) => x));
  const maxX = _.max(keys.map(({ x }) => x));
  const minY = _.min(keys.map(({ y }) => y));
  const maxY = _.max(keys.map(({ y }) => y));
  return (
    map[key({ x: minX, y: minY })].id *
    map[key({ x: minX, y: maxY })].id *
    map[key({ x: maxX, y: maxY })].id *
    map[key({ x: maxX, y: minY })].id
  );
};

const compare = (map, seaMonster) => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (seaMonster[i][j] === "#" && map[i][j] !== "#") {
        return false;
      }
    }
  }
  return true;
};
const seaMonster = [
  "                  # ".split(""),
  "#    ##    ##    ###".split(""),
  " #  #  #  #  #  #   ".split(""),
];

const countNonSeamonsters = (map) => {
  const count = map.map((row) => row.map((c) => c === "#"));
  for (let y = 0; y < map.length - seaMonster.length - 1; y++) {
    for (let x = 0; x < map[y].length - seaMonster[0].length - 1; x++) {
      if (
        compare(
          map
            .slice(y, y + seaMonster.length)
            .map((row) => row.slice(x, x + seaMonster[0].length)),
          seaMonster
        )
      ) {
        for (let i = 0; i < seaMonster.length; i++) {
          for (let j = 0; j < seaMonster[i].length; j++) {
            if (seaMonster[i][j] === "#") {
              count[y + i][x + j] = false;
            }
          }
        }
      }
    }
  }
  return _.sum(count.map((row) => row.filter((x) => !!x).length));
};

const hasSeaMonsters = (map) => {
  for (let y = 0; y < map.length - seaMonster.length; y++) {
    for (let x = 0; x < map[y].length - seaMonster[0].length; x++) {
      if (
        compare(
          map
            .slice(y, y + seaMonster.length)
            .map((row) => row.slice(x, x + seaMonster[0].length)),
          seaMonster
        )
      ) {
        return true;
      }
    }
  }
  return false;
};

const part2 = async () => {
  const input = await readInput();
  const tiles = parseInput(input);
  const available = [{ x: 0, y: 0 }];
  const map = {};
  while (tiles.length > 0) {
    let found = false;
    for (let j = 0; j < available.length; j++) {
      const position = available[j];
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const oriented = fitTile(tile, position, map);
        if (oriented) {
          tiles.splice(i, 1);
          map[key(position)] = oriented;
          available.splice(j, 1);
          [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1],
          ].forEach(([dx, dy]) => {
            if (
              map[key({ x: position.x + dx, y: position.y + dy })] == null &&
              !available.some(
                ({ x, y }) => x === position.x + dx && y === position.y + dy
              )
            ) {
              available.push({ x: position.x + dx, y: position.y + dy });
            }
          });
          found = true;
          break;
        }
      }
      if (found) {
        break;
      }
    }
  }
  const keys = Object.keys(map).map((key) => {
    const match = /^\((-?\d+),(-?\d+)\)$/.exec(key);
    return {
      x: parseInt(match[1], 10),
      y: parseInt(match[2], 10),
    };
  });
  const minX = _.min(keys.map(({ x }) => x));
  const maxX = _.max(keys.map(({ x }) => x));
  const minY = _.min(keys.map(({ y }) => y));
  const maxY = _.max(keys.map(({ y }) => y));

  const grid = [];
  for (let y = minY; y <= maxY; y++) {
    const newRows = _.range(0, 8).map(() => []);
    for (let x = minX; x <= maxX; x++) {
      _.range(0, 8).forEach((i) => {
        const newRow = map[key({ x, y })].map[i].map((c) => (c ? "#" : "."));
        if (i === 3) {
          newRow.splice(3, 4, _.pad(map[key({ x, y })].id, 4));
        }
        newRows[i].push(...newRow);
      });
    }
    grid.push(...newRows);
  }

  for (let orientation of getOrientations({
    id: null,
    map: grid,
    edges: {},
    flipped: {},
  })) {
    const orientedMap = orientation.map;
    if (hasSeaMonsters(orientedMap)) {
      return countNonSeamonsters(orientedMap);
    }
  }
  return 0;
};

part1().then(console.log).then(part2).then(console.log);
