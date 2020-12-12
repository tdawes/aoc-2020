const fs = require("fs");
const { promisify } = require("util");
const path = require("path");

const readFile = promisify(fs.readFile);

const readInput = async () => readFile(path.join(__dirname, "input"), "utf-8");

const parseInput = (input) => {
  const parts = input.split("\n\n");
  return parts.map((part) => {
    const bits = part.split(/\s/);
    return bits.reduce((acc, data) => {
      const [first, last] = data.split(":");
      return { ...acc, [first]: last };
    }, {});
  });
};

const fields = {
  byr: (f) =>
    /^\d{4}$/.test(f) && parseInt(f, 10) >= 1920 && parseInt(f, 10) <= 2002,
  iyr: (f) =>
    /^\d{4}$/.test(f) && parseInt(f, 10) >= 2010 && parseInt(f, 10) <= 2020,
  eyr: (f) =>
    /^\d{4}$/.test(f) && parseInt(f, 10) >= 2020 && parseInt(f, 10) <= 2030,
  hgt: (f) => {
    const match = /^(\d+)(cm|in)$/.exec(f);
    if (match == null) {
      return false;
    }
    const height = parseInt(match[1], 10);
    const unit = match[2];
    if (unit === "cm") {
      return 150 <= height && height <= 193;
    } else {
      return 59 <= height && height <= 79;
    }
  },
  hcl: (f) => /^#[0-9a-f]{6}$/.test(f),
  ecl: (f) => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(f),
  pid: (f) => /^\d{9}$/.test(f),
  cid: (f) => true,
};

const part1 = async () => {
  const input = await readInput();
  const passports = parseInput(input);
  return passports.filter((passport) =>
    Object.keys(fields)
      .filter((field) => field !== "cid")
      .every((field) => passport[field] != null)
  ).length;
};

const part2 = async () => {
  const input = await readInput();
  const passports = parseInput(input);
  return passports.filter((passport) =>
    Object.keys(fields)
      .filter((key) => key !== "cid")
      .every(
        (field) => passport[field] != null && fields[field](passport[field])
      )
  ).length;
};

part1().then(console.log).then(part2).then(console.log);
