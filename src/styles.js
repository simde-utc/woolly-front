import { makeStyles } from '@material-ui/core/styles';


// Utils

export function mergeClasses(classes, ...names) {
    return names.reduce((merged, name) => (
        name in classes ? `${merged} ${classes[name]}` : merged
    ), '').slice(1);
}


// Style decorators

export const useFormStyles = makeStyles(theme => ({
    column: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
    },
    controls: {
        maxWidth: 240,
    },
    editor: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'transparent',
        padding: theme.spacing(2),
    },
    editing: {
        borderColor: 'yellow',
    },
    error: {
        borderColor: 'red',
    },
}));
