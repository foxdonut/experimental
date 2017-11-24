const timeIt = (desc, fn) => {
  console.time(desc);
  const result = fn();
  if (result.length) {
    const max = result.length > 10 ? 10 : result.length;
    const slice = result.slice(0, max);
    console.log(JSON.stringify(slice));
  }
  console.timeEnd(desc);
  console.log("--------");
};

timeIt("test", x => x + 1);

const createArr = n => {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(i + 1);
  }
  return arr;
};

const arrMil = createArr(1e6);

const decr = x => x - 1;
const triple = x => x * 3;
const isEven = x => x % 2 === 0;

timeIt("map mil", () => arrMil.map(decr));
timeIt("filter mil", () => arrMil.filter(isEven));
timeIt("map filter mil", () => arrMil.map(decr).filter(isEven));
timeIt("map map filter mil", () =>
  arrMil.map(decr).map(triple).filter(isEven));

const map1 = (fn, coll) => coll.reduce((acc, next) => {
  acc.push(fn(next));
  return acc;
}, []);

timeIt("map as reduce", () => map1(decr, arrMil));

const filter1 = (pred, coll) => coll.reduce((acc, next) => {
  if (pred(next)) {
    acc.push(next);
  }
  return acc;
}, []);

timeIt("filter as reduce", () => filter1(isEven, arrMil));
timeIt("map map filter as reduce", () =>
  filter1(isEven, map1(triple, map1(decr, arrMil))));

const map2 = fn => (acc, next) => {
  acc.push(fn(next));
  return acc;
};

const filter2 = pred => (acc, next) => {
  if (pred(next)) {
    acc.push(next);
  }
  return acc;
};

timeIt("map map filter reducers", () => arrMil.
  reduce(map2(decr), []).reduce(map2(triple), []).reduce(filter2(isEven), []));

const map3 = fn => reducer => (acc, next) => reducer(acc, fn(next));
const filter3 = pred => reducer => (acc, next) => pred(next) ? reducer(acc, next) : acc;

const push = (acc, next) => {
  acc.push(next);
  return acc;
};

timeIt("map map filter transducers", () => arrMil.
  reduce(map3(decr)(push), []).reduce(map3(triple)(push), []).reduce(filter3(isEven)(push), []));

const compose2 = (f, g) => x => f(g(x));
const compose3 = (f, g, h) => x => f(g(h(x)));

timeIt("map map filter transducers compose", () => arrMil.
  reduce(compose3(map3(decr), map3(triple), filter3(isEven))(push), []));

/*
map3(decr) => reducer => (acc, next) => ...
filter3(isEven) => reducer => (acc, next) => ...
compose(f, g) => x => f(g(x));
compose(reducer => (acc, next), reducer => (acc, next)) => reducer =>
*/
