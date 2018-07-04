import { sv } from "../src"

const tag = (node, tag) => Object.assign(node, { selector: tag })
const attrs = (node, attrs) => Object.assign(node, { attributes: attrs })
const children = (node, children) => Object.assign(node, { children })
const text = (node, text) => Object.assign(node, { text })

const h = sv({ tag, attrs, children, text })

export default {
  basicText: [
    h(["div", { id: "test" }, "test"]),
    {
      selector: "div",
      attributes: { id: "test" },
      text: "test"
    }
  ],
  basicChildren: [
    h(["div", { id: "test" }, [
      ["div", {}, "test1"],
      ["div", {}, "test2"]
    ]]),
    {
      selector: "div",
      attributes: { id: "test" },
      children: [
        {
          selector: "div",
          attributes: {},
          text: "test1"
        },
        {
          selector: "div",
          attributes: {},
          text: "test2"
        }
      ]
    }
  ],
  justATag: [
    h(["hr"]),
    {
      selector: "hr"
    }
  ],
  optionalAttrs: [
    h(["div", "test"]),
    {
      selector: "div",
      text: "test"
    }
  ],
  optionalAttrsChildren: [
    h(["div", [
      ["div", "test1"],
      ["div", "test2"]
    ]]),
    {
      selector: "div",
      children: [
        {
          selector: "div",
          text: "test1"
        },
        {
          selector: "div",
          text: "test2"
        }
      ]
    }
  ],
  mixedChildrenArray: [
    h(["div", [
      "text 1",
      ["b", "in bold"],
      "text 2"
    ]]),
    {
      selector: "div",
      children: [
        { text: "text 1" },
        { selector: "b", text: "in bold" },
        { text: "text 2" }
      ]
    }
  ]
}
