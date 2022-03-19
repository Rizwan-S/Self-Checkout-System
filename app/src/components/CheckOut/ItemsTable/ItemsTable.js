import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, price, quantity) {
    return { name, price, quantity };
}

const rows = [
    createData('Frozen yoghurt', 159, 6),
    createData('Ice cream sandwich', 237, 2),
    createData('Eclair', 262, 16),
    createData('Cupcake', 305, 3),
    createData('Gingerbread', 356, 16),
];

export default function ItemsTable({ cart }) {
    useEffect(() => {}, []);

    return (
        <div style={{ paddingRight: '50px', paddingLeft: '50px' }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <b>NAME</b>
                            </TableCell>
                            <TableCell align="right">
                                <b>PRICE</b>
                            </TableCell>
                            <TableCell align="right">
                                <b>QUANTITY&nbsp;</b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.price}</TableCell>
                                <TableCell align="right">
                                    {row.quantity}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
