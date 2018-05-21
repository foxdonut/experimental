import m from 'mithril'
import b from 'bss'

const tick = () => Promise.resolve()

export default {
  view: ({children}) =>
    m('.' + b`
      background #fff
      box-shadow #0001 0 0 2em .25em
      padding    1em
      position   fixed
      top        50%
      left       50%
      transform  translate(-50%, -50%)
      max-width  98vw
      max-height 98vh
      transition .4s ease-in-out
      opacity    0
    `
    , { oncreate: ({dom: {style, innerHeight}}) => {
          style.opacity = 1
          tick().then(m.redraw)
        }
      , onbeforeremove: ({dom}) => new Promise(resolve => {
          dom.style.opacity = 0
          dom.addEventListener('transitionend', resolve)
        })
      }
    , children
    )
}

