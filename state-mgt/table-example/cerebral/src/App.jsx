import React from "react";
import { Compute, Controller, Module, connect } from "cerebral";
import { set } from "cerebral/operators";
import { signal, state } from "cerebral/tags";

const Row = (props) => {
  return (<tr>
    <td>{props.data.name}</td>
    <td>{props.data.salary}</td>
  </tr>);
};

const computedTotalSum = Compute(state`employeesList`, employeesList => {
  let sum = 0;
  employeesList.map(e => sum = sum + e.salary);
  return sum;
});

const computedHighEarnersCount = Compute(state`employeesList`, employeesList => {
  return employeesList.filter(e => e.salary > 500).length;
});

const Table = connect(
  {
    employeesList: state`employeesList`,
    totalSum: computedTotalSum,
    highEarnersCount: computedHighEarnersCount
  },
  function({ employeesList, totalSum, highEarnersCount }) {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <td>Name:</td>
              <td>Daily salary:</td>
            </tr>
          </thead>
          <tbody>
            {employeesList.map((e, i) =>
              <Row
                key={i}
                data={e}
              />
            )}
          </tbody>
          <tfoot>
            <tr>
              <td>TOTAL:</td>
              <td>{totalSum}</td>
            </tr>
          </tfoot>
        </table>
        <div className="fade">
          You have <u>{highEarnersCount} team members</u> that earn more than 500$/day.
        </div>
      </div>
    );
  }
);

const clearList = () => {
  this.props.store.clearList();
};

const addEmployee = () => {
  const name = prompt("The name:");
  const salary = parseInt(prompt("The salary:"), 10) || 0;
  this.props.store.pushEmployee({ name, salary });
};

const Controls = connect(
  {
    clearList: signal`clearList`,
    addEmployee: signal`addEmployee`
  },
  function({ clearList, addEmployee }) {
    return (
      <div className="controls">
        <button onClick={() => clearList()}>clear table</button>
        <button onClick={() => addEmployee()}>add record</button>
      </div>
    );
  }
);

const actions = {
  addEmployee: ({ state }) => state.push("employeesList", { name, salary })
};

const sequences = {
  clearList: set(state`employeesList`, []),
  addEmployee: actions.addEmployee
};

const app = Module({
  state: {
    employeesList: [
      { name: "John Doe", salary: 150 },
      { name: "Richard Roe", salary: 225 },
    ]
  },
  signals: {
    clearList: sequences.clearList,
    addEmployee: sequences.addEmployee
  }
});

export const App = connect(function() {
  return (
    <div>
      <h1>Cerebral Table</h1>
      <Controls />
      <Table />
    </div>
  );
});

export const controller = Controller(app);
