import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@mui/styles';
import Filter from './Filter';
import Bills from './Bills';
import { Grid, Box, CircularProgress } from '@mui/material';
import styles from '../../assets/jss/material-kit-react/views/components.js';
import cover from "../../assets/img/bg12.jpg";



export default function BillsPage({ categories, user, setUser, updateWatchList }) {
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    const [filters, setFilters] = useState({
        category: 0,
        status: '',
        session: '',
        senateHouse: '',
    });
    const [bills, setBills] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const applyFilters = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`${process.env.REACT_APP_COMMONS_API}/api/bills?${params}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await response.json();
            setBills(data.bills);
        } catch (error) {
            console.error('Error fetching bills:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetFilters = async () => {
        const defaultFilters = {
            category: 0,
            status: '',
            session: '',
            senateHouse: '',
        };
        setFilters(defaultFilters);
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_COMMONS_API}/api/bills`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setBills(data.bills);
        } catch (error) {
            console.error('Error resetting filters:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        applyFilters(); // initial load
    }, []);

    return (

        <div>
            <Box
                component="img"
                sx={{
                    backgroundImage: `url(${cover})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    height: "500px",
                    width: "100%"
                }}
            />
            <div className={classnames(classes.main, classes.mainRaised)}>
                <Filter
                    categories={categories}
                    filters={filters}
                    setFilters={setFilters}
                    applyFilters={applyFilters}
                    onReset={resetFilters}
                />

                {isLoading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Bills
                        bills={bills}
                        user={user}
                        setUser={setUser}
                        updateWatchList={updateWatchList}
                        categories={categories}
                        filters={filters}
                    />
                )}
            </div>
        </div >
    );
}
