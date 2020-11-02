import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    container: {
        position: 'relative',
        textAlign: 'center',
    },
    title: {
        display: 'block',
        fontWeight: 200,
    },
    stat: {
        fontSize: '2.5rem',
    },
    unit: {
        color: theme.palette.text.secondary,
        fontSize: '1rem',
    },
    max: {
        color: theme.palette.text.secondary,
        position: 'relative',
        bottom: '-0.5rem',
    },
}));


export default function Stat({ value, title, max, unit, ...props }) {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            {title && <span className={classes.title}>{title}</span>}
            <span className={classes.stat}>{value}</span>
            {unit && <span className={classes.unit}>{unit}</span>}
            {max && <span className={classes.max}>/{max}</span> }
        </div>
    );
}

export function CircularStat({ value, max, ...props }) {
    return (
        <div style={{
            position: 'relative',
            width: 100,
            height: 100,
            padding: 10,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <CircularProgress variant="static" value={max ? (value / max * 100) : 100} style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                zIndex: -1,
            }} />
            <span style={{ fontSize: 40 }}>{value}</span>
            <span style={{
                position: 'absolute',
                right: 20,
                bottom: 20,
                fontSize: 10,
            }}>/{max}</span>
        </div>
    );
}