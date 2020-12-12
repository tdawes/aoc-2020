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
  return lines.map((x) => {
    const match = /^([NESWLRF])(\d+)$/.exec(x);
    const command = match[1];
    const amount = parseInt(match[2], 10);
    return {
      command,
      amount,
    };
  });
};

const movePart1 = ({ command, amount }, { position, direction }) => {
  if (command === "N") {
    return {
      position: {
        x: position.x,
        y: position.y + amount,
      },
      direction,
    };
  } else if (command === "E") {
    return {
      position: {
        x: position.x + amount,
        y: position.y,
      },
      direction,
    };
  } else if (command === "S") {
    return {
      position: {
        x: position.x,
        y: position.y - amount,
      },
      direction,
    };
  } else if (command === "W") {
    return {
      position: {
        x: position.x - amount,
        y: position.y,
      },
      direction,
    };
  } else if (command === "L") {
    while (amount > 0) {
      direction = {
        x: -direction.y,
        y: direction.x,
      };
      amount -= 90;
    }
    return {
      position,
      direction,
    };
  } else if (command === "R") {
    while (amount > 0) {
      direction = {
        x: direction.y,
        y: -direction.x,
      };
      amount -= 90;
    }
    return {
      position,
      direction,
    };
  } else if (command === "F") {
    return {
      position: {
        x: position.x + amount * direction.x,
        y: position.y + amount * direction.y,
      },
      direction,
    };
  }
};

const movePart2 = ({ command, amount }, { position, direction, waypoint }) => {
  if (command === "N") {
    return {
      position,
      waypoint: {
        x: waypoint.x,
        y: waypoint.y + amount,
      },
    };
  } else if (command === "E") {
    return {
      position,
      waypoint: {
        x: waypoint.x + amount,
        y: waypoint.y,
      },
    };
  } else if (command === "S") {
    return {
      position,
      waypoint: {
        x: waypoint.x,
        y: waypoint.y - amount,
      },
    };
  } else if (command === "W") {
    return {
      position,
      waypoint: {
        x: waypoint.x - amount,
        y: waypoint.y,
      },
    };
  } else if (command === "L") {
    while (amount > 0) {
      waypoint = {
        x: -waypoint.y,
        y: waypoint.x,
      };
      amount -= 90;
    }
    return {
      position,
      waypoint,
    };
  } else if (command === "R") {
    while (amount > 0) {
      waypoint = {
        x: waypoint.y,
        y: -waypoint.x,
      };
      amount -= 90;
    }
    return {
      position,
      waypoint,
    };
  } else if (command === "F") {
    return {
      position: {
        x: position.x + amount * waypoint.x,
        y: position.y + amount * waypoint.y,
      },
      direction,
      waypoint,
    };
  }
};

const part1 = async () => {
  const input = await readInput();
  const commands = parseInput(input);

  let current = {
    position: { x: 0, y: 0 },
    direction: { x: 1, y: 0 },
  };

  for (let command of commands) {
    current = movePart1(command, current);
  }

  return Math.abs(current.position.x) + Math.abs(current.position.y);
};

const part2 = async () => {
  const input = await readInput();
  const commands = parseInput(input);

  let current = {
    position: { x: 0, y: 0 },
    direction: { x: 1, y: 0 },
    waypoint: { x: 10, y: 1 },
  };

  for (let command of commands) {
    current = movePart2(command, current);
  }

  return Math.abs(current.position.x) + Math.abs(current.position.y);
};

part1().then(console.log).then(part2).then(console.log);
