import { m, FormPage, HomePage } from "./constants"

export const createList = navigator => _update => {
  return {
    view: _model => m("div",
      m("div", "List Page"),
      m("div",
        ["a", "b"].map(itemId => m("button",
          { key: itemId, onClick: () => navigator.navigateTo(FormPage, { itemId }) },
          "Form ", itemId
        ))
      ),
      m("div",
        m("a", {
          href: navigator.getUrl(HomePage),
          onClick: evt => { evt.preventDefault(); navigator.navigateTo(HomePage) }
        }, "Home Page")
      )
    )
  }
}
