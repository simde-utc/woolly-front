import React from 'react';

import { CircularProgress } from '@material-ui/core';


export default function Stat({ value, max, ...props }) {
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