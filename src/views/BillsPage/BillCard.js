import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Card, CardContent, CardActions, Collapse, IconButton, Typography,
  Tooltip, Grid, Button, Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { red, grey } from '@mui/material/colors';
import clsx from 'clsx';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: '16px',
    height: '100%',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500],
    borderRadius: '100%',
    width: '75px',
    height: '75px',
    color: '#FFF',
    fontWeight: 900,
    margin: theme.spacing(2),
  },
  billText: {
    backgroundColor: grey[200],
    transition: 'all 0.5s ease-in-out',
    '&:hover,&:focus': {
      color: '#10021a',
      background: '#fa7c70',
      boxShadow: '0 8px 10px rgba(0,0,0,0.25), 0 6px 6px rgba(0,0,0,0.22)',
      transform: 'scale(1.05)'
    }
  },
  status: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    maxWidth: '200px'
  },
  pullRight: {
    justifyContent: 'flex-end',
    fontSize: '0.8em'
  },
  billChips: {
    minWidth: '100px'
  }
}));

export default function BillCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [events, setEvents] = useState([]);
  const [color, setColor] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (props.user?.user_bills?.includes(props.bill.id)) {
      setColor('red');
    } else {
      setColor('grey');
    }
  }, [props.user, props.bill.id]);

  const handleWatchSubmit = async () => {
    const watchlist_bill = {
      id: { bill_id: props.bill.id, user_id: props.user.id }
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_COMMONS_API}/bill_users`,
        watchlist_bill
      );
      setColor(color === 'grey' ? 'red' : 'grey');
      props.updateWatchList(response.data.watchlist);
      setOpen(true);
    } catch (error) {
      console.error(`Error occurred on handleWatchSubmit: ${error}`);
    }
  };

  const getEventsForBill = async (bill_id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_COMMONS_API}/api/events/${bill_id}`
      );
      setEvents(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn(`No events found for bill ${bill_id}`);
        setEvents([]);
      } else {
        console.error('Error fetching events:', error);
        setEvents([]);
      }
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
    const billId = props.bill.bill_number;
    if (billId) {
      getEventsForBill(billId);
    }
  };

  const validDate = new Date(props.bill.passed_house_first_reading_date);
  const passed_house_first_reading_date = !isNaN(validDate) ? validDate : null;

  const eventCards = Array.isArray(events) && events.length > 0 ? (
    events.map((event) => (
      <CardContent key={event.id}>
        <Grid container justify="center">
          <Grid item xs={0} sm={3} md={2} lg={2} xl={1}></Grid>
          <Grid item xs={4} sm={3} md={3} lg={3} xl={3}>
            <Typography>
              <strong>{event.publication_date}</strong>
            </Typography>
          </Grid>
          <Grid item xs={8} sm={6} md={7} lg={7} xl={7}>
            <Typography>{event.title}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    ))
  ) : (
    <CardContent>
      <Typography variant="body2" color="textSecondary">
        No events have been recorded for this bill yet.
      </Typography>
    </CardContent>
  );

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify="center">
          <Grid item xs={6} sm={3} md={2} lg={2} xl={1} className={classes.status}>
            <Tooltip title="View bill page on parliament's website." placement="right">
              <Button
                href={`https://www.parl.ca/legisinfo/en/bill/${props.bill.parl_session_code}/${props.bill.bill_number}`}
                variant="contained"
                className={classes.avatar}
                target="_blank"
              >
                Bill<br />{props.bill.bill_number}
              </Button>
            </Tooltip>
            {props.bill.received_royal_assent_date ? (
              <Tooltip title="This bill has been passed." placement="bottom">
                <Chip
                  label="Passed"
                  className={classes.billChips}
                  variant="contained"
                  color="primary"
                  icon={<DoneOutlineIcon />}
                />
              </Tooltip>
            ) : (
              <Tooltip title="This bill is in progress." placement="bottom">
                <Chip
                  label="In Progress"
                  className={classes.billChips}
                  variant="outlined"
                  color="default"
                  icon={<AccessTimeIcon />}
                />
              </Tooltip>
            )}
          </Grid>
          <Grid item xs={10} sm={7} md={8} lg={8} xl={10}>
            <Typography><strong>{props.bill.long_title_en}</strong></Typography>
            <Typography style={{ marginBottom: '16px' }}>
              Current Status: {props.bill.latest_event_en}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ marginBottom: '24px' }}
            >
              Sponsor: {props.bill.sponsor_en || 'No sponsor details available.'}
            </Typography>
            <Button
              href={`https://www.parl.ca/legisinfo/en/bill/${props.bill.parl_session_code}/${props.bill.bill_number}`}
              target="_blank"
              variant="primary"
              className={classes.billText}
            >
              <LibraryBooksIcon style={{ marginRight: '8px' }} />
              More Info
            </Button>
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={1} style={{ textAlign: 'right' }}>
            {props.user ? (
              <IconButton aria-label="watchlist">
                <BookmarkIcon
                  style={{ color }}
                  onClick={handleWatchSubmit}
                />
              </IconButton>
            ) : (
              <Tooltip title="Sign in to add bills to watchlist." placement="right">
                <IconButton aria-label="watchlist">
                  <BookmarkIcon style={{ color }} />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        </Grid>
      </CardContent>

      <CardActions disableSpacing className={classes.pullRight}>
        <Typography variant="body" style={{ marginRight: '16px' }}>
          View events for this bill
        </Typography>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container>
            <Grid item xs={0} sm={3} md={2} lg={2} xl={1}></Grid>
            <Grid item xs={12} sm={9} md={10} lg={10} xl={10}>
              <Typography>Bill Events</Typography>
            </Grid>
          </Grid>
        </CardContent>
        {eventCards}
      </Collapse>
    </Card>
  );
}
