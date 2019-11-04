// Simulated API request
let attempts = 2
function deleteItems(items) {
    return new Promise((resolve, reject) => (++attempts % 3 === 0)
        ? setTimeout(() => resolve(`${items.length} items deleted succesfully`), 1000)
        : setTimeout(() => reject(`Error deleting the ${items.length} selected item(s). Please try again later.`), 1000)
    )
};

export const services = [
  ({ state }) => ({
    state: { selectedItems: state.items.filter(it => it.selected) }
  }),
  ({ state, patch }) => !patch.viewState && ({
    state: { viewState: state.selectedItems.length === 0 ? 'browsing' : 'selecting' }
  }),
  ({ patch }) => {
    if (patch.viewState === 'deleting') {
      return {
        next: ({ state, update }) => {
          const items = state.items.filter(it => it.selected)
          deleteItems(items).then(() => {
            update({
              items: items => items.filter(it => !it.selected)
            })
          }).catch(message => {
            update({
              viewState: 'prompting',
              message
            })
          })
        }
      }
    }
  }
]
