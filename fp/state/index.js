const State = require("crocks/State");
const Pair = require("crocks/Pair");
const compose = require("crocks/helpers/compose");
const prop = require("crocks/Maybe/prop");
const option = require("crocks/pointfree/option");
const mapProps = require("crocks/helpers/mapProps");
const constant = require("crocks/combinators/constant");

// State s a
// (s -> (a, s))

// m :: State Number String
const m1 = State(s => Pair("value", s));
console.log(m1.runWith(42), m1.runWith(41).fst(), m1.runWith(40).snd());

const m2 = State(s => Pair(s + 5, s));
console.log(m2.runWith(40).fst(), m2.runWith(40).snd());

const m3 = State(s => Pair(s, s + 5));
console.log(m3.runWith(40).fst(), m3.runWith(40).snd());

const updateValue = x => State(s => Pair(s + x, s));
const updateState = x => State(s => Pair(s, s + x));
console.log(updateValue(5).runWith(40), updateState(5).runWith(40));

const getState = () => State(s => Pair(s, s));
const add = x => y => x + y;
console.log(getState().map(add(10)).runWith(32));

const pluralize = (single, plural) => num =>
  `${num} ${Math.abs(num) === 1 ? single : plural}`;

console.log(getState().map(pluralize("cactus", "cactii")).runWith(1));
console.log(getState().map(pluralize("cactus", "cactii")).runWith(2));
console.log(getState().map(add(10)).map(pluralize("cactus", "cactii")).runWith(1));
console.log(State.get().map(compose(pluralize("cactus", "cactii"), add(10))).runWith(1));

const burgers = { burgers: 4 };
console.log(State.get().map(prop("burger")).runWith(burgers));
console.log(State.get().map(prop("burgers")).runWith(burgers));
console.log(State.get().map(prop("burgers")).evalWith(burgers));

console.log(State.get(prop("burgers")).evalWith(burgers));
console.log(State.get(prop("burgers")).map(option(0)).evalWith(burgers));
console.log(State.get(prop("fries")).map(option(0)).evalWith(burgers));
console.log(State.get(prop("fries")).map(option(0)).execWith(burgers));

console.log(State.put("Grand Canyon").execWith("Evergreen"));

console.log(State.modify(mapProps({ bubbles: add(1) })).execWith({ bubbles: 41 }));

const addToResult = n => State.get(add(n));
const addToState = r => State.modify(add(1)).map(constant(r));

const compute = n => State.of(n).chain(addToResult).chain(addToState);

console.log(compute(10).runWith(2));

