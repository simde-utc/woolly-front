import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Dialog, Box, Paper, Grid, Button, IconButton, useMediaQuery } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import { useFormStyles } from 'utils/styles';
import { LoadingButton, ConfirmButton } from 'components/common/Buttons';
import ItemsDisplay from './ItemsDisplay';
import ItemEditor from './ItemEditor';
import ItemGroupEditor from './ItemGroupEditor';



function ItemsTutorial(props) {
    return (
        <Grid item xs={12} md={6}>
            <Alert severity="info">
                <AlertTitle>Ajouter et modifier des articles</AlertTitle>
                <h5 style={{ marginBottom: 4 }}>Ajouter</h5>
                <p style={{ marginTop: 0 }}>
                    Vous pouvez ajouter des articles et des groupes
                    en utilisant les boutons ci-dessous.
                </p>
                <h5 style={{ marginBottom: 4 }}>Modifier</h5>
                <p style={{ marginTop: 0 }}>
                    Une fois ajoutés, cliquez sur les titres de groupe
                    ou sur les cartes d'article pour les modifier.
                </p>
            </Alert>
        </Grid>
    );
}


function ItemsManager({ selected, ...props }) {
    const inDialog = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const classes = useFormStyles();

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
                        onItemFieldChange={props.onItemFieldChange}
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
                <h3 style={{ margin: 0 }}>{editorTitle}</h3>
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
                <Box style={inDialog ? { overflowY: 'auto', overflowX: 'hidden' } : {}}>
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
                <Paper className={classes.editor}>
                    {editorTitle}
                    {editor}
                </Paper>
            </Grid>
        )
    }

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                {inDialog && editor === null && <ItemsTutorial />}
                <ItemsDisplay
                    items={props.items}
                    itemgroups={props.itemgroups}
                    usertypes={props.usertypes}
                    onSelect={props.onSelect}
                    selected={selected}
                    editing={props.editing}
                    saving={props.saving}
                    errors={props.errors}
                />
                <Box textAlign="center">
                    <Box clone m={1}>
                        <Button
                            onClick={props.onAdd} name="itemgroups"
                            color="primary" variant="outlined"
                        >
                            Ajouter un groupe
                        </Button>
                    </Box>
                    <Box clone m={1}>
                        <Button
                            onClick={props.onAdd} name="items"
                            color="primary" variant="contained"
                        >
                            Ajouter un article
                        </Button>
                    </Box>
                </Box>
            </Grid>
            {editor || (!inDialog && <ItemsTutorial />)}
        </Grid>
    );
}

export default ItemsManager;
