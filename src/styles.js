import { withStyles } from '@material-ui/core/styles';


// Utils

export function mergeClasses(classes, ...names) {
    return names.reduce((merged, name) => `${merged} ${classes[name]}`, '').slice(1);
}


// Style decorators

export const withFormStyles = withStyles({
    column: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
    },
    controls: {
        maxWidth: 240,
    },
});
