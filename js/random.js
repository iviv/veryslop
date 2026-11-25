"use strict";

// ---- Randomness ----------------------------------------------------------

// Course drills use a seeded generator so every drill stays the same between visits.
function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(values, random = Math.random) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}

const pick = (values, random = Math.random) => values[Math.floor(random() * values.length)];
const repeatItems = (items, times) => Array.from({ length: times }, () => items).flat().join(" ");

// `count` drills, each a seeded sample of `size` items from `pool`, optionally shaped by `format`.
function sampledDrills(pool, count, size, seed, title, format = (items) => items.join(" ")) {
  const random = seededRandom(seed);
  return Array.from({ length: count }, (_, index) => ({
    title: title(index + 1),
    prompt: format(shuffle(pool, random).slice(0, size))
  }));
}

function shuffledBag(values) {
  let bag = [];
  return () => {
    if (bag.length === 0) bag = shuffle(values);
    return bag.pop();
  };
}
