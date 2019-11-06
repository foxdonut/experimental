import React, { useState } from 'react';
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
    withStyles,
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
import { fsm, initialAppContext } from './app.machine'

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

const App = (props) => {
    const { classes } = props;
    const [current, setCurrent] = useState(fsm.current);
    const context = initialAppContext;

    const itemList = context.items.map((item) => ({
        ...item,
        selected: context.selectedItems.findIndex((selectedItem) => selectedItem.id === item.id) >= 0
    }));

    const allItemsSelected = context.selectedItems.length === context.items.length;

    const resetSelection = () => fsm.trigger("RESET_SELECTION").then(setCurrent);
    const deleteSelection = () => fsm.trigger("DELETE_SELECTION").then(setCurrent);
    const dismissPrompt = () => fsm.trigger("DISMISS_PROMPT").then(setCurrent);

    const toggleSelectItem = (item) => (item.selected ? fsm.trigger("DESELECT_ITEM", item) : fsm.trigger("SELECT_ITEM", item)).then(setCurrent);
    const toggleSelectAll = () => (allItemsSelected ? fsm.trigger("RESET_SELECTION") : fsm.trigger("SELECT_ALL_ITEMS")).then(setCurrent);

    return (
        <div className={classes.root}>
            <AppBar
                position="static"
                className={current === 'browsing' ? classes.bar : classes.selecting}
            >
                <Toolbar>
                    {
                        current === 'selecting' ?
                        (<IconButton
                            onClick={resetSelection}
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
                            current === 'browsing' ?
                            (<Typography variant="h6" id="tableTitle" className={classes.title}>
                                My files
                            </Typography>)
                            :
                            (<Typography color="inherit" variant="subtitle1">
                                {context.selectedItems.length} selected
                            </Typography>)
                        }
                    </div>
                    <div className={classes.spacer} />
                    <div className={classes.actions}>
                        {
                            current === 'browsing' ?
                            (<Tooltip title="Search">
                                <IconButton color="inherit" aria-label="Search">
                                    <Search />
                                </IconButton>
                            </Tooltip>)
                            :
                            (<Tooltip title="Delete">
                                <IconButton
                                    disabled={current === 'deleting'}
                                    color="inherit"
                                    aria-label="Delete"
                                    onClick={deleteSelection}
                                >
                                    <Delete />
                                    {current === 'deleting' && <CircularProgress size={40} className={classes.fabProgress} />}
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
                            onClick={() => toggleSelectItem(item)}
                            role="checkbox"
                            tabIndex={-1}
                            key={item.id}
                            selected={item.selected}
                        >
                            <TableCell padding="checkbox">
                                {
                                    current === 'browsing' ?
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
                open={current === 'prompting'}
                keepMounted
                onClose={dismissPrompt}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">Error deleting selection</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {context.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={dismissPrompt} color="primary">
                        Ok
                    </Button>
                    <Button onClick={deleteSelection} color="primary">
                        Retry
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

export default withStyles(styles)(App);
