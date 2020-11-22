import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { TableContainer, Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import { SkeletonTable } from "./Skeletons";

const useStyles = makeStyles({
	topborder: {
		borderTop: "1px solid rgba(224, 224, 224, 1)",
	},
	label: {
		fontWeight: 500,
		fontSize: "1em",
		paddingRight: "1em",
	},
	value: {
		fontWeight: 200,
	},
});

function renderDetailValue(value) {
	if (typeof value === "object") {
		return JSON.stringify(value);
	}

	return value;
}

export default function DetailsTable({ data, fetched, labels, renderValue }) {
	const classes = useStyles();
	if (!fetched) {
		return <SkeletonTable nRows={4} nCols={2} />;
	}

	const keys = Object.keys(labels || data);
	return (
		<TableContainer>
			<Table>
				<TableBody>
					{keys.map((key, index) => (
						<TableRow key={key} className={index === 0 ? classes.topborder : ""}>
							<TableCell className={classes.label}>
								{labels ? labels[key] : key}
							</TableCell>
							<TableCell className={classes.value}>{renderValue(data[key])}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

DetailsTable.propTypes = {
	data: PropTypes.object,
	fetched: PropTypes.bool,
	labels: PropTypes.object,
	renderValue: PropTypes.func,
};

DetailsTable.defaultProps = {
	data: undefined,
	fetched: undefined,
	labels: undefined,
	renderValue: renderDetailValue,
};
