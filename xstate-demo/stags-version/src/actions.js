import { ViewState } from './initial'

const setAllItemsTo = value => items => items.map(it => {
  it.selected = value
  return it
})

export const Actions = update => ({
  toggleSelectItem: item => {
    update({
      items: items => items.map(it => {
        if (it.id === item.id) {
          it.selected = !item.selected
        }
        return it
      })
    })
  },
  resetSelection: () => update({
    items: setAllItemsTo(false)
  }),
  selectAll: () => update({
    items: setAllItemsTo(true)
  }),
  deleteSelection: () => update({
    viewState: ViewState.Deleting()
  }),
  dismissPrompt: () => update({
    viewState: ViewState.Selecting()
  })
})
