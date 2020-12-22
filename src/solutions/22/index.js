const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const _ = require("lodash");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");
const readTestInput = async (num) =>
  readFile(path.join(__dirname, `test-input-${num}`), "utf-8");

const parsePlayer = (lines) =>
  lines
    .split("\n")
    .slice(1)
    .map((x) => parseInt(x, 10));

const parseInput = (input) => {
  const players = input.split("\n\n");
  return {
    player0: parsePlayer(players[0]),
    player1: parsePlayer(players[1]),
  };
};

const score = (cards) => {
  let score = 0;
  for (let i = 0; i < cards.length; i++) {
    score += cards[i] * (cards.length - i);
  }
  return score;
};

const playCombat = (player0, player1) => {
  while (player0.length > 0 && player1.length > 0) {
    const first = player0.shift();
    const second = player1.shift();
    if (first > second) {
      player0.push(first, second);
    } else {
      player1.push(second, first);
    }
  }
  const winner = player0.length > 0 ? 0 : 1;
  return { winner, score: score(winner === 0 ? player0 : player1) };
};

const key = (player0, player1) =>
  [player0.join(","), player1.join(",")].join(":");

const playRecursiveCombat = (player0, player1) => {
  let previous = new Set();
  while (player0.length > 0 && player1.length > 0) {
    if (previous.has(key(player0, player1))) {
      return { winner: 0, score: score(player0) };
    }
    previous.add(key(player0, player1));
    const first = player0.shift();
    const second = player1.shift();
    let winner = null;
    if (player0.length >= first && player1.length >= second) {
      winner = playRecursiveCombat(
        player0.slice(0, first),
        player1.slice(0, second)
      ).winner;
    } else {
      winner = first > second ? 0 : 1;
    }
    if (winner === 0) {
      player0.push(first, second);
    } else {
      player1.push(second, first);
    }
  }
  const winner = player0.length > 0 ? 0 : 1;
  return { winner, score: score(winner === 0 ? player0 : player1) };
};

const part1 = async () => {
  const input = await readInput();
  const { player0, player1 } = parseInput(input);
  return playCombat(player0, player1).score;
};

const part2 = async () => {
  const input = await readInput();
  const { player0, player1 } = parseInput(input);
  return playRecursiveCombat(player0, player1).score;
};

part1().then(console.log).then(part2).then(console.log);
