import React from 'react';
import {
    Box, Grid, Button, TableContainer, Table,
    TableHead, TableBody, TableRow, TableCell
} from '@material-ui/core';


import FieldGenerator from '../../../../components/common/FieldGenerator';
import { useFormStyles } from '../../../../styles';


function ItemFieldsTable({ Field, itemfields, fields, ...props}) {
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Champ</TableCell>
                        <TableCell>Editable</TableCell>
                        <TableCell>
                                <Button
                                    name="add" onClick={props.onChange}
                                    color="primary" variant="outlined"
                                >
                                    Ajouter
                                </Button>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {itemfields.length ? (
                        itemfields.map((itemfield, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {(itemfield._isNew
                                        ? Field.select(`itemfields.${index}.field`, null, fields, { required: true })
                                        : fields[itemfield.field].label
                                    )}
                                </TableCell>
                                <TableCell>
                                    {Field.boolean(`itemfields.${index}.editable`)}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        name="delete"
                                        value={index}
                                        onClick={props.onChange}
                                    >
                                        Supprimer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <Box component="td" colSpan="3" textAlign="center" color="text.secondary" py={2}>
                                Aucun champ ! Ajouter en avec le bouton ci-dessus.
                            </Box>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default function ItemEditor({ item, ...props }) {
    const classes = useFormStyles()
    const Field = new FieldGenerator(
        item,
        props.errors,
        props.onChange,
        `items.${item.id}`,
        { disabled: props.disabled || props.saving }
    );

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} className={classes.column}>
                    <h4>Description</h4>
                    {Field.text('name', "Nom", { autoFocus: true })}
                    {Field.text('description', "Description", { multiline: true, rows: 2 })}
                    {Field.select('group', "Groupe", props.itemgroups, { default: 'null' })}
                    {Field.select('usertype', "Type d'acheteur", props.usertypes)}
                    {Field.number('price', "Prix")}
                </Grid>

                <Grid item xs={12} sm={6} className={classes.column}>
                    <h4>Disponibilité</h4>
                    {Field.boolean('is_active', "Actif")}
                    {Field.number('quantity', "Quantité")}
                    {Field.number('max_per_user', "Max par acheteur")}
                </Grid>
            </Grid>

            {!item._isNew && (
                <React.Fragment>
                    <h4>Champs</h4>
                    <ItemFieldsTable
                        Field={Field}
                        itemfields={item.itemfields}
                        fields={props.fields}
                        onChange={props.onItemFieldChange(item.id)}
                    />
                </React.Fragment>
            )}
        </React.Fragment>
    );
}
