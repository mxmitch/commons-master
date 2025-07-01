import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@mui/styles';
import Filter from './Filter';
import Bills from './Bills';
import { Box, CircularProgress, Pagination } from '@mui/material';
import styles from '../../assets/jss/material-kit-react/views/components.js';
import cover from "../../assets/img/bg12.jpg";
import axiosInstance from '../../utils/axiosInstance'; // ✅ import centralized axios

export default function BillsPage({ categories, user, setUser, updateWatchList }) {
    const useStyles = makeStyles(styles);
    const classes = useStyles();

    const [filters, setFilters] = useState({
        category: '0', // use string instead of 0
        status: '',
        session: '',
        senateHouse: '',
    });
    const [bills, setBills] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalBills, setTotalBills] = useState(0);
    const billsPerPage = 50;

    const fetchBills = async (customFilters = filters, currentPage = page, isFallbackAttempt = false) => {
        setIsLoading(true);

        try {
            const params = new URLSearchParams({
                ...customFilters,
                limit: billsPerPage,
                offset: (currentPage - 1) * billsPerPage,
            });

            const response = await axiosInstance.get(`/api/bills?${params}`);
            const billList = response.data.bills;

            // ✅ Fallback: If no results and not already retrying, reload without filters
            if (billList.length === 0 && !isFallbackAttempt) {
                console.warn("No bills found. Retrying without filters...");
                fetchBills(
                    { category: '0', status: '', session: '', senateHouse: '' },
                    1,
                    true
                );
                return;
            }

            setBills(billList);
            setTotalBills(response.data.total || 0);
        } catch (error) {
            console.error("Error fetching bills:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = (customFilters = filters) => {
        setPage(1);
        fetchBills(customFilters, 1);
      };

      const resetFilters = () => {
        const defaultFilters = {
          category: '0',
          status: '',
          senateHouse: '',
        };
        setFilters(defaultFilters);
        setPage(1);
        fetchBills(defaultFilters, 1); // ✅ use immediate value
      };

    const handlePageChange = (event, value) => {
        setPage(value);
        fetchBills(filters, value);
    };

    useEffect(() => {
        fetchBills(filters, page);
    }, []); // initial load

    const totalPages = Math.ceil(totalBills / billsPerPage);

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
                    <>
                        <Bills
                            bills={bills}
                            user={user}
                            setUser={setUser}
                            updateWatchList={updateWatchList}
                            categories={categories}
                            filters={filters}
                        />
                        {totalBills > billsPerPage && (
                            <Box display="flex" justifyContent="center" mt={4} mb={4}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
