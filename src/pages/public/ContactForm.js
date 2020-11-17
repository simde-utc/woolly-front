import React, { useState } from 'react'
import {getButtonColoredVariant} from "../../styles";
import { Container, Grid} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {useSelector} from "react-redux";
import {apiAxios } from "../../redux/actions";
import Loader from "../../components/common/Loader";

const styles = theme => ({
    title: {
        fontSize: '4em',
        margin: 0,
    },
    subtitle: {
        color: theme.palette.text.secondary,
        fontWeight: 100,
    },
    buttonEmpty: {
        ...getButtonColoredVariant(theme, "warning", "outlined"),
        margin: theme.spacing(1),
    },
    buttonBuy: {
        ...getButtonColoredVariant(theme, "success", "contained"),
        margin: theme.spacing(1),
    },
    alert: {
        textAlign: 'center',
        color: '#f50057',
    },
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
        flexGrow: 1,

    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },

    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        minWidth: 220,
    },
    controls: {
        maxWidth: 280,
    },
    editor: {
        // borderWidth: 1,
        // borderStyle: 'solid',
        // borderColor: 'transparent',
        padding: theme.spacing(2),
    },
    editing: {
        borderColor: 'yellow',
    },
    textF: {
        margin: 3,
        padding: 5

    },
    button: {
        margin: theme.spacing(1),
    },
});



export default function ContactForm() {
    const user = useSelector(store => store.getAuthUser());
    const [reasonIndex, setReasonIndex] = useState(0);
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(0);

    async function handleSubmit(e){
        e.preventDefault();
        if(message.length < 0 || reasonIndex === 0) {
            //TODO : validation
            console.log("Données invalides")
            return;
        }
        const reasonToSend = reason
        const subject = "[WOOLLY][FeedBack] - " + reason + " - " + user.name;
        const sender = {name: user.name, id: user.id, email: user.email};
        const datas = {subject: subject, message: message, sender: sender, reason: reasonToSend};
        setLoading(1);
        await apiAxios.post("/feedback", datas).then(() => {
            setReasonIndex(0);
            setReason("");
            setMessage("");
            setLoading(0);
        });
    }


    return (
        loading ? (
            <Loader text="Envoi du message ..." />
        ) : (
            <Container>
                <h1>Contacter l'équipe</h1>
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={3}
                          direction="row"
                          justify="center"
                          alignItems="center">

                        <Grid container item xs={12}
                              direction="row"
                              justify="center"
                              alignItems="center"
                        >

                            <FormControl className={styles.formControl}>
                                <h4>Veuillez sélectionner un motif</h4>
                                <Select
                                    labelId="reason_select"
                                    id="reason"
                                    value={reasonIndex}
                                    onChange={(e, select) => {setReasonIndex(e.target.value); setReason(select.props.children)}}
                                    required
                                >
                                    <MenuItem value={1}>Création d'une vente</MenuItem>
                                    <MenuItem value={2}>Gestion d'une vente</MenuItem>
                                    <MenuItem value={3}>Commande passée</MenuItem>
                                    <MenuItem value={4}>Signaler un bug</MenuItem>
                                    <MenuItem value={5}>Autre</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid container item xs={12}
                              direction="row"
                              justify="center"
                              alignItems="center"
                        >
                            <FormControl         >

                                <TextField
                                    id="message_content"
                                    label="Message"
                                    placeholder="Dîtes nous ce qu'il se passe !"
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={10}
                                    rowsMax={25}
                                    required={true}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                        <Button
                            variant="contained"
                            color="default"
                            className={styles.button}
                            startIcon={<CloudUploadIcon />}
                            onClick={handleSubmit}
                            type="submit"
                        >
                            Envoyer
                        </Button>
                    </Grid>
                </form>
            </Container>
        )

    );
}
