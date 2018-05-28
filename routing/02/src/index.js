import m from "mithril"
import stream from "mithril-stream"
import { P } from "patchinko"
import { createApp } from "./app"
import { ListPage } from "./list"
import { FormPage } from "./form"

const update = stream()
const models = stream.scan(P, { pageId: ListPage }, update)
const App = createApp(update)
const router = App.router
const Root = { view: () => m(App, { model: models() }) }
m.route(document.getElementById("app"), "/", {
  "/": Root,
  "/list": {
    onmatch: () => {
      router.navigate(ListPage)
      return Root
    }
  },
  "/form/:item": {
    onmatch: ({ item }) => {
      router.navigate(FormPage, { item })
      return Root
    }
  }
})
