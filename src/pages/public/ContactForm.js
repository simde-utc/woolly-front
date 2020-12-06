import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import messagesActions from "redux/actions/messages";
import {apiAxios} from "utils/api";
import {useFormStyles} from "utils/styles";

import {Box, Container, Grid, Paper, Button} from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Loader from "components/common/Loader";
import FieldGenerator from 'components/common/FieldGenerator';


export default function ContactForm() {

    const error = {};
    const initialStore = {choix: 0, reason: null, message: null, loading: false}
    const [store, changeStore] = React.useState(initialStore);
    const classes = useFormStyles();

    const onChange = event => {
        const {name, value} = event.target;
        if (name === 'choix' && choicePossibilites[value - 1]) {
            changeStore(prevState => ({...prevState, reason: choicePossibilites[value - 1].label}));
        }
        changeStore(prevState => ({...prevState, [name]: value}));
    }

    const Field = new FieldGenerator(store, error, onChange);

    const choicePossibilites = [
        {
            label: 'Création d\'une vente', value: '1'
        },
        {
            label: 'Gestion d\'une vente', value: '2'
        },
        {
            label: 'Commande passée', value: '3'
        },
        {
            label: 'Signaler un bug', value: '4'
        },
        {
            label: 'Autre', value: '5'
        }
    ];

    const user = useSelector(store => store.getAuthUser());
    const dispatch = useDispatch();

    async function handleSubmit() {

        const sender = {name: user.name, id: user.id, email: user.email};
        const datas = {message: store.message, sender: sender, reason: store.reason};
        changeStore(prevState => ({...prevState, loading: true}));

        try {
            await apiAxios.post("/feedback", datas).then(() => {
                changeStore(initialStore);
                dispatch(messagesActions.pushMessage("Message envoyé !", "Votre message a bien été transmis au SiMDE", "success"));
            });
        } catch (error) {
            changeStore(prevState => ({...prevState, loading: false}));
            dispatch(messagesActions.pushError(error, "Un ou plusieurs champs sont manquants"));
        }

    }

    return (
        store.loading ? (
            <Loader text="Envoi du message ..."/>
        ) : (


            <Container>
                <Box clone mb={3} mt={6} textAlign="center">
                    <h2>Contacter le SiMDE</h2>
                </Box>

                <Paper className={classes.editor}>
                    <Grid container spacing={13}
                          direction="column"
                          justify="center"
                          alignItems="center">

                        <Grid className={classes.column}>
                            <h4>Veuillez sélectionner un motif</h4>
                            {Field.select('choix', "Choix", choicePossibilites, {required: true})}
                        </Grid>

                        <Grid className={classes.column} >
                            <h4>Message</h4>
                            {Field.text('message', 'Message', {
                                required: true,
                                multiline: true,
                                rows: 6,
                                fullWidth: true
                            })}
                        </Grid>

                    </Grid>

                    <Box textAlign="center" mt={4}>
                        <Button
                            variant="contained"
                            color="default"
                            startIcon={<CloudUploadIcon/>}
                            onClick={handleSubmit}
                            type="submit"
                        >
                            Envoyer
                        </Button>
                    </Box>
                </Paper>

            </Container>
        )
    );
}
