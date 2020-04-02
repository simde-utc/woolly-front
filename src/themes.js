import { createMuiTheme } from '@material-ui/core/styles';

export const WoollyTheme = createMuiTheme({
    overrides: {
        MuiFormControl: {
            root: {
                marginBottom: '10px',
            }
        }
    }
});
