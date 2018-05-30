import m from "mithril"
import O from "patchinko/overloaded"

const employeeList = [
  { name: "John Doe", salary: 150 },
  { name: "Richard Roe", salary: 225 },
]

const createActions = update => ({
  clearList: () => update({ employeeList: [] }),
  pushEmployee: (e) => update({ employeeList: O(list => {
    list.push(e)
    return list
  }) }),
  loadMore: () => update({ loadMore: O(value => !value) })
})

const createTable = () => {
  const row = model => (
    m("tr", { key: model.key },
      m("td", model.data.name),
      m("td", model.data.salary)
    )
  )

  const view = model => (
    m("table",
      m("thead",
        m("tr",
          m("td", "Name:"),
          m("td", "Daily salary:")
        )
      ),
      m("tbody",
        model.employeeList.map((e, i) => row({key: i, data: e}))
      )
    )
  )

  return { view }
}

const createControls = update => {
  const actions = createActions(update)

  const addEmployee = () => {
    const name = prompt("The name:")
    const salary = parseInt(prompt("The salary:"), 10) || 0
    actions.pushEmployee({ name, salary })
  }

  const view = () => (
    m("div",
      m("button", { onclick: actions.clearList }, "Clear table"),
      m("button", { onclick: addEmployee }, "Add record"),
      m("button", { onclick: actions.loadMore }, "Load more")
    )
  )

  return { view }
}

const createApp = update => {
  const controls = createControls(update)
  const table = createTable(update)

  const model = () => ({ employeeList, loadMore: false })

  const view = model => (
    m("div",
      m("h1", "Meiosis Table"),
      controls.view(model),
      table.view(model)
    )
  )

  return { model, view }
}

export default createApp
