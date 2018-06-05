export const createNavigator = update => {
  const componentMap = {}
  const navigateToMap = {}

  return {
    register: configs => {
      configs.forEach(config => {
        const component = config.component
        componentMap[config.key] = component
        navigateToMap[config.key] = params => {
          if (component.navigating) {
            component.navigating(params)
          }
          else {
            update(model => Object.assign(model, { pageId: config.key, params }))
          }
        }
      })
    },
    getComponent: pageId => componentMap[pageId],
    navigateTo: (id, params) => {
      const target = navigateToMap[id]
      if (target) {
        target(params)
      }
    }
  }
}
