import m from "mithril"
import { FormPage, ListPage } from "./constants"

const loadData = _item => ({
  then: fn => setTimeout(fn, 50)
})

export const createForm = navigator => update => {
  return {
    //navigate: item => update({ pageId: FormPage, item }),
    navigate: ({ item }) => {
      loadData(item).then(() => {
        update({ pageId: FormPage, item })
        m.redraw()
      })
    },
    view: vnode => {
      const model = vnode.attrs.model

      return m("div",
        "Form Page for item ", model.item,
        m("div",
          m("button",
            { onclick: () => navigator.navigate(ListPage) },
            "List"
          )
        )
      )
    }
  }
}
