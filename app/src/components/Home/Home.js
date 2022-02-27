import React from 'react';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <p>&nbsp;</p>

            <p align="center">
                Welcome to store! Proceed to check in the store or check out of
                the store.
            </p>

            <p>&nbsp;</p>

            <Box textAlign="center" m={3} pt={1}>
                <Button
                    variant="contained"
                    component={Link}
                    to="/checkInStore"
                    color="error"
                    fullWidth
                    style={{ minHeight: '50px' }}
                >
                    Enter the store
                </Button>
            </Box>

            <Box textAlign="center" m={3} pt={1}>
                <Button
                    variant="contained"
                    component={Link}
                    to="/checkOut"
                    color="success"
                    fullWidth
                    style={{ minHeight: '50px' }}
                >
                    Proceed to self checkout
                </Button>
            </Box>
        </div>
    );
};

export default Home;
