// In src/components/admin/CustomerList.js

import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box,
  Typography,
  Link
} from '@mui/material';

export function CustomerList(props) {
  const { customers, handleCustomerClick } = props;

  // This JSX is copied directly from renderCustomerList
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Registered Customer List</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Registered On</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography sx={{ p: 2 }}>No customers found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                      <TableRow key={customer._id} hover>
                          {/* Name is clickable to open the modal */}
                          <TableCell>
                            <Link 
                              component="button" 
                              variant="body2"
                              onClick={() => handleCustomerClick(customer)}
                              sx={{ 
                                fontWeight: 'bold', 
                                textDecoration: 'underline', 
                                cursor: 'pointer',
                                color: 'primary.main',
                                textAlign: 'left',
                                background: 'none',
                                border: 'none',
                                padding: 0
                              }}
                            >
                              {customer.name}
                            </Link>
                          </TableCell>
                          <TableCell>{customer.email || 'N/A'}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                  ))
                )}
            </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}