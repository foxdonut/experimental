import React from "react"
import { ListPage } from "./list.jsx"

export const FormPage = "formPage"

const loadData = _item => ({
  then: fn => setTimeout(fn, 50)
})

export const createForm = router => update => {
  return {
    pageId: FormPage,
    //navigate: item => update({ pageId: FormPage, item }),
    navigate: ({ item }) => {
      loadData(item).then(() => {
        update(model => Object.assign(model, { pageId: FormPage, item }))
      })
    },
    view: model => (
      <div>
        Form Page for item {model.item}
        <div>
          <button onClick={() => router.navigate(ListPage)}>
            List
          </button>
        </div>
      </div>
    )
  }
}
