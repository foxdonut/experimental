import React from "react"
import { FormPage, HomePage, ListPage } from "./constants"

const items = {
  "a": "Article",
  "b": "Book"
}

const loadData = itemId => new Promise(resolve =>
  setTimeout(() => resolve(items[itemId]), 5)
)

export const createForm = router => update => {
  return {
    pageId: FormPage,
    route: "/form/:itemId",
    navigate: ({ itemId }) => {
      loadData(itemId).then(item => {
        update(model => Object.assign(model, { pageId: FormPage, params: { itemId }, item }))
      })
    },
    view: model => (
      <div>
        Form Page for item {model.item}
        <div>
          <button onClick={() => router.navigateTo(ListPage)}>
            List
          </button>
        </div>
        <div>
          <a href={router.generate(HomePage)}>Home Page</a>
        </div>
      </div>
    )
  }
}
