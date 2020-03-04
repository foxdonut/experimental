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

import { initial, ViewState } from './initial';
import { Actions } from './actions';
import { services } from './services';

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
                className={ViewState.isBrowsing(state.viewState) ? classes.bar : classes.selecting}
            >
                <Toolbar>
                    {
                        ViewState.isSelecting(state.viewState) ?
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
                            ViewState.isBrowsing(state.viewState) ?
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
                            ViewState.isBrowsing(state.viewState) ?
                            (<Tooltip title="Search">
                                <IconButton color="inherit" aria-label="Search">
                                    <Search />
                                </IconButton>
                            </Tooltip>)
                            :
                            (<Tooltip title="Delete">
                                <IconButton
                                    disabled={ViewState.isDeleting(state.viewState)}
                                    color="inherit"
                                    aria-label="Delete"
                                    onClick={actions.deleteSelection}
                                >
                                    <Delete />
                                    {ViewState.isDeleting(state.viewState) && <CircularProgress size={40} className={classes.fabProgress} />}
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
                                    ViewState.isBrowsing(state.viewState) ?
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
                open={ViewState.isPrompting(state.viewState)}
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
    initial: Object.assign(initial, props),
    Actions,
    services
  };

  const { states, actions } = meiosisMergerino({
    stream: simpleStream,
    merge,
    app
  });

  return <App states={states} actions={actions} />
});
