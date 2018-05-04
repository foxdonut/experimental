import React from "react";

const employeesList = [
  { name: "John Doe", salary: 150 },
  { name: "Richard Roe", salary: 225 },
];

const createActions = update => ({
  clearList: () => update(model => {
    model.employeesList = [];
    return model;
  }),

  pushEmployee: (e) => update(model => {
    model.employeesList.push(e);
    return model;
  })
});

const totalSum = employeesList => {
  let sum = 0;
  employeesList.map(e => sum = sum + e.salary);
  return sum;
};

const highEarnersCount = employeesList => {
  return employeesList.filter(e => e.salary > 500).length;
};

const state = model => {
  model.totalSum = totalSum(model.employeesList);
  model.highEarnersCount = highEarnersCount(model.employeesList);
  return model;
};

const createTable = () => {
  const row = model => (
    <tr key={model.key}>
      <td>{model.data.name}</td>
      <td>{model.data.salary}</td>
    </tr>
  );

  const view = model => (
    <div>
      <table>
        <thead>
          <tr>
            <td>Name:</td>
            <td>Daily salary:</td>
          </tr>
        </thead>
        <tbody>
          {model.employeesList.map((e, i) => row({key: i, data: e}))}
        </tbody>
        <tfoot>
          <tr>
            <td>TOTAL:</td>
            <td>{model.totalSum}</td>
          </tr>
        </tfoot>
      </table>
      <div className="fade">
        You have <u>{model.highEarnersCount} team members</u> that earn more than 500$/day.
      </div>
    </div>
  );

  return { view };
};

const createControls = update => {
  const actions = createActions(update);

  const addEmployee = () => {
    const name = prompt("The name:");
    const salary = parseInt(prompt("The salary:"), 10) || 0;
    actions.pushEmployee({ name, salary });
  };

  const view = () => (
    <div className="controls">
      <button onClick={actions.clearList}>clear table</button>
      <button onClick={addEmployee}>add record</button>
    </div>
  );

  return { view };
};

const createApp = update => {
  const controls = createControls(update);
  const table = createTable(update);

  const model = () => ({ employeesList });

  const view = model => (
    <div>
      <h1>Meiosis Table</h1>
      {controls.view(model)}
      {table.view(model)}
    </div>
  );

  return { model, view, state };
};

export default createApp;
