import m from "mithril"
import stream from "mithril-stream"
import { P } from "patchinko"
import { compile } from "path-to-regexp"
import { createApp } from "./app"
import { FormPage, ListPage } from "./constants"

const update = stream()
const models = stream.scan(P, { pageId: ListPage }, update)
const App = createApp(update)
const navigator = App.navigator
const Root = { view: () => m(App, { model: models() }) }

m.route(document.getElementById("app"), "/list", {
  "/list": {
    onmatch: () => {
      navigator.navigate(ListPage)
      return Root
    }
  },
  "/form/:item": {
    onmatch: ({ item }) => {
      navigator.navigate(FormPage, { item })
      return Root
    }
  }
})

const routeMap = {
  ListPage: compile("/list"),
  FormPage: compile("/form/:item")
}

models.map(model => {
  const route = "#!" + routeMap[model.pageId](model)
  if (document.location.hash !== route) {
    window.history.pushState({}, "", route)
  }
})
