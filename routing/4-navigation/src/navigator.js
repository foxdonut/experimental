import { StateNavigator } from "navigation"
import { prefix } from "./constants"

export const createNavigator = update => {
  let stateNavigator = null
  const componentMap = {}

  return {
    register: configs => {
      stateNavigator = new StateNavigator(configs)
      configs.forEach(config => {
        const component = config.component
        componentMap[config.key] = component
        if (component.navigating) {
          stateNavigator.states[config.key].navigating = component.navigating
        }
      })
      stateNavigator.onNavigate(() => {
        const { data, asyncData, state } = stateNavigator.stateContext
        update(model => Object.assign(model, data, asyncData, { pageId: state.key, params: data }))
      })
    },
    getComponent: pageId => componentMap[pageId],
    getUrl: (id, params) => prefix + stateNavigator.getNavigationLink(id, params),
    navigateTo: (id, params) => stateNavigator.navigate(id, params),
    start: () => stateNavigator.start()
  }
}
