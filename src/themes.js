import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

function createResponseTheme(...args) {
    return responsiveFontSizes(createMuiTheme(...args));
}

// https://material.io/inline-tools/color/ #ff7300

export const WoollyTheme = createResponseTheme({
    themeName: 'Woolly',
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            // '"Apple Color Emoji"',
            // '"Segoe UI Emoji"',
            // '"Segoe UI Symbol"',
        ].join(','),
    },
    overrides: {
        MuiFormControl: {
            root: {
                marginBottom: 10,
                minWidth: 100,
                maxWidth: 300,
            },
        },
    },
});
