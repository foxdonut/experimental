import { compose } from "./utils"

export const createNavigator = update => {
  const componentMap = {}
  const navigateToMap = {}
  let notFoundComponent = undefined

  return {
    register: (configs, notFound) => {
      configs.forEach(config => {
        const component = config.component
        componentMap[config.key] = component
        const updateFn = model => Object.assign(model, { pageId: config.key })
        navigateToMap[config.key] = params => {
          if (component.navigating) {
            component.navigating(params, func => update(compose(func, updateFn)))
          }
          else {
            update(updateFn)
          }
        }
      })
      notFoundComponent = notFound
    },
    getComponent: pageId => componentMap[pageId] || notFoundComponent,
    navigateTo: (id, params) => {
      const target = navigateToMap[id]
      if (target) {
        target(params)
      }
    }
  }
}
