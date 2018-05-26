import m from "mithril";
import stream from "mithril-stream";
import { P } from "patchinko";
import { createApp } from "./app"
import { Pages } from "./constants"

const update = stream()
const models = stream.scan(P, { pageId: Pages.LIST }, update)
const App = createApp(update)
m.mount(document.body, { view: () => m(App, { model: models() }) })
