import React from "react"
import { FormPage } from "./form.jsx"

export const ListPage = "ListPage"

export const createList = router => _update => {
  return {
    pageId: ListPage,
    view: _model => (<div>
      List Page
      <div>
        {["a", "b"].map(item => (<button key={item}
          onClick={() => router.navigateTo(FormPage, { item })}>
          Form {item}
        </button>))}
      </div>
    </div>)
  }
}
