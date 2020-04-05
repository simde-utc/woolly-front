import React from 'react';
import { Box, Grid, Button, IconButton } from '@material-ui/core';
// import { Skeleton } from '@material-ui/lab';
import { Close } from '@material-ui/icons';

import ItemsDisplay from './ItemsDisplay';
import ItemEditor from './ItemEditor';
// import ItemGroupEditor from './ItemGroupEditor';
// import Loader from '../../../components/common/Loader';


function ItemsManager({ selected, ...props }) {
    // if (this.state.loading_items || !this.props.usertypes.fetched)
    //     return <Loader text="Chargement des articles..." />

    let editor = null;
    let editorTitle = null;
    if (selected) {
        const resource = props[selected.resource][selected.id];
        const isNew = resource && resource._isNew;
        editorTitle = isNew ? "Ajouter " : "Modifier ";

        switch (selected.resource) {
            case 'items':
                editorTitle += "un article";
                editor = (
                    <ItemEditor
                        item={resource}
                        errors={props.errors[selected.resource][selected.id] || {}}
                        //saving={this.state.saving_details}
                        {...props.choices}
                        {...props.editorProps}
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
    }

    if (editor) {
        
    }


    // <Dialog fullScreen open={open} onClose={handleClose}

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
                </Grid>
                {editor && (
                    <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center">
                            <h2>{editorTitle}</h2>
                            <Box ml="auto" clone>
                                <IconButton onClick={props.onSelect} name="unselect" ml="auto">
                                    <Close />
                                </IconButton>
                            </Box>
                        </Box>
                        {editor}
                    </Grid>
                )}
            </Grid>

            <Box textAlign="center">
                <Button onClick={props.onAdd} name="itemgroups">
                    Ajouter un groupe
                </Button>
                <Button onClick={props.onAdd} name="items">
                    Ajouter un article
                </Button>
            </Box>
        </React.Fragment>
    );
}

export default ItemsManager;
