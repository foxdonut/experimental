interface Loading {
  kind: "Loading";
}

interface Loaded<T> {
  kind: "Loaded";
  value: T;
}

type Loadable<T> = Loading | Loaded<T>;

function foldLoadable<T>(loadable: Loadable<T>) {
  switch (loadable.kind) {
    case "Loading":
      return "Loading, please wait...";
    case "Loaded":
      return "Loaded: " + loadable.value;
  }
}

const loadable1: Loadable<number> = { kind: "Loading" };
const loadable2: Loadable<number> = { kind: "Loaded", value: 42 };

console.log(foldLoadable(loadable1));
console.log(foldLoadable(loadable2));

interface Selected<T> {
  kind: "Selected";
  value: T;
}

interface Deselected {
  kind: "Deselected";
}

type Selectable<T> = Selected<T> | Deselected;

function foldSelectableAndLoadable(selectable: Selectable<Loadable<string>>) {
  switch (selectable.kind) {
    case "Selected":
      switch (selectable.value.kind) {
        case "Loading":
          return "Selected, loading";
        case "Loaded":
          return "Selected, loaded " + selectable.value.value;
      }
    case "Deselected":
      return "Deselected";
  }
}

const selectableLoadable1: Selectable<Loadable<string>> = {
  kind: "Selected",
  value: {
    kind: "Loaded",
    value: "duck"
  }
};

console.log(foldSelectableAndLoadable(selectableLoadable1));
