import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase-config';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Box } from '@mui/system';

const CheckInStore = () => {
    return (
        <div>
            <p>&nbsp;</p>

            <p align="center">
                Please register if you do not have valid credentials else
                proceed to check in the store
            </p>

            <p>&nbsp;</p>

            <Box textAlign="center" m={3} pt={1}>
                <Button
                    variant="contained"
                    component={Link}
                    to="/register"
                    color="success"
                    fullWidth
                    style={{ minHeight: '50px' }}
                >
                    Register
                </Button>
            </Box>

            <Box textAlign="center" m={3} pt={1}>
                <Button
                    variant="contained"
                    component={Link}
                    to="/checkIn"
                    color="success"
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
                    to="/"
                    color="error"
                    fullWidth
                    style={{ minHeight: '50px' }}
                >
                    Go Back
                </Button>
            </Box>
        </div>
    );
};

export default CheckInStore;
