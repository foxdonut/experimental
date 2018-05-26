import m from "mithril"
import { Pages } from "./constants"
import { createList } from "./list"
import { createForm } from "./form"

export const createApp = update => {
  const componentMap = {}

  const actions = {
    navigateTo: (id, params) => {
      componentMap[id].navigateTo(params)
    }
  }

  const List = createList(actions)(update)
  const Form = createForm(actions)(update)

  componentMap[Pages.LIST] = List
  componentMap[Pages.FORM] = Form

  return {
    view: vnode => {
      const model = vnode.attrs.model
      const Component = componentMap[model.pageId]

      return m("div",
        "Hello, world",
        m(Component, { model })
      )
    }
  }
}
