import React from "react";
import { useStoreAPIData } from "../../redux/hooks";

import { Container, Grid, Box, Button } from "@material-ui/core";
import SaleCard, { SaleCardSkeleton } from "../../components/sales/SaleCard";


export default function Home(props) {
	const { pagination, ...sales } = useStoreAPIData("sales", {
		include: "association",
		order_by: "-begin_at",
	});
	return (
		<Container>
			<h1>Liste des ventes</h1>

			<Grid container spacing={2}>
				{sales.fetched
					? Object.values(sales.data).map((sale) => (
							<SaleCard key={sale.id} sale={sale} />
					  ))
					: [...Array(3).keys()].map((index) => <SaleCardSkeleton key={index} />)}
			</Grid>
			{pagination && (
				<Box mt={3} textAlign="center">
					<Button
						disabled={pagination.lastFetched >= pagination.nbPages}
						onClick={() => sales.fetchData({ page: pagination.lastFetched + 1 })}
					>
						Voir plus
					</Button>
				</Box>
			)}
		</Container>
	);
}
