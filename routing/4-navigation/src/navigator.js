import { StateNavigator } from "navigation"
import { prefix } from "./constants"

export const createNavigator = update => {
  let stateNavigator = undefined
  let notFoundComponent = undefined
  const componentMap = {}

  return {
    register: (configs, notFound) => {
      if (notFound) {
        configs.push({ key: "NotFoundPage", component: notFound, route: "{*x}",
          defaultTypes: { x: "stringarray" }, trackTypes: false })
      }
      stateNavigator = new StateNavigator(configs)
      configs.forEach(config => {
        const component = config.component
        componentMap[config.key] = component
        if (component.navigating) {
          stateNavigator.states[config.key].navigating = component.navigating
        }
      })
      stateNavigator.onNavigate(() => {
        const { data, asyncData, state, url } = stateNavigator.stateContext
        update(model => Object.assign(model, data, asyncData,
          { pageId: state.key, url: prefix + url }))
      })
      notFoundComponent = notFound
    },
    getComponent: pageId => componentMap[pageId] || notFoundComponent,
    getUrl: (id, params) => prefix + stateNavigator.getNavigationLink(id, params),
    navigateTo: (id, params) => stateNavigator.navigate(id, params),
    start: () => stateNavigator.start()
  }
}
