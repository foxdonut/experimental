export const createNavigator = update => {
  let componentMap = {}

  return {
    register: compMap => {
      componentMap = compMap
    },
    navigate: (pageId, params) => {
      const Component = componentMap[pageId]

      if (Component && Component.navigate) {
        Component.navigate(params)
      }
      else {
        update({ pageId, params })
      }
    },
    getComponent: pageId => componentMap[pageId]
  }
}
