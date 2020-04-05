import React from 'react';
import { Dialog, Box, Paper, Grid, Button, IconButton, useMediaQuery } from '@material-ui/core';
// import { Skeleton } from '@material-ui/lab';
import { Close } from '@material-ui/icons';

import ItemsDisplay from './ItemsDisplay';
import ItemEditor from './ItemEditor';
// import ItemGroupEditor from './ItemGroupEditor';
// import Loader from '../../../components/common/Loader';


function ItemsManager({ selected, ...props }) {
    const inDialog = useMediaQuery(theme => theme.breakpoints.down('sm'));

    // TODO Loading
    // if (this.state.loading_items || !this.props.usertypes.fetched)
    //     return <Loader text="Chargement des articles..." />


    // Get resource editor if a resource is selected
    let editor = null;
    if (selected) {
        // TODO Assert resource
        const resource = props[selected.resource][selected.id];
        const resourceErrors = props.errors[selected.resource][selected.id] || {}
        const isNew = resource._isNew;

        // Get editor
        let editorTitle = isNew ? "Ajouter " : "Modifier ";
        const editorProps = {
            onChange: props.onChange,
            errors: resourceErrors,
            inDialog,
        };
        switch (selected.resource) {
            case 'items':
                editorTitle += "un article";
                editor = (
                    <ItemEditor
                        item={resource}
                        //saving={this.state.saving_details}
                        {...props.choices}
                        {...editorProps}
                    />
                );
                break;
            case 'itemgroups':
                editorTitle += "un groupe";
                editor = 'TODO'
                break;
            default:
                throw Error(`Unknown resource '${selected.resource}'`);
        }

        // Wrap title with close button
        editorTitle = (
            <Box display="flex" alignItems="center">
                <h2>{editorTitle}</h2>
                <Box clone ml="auto">
                    <IconButton onClick={props.onSelect} name="unselect">
                        <Close />
                    </IconButton>
                </Box>
            </Box>
        );
    
        // Wrap editor with edition buttons
        const buttonProps = { name: selected.resource, value: selected.id };
        // TODO Additional work on saving....
        editor = (
            <React.Fragment>
                <Box style={{ overflowY: 'auto', overflowX: 'hidden'}}>
                    {editor}
                </Box>
                <Box textAlign="center">
                    <Button onClick={props.onReset} {...buttonProps}>
                        Annuler
                    </Button>
                    <Button onClick={props.onSave} {...buttonProps}>
                        {isNew ? "Créer" : "Sauvegarder" }
                    </Button>
                    {!isNew && (
                        <Button onClick={props.onDelete} {...buttonProps}>
                            Supprimer
                        </Button>
                    )}
                </Box>
            </React.Fragment>
        );

        // Wrap editor in proper container to integrate better in the view
        editor = inDialog ? (
            <Dialog fullScreen open>
                <Box display="flex" flexDirection="column" overflow="hidden" px={2}>
                    {editorTitle}
                    {editor}
                </Box>
            </Dialog>
        ) : (
            <Grid item xs={12} md={6}>
                {editorTitle}
                <Box clone p={2}>
                    <Paper>
                        {editor}
                    </Paper>
                </Box>
            </Grid>
        )
    }

    return (
        <React.Fragment>
            <Grid container spacing={4}>
                <Grid item md={editor ? 6 : 12}>
                    <h2>Articles</h2>
                    <ItemsDisplay
                        items={props.items}
                        itemgroups={props.itemgroups}
                        usertypes={props.usertypes}
                        onSelect={props.onSelect}
                        selected={selected}
                    />
                    <Box textAlign="center">
                        <Button onClick={props.onAdd} name="itemgroups">
                            Ajouter un groupe
                        </Button>
                        <Button onClick={props.onAdd} name="items">
                            Ajouter un article
                        </Button>
                    </Box>
                </Grid>
                {editor}
            </Grid>
        </React.Fragment>
    );
}

export default ItemsManager;
