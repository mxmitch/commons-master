import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red, grey } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Chip from '@mui/material/Chip';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import ClearIcon from '@mui/icons-material/Clear';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import clsx from 'clsx';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: '16px'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'none',
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
      transform: 'scale(1.05)',
      transition: 'box-shadow 0.3s ease-in-out'
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
  const [events, setEvents] = useState('No events currently loaded.');
  const [color, setColor] = useState('');  
  const [open, setOpen] = useState(false);

  // console.log(props.bill);

  useEffect(() => {
    props.user &&
    props.user.user_bills &&
    props.user.user_bills.includes(props.bill.id)
      ? setColor('red')
      : setColor('grey');
  }, []);

  const handleWatchSubmit = async () => {
    const watchlist_bill = {
      id: { bill_id: props.bill.id, user_id: props.user.id }
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_COMMONS_API}/bill_users`,
        watchlist_bill
      );
      color === 'grey' ? setColor('red') : setColor('grey');
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
      setEvents(response.data);  // Set the events in state
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
    const billId = props.bill.bill_number;
    if (billId) {
      console.log('Fetching events for bill ID:', billId); // Log the bill_id
      getEventsForBill(billId); // Call getEventsForBill if billId is valid
    } else {
      console.error('Bill ID is missing or undefined.');
    }
  };

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const validDate = new Date(props.bill.passed_house_first_reading_date);
  const passed_house_first_reading_date = !isNaN(validDate) ? validDate : null;

  const eventCards =
    Array.isArray(events) &&
    events.map((event) => {
      return (
        <CardContent key={event.id}>
          <Grid container justify="center">
            <Grid item xs={0} sm={3} md={2} lg={2} xl={1} spacing={3} className={classes.status}></Grid>
            <Grid item xs={4} sm={3} md={3} lg={3} xl={3}>
              <Typography body>
                <strong>
                  {event.publication_date}
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={8} sm={6} md={7} lg={7} xl={7}>
              <Typography body>{event.title}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      );
    });

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify="center">
          <Grid item xs={6} sm={3} md={2} lg={2} xl={1} spacing={3} className={classes.status}>
            <Tooltip title="View bill page on parliament's website." placement="right">
              <Button
                href={`https://www.parl.ca/legisinfo/en/bill/${props.bill.parl_session_code}/${props.bill.bill_number}`}
                variant="contained"
                className={classes.avatar}
                target="_blank"
              >
                Bill<br></br>
                {props.bill.bill_number}
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
            <Typography>
              <strong>{props.bill.long_title_en}</strong>
            </Typography>
            <Typography style={{ marginBottom: '16px' }}>
              Current Status: {props.bill.latest_event_en}
            </Typography>
            <Grid container direction="row">
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  style={{ marginBottom: '24px' }}
                >
                  Sponsor: {props.bill.sponsor_en || 'No sponsor details available.'}
                </Typography>
                <Grid container xs={12} spacing={2} style={{ display: 'flex' }}>
                  <Grid item>
                    <Tooltip
                      title="View the full text of this bill on parliament's website."
                      placement="right"
                    >
                      <Button
                        href={`https://www.parl.ca/legisinfo/en/bill/${props.bill.parl_session_code}/${props.bill.bill_number}`}
                        target="_blank"
                        variant="primary"
                        className={classes.billText}
                      >
                        <LibraryBooksIcon style={{ marginRight: '8px' }} />
                        More Info
                      </Button>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={2}
            sm={2}
            md={2}
            lg={2}
            xl={1}
            style={{ textAlign: 'right' }}
          >
            {props.user ? (
              <IconButton aria-label="settings">
                <BookmarkIcon
                  style={{ color: color }}
                  onClick={() => {
                    handleWatchSubmit();
                  }}
                />
                {/* <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                  }}
                  open={open}
                  autoHideDuration={2000}
                  onClose={handleClose}
                >
                  <SnackbarContent
                    style={{
                      backgroundColor: '#f44336'
                    }}
                    message={
                      props.user.user_bills.includes(props.bill.id)
                        ? `Bill ${props.bill.bill_number} added to watchlist`
                        : `Bill ${props.bill.bill_number} removed from watchlist`
                    }
                    action={
                      <>
                        <IconButton
                          size="small"
                          aria-label="close"
                          color="inherit"
                          onClick={handleClose}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </>
                    }
                  />
                </Snackbar> */}
              </IconButton>
            ) : (
              <Tooltip
                title="Sign in to add bills to watchlist."
                placement="right"
              >
                <IconButton aria-label="settings">
                  <BookmarkIcon style={{ color: color }} />
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
            <Grid
              item
              xs={0}
              sm={3}
              md={2}
              lg={2}
              xl={1}
              justify="flex-end"
            ></Grid>
            <Grid
              item
              xs={12}
              sm={9}
              md={10}
              lg={10}
              xl={10}
              justify="flex-end"
              style={{ paddingRight: 'none' }}
            >
              <Typography>Bill Events</Typography>
            </Grid>
          </Grid>
        </CardContent>
        {eventCards}
      </Collapse>
    </Card>
  );
}
