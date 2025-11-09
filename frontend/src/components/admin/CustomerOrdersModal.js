import React from 'react';
import {
  Typography, Button, List, ListItem, ListItemText,
  Box, CircularProgress,
  Dialog, DialogTitle, DialogContent, Stack, Card, CardContent, DialogActions
} from '@mui/material';

// This is the EXACT code from your CustomerOrdersModal component
export const CustomerOrdersModal = ({ open, onClose, customer, orders, loading }) => {
  // Helper to render status with color
  const renderStatus = (status) => (
    <Typography component="span" variant="body2" fontWeight="bold" color={
      status === 'Completed' ? 'success.main' :
      status === 'Cancelled' ? 'error.main' :
      status === 'Ready' ? 'info.main' :
      status === 'Preparing' ? 'warning.main' : 'primary.main'
    }>
      {status}
    </Typography>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Order History for: {customer ? customer.name : 'Customer'}
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : !orders || orders.length === 0 ? (
          <Typography textAlign="center" sx={{ my: 5 }}>
            No orders found for this customer.
          </Typography>
        ) : (
          <Stack spacing={2} sx={{ py: 2 }}>
            <Typography variant="h6">
              Total Orders: {orders.length}
            </Typography>
            {orders.map((order) => (
              <Card key={order._id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="h6" component="div">
                        Status: {renderStatus(order.status)}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                        Placed on: {new Date(order.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                      Total: ₹{order.totalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                  <List dense sx={{ pl: 2, listStyleType: 'disc' }}>
                    {order.items.map((item, index) => (
                      <ListItem key={index} disablePadding sx={{ display: 'list-item', pl: 1 }}>
                        <ListItemText 
                          primary={`${item.quantity}x ${item.name}`}
                          secondary={
                            item.note 
                              ? `(₹${item.price.toFixed(2)} each) | Note: ${item.note}`
                              : `(₹${item.price.toFixed(2)} each)`
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};