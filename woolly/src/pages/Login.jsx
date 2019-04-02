import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';


class Login extends React.Component{
    render(){
        const { classes } = this.props;

        return(
            <div className="container" style={{display: "flex", flexDirection: "column",alignItems: "center"}}>
                <h1 className={classes.title}>Espace de connexion</h1>
                <a href="#" style={{textDecoration: "none"}}>
                    <Button variant="contained" color="primary" className={classes.button}>Se connecter</Button>
                </a>
            </div>
        )
    }
}

Login.propTypes = {
	classes: PropTypes.object.isRequired,
};

const classes = theme => ({
    title: {
        fontFamily: "roboto",
        fontWeight: 100,
        fontSize: "2.4em",
        margin: "70px 0"
    },
    button: {
        padding: "0.8em 3em",
    }
})

export default withStyles(classes)(Login)