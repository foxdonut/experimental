export const Actions = update => ({
  toggleSelectItem: item => {
    if (item.selected) {
      update({
        items: items => items.map(it => {
          if (it.id === item.id) {
            it.selected = false
          }
          return it
        })
      })
    } else {
      update({
        items: items => items.map(it => {
          if (it.id === item.id) {
            it.selected = true
          }
          return it
        })
      })
    }
  },
  resetSelection: () => update({
    items: items => items.map(it => {
      it.selected = false
      return it
    })
  }),
  selectAll: () => update({
    items: items => items.map(it => {
      it.selected = true
      return it
    })
  }),
  deleteSelection: () => update({
    viewState: 'deleting'
  }),
  dismissPrompt: () => update({
    viewState: 'selecting'
  })
})
