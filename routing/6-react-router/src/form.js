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

export const createForm = navigator => _update => class extends Component {
  componentDidMount() {
    console.log("componentDidMount:", this.props)
  }
  componentDidUpdate(previous) {
    console.log("componentDidUpdate:", previous)
  }
  render() {
    const { match, history } = this.props
    return m("div",
      m("div", "Form Page for item " + match.params.itemId /*+ model.item*/),
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
    /*
  return {
    navigating: ({ itemId }, navigate) => {
      loadData(itemId).then(item =>
        navigate(model => Object.assign(model, { item })))
    },
    view: model => {
      return m("div",
        m("div", "Form Page for item " + model.item),
        m("div",
          m("button",
            { onClick: () => navigator.navigateTo(ListPage) },
            "List"
          )
        ),
        m("div",
          m("a", { href: navigator.getUrl(HomePage) }, "Home Page")
        )
      )
    }
  }
  */
  }
}
