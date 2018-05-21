import m from 'mithril'
import b from 'bss'

import sleep    from './sleep'

//import Waiter   from './Waiter'
import Inline   from './Inline'
//import Off      from './Off'
import Promiser from './Promiser'

import Modal    from './Modal'

const App = '.' + b`
  font-family sans-serif
  padding     1em
`

let agreed = false

m.mount(document.body, {
  view: () => 
    m(App,
      m('h1' + b`text-align center`, 'Hello'),
      !agreed
      ?// m(Waiter, link => 
          //m(Off, { click: e => { agreed = true } }, 
            //m(Waiter, {link}, 
            m("div", { onclick: () => { agreed = true; }}, "click in here to dismiss",
              m(Modal,
                'By continuing to use this site, ',
                'you agree to terrible things.',
                m('br'),
                'Have a nice day!',
                m('div', m('button', { onclick: () => { agreed = true; }}, "OK"))
              )
            )
          //)
        //)
      : m(Inline,
          { oninit: ({state}) => {
              state.promise =
                m.request('https://jsonplaceholder.typicode.com/posts/1')
                  .then(sleep(1e3))
                  //.then(() => { throw "ERROR OCCURRED"; })
            }
          , view: ({state: {promise}}) =>
              m(Promiser, {promise}, ({pending, error, value: {title, body} = {}}) => (
                pending
                ? m('p' + b`text-align center`, 'Loading, please wait...')
                : error
                ? [ m('p' + b`
                      text-align center 
                      color      #c00
                    `,
                      'Uh-oh. Something went wrong:'
                    )
                  , m('pre' + b`
                      background #fcc
                      padding    1em
                      border     #c00
                    `,
                      error
                    )
                  ]
                : [ m('h2', title)
                  , body.split(/\n/).map(paragraph => 
                      m('p', paragraph)
                    )
                  ]
              ))
          }
      )
    )
})
