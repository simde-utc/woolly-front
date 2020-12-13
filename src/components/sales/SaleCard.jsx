import React from 'react';
import PropTypes from 'prop-types';
import { shorten } from 'utils/format';
import { getCountdown, saleIsOpen } from 'utils/api';
import {isPast} from "date-fns";

import { makeStyles } from '@material-ui/core/styles';
import {
	Box, Grid, Card, CardContent, CardActions,
	Chip, LinearProgress, Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { NavButton } from 'components/common/Nav';


const useStyles = makeStyles(theme => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
            boxShadow: theme.shadows[4],
        },
        '&:hover .go-to-sale': {
            color: theme.palette.primary.main,
        },
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        margin: 0,
    },
    subtitle: {
        fontStyle: 'italic',
    },
    description: {
        textAlign: 'justify',
    },
}));

export function SaleCardSkeleton() {
    const classes = useStyles();
    return (
        <Grid item xs={12} sm={4} md={3}>
            <Card className={classes.card}>
                <CardContent className={classes.content}>
                    <Skeleton variant="rect" width={230} height={34} style={{marginBottom: 2}}/>
                    <Skeleton variant="rect" width={150} height={16}/>
                    <Skeleton variant="text"/>
                    <Skeleton variant="text"/>
                    <Skeleton variant="text"/>
                </CardContent>

                <CardActions>
                    <Skeleton variant="rect" width={160} height={30}/>
                </CardActions>
            </Card>
        </Grid>
    );
}


function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center" direction="row">
            <Box width="100%" mr={1} ml={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>

            <Box  mr={1}>
                <Typography variant="body2" color="textSecondary" display="inline">
                    {props.text}
                </Typography>
            </Box>
        </Box>
    );
}

export default function SaleCard({sale, ...props}) {
    const classes = useStyles();
    const [store, changeStore] = React.useState({progress: 0, timeLeft: "Chargement..."});

   	React.useEffect(() => {
        const interval = setInterval(() => {
            if(document.getElementById(sale.id)) {
                const count = getCountdown(sale.begin_at);
                console.log(count)
                if(!count.timer)
                    window.location.reload(false);

                changeStore(prevState => ({...prevState, progress: count.nbSeconds, timeLeft: count.timer}));
            }
        }, 1000);
        return () => clearInterval(interval);
    });

    function currentSaleState() {
        if (!sale)
            return null;
        if (sale.end_at && isPast(new Date(sale.end_at)))
            return ['Terminée !', 'red'];
        if (sale.begin_at && isPast(new Date(sale.begin_at)))
            return ['En cours !', 'green'];
        return ['Ouverte prochaine ... ', 'orange'];
    }

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className={classes.card}>
                <CardContent className={classes.content}>
                    <h4 className={classes.title}>
                        {sale.name}
                    </h4>
                    <span className={classes.subtitle}>
                        Par {sale?.association?.shortname}
                    </span>
                    <p className={classes.description}>
                        {shorten(sale.description, 150)}
                    </p>
                    <b>
                        <Chip id="bla" style={{backgroundColor: currentSaleState()[1]}}
                              label={currentSaleState()[0]}
                              color="primary"
                        />
                    </b>


                </CardContent>
                { isPast(new Date(sale.begin_at)) ? (
                	<CardActions>
						<NavButton className="go-to-sale" to={`/sales/${sale.id}`}>
							Accéder à la vente
						</NavButton>
					</CardActions>
                    ) : (
                    <LinearProgressWithLabel id={sale.id} value={store.progress} text={store.timeLeft}/>

                    /*<Chip id={sale.id}
                          label={getCountdown(sale.begin_at)}
                          color="primary"
                    />*/
                    )
                }

            </Card>
        </Grid>
    );
}

SaleCard.propTypes = {
    sale: PropTypes.object.isRequired,
};
