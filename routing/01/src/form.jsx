import React from "react"
import { FormPage, HomePage, ListPage } from "./constants"

const items = {
  "a": "Article",
  "b": "Book"
}

const loadData = itemId => new Promise(resolve =>
  setTimeout(() => resolve(items[itemId]), 5)
)

export const createForm = navigator => update => {
  return {
    navigating: ({ itemId }) => {
      loadData(itemId).then(item => {
        update(model => Object.assign(model, { pageId: FormPage, params: { itemId }, item }))
      })
    },
    view: model => (
      <div>
        Form Page for item {model.item}
        <div>
          <button onClick={() => navigator.navigateTo(ListPage)}>
            List
          </button>
        </div>
        <div>
          <a href={navigator.getLink(HomePage)}>Home Page</a>
        </div>
      </div>
    )
  }
}
