import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

function createResponsiveTheme(...args) {
	return responsiveFontSizes(createMuiTheme(...args));
}

export const WoollyTheme = createResponsiveTheme({
	themeName: "Woolly",
	typography: {
		fontFamily: [
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
		].join(","),
	},
	palette: {
		primary: {
			main: "#025862",
		},
		secondary: {
			main: "#2196f3",
			light: "#00b7ff",
			dark: "#1976d2",
			contrastText: "#fff",
		},
		success: {
			main: "#008805",
		},
		warning: {
			main: "#FA8C05",
			light: "#F2B705",
			dark: "#EE6B4D",
			contrastText: "#fff",
		},
		error: {
			main: "#e00000",
		},
		neutral: {
			dark: "#293241",
			main: "#3D5B81",
			light: "#98C0D9",
		},
	},
	overrides: {
		MuiFormControl: {
			root: {
				marginBottom: 10,
				minWidth: 100,
				maxWidth: 300,
			},
		},
		MuiListItem: {
			dense: {
				paddingTop: 0,
				paddingBottom: 0,
			},
		},
		MuiListItemText: {
			dense: {
				marginTop: 0,
				marginBottom: 0,
			},
		},
	},
});
