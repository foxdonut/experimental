import React from "react"
import { FormPage, ListPage } from "./constants"

export const createList = router => _update => {
  return {
    pageId: ListPage,
    view: _model => (<div>
      List Page
      <div>
        {["a", "b"].map(item => (<button key={item}
          onClick={() => router.navigate(FormPage, { item })}>
          Form {item}
        </button>))}
      </div>
    </div>)
  }
}
