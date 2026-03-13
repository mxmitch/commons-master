import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@mui/styles';
import Filter from './Filter';
import Bills from './Bills';
import { Box, CircularProgress, Pagination } from '@mui/material';
import styles from '../../assets/jss/material-kit-react/views/components.js';
import cover from "../../assets/img/bg12.jpg";
import axiosInstance from '../../utils/axiosInstance';
import Footer from '../../components/Footer/Footer.js';

const DEFAULT_FILTERS = {
  category: '0',
  status: '',
  session: '',
  senateHouse: '',
};

export default function BillsPage({ categories, user, setUser, updateWatchList }) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalBills, setTotalBills] = useState(0);
  const billsPerPage = 50;

  const fetchBills = async (customFilters = filters, currentPage = page) => {
    setIsLoading(true);

    // Don't send category '0' to the API — it means "no filter"
    const apiFilters = { ...customFilters };
    if (apiFilters.category === '0') delete apiFilters.category;

    try {
      const params = new URLSearchParams({
        ...apiFilters,
        limit: billsPerPage,
        offset: (currentPage - 1) * billsPerPage,
      });

      const response = await axiosInstance.get(`/api/bills?${params}`);
      setBills(response.data.bills || []);
      setTotalBills(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setBills([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (customFilters = filters) => {
    setPage(1);
    fetchBills(customFilters, 1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    fetchBills(DEFAULT_FILTERS, 1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchBills(filters, value);
  };

  useEffect(() => {
    fetchBills(DEFAULT_FILTERS, 1);
  }, []);

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
      <Footer />
    </div>
  );
}