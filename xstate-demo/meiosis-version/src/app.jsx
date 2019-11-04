import React from 'react';
import {
    AppBar,
    Button,
    CircularProgress,
    Checkbox,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Tooltip,
    Typography,
    withStyles
} from '@material-ui/core';
import {
    Close,
    Delete,
    FolderShared,
    Menu,
    Search,
} from '@material-ui/icons';
import blue from '@material-ui/core/colors/blue';
import deepPurple from '@material-ui/core/colors/deepPurple';

import { initialAppContextItems } from './app.machine';

import simpleStream from 'meiosis-setup/simple-stream';
import merge from 'mergerino';
import meiosisReact from 'meiosis-setup/react';
import meiosisMergerino from 'meiosis-setup/mergerino';

const styles = (theme) => createStyles({
    root: {
        flexGrow: 1,
    },
    bar: {
        // backgroundColor: theme.palette.common.black,
    },
    selecting: {
        backgroundColor: deepPurple[500],
    },
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    menuButton: {
        marginLeft: -18,
        marginRight: 10,
    },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        // color: theme.palette.text.secondary,
    },
    titleContainer: {
        flex: '0 0 auto',
    },
    title: {
        color: theme.palette.common.white,
    },
    fabProgress: {
      color: blue[500],
      position: 'absolute',
      top: 6,
      zIndex: 1,
    }
});

// Simulated API request
let attempts = 2
function deleteItems(items) {
    return new Promise((resolve, reject) => (++attempts % 3 === 0)
        ? setTimeout(() => resolve(`${items.length} items deleted succesfully`), 1000)
        : setTimeout(() => reject(`Error deleting the ${items.length} selected item(s). Please try again later.`), 1000)
    )
};

const Root = props => {
    const { state, actions } = props;
    const { classes } = state;

    const itemList = state.items.map((item) => ({
        ...item,
        selected: state.selectedItems.findIndex((selectedItem) => selectedItem.id === item.id) >= 0
    }));

    const allItemsSelected = state.selectedItems.length === state.items.length;
    const toggleSelectAll = () => allItemsSelected ? actions.resetSelection() : actions.selectAll()

    return (
        <div className={classes.root}>
            <AppBar
                position="static"
                className={state.viewState === 'browsing' ? classes.bar : classes.selecting}
            >
                <Toolbar>
                    {
                        state.viewState === 'selecting' ?
                        (<IconButton
                            onClick={actions.resetSelection}
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="Reset Selection">
                            <Close />
                        </IconButton>)
                        :
                        (<IconButton
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="Menu">
                            <Menu />
                        </IconButton>)
                    }
                    <div className={classes.titleContainer}>
                        {
                            state.viewState === 'browsing' ?
                            (<Typography variant="h6" id="tableTitle" className={classes.title}>
                                My files
                            </Typography>)
                            :
                            (<Typography color="inherit" variant="subtitle1">
                                {state.selectedItems.length} selected
                            </Typography>)
                        }
                    </div>
                    <div className={classes.spacer} />
                    <div className={classes.actions}>
                        {
                            state.viewState === 'browsing' ?
                            (<Tooltip title="Search">
                                <IconButton color="inherit" aria-label="Search">
                                    <Search />
                                </IconButton>
                            </Tooltip>)
                            :
                            (<Tooltip title="Delete">
                                <IconButton
                                    disabled={state.viewState === 'deleting'}
                                    color="inherit"
                                    aria-label="Delete"
                                    onClick={actions.deleteSelection}
                                >
                                    <Delete />
                                    {state.viewState === 'deleting' && <CircularProgress size={40} className={classes.fabProgress} />}
                                </IconButton>
                            </Tooltip>)
                        }
                    </div>
                </Toolbar>
            </AppBar>
            <Table aria-labelledby="tableTitle">
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={allItemsSelected}
                                onChange={toggleSelectAll}
                            />
                        </TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell>Last Modified</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {itemList.map((item) => (
                        <TableRow
                            hover
                            onClick={() => actions.toggleSelectItem(item)}
                            role="checkbox"
                            tabIndex={-1}
                            key={item.id}
                            selected={item.selected}
                        >
                            <TableCell padding="checkbox">
                                {
                                    state.viewState === 'browsing' ?
                                    (<IconButton><FolderShared /></IconButton>)
                                    :
                                    (<Checkbox checked={item.selected}/>)
                                }
                            </TableCell>
                            <TableCell component="th" scope="row">{item.title}</TableCell>
                            <TableCell>{item.owner}</TableCell>
                            <TableCell>{item.updatedAt.toDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog
                open={state.viewState === 'prompting'}
                keepMounted
                onClose={actions.dismissPrompt}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">Error deleting selection</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {state.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={actions.dismissPrompt} color="primary">
                        Ok
                    </Button>
                    <Button onClick={actions.deleteSelection} color="primary">
                        Retry
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

const App = meiosisReact({ React, Root });

export default withStyles(styles)((props) => {
  const app = {
    initial: Object.assign({
      items: initialAppContextItems,
      viewState: 'browsing',
    }, props),
    Actions: update => ({
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
    }),
    services: [
      ({ state }) => ({
        state: { selectedItems: state.items.filter(it => it.selected) }
      }),
      ({ state, patch }) => !patch.viewState && ({
        state: { viewState: state.selectedItems.length === 0 ? 'browsing' : 'selecting' }
      }),
      ({ state, patch }) => {
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
  };

  const { states, actions } = meiosisMergerino({
    stream: simpleStream,
    merge,
    app
  });

  return <App states={states} actions={actions} />
});
