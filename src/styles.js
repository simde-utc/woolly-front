import { makeStyles } from '@material-ui/core/styles';
import { fade } from "@material-ui/core/styles/colorManipulator";


// Utils

export function mergeClasses(classes, ...names) {
    return names.reduce((merged, name) => (
        name in classes ? `${merged} ${classes[name]}` : merged
    ), '').slice(1);
}

export function getButtonColoredVariant(theme, color, variant) {
  const colors = theme.palette[color];
  switch (variant) {
    case 'outlined':
      return {
        color: colors.main,
        border: `1px solid ${fade(colors.main, 0.5)}`,
        "&:hover": {
          border: `1px solid ${colors.main}`,
          backgroundColor: fade(
            colors.main,
            theme.palette.action.hoverOpacity
          ),
          "@media (hover: none)": {
            backgroundColor: "transparent"
          }
        }
      };
    case 'contained':
      return {
        color: colors.contrastText,
        backgroundColor: colors.main,
        "&:hover": {
          backgroundColor: colors.dark,
          "@media (hover: none)": {
            backgroundColor: colors.main
          }
        }
      };
    default:
    case 'text':
      return {
        color: colors.main,
        "&:hover": {
          backgroundColor: fade(colors.main, theme.palette.action.hoverOpacity),
          "@media (hover: none)": {
            backgroundColor: "transparent"
          }
        }
      };
  }
}


// Style decorators

export const useFormStyles = makeStyles(theme => ({
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
    error: {
        borderColor: 'red',
    },
}));
