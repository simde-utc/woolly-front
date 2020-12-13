import React from "react";
import { Container, Box } from "@material-ui/core";
import { getCountdown} from 'utils/api';

import APIDataTable from "components/common/APIDataTable";
import { Link } from "components/common/Nav";

import { PORTAIL_URL } from "utils/constants";
import { formatDate } from "utils/format";


export default function Sales(props) {
	return (
		<Box clone py={3}>
			<Container>
				<APIDataTable
					title={<h1>Liste des ventes</h1>}
					path={["sales"]}
					queryParams={{
						include: "association",
						order_by: "-begin_at",
					}}
					columns={[
						{
							title: "Lien",
							field: "id",
							render: (sale) => (
								<Link to={`/sales/${sale.id}`}>{sale.id}</Link>
							),
						},
						{
							title: "Titre",
							field: "name",
						},
						{
							title: "Association",
							render: (sale) => (
								<Link
									href={`${PORTAIL_URL}/assos/${sale.association?.id}`}
									color="inherit"
									target="_blank"
								>
									{sale.association?.shortname}
								</Link>
							)
						},
						{
							title: "Début",
							field: "begin_at",
							render: (sale) => formatDate(sale.begin_at, "datetime"),
						}
					]}
				/>
			</Container>
		</Box>
	);
}
