function trimAndLower(text: string | null | undefined) {
  if (typeof text === "string") {
    return text.trim().toLowerCase();
  }
  return text;
}

console.log(trimAndLower(" LearnTypeScript.io "));
console.log(trimAndLower(null));
console.log(trimAndLower(undefined));

// HTMLElement | null
//const element1 = document.getElementById("app");

// HTMLElement
//const element2 = document.getElementById("app")!;

function trimAndLower2(text: string | null | undefined) {
  if (!text) {
    return text;
  }
  return text.trim().toLowerCase();
}

const numbers = [0, 1, 2, [3, 4], 5, [6], [7], 8, [9]];

function isFlat<T>(array: (T | T[])[]): array is T[] {
  return !array.some(Array.isArray);
}

if (isFlat(numbers)) {
  numbers;
}
else {
  numbers;
}

function flatten<T>(array: (T | T[])[]): T[] {
  const flattened: T[] = [];
  for (const element of array) {
    if (Array.isArray(element)) {
      flattened.push(...element);
    }
    else {
      flattened.push(element);
    }
  }
  return flattened;
}

console.log(flatten(numbers));

interface User {
  readonly id: number;
  name: string;
}

const user: User = {
  id: 42,
  name: "Marius"
};

// Prevented!
//user.id++;
user.name += " Schulz";

const weekend: ReadonlyArray<string> = [ "Saturday", "Sunday" ];
// Prevented!
//weekend[0] = "Monday";
//weekend.length = 0;

let obj: object;
// cannot assign primitive type
//obj = 42;
//obj = Symbol();
obj = {};
obj = [];
obj = Math.random;

//Object.create(42);

let obj2: Object;
obj2 = {};
obj2.toString();

const obj3 = {};
obj3;

const obj4: { [key: string]: any } = {};
obj4.duck = "quack";

// Adding a ShirtSize without addressing it in printShirtSize
// will cause a compile-time error.
enum ShirtSize {
  S,
  M,
  L
};

function assertNever(value: never): never {
  throw new Error("Unexpected value: " + value);
}

function printShirtSize(size: ShirtSize) {
  switch(size) {
    case ShirtSize.S: return "small";
    case ShirtSize.M: return "small";
    case ShirtSize.L: return "small";
    default: return assertNever(size);
  }
}

/**
 * Reverses the given string.
 * @param str the string to reverse
 */
function reverse(str: string): string;

/**
 * Reverses the given array.
 * @param arr the array to reverse.
 */
function reverse<T>(arr: T[]): T[];

function reverse<T>(strOrArr: string | T[]) {
  return typeof strOrArr === "string"
    ? strOrArr.split("").reverse().join("")
    : strOrArr.slice().reverse();
}

const reversedStr = reverse("abcde");
console.log(reversedStr);

const reversedArr = reverse(["a", "duck", "says", "quack"]);
console.log(reversedArr);

const enum MediaTypes {
  JSON = "application/json"
}

let autocomplete: "on" | "off" = "on";

enum Protocols {
  HTTP,
  HTTPS,
  FTP
}

type HypertextProtocol = Protocols.HTTP | Protocols.HTTPS;

/*
type Result = {
  success: boolean;
  value?: number;
  error?: string;
};
*/

type Result<T> =
  | { success: true, value: T }
  | { success: false, error: string };

function tryParseInt(text: string): Result<number> {
  if (/^-?\d+$/.test(text)) {
    return {
      success: true,
      value: parseInt(text, 10)
    };
  }
  return {
    success: false,
    error: "Invalid number format"
  };
}

console.log(tryParseInt("42"));
console.log(tryParseInt("42a"));

function fold<T>(result: Result<T>, onSuccess: ((T) => (T | string)), onFailure: ((string) => (T | string))): T | string {
  if (result.success) {
    return onSuccess(result.value);
  }
  else {
    return onFailure(result.error);
  }
}

function f<T>(value: T): string {
  return "You got " + value;
}

function g(error: string): string {
  return "You have failed me for the last time";
}

console.log(fold(tryParseInt("42"), f, g));
console.log(fold(tryParseInt("42a"), f, g));

interface Cash {
  kind: "cash";
}

interface PayPal {
  kind: "paypal";
  email: string;
}

interface CreditCard {
  kind: "cc";
  cardNumber: string;
  securityCode: number;
}

type PaymentMethod = Cash | PayPal | CreditCard;

function prettyPrintPaymentMethod(paymentMethod: PaymentMethod): string {
  switch(paymentMethod.kind) {
    case "cash": return "Ca$h";
    case "cc": return `plastic ${paymentMethod.cardNumber} `;
    case "paypal": return `PP ${paymentMethod.email}`;
    default: return assertNever(paymentMethod);
  }
}

const person = {
  fullName: "FN",
  blog: "addr",
  twitter: "@handle"
};

const { fullName, ...socialMedia } = person;

socialMedia.blog;
socialMedia.twitter;

const defaultStyles = {
  fontFamily: "Consolas",
  fontWeight: "normal"
};

const userStyles = {
  color: "#FFFFAA",
  fontWeight: 700
};

const styles = {
  ...defaultStyles,
  ...userStyles
};

const { color, ...remaining } = styles;

const shallowCopy = { ...styles };

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const todo: Todo = {
  id: 42,
  text: "use TS",
  completed: false
};

function prop<T, K extends keyof T>(obj: T, prop: K): T[K] {
  return obj[prop];
}

type TodoId = Todo["id"];

const id = prop(todo, "id");
const text = prop(todo, "text");
const completed = prop(todo, "completed");

interface Point {
  x: number;
  y: number;
}

const origin: Point = { x: 0, y: 0 };

type ReadonlyPoint = Readonly<Point>;

const ppoint: Partial<Point> = { x: 42 };

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

const npoint: Nullable<Point> = { x: 5, y: null };
