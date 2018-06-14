import * as Main from "./index"
import { trace } from "meiosis"
import meiosisTracer from "meiosis-tracer"
import m from "mithril"

const tracerElement = document.createElement("div")
tracerElement.id = "tracer"
tracerElement.style = "position: absolute; top: 0; right: 0"
Main.element.parentNode.insertBefore(tracerElement, Main.element.nextSibling)

const I = x => x
trace({ update: Main.update, dataStreams: [ Main.models ], toUpdate: I })
meiosisTracer({ selector: "#tracer" })

// Display the url in the browser's location bar.
Main.models.map(model => {
  const url = model.url
  if (url && document.location.hash !== url) {
    window.history.pushState({}, "", url)
  }
})
Main.models.map(() => m.redraw())
