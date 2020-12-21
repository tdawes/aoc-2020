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

const parseInput = (input) => {
  const recipes = input.split("\n");
  const parsed = recipes.map((recipe) => {
    const [, i, a] = /^(.*) \(contains (.*)\)$/.exec(recipe);
    const ingredients = i.split(" ");
    const allergens = a.split(", ");
    return { ingredients, allergens };
  });
  return parsed;
};

const part1 = async () => {
  const input = await readInput();
  const foods = parseInput(input);
  const allAllergens = _.uniq(foods.flatMap(({ allergens }) => allergens));
  const allIngredients = _.uniq(
    foods.flatMap(({ ingredients }) => ingredients)
  );
  const possibleSources = allAllergens.reduce(
    (acc, allergen) => ({
      ...acc,
      [allergen]: _.intersection(
        ...foods
          .filter(({ allergens }) => allergens.includes(allergen))
          .map(({ ingredients }) => ingredients)
      ),
    }),
    {}
  );

  const sources = {};
  while (Object.keys(sources).length < allAllergens.length) {
    const next = allAllergens.find(
      (allergen) => possibleSources[allergen].length === 1
    );
    sources[next] = possibleSources[next][0];
    Object.keys(possibleSources).forEach((a) => {
      possibleSources[a] = possibleSources[a].filter(
        (i) => i !== sources[next]
      );
    });
  }
  const safeIngredients = _.uniq(
    foods.flatMap(({ ingredients }) =>
      ingredients.filter(
        (ingredient) => !Object.values(sources).includes(ingredient)
      )
    )
  );
  return _.sum(
    foods.map(
      ({ ingredients }) =>
        ingredients.filter((ingredient) => safeIngredients.includes(ingredient))
          .length
    )
  );
};

const part2 = async () => {
  const input = await readInput();
  const foods = parseInput(input);
  const allAllergens = _.uniq(foods.flatMap(({ allergens }) => allergens));
  const allIngredients = _.uniq(
    foods.flatMap(({ ingredients }) => ingredients)
  );
  const possibleSources = allAllergens.reduce(
    (acc, allergen) => ({
      ...acc,
      [allergen]: _.intersection(
        ...foods
          .filter(({ allergens }) => allergens.includes(allergen))
          .map(({ ingredients }) => ingredients)
      ),
    }),
    {}
  );

  const sources = {};
  while (Object.keys(sources).length < allAllergens.length) {
    const next = allAllergens.find(
      (allergen) => possibleSources[allergen].length === 1
    );
    sources[next] = possibleSources[next][0];
    Object.keys(possibleSources).forEach((a) => {
      possibleSources[a] = possibleSources[a].filter(
        (i) => i !== sources[next]
      );
    });
  }
  const badIngredients = _.uniq(
    foods.flatMap(({ ingredients }) =>
      ingredients.filter((ingredient) =>
        Object.values(sources).includes(ingredient)
      )
    )
  );
  return _.sortBy(badIngredients, (i) =>
    Object.keys(sources).find((a) => sources[a] === i)
  ).join(",");
};

part1().then(console.log).then(part2).then(console.log);
