import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

export default function CommunicationTable({ data }) {
    return (
        <Paper elevation={2} style={{ marginTop: 20, overflowX: 'auto' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((entry, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell>{entry.type}</TableCell>
                            <TableCell>{entry.message}</TableCell>
                            <TableCell>{new Date(entry.date).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
