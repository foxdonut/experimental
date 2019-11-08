const Light = stags.tags('Light', ['Red', 'Yellow', 'Green', 'FlashingGreen'])
const LightEvent = stags.tags('LightEvent', ['change', 'reset'])
const initial = Light.Red()

// printLight :: Light -> String
const printLight = stags.fold(Light)({
  Red: () => '[ Red ]',
  Yellow: () => '< Yellow >',
  Green: () => '( Green )',
  FlashingGreen: () => '( Flashing Green )'
})

p(printLight(initial))

// Light -> Event -> Light
const handleLightEvent = lightEvent => light =>
  stags.map()
  
const View = () => {
  let light = Light.Red()
  let eventText = 'change'
  
  return {
    view: () => {
      const oninput = evt => {
        eventText = evt.target.value
      }
      const trigger = () => {
        light = handleLightEvent(light)(eventText)
      }

      return m('',
        m('', 'Light: ', printLight(light)),
        m('', 'Event: ', m('input', { type: 'text', value: eventText, oninput })),
        m('button', { onclick: trigger }, 'Trigger')
      )
    }
  }
}

m.mount(document.body, View)

///// example from gitlab.com/harth/stags

const { Y, N } = stags.Maybe
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

