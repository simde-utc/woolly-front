import React from 'react';
import PropTypes from 'prop-types';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Button, CircularProgress, Tooltip
} from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';
import copy from 'copy-to-clipboard';


export function LoadingButton({ loading, disabled, LoaderProps, startIcon, ...props }) {
    const loader = <CircularProgress size="1em" {...LoaderProps} />;
    return (
        <Button
            startIcon={loading ? loader : props.startIcon}
            disabled={disabled || loading}
            {...props}
        />
    );
}

LoadingButton.propTypes = {
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    LoaderProps: PropTypes.object,
    startIcon: PropTypes.element,
};

LoadingButton.defaultProps = {
    loading: false,
    disabled: false,
    LoaderProps: {},
    startIcon: null,
};


export function CopyButton({ title, placement, ...props }) {
    const [copied, setCopied] = React.useState(false);
    function handleClick() {
        copy(props.value);
        setCopied(true);
    }

    return (
        <Tooltip
            title={title}
            placement={placement}
            open={copied}
            onClose={() => setCopied(false)}
        >
            <Button
                startIcon={<FileCopy />}
                onClick={handleClick}
                {...props}
            />
        </Tooltip>
    );    
}

CopyButton.propTypes = {
    title: PropTypes.string,
    placement: PropTypes.string,
};

CopyButton.defaultProps = {
    title: 'Copié !',
    placement: 'right',
};


export function ConfirmButton(props) {
    const {
        onClick, content, title, text, yes, no,
        buttons, colors, ...buttonProps
    } = props;
    const [event, setEvent] = React.useState(null);
    const close = () => setEvent(null);
    function onConfirmClick() {
        onClick(event);
        close();
    }

    return (
        <React.Fragment>
            <Dialog open={event !== null} onClose={close}>
                {content || (
                    <React.Fragment>
                        <DialogTitle>{title}</DialogTitle>
                        {text && (
                            <DialogContent>
                                <DialogContentText>
                                    {text}
                                </DialogContentText>
                            </DialogContent>
                        )}
                        <DialogActions>
                            {buttons ? buttons(close) : (
                                <React.Fragment>
                                    <Button
                                        onClick={close}
                                        color={colors.secondary || 'secondary'}
                                    >
                                        {no}
                                    </Button>
                                    <Button
                                        onClick={onConfirmClick}
                                        color={colors.primary || 'primary'}
                                    >
                                        {yes}
                                    </Button>
                                </React.Fragment>
                            )}
                        </DialogActions>
                    </React.Fragment>
                )}
            </Dialog>
            <Button
                onClick={event => { setEvent({ ...event }) }}
                {...buttonProps}
            />
        </React.Fragment>
    );
}

ConfirmButton.propTypes = {
    content: PropTypes.element,
    title: PropTypes.string.isRequired,
    text: PropTypes.node,
    onClick: PropTypes.func.isRequired,
    buttons: PropTypes.func,
    yes: PropTypes.string,
    no: PropTypes.string,
    colors: PropTypes.object,
};

ConfirmButton.defaultProps = {
    content: null,
    text: null,
    buttons: null,
    yes: "Oui",
    no: "Non",
    colors: {}, 
};
