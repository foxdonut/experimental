import React from "react";
import { createStore } from "redux";
import { connect } from "react-redux";

const actions = {
  clearList: () => ({ type: "CLEAR_LIST" }),
  addEmployee: employee => ({ type: "ADD_EMPLOYEE", employee })
};

const initialState = {
  employeesList: [
    { name: "John Doe", salary: 150 },
    { name: "Richard Roe", salary: 225 },
  ]
};

function app(state = initialState, action) {
  if (action.type === "CLEAR_LIST") {
    return Object.assign({}, state, { employeesList: [] });
  }
  else if (action.type === "ADD_EMPLOYEE") {
    return Object.assign({}, state,
      { employeesList: state.employeesList.concat([action.employee]) });
  }
  return state;
}

export const store = createStore(app);

function totalSum(employeesList) {
  let sum = 0;
  employeesList.map(e => sum = sum + e.salary);
  return sum;
}

function highEarnersCount(employeesList) {
  return employeesList.filter(e => e.salary > 500).length;
}

const Row = (props) => {
  return (<tr>
    <td>{props.data.name}</td>
    <td>{props.data.salary}</td>
  </tr>);
};

const Table = connect(
    state => ({
      employeesList: state.employeesList,
      totalSum: totalSum(state.employeesList),
      highEarnersCount: highEarnersCount(state.employeesList)
    })
  )(({ employeesList, totalSum, highEarnersCount }) => (
    <div>
      <table>
        <thead>
          <tr>
            <td>Name:</td>
            <td>Daily salary:</td>
          </tr>
        </thead>
        <tbody>
          {employeesList.map((e, i) => <Row key={i} data={e} />)}
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
  )
);

const Controls = connect()(({ dispatch }) => {
  const addEmployee = () => {
    const name = prompt("The name:");
    const salary = parseInt(prompt("The salary:"), 10) || 0;
    dispatch(actions.addEmployee({ name, salary }));
  };

  const clearList = () => {
    dispatch(actions.clearList());
  };

  return (<div className="controls">
    <button onClick={() => clearList()}>clear table</button>
    <button onClick={() => addEmployee()}>add record</button>
  </div>);
});

export const App = () => (
  <div>
    <h1>Redux Table</h1>
    <Controls />
    <Table />
  </div>
);

export default App;
