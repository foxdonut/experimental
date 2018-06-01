import React from "react"
import { FormPage, HomePage, ListPage } from "./constants"

export const createList = navigator => _update => {
  return {
    pageId: ListPage,
    view: _model => (<div>
      List Page
      <div>
        {["a", "b"].map(itemId => (<button key={itemId}
          onClick={() => navigator.navigateTo(FormPage, { itemId })}>
          Form {itemId}
        </button>))}
      </div>
      <div>
        <a href={"#" + navigator.getLink(HomePage)}>Home Page</a>
      </div>
    </div>)
  }
}
