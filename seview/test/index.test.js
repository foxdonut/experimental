import { sv } from "../src"

const tag = (node, tag) => Object.assign(node, { selector: tag })
const attrs = (node, attrs) => Object.assign(node, { attributes: attrs })
const children = (node, children) => Object.assign(node, { children })
const text = (node, text) => Object.assign(node, { text })

const h = sv({ tag, attrs, children, text })

const basicText = ["div", { id: "test" }, "test"]

const basicChildren = ["div", { id: "test" }, [
  ["div", {}, "test1"],
  ["div", {}, "test2"]
]]

console.log(h(basicChildren))

export default {
  basicText: [
    h(basicText),
    { selector: "div"
    , attributes: { id: "test" }
    , text: "test"
    }
  ],
  basicChildren: [
    h(basicChildren),
    { selector: "div"
    , attributes: { id: "test" }
    , children:
      [ { selector: "div"
        , attributes: {}
        , text: "test1"
        }
      , { selector: "div"
        , attributes: {}
        , text: "test2"
        }
      ]
    }
  ]
}
