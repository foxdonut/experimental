import React from "react"
import { HomePage, ListPage } from "./constants"

export const createHome = router => _update => {
  return {
    pageId: HomePage,
    route: "/",
    view: _model => (<div>
      Home Page
      <div>
        <a href={router.generate(ListPage)}>List Page</a>
      </div>
    </div>)
  }
}
