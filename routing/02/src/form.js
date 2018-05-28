import m from "mithril"
import { ListPage } from "./list"

export const FormPage = "FormPage"

const loadData = _item => ({
  then: fn => setTimeout(fn, 50)
})

export const createForm = navigator => update => {
  return {
    pageId: FormPage,
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
