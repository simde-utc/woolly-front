import React from 'react';
import { Dialog, Box, Paper, Grid, Button, IconButton, useMediaQuery } from '@material-ui/core';
// import { Skeleton } from '@material-ui/lab';
import { Close } from '@material-ui/icons';

import { useFormStyles } from '../../../../styles';
import { LoadingButton, ConfirmButton } from '../../../../components/common/Buttons';
import ItemsDisplay from './ItemsDisplay';
import ItemEditor from './ItemEditor';
import ItemGroupEditor from './ItemGroupEditor';
// import Loader from '../../../components/common/Loader';


function ItemsTutorialMini(props) {
    return (
        <Box clone p={2}>
            <Paper>
                <p>Hello</p>
            </Paper>
        </Box>
    );
}

function ItemsTutorialFull(props) {
    return (
        <Grid item xs={12} md={6}>
            <h2>Ajouter/modifier des articles</h2>
            <Box clone p={2}>
                <Paper>
                    <h5>Ajouter</h5>
                    <p>
                        Vous pouvez ajouter des articles et des groupes
                        en utilisant les boutons ci-dessous.
                    </p>
                    <h5>Modifier</h5>
                    <p>
                        Une fois ajoutés, cliquez sur les titres de groupe
                        ou sur les cartes d'article pour les modifier.
                    </p>
                </Paper>
            </Box>
        </Grid>
    );
}


function ItemsManager({ selected, ...props }) {
    const inDialog = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const classes = useFormStyles();

    // TODO Loading
    // if (this.state.loading_items || !this.props.usertypes.fetched)
    //     return <Loader text="Chargement des articles..." />


    // Get resource editor if a resource is selected
    let editor = null;
    if (selected) {
        const { resource: name, id } = selected;
        const resource = props[name][id];
        const isNew = resource._isNew;

        // Get editor
        let editorTitle = isNew ? "Ajouter " : "Modifier ";
        let supprTitle = "Êtes-vous sûr.e de vouloir supprimer ";
        const editorProps = {
            onChange: props.onChange,
            errors: props.errors[name][id] || {},
            editing: props.editing[name][id],
            saving: props.saving[name][id],
            inDialog,
        };

        switch (name) {
            case 'items':
                editorTitle += "un article";
                supprTitle += "cet article ?";
                editor = (
                    <ItemEditor
                        item={resource}
                        {...props.choices}
                        {...editorProps}
                    />
                );
                break;
            case 'itemgroups':
                editorTitle += "un groupe";
                supprTitle += "ce groupe ?";
                editor = (
                    <ItemGroupEditor
                        itemgroup={resource}
                        {...editorProps}
                    />
                );
                break;
            default:
                throw Error(`Unknown resource '${name}'`);
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
        const buttonProps = { name, value: id, disabled: editorProps.saving };
        editor = (
            <React.Fragment>
                <Box style={inDialog ? { overflowY: 'auto', overflowX: 'hidden'} : {}}>
                    {editor}
                </Box>
                <Box textAlign="center">
                    {!isNew && (
                        <Button
                            onClick={props.onReset}
                            {...buttonProps} 
                            disabled={!editorProps.editing || editorProps.saving}
                        >
                            Annuler
                        </Button>
                    )}
                    <ConfirmButton
                        onClick={props.onDelete}
                        {...buttonProps}
                        title={supprTitle}
                        yes="Supprimer"
                        no="Annuler"
                    >
                        Supprimer
                    </ConfirmButton>
                    <LoadingButton loading={editorProps.saving} onClick={props.onSave} {...buttonProps}>
                        {isNew ? "Créer" : "Sauvegarder" }
                    </LoadingButton>
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
                <Paper className={classes.editor}>
                    {editor}
                </Paper>
            </Grid>
        )
    }

    return (
        <React.Fragment>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <h2>Articles</h2>
                    {inDialog && editor === null && <ItemsTutorialMini />}
                    <ItemsDisplay
                        items={props.items}
                        itemgroups={props.itemgroups}
                        usertypes={props.usertypes}
                        onSelect={props.onSelect}
                        selected={selected}
                        editing={props.editing}
                        saving={props.saving}
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
                {editor || (!inDialog && <ItemsTutorialFull />)}
            </Grid>
        </React.Fragment>
    );
}

export default ItemsManager;
