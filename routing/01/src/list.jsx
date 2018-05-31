import React from "react"
import { FormPage, HomePage, ListPage } from "./constants"

export const createList = router => _update => {
  return {
    pageId: ListPage,
    route: "/list",
    view: _model => (<div>
      List Page
      <div>
        {["a", "b"].map(itemId => (<button key={itemId}
          onClick={() => router.navigateTo(FormPage, { itemId })}>
          Form {itemId}
        </button>))}
      </div>
      <div>
        <a href={router.generate(HomePage)}>Home Page</a>
      </div>
    </div>)
  }
}
