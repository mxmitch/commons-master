import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@mui/styles';
import GridContainer from '../../components/Grid/GridContainer.js';
import GridItem from '../../components/Grid/GridItem.js';
import Parallax from '../../components/Parallax/Parallax.js';
import styles from '../../assets/jss/material-kit-react/views/components.js';
import { Typography, CircularProgress } from '@mui/material/';

const useStyles = makeStyles(styles);

export default function Home(props) {
  const classes = useStyles();
  const [childCategory, setChildCategory] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 0,
    status: '',
    session: '',
    senateHouse: ''
  });
  const [filteredBills, setFilteredBills] = useState([]);

  useEffect(() => {
    handleApplyFilters({});
  }, []);

  // Ensure categories and bills are passed correctly
  const categories = props.categories || [];
  const bills = props.bills || [];

  const handleApplyFilters = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${process.env.REACT_APP_COMMONS_API}/api/bills?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      setFilteredBills(data.bills);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    const defaultFilters = {
      category: 0,
      status: '',
      session: '',
      senateHouse: '',
    };

    setFilters(defaultFilters);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_COMMONS_API}/api/bills`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      setFilteredBills(data.bills);
    } catch (error) {
      console.error('Error resetting filters:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Parallax image={require('../../assets/img/bg7.jpg')}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h1 className={classes.title}>Commons</h1>
                <h3 className={classes.subtitle}>
                  Get informed. Stay engaged.
                </h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classnames(classes.main, classes.mainRaised)}>
        <Typography variant="h4" style={{ textAlign: 'center', margin: '1em' }}>
          See up to date information on bills in session in the House of Commons.
        </Typography>
      </div>
    </div>
  );
}
