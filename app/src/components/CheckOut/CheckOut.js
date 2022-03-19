import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase-config';
import ItemsTable from './ItemsTable/ItemsTable';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';

const CheckOut = () => {
    const [items, setItems] = useState([]);

    function loadItems() {
        //Load RFID tags
        onValue(ref(db, '/CheckOut/RFIDTags/'), (snapshot) => {
            setItems([]);
            const data = snapshot.val();
            if (data !== null) {
                Object.values(data).map((it) => {
                    setItems((oldArray) => [...oldArray, it]);
                });
            }
        });
    }

    useEffect(() => {
        loadItems();
    }, []);

    return (
        <div>
            <div>
                <p>{items}</p>
            </div>
            <h1 align="center">Your Cart Items</h1>
            <ItemsTable cart={items} />
            <Box textAlign="right" m={3} pt={1}>
                <Button
                    variant="contained"
                    style={{
                        minHeight: '50px',
                        minWidth: '150px',
                        marginRight: '50px',
                    }}
                >
                    Pay
                </Button>
            </Box>
        </div>
    );
};

export default CheckOut;
