import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core'; 
import { capitalFirst } from '../../utils';

const FLEX_DIRECTIONS = {
	right:  'row',
	left:   'row-reverse',
	top:    'column-reverse',
	bottom: 'column',
};
const SIZES = {
	sm:  { text: 14, spinner: 22 },
	md:  { text: 18, spinner: 30 },
	lg:  { text: 24, spinner: 36 },
	xl:  { text: 32, spinner: 48 },
	xxl: { text: 40, spinner: 60 },
};

class Loader extends React.Component {

	getStyles() {
		const { fluid, text, size, textDirection } = this.props;
		const sizes = this.props.sizes || SIZES[size];
		let container = {}, spinner = {}, textStyle = {};

		// Container
		if (textDirection)
			container.flexDirection = FLEX_DIRECTIONS[textDirection];
		if (fluid) {
			container.margin = 'auto';
			container.height = '100%';
			container.width = '100%';
		}

		// Text
		if (text)
			textStyle.fontSize = sizes.text;

		// Spinner
		spinner.height = spinner.width = sizes.spinner;
		spinner[`margin${text ? capitalFirst(textDirection) : ''}`] = '0.5em';

		// Merge with props styles
		let styles = { container, spinner, text: textStyle };
		for (const key in this.props.styles)
			styles[key] = { ...styles[key], ...this.props.styles[key] };
		return styles;
	}

	render() {
		if (this.props.children && !this.props.loading)
			return this.props.children;

		const { classes, text } = this.props;
		const styles = this.getStyles();
		return (
			<div className={classes.container} style={styles.container}>
				<CircularProgress style={styles.spinner} />
				{text && <span style={styles.text}>{text}</span>}
			</div>
		)
	}
}

Loader.propTypes = {
	classes: PropTypes.object.isRequired,
	loading: PropTypes.bool,
	text: PropTypes.string,
	size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'xxl']),
	textDirection: PropTypes.oneOf(['right', 'left', 'top', 'bottom']),
	styles: PropTypes.shape({
		text: PropTypes.object,
		container: PropTypes.object,
		spinner: PropTypes.object,
	}),
};

Loader.defaultProps = {
	loading: true,
	fluid: true,
	size: 'md',
	textDirection: 'right',
	styles: {},
};

const styles = {
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
};

export default withStyles(styles)(Loader);
