/*
https://stackoverflow.com/questions/66181496/typescript-generic-generic
https://www.typescriptlang.org/play?#code/HYQwtgpgzgDiDGEAEApeIA2AvJBvAUIUkgJbAAuEATgGYLICiAbhBXvsceQJ4wQBcSKOSpkA5gG4OSAL5EkPPkmatyAFV4QAPGqQQAHpWAATKMpYUAfEgC8SNQG0A5IohOAulK6bzqgBIgJhjUOnqGrKa+VrZIABQQFuSCagCUttZMAPYkxlLSAPT5QplIdFTFSGKZmcbSrlHqmgCCJgFB1GoArjDBoQZGkSrRdg5DjXw6lgA0DW3GwVSTnvKFCgAWJGabSADua9TIAJK7m2tIx-CZnRjGSMYlAEYQ5JRUAHTnSOClmVSIt+QSp0oBBboFuHUfGMNHwWsY5gsuj1oDFoc1WoF5h1ur1wZYHO55GRXnREPYapkmsZjKCxmEBmY6QROApNIIAERqClUmnGdleTiA+4AOXAAiEInEAuIxhAlB5oMEABE5RABXJvEoufcFfDMQtUYkESFtZTqbTEpY8sRidRSchTQAlCBgTIsYx0-oRRmJdgs1wcp0ut2g-nSLgU0WQQTCUTASThu6q52u93K1XqyFaikpkN69rlOxjY2LIOpi2qK2EaQ0+AYEBUZCXYDCBTc80exKCNETU26sZVmUQOsNpuZFvkJBrfUQPsdsbdo0z0vt3kDgW1+uNpDN1tCzK590Lhow7RlvPrmvDrdjidTmfno9d2bLnQ54NPyvWpCgSCwehIAAqsAJDjuwib1MBoHAAA8jQPYQHCJZIsEZhFokZheiYWzADQ1D2EgAD8ibELoWGDL6hEnui+ZYlQKFntYgjAAk+HMaxVDSkgqyQSB45wQhSHLgxaFIImqyCRiBYMW+OrzpaSAAD7UbCUl0TJj4VlY8iaowGExHOa6+spmmdqo37EKsmQANYgBCLK7pOrEUKeXLITi0CCFB-HwYkp5CdJHlQASMQOCRSAOPu-aJDM07tIZWnkO4UzhZF77lmZFCxQ+6UXokhIsss4lFNQVC-ImjlIA8ICZeMs6ZO5yJQF5fGwb5qj+WpiJBSFIypfuh6Jdl8WrolyXcSVVBlVQACEiZFcQcjSL+0BwGSADirDUCQ8DgQ546tiAUAIW5wlBTEfThNhDQEpYsTheQQWCA4byvbgEXHGQSDWRA3CZDQ9juIuHU0Y1vQMIYVAIOQOgOIc40DtYMgFZwaQ2NYj1NXkxVIDZdkVQdTl+Zop2BU1MRHSdDVnU1sRhSyxBpXJRmqMNWIJbVyX9bln5ZfeI33INnPzSkFkTXoU3lftd7VbVrnU2TqEU8dxN8KT6lBXT3OCx+Q38+zo2czMqylb8c2FaL8hyHIQA
*/

interface Event {
  type: string;
}

type EventType<T extends Event> = T['type'];
type EventHandler<T extends Event> = (event: T) => void;

// so far so good
type EventTypeAndHandlerTuple<T extends Event> = [EventType<T>, EventHandler<T>];

// this is where I wish I could do better. I am forced to used any
type EventTypeAndHandlerTuples = EventTypeAndHandlerTuple<any>[];

interface TodoAddedEvent extends Event {
  type: 'TodoAdded';
  todoName: string;
  dateAdded: Date;
}
type TodoAddedHandler = EventHandler<TodoAddedEvent>;

interface TodoRemovedEvent extends Event {
  type: 'TodoRemoved';
  todoName: string;
  dateRemoved: Date;
}
type TodoRemovedHandler = EventHandler<TodoRemovedEvent>;

declare const todoAddedEvent: EventType<TodoAddedEvent>;
declare const handleTodoAddedEvent: TodoAddedHandler;
declare const todoRemovedEvent: EventType<TodoRemovedEvent>;
declare const handleTodoRemovedEvent: TodoRemovedHandler;

const eventTypeToHandlerTuples: EventTypeAndHandlerTuples = [
  [todoAddedEvent, handleTodoRemovedEvent],
  [todoRemovedEvent, handleTodoAddedEvent]
];

console.log(eventTypeToHandlerTuples);

type Events = TodoAddedEvent | TodoRemovedEvent;

type UnionOfEventTypeAndHandlerTuples = Events extends infer T
  ? T extends Event
    ? EventTypeAndHandlerTuple<T>
    : never
  : never;

const goodEventTypeToHandlerTuples: UnionOfEventTypeAndHandlerTuples[] = [
  [todoAddedEvent, handleTodoAddedEvent],
  [todoRemovedEvent, handleTodoRemovedEvent]
];

console.log(goodEventTypeToHandlerTuples);

const badEventTypeToHandlerTuples: UnionOfEventTypeAndHandlerTuples[] = [
  [todoRemovedEvent, handleTodoAddedEvent] // error!
];

console.log(badEventTypeToHandlerTuples);

const asEventTypeToHandlerTuples = <T extends Event[]>(
  tuples: [...{ [I in keyof T]: EventTypeAndHandlerTuple<Extract<T[I], Event>> }]
) => tuples;

const goodGenericEventTypeToHandlerTuples = asEventTypeToHandlerTuples([
  [todoAddedEvent, handleTodoAddedEvent],
  [todoRemovedEvent, handleTodoRemovedEvent]
]);

console.log(goodGenericEventTypeToHandlerTuples);

const badGenericEventTypeToHandlerTuples = asEventTypeToHandlerTuples([
  [todoRemovedEvent, handleTodoAddedEvent] // error!
]);

console.log(badGenericEventTypeToHandlerTuples);

