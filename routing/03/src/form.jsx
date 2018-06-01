import React from "react"
import { FormPage, HomePage, ListPage } from "./constants"

const items = {
  "a": "Article",
  "b": "Book"
}

const loadData = itemId => ({
  then: fn => setTimeout(() => fn(items[itemId]), 500)
})

export const createForm = navigator => _update => {
  return {
    pageId: FormPage,
    navigating: ({ itemId }, url, navigate) => {
      loadData(itemId).then(item => navigate({ item }))
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
          <a href={"#" + navigator.getLink(HomePage)}>Home Page</a>
        </div>
      </div>
    )
  }
}
