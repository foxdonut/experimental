import React from "react"
import { FormPage, HomePage, ListPage } from "./constants"

const items = {
  "a": "Article",
  "b": "Book"
}

const loadData = itemId => ({
  then: fn => setTimeout(() => fn(items[itemId]), 500)
})

export const createForm = stateNavigator => _update => {
  return {
    pageId: FormPage,
    navigating: ({ itemId }, url, navigate) => {
      loadData(itemId).then(item => navigate({ item }))
    },
    view: model => (
      <div>
        Form Page for item {model.item}
        <div>
          <button onClick={() => stateNavigator.navigate(ListPage)}>
            List
          </button>
        </div>
        <div>
          <a href={"#" + stateNavigator.getNavigationLink(HomePage)}>Home Page</a>
        </div>
      </div>
    )
  }
}
