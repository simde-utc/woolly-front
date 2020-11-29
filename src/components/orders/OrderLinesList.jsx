import React from "react"
import PropTypes from "prop-types";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { SkeletonList } from "../common/Skeletons";
import { isEmpty } from "../../utils";


export default function OrderLinesList({ orderlines, items, prefix, empty, ...props }) {
	if (!orderlines)
		return <SkeletonList {...props} />

	if (isEmpty(orderlines))
		return empty;

	return (
		<List {...props}>
			{Object.values(orderlines).map(({ id, quantity, item }, index) => (
				<ListItem key={id || index} dense={props.dense} disableGutters={props.dense}>
					<ListItemText>
						{prefix}{quantity} &times; {item?.name || item?.[item]?.name || "..."}
					</ListItemText>
				</ListItem>
			))}
		</List>
	);
}

OrderLinesList.propTypes = {
	orderlines: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]),
	items: PropTypes.object,
	prefix: PropTypes.string,
	empty: PropTypes.string,
};

OrderLinesList.defaultProps = {
	empty: "Aucun article",
	prefix: "",
};
