import m from "mithril"
import stream from "mithril-stream"
import O from "patchinko/overloaded"
import createApp from "./app"

const update = stream()
const app = createApp(update)
const models = stream.scan(O, app.model(), update)

const states = stream()
models.map(model => {
  if (model.loadMore) {
      setTimeout(() => {
        model.employeeList.push({ name: "Claude Ricard", salary: 350 })
        states(model)
      }, 500)
  }
  else {
    states(model)
  }
})

const element = document.getElementById("app")
states.map(state => m.render(element, app.view(state)))

import { trace } from "meiosis"
import meiosisTracer from "meiosis-tracer"
const I = x => x
trace({ update: states, dataStreams: [ states ], toUpdate: I })
meiosisTracer({ selector: "#tracer" })
