import React from "react"
import { FormPage, HomePage, ListPage } from "./constants"

export const createList = stateNavigator => _update => {
  return {
    pageId: ListPage,
    view: _model => (<div>
      List Page
      <div>
        {["a", "b"].map(itemId => (<button key={itemId}
          onClick={() => stateNavigator.navigate(FormPage, { itemId })}>
          Form {itemId}
        </button>))}
      </div>
      <div>
        <a href={"#" + stateNavigator.getNavigationLink(HomePage)}>Home Page</a>
      </div>
    </div>)
  }
}
