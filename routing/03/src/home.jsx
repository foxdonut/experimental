import React from "react"
import { HomePage, ListPage } from "./constants"

export const createHome = stateNavigator => _update => {
  return {
    pageId: HomePage,
    view: _model => (<div>
      Home Page
      <div>
        <a href={"#" + stateNavigator.getNavigationLink(ListPage)}>List Page</a>
      </div>
    </div>)
  }
}
