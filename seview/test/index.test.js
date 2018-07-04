import { sv } from "../src"

const transform = node => {
  const children = node.children || []
  if (node.text) {
    children.push(node.text)
  }
  const childrenObj = children.length > 0 ? { children } : {}
  const idObj = node.id ? { id: node.id } : {}

  return {
    type: node.tag,
    props: Object.assign({}, node.attrs, idObj, childrenObj )
  }
}

const h = sv(transform)

export default {
  basicText: [
    h(["div", { id: "test" }, "test"]),
    {
      type: "div",
      props: { id: "test", children: ["test"] }
    }
  ],
  basicChildren: [
    h(["div", { id: "test" }, [
      ["div", {}, "test1"],
      ["div", {}, "test2"]
    ]]),
    {
      type: "div",
      props: {
        id: "test",
        children: [
          { type: "div", props: { children: ["test1"] } },
          { type: "div", props: { children: ["test2"] } }
        ]
      }
    }
  ],
  justATag: [
    h(["hr"]),
    { type: "hr", props: {} }
  ],
  optionalAttrs: [
    h(["div", "test"]),
    { type: "div", props: { children: ["test"] } }
  ],
  optionalAttrsChildren: [
    h(["div", [
      ["div", "test1"],
      ["div", "test2"]
    ]]),
    {
      type: "div",
      props: { children: [
        { type: "div", props: { children: ["test1"] } },
        { type: "div", props: { children: ["test2"] } }
      ] }
    }
  /*
  ],
  basicVarArgs: [
    h(["div", {},
      ["div", "test1"],
      ["div", "test2"]
    ]),
    {
      type: "div",
      attributes: {},
      children: [
        { type: "div", text: "test1" },
        { type: "div", text: "test2" }
      ]
    }
  ],
  varArgsNoAttrs: [
    h(["div",
      ["div", "test1"],
      ["div", "test2"]
    ]),
    {
      type: "div",
      children: [
        { type: "div", text: "test1" },
        { type: "div", text: "test2" }
      ]
    }
  ],
  oneVarArg: [
    h(["div",
      ["div", "test1"]
    ]),
    {
      type: "div",
      children: [
        { type: "div", text: "test1" }
      ]
    }
  ],
  mixedChildrenVarArgs: [
    h(["div",
      "text 1",
      ["b", "in bold"]
    ]),
    {
      type: "div",
      children: [
        { text: "text 1" },
        { type: "b", text: "in bold" }
      ]
    }
  ],
  mixedChildrenArray: [
    h(["div", [
      ["b", "in bold"],
      "text 2"
    ]]),
    {
      type: "div",
      children: [
        { type: "b", text: "in bold" },
        { text: "text 2" }
      ]
    }
  */
  ]
}
