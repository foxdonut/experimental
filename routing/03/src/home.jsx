import React from "react"
import { HomePage, ListPage } from "./constants"

export const createHome = navigator => _update => {
  return {
    pageId: HomePage,
    view: _model => (<div>
      Home Page
      <div>
        <a href={"#" + navigator.getLink(ListPage)}>List Page</a>
      </div>
    </div>)
  }
}
