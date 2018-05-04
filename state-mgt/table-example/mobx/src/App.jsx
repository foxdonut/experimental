import React from "react";
import { decorate, observable, configure, action, computed } from "mobx";
import { observer } from "mobx-react";

configure({ enforceActions: true });

class Store {
  constructor() {
    this.employeesList = [
      { name: "John Doe", salary: 150 },
      { name: "Richard Roe", salary: 225 },
    ];
  }

  clearList() {
    this.employeesList = [];
  }

  pushEmployee(e) {
    this.employeesList.push(e);
  }

  get totalSum() {
    let sum = 0;
    this.employeesList.map(e => sum = sum + e.salary);
    return sum;
  }

  get highEarnersCount() {
    return this.employeesList.filter(e => e.salary > 500).length;
  }
}

decorate(Store, {
  employeesList: observable,
  clearList: action,
  pushEmployee: action,
  totalSum: computed
});

const Row = (props) => {
  return (<tr>
    <td>{props.data.name}</td>
    <td>{props.data.salary}</td>
  </tr>);
};

const Table = observer(({ store }) => (
  <div>
    <table>
      <thead>
        <tr>
          <td>Name:</td>
          <td>Daily salary:</td>
        </tr>
      </thead>
      <tbody>
        {store.employeesList.map((e, i) => <Row key={i} data={e} />)}
      </tbody>
      <tfoot>
        <tr>
          <td>TOTAL:</td>
          <td>{store.totalSum}</td>
        </tr>
      </tfoot>
    </table>
    <div className="fade">
      You have <u>{store.highEarnersCount} team members</u> that earn more than 500$/day.
    </div>
  </div>
));

const Controls = props => {
  const clearList = () => {
    props.store.clearList();
  };

  const addEmployee = () => {
    const name = prompt("The name:");
    const salary = parseInt(prompt("The salary:"), 10) || 0;
    props.store.pushEmployee({ name, salary });
  };

  return (
    <div className="controls">
      <button onClick={() => clearList()}>clear table</button>
      <button onClick={() => addEmployee()}>add record</button>
    </div>
  );
};

const appStore = new Store();

const App = () => (
  <div>
    <h1>Mobx Table</h1>
    <Controls store={appStore} />
    <Table store={appStore} />
  </div>
);

export default App;
