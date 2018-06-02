import m from "mithril"
import * as Main from "./index"
import { prefix } from "./constants"
import { trace } from "meiosis"
import meiosisTracer from "meiosis-tracer"

const tracerElement = document.createElement("div")
tracerElement.id = "tracer"
tracerElement.style = "position: absolute; top: 0; right: 0"
Main.element.parentNode.insertBefore(tracerElement, Main.element.nextSibling)

const I = x => x
trace({ update: Main.update, dataStreams: [ Main.models ], toUpdate: I })
meiosisTracer({ selector: "#tracer" })

const navigator = Main.App.navigator
Main.models.map(model => {
  const url = prefix + navigator.getLink(model.pageId, model.params)
  if (document.location.hash !== url) {
    window.history.pushState({}, "", url)
  }
})
Main.models.map(() => m.redraw())
