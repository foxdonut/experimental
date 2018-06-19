import { Component } from "react"
import { Link } from "react-router-dom"
import { HomePage, ListPage } from "./constants"
import { m } from "./utils"

const items = {
  "a": "Article",
  "b": "Book"
}

const loadData = itemId => new Promise(resolve =>
  setTimeout(() => resolve(items[itemId]), 5)
)

export const createForm = navigator => update => class extends Component {
  loadItem(itemId) {
    loadData(itemId).then(item => update(model => Object.assign(model, { item })))
  }
  componentWillMount() {
    this.loadItem(this.props.match.params.itemId)
  }
  componentDidUpdate(previous) {
    const itemId = this.props.match.params.itemId
    if (itemId !== previous.match.params.itemId) {
      this.loadItem(itemId)
    }
  }
  render() {
    const { history, model } = this.props
    return m("div",
      m("div", "Form Page for item " + model.item),
      m("div",
        m("button",
          { onClick: () => history.push(navigator.getUrl(ListPage)) },
          "List"
        )
      ),
      m("div",
        m(Link, { to: navigator.getUrl(HomePage) }, "Home Page")
      )
    )
  }
}
