// Source: http://www.clojure.net/2012/03/24/Continuation-monad/

function funcA(x: number): number {
  return x + 1;
}

function funcB(x: number): number {
  return x * 2;
}

function funcC(x: number): number {
  return x - 1;
}

function fn1(x: number): number {
  const a = funcA(x);
  const b = funcB(a);
  const c = funcC(b);

  return c;
}

function comp(...fns) {
  return v => fns.reverse().reduce((r, f) => f(r), v);
}

function pipe(...fns) {
  return v => fns.reduce((r, f) => f(r), v);
}

function B<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  return function(a: A): C {
    return f(g(a));
  };
}

const val = 10;

console.log(fn1(val));
console.log(comp(funcC, funcB, funcA)(val));
console.log(pipe(funcA, funcB, funcC)(val));

function funcB2(x: number, f: Function) {
  return f(funcB(x));
}

function fn2(x: number): number {
  const a = funcA(x);
  const c = funcB2(a, funcC);
  return c;
}

console.log(fn2(val));

function funcA2(x: number, f: Function): number {
  return f(funcA(x));
}

function contA(x: number): number {
  return funcB2(x, funcC);
}

function fn3(x: number): number {
  return funcA2(x, contA);
}

console.log(fn3(val));

function funcC2(x: number, f: Function) {
  return f(funcC(x));
}

function identity<T>(value: T): T {
  return value;
}

function contB(x: number): number {
  return funcC2(x, identity);
}

function contA2(x: number): number {
  return funcB2(x, contB);
}

function fn4(x: number): number {
  return funcA2(x, contA2);
}

console.log(fn4(val));

function fn5(x: number, f: Function) {
  return f(funcA2(x, contA2));
}

console.log(fn5(val, identity));

function fn6(x: number, f: Function) {
  const contB = x => funcC2(x, f);
  const contA = x => funcB2(x, contB);
  return funcA2(x, contA);
}

console.log(fn6(val, identity));

// --------

type Fn<A, B> = (x: A) => B;

type Continuation<A, B> = (f: Fn<A, B>) => B;

function contOf<A, B>(x: A): Continuation<A, B> {
  return f => f(x);
}

console.log(contOf(21)(identity));

function contMap<A, B, C>(mv: Continuation<A, B>, f: Fn<A, B>): Continuation<B, C> {
  return g => g(mv(f));
}

function step1(x: number): number {
  console.log("step1");
  return x + 5;
}

function step2(x: number): string {
  console.log("step2");
  return "the answer is " + x;
}

console.log("start");
const cont1 = contMap(contMap(contOf(7), step1), step2);
console.log("should not see step1 and step2 yet");
console.log("go");

console.log(cont1(identity));

function contChain(mv, mf) {
  return g => mv(x => mf(x)(g));
}

function chStep1(x) {
  console.log("ch step 1");
  return contOf(x + 11);
}

function chStep2(x) {
  console.log("ch step 2");
  return contOf("the answer is " + x);
}

const cont2 = contChain(contChain(contOf(7), chStep1), chStep2);
console.log("chain");
console.log(cont2(identity));

  /*
function contChain<A, B, C, D>(mv: Continuation<A, B>, mf: Fn<A, Continuation<C, D>>): Continuation<C, D> {
  return g => mv(x => mf(x))(g);
  return function(f) {
    return mv(x => mf(x)(f));
  };
}
  */

/*
function contfA(x: number) {
  return function(c: Function) {
    return funcA2(x, c);
  };
}

console.log(contChain(contOf(21), contfA)(identity));
*/

function fold(f) {
  return function(mv) {
    return mv(f);
  };
}

const ifold = fold(identity);

//console.log(ifold(contChain(contOf(21), contfA)));
console.log(ifold(contOf(42)));
