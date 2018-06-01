import React from "react"
import { ListPage } from "./constants"

export const createHome = navigator => _update => {
  return {
    view: _model => (<div>
      Home Page
      <div>
        <a href={navigator.getLink(ListPage)}>List Page</a>
      </div>
    </div>)
  }
}
