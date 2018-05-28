import m from "mithril"
import { ListPage } from "./list"

export const FormPage = "FormPage"

const loadData = item => ({
  then: fn => setTimeout(fn, 50)
})

export const createForm = router => update => {
  return {
    pageId: FormPage,
    //navigateTo: item => update({ pageId: FormPage, item }),
    navigateTo: ({ item }) => {
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
            { onclick: () => router.navigateTo(ListPage) },
            "List"
          )
        )
      )
    }
  }
}