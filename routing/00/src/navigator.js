export const createNavigator = update => {
  const componentMap = {}
  const navigateToMap = {}

  return {
    register: configs => {
      configs.forEach(config => {
        const component = config.component
        componentMap[config.key] = component
        const updateFn = model => Object.assign(model, { pageId: config.key })
        const handler = params => {
          if (component.navigating) {
            component.navigating(params, () => update(updateFn))
          }
          else {
            update(updateFn)
          }
        }
        navigateToMap[config.key] = handler
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
