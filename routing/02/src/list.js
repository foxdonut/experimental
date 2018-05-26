import m from "mithril"

export const ListPage = "ListPage";

export const createList = actions => update => {
  return {
    pageId: ListPage,
    view: vnode => m("div",
      "List Page",
      m("div",
        ["a", "b"].map(item => m("button",
          { onclick: () => actions.editItem(item) },
          "Form ", item
        ))
      )
    )
  }
}
