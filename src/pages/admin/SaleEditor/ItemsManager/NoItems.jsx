import React from 'react';
import { Box, Paper } from '@material-ui/core';

export default function NoItems({ group }) {
    const Title = group ? 'h5' : 'h4';
    return (
        <Box clone p={2} textAlign="center">
            <Paper variant="outlined" style={{ borderStyle: 'dashed' }}>
                <Title>Aucun article !</Title>
                <p>
                    {group ? (
                        group._isNew
                            ? "Ajoutez en après avoir sauvegarder le groupe"
                            : "Ajoutez en avec le bouton ci-dessous !"
                    ) : (
                        "Ajouter des groupes et articles avec les boutons ci-dessous"
                    )}
                </p>
            </Paper>
        </Box>
    );
}
