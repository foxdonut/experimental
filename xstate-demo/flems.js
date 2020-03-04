import * as stags from 'stags@1.0.0-rc30'

const { Y, N } = stags.Either
const K = v => () => v

const Light = stags.tags('Light', ['Red', 'Yellow', 'Green', 'FlashingGreen'])
const LightEvent = stags.tags('LightEvent', ['change', 'reset'])
const initial = Light.Red()

// printLight :: Light -> String
const printLight = Light.fold({
  Red: () => '[ Red ]',
  Yellow: () => '< Yellow >',
  Green: () => '( Green )',
  FlashingGreen: () => '( Flashing Green )'
})

p(printLight(initial))

// Light -> Event -> Light
const handleLightEvent = (light, lightEvent, carTurning) =>
  stags.run(
    lightEvent,
    LightEvent.fold({
      change: () => stags.run(
        light,
        Light.fold({
          Red: () => Light.Green(),
          Yellow: () => Light.Red(),
          Green: () => stags.run(
            carTurning,
            stags.bifold(
              K(Light.Yellow()),
              K(Light.FlashingGreen())
            )
          ),
          FlashingGreen: () => Light.Green()
        })
      ),
      reset: () => Light.Red()
    })
  )

const View = () => {
  let light = Light.Red()
  let eventText = 'change'
  let carTurning = N()

  return {
    view: () => {
      const onclick = evt => {
        eventText = evt.target.value
      }
      const onCarTurning = evt => {
        carTurning = evt.target.checked ? Y() : N()
      }
      const trigger = () => {
        light = handleLightEvent(
          light, LightEvent[eventText](), carTurning)
      }

      return m('',
        m('', 'Light: ', printLight(light)),
        m('', 'Event: ',
          m('label',
            m('input', {
              type: 'radio', name: 'evt', value: 'change',
              checked: eventText === 'change', onclick
            }),
            'change'
          ),
          m('label', { style: { marginLeft: '8px' } },
            m('input', {
              type: 'radio', name: 'evt', value: 'reset',
              checked: eventText === 'reset', onclick
            }),
            'reset'
          )
        ),
        m('',
          m('label', 'Car turning: ',
            m('input', {
              type: 'checkbox', onclick: onCarTurning,
              checked: stags.bifold(K(null), K('checked'))(carTurning)
            })
          )
        ),
        m('button', { onclick: trigger }, 'Trigger')
      )
    }
  }
}

m.mount(document.body, View)

///// example from gitlab.com/harth/stags
const Platform = stags.tags ('Platform', [
    'ModernWindows',
    'XP',
    'Linux',
    'Darwin'
])

const rest = stags.otherwise([ // renamed
    'ModernWindows',
    'XP',
    'Linux',
    'Darwin',
])

const windowsGUI = stags.otherwise([
    'ModernWindows',
    'XP',
])

const foldWindowsGUI = f => Platform.fold({
    ... rest(N),
    ... windowsGUI( () => Y(f()) )
})

const winPing =
    foldWindowsGUI
        ( () => 'ping \\t www.google.com' )

p( winPing( Platform.Darwin() ) )
// => stags.Maybe.N()

p( winPing( Platform.XP() ) )
// => stags.Maybe.Y('ping \t www.google.com')
