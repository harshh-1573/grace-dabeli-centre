//frontend/src/components
import React from 'react';
import { Stepper, Step, StepLabel, Box, Typography, Paper } from '@mui/material';

// 1. Define the steps for each order type
const deliverySteps = ['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
const pickupSteps = ['Order Placed', 'Preparing', 'Ready for Pickup', 'Completed'];

// 2. Create a helper function to map status to a step number
const getActiveStep = (status) => {
  switch (status) {
    case 'Pending':
      return 0; // 'Order Placed'
    case 'Preparing':
      return 1; // 'Preparing'
    case 'Ready':
      return 2; // 'Ready for Pickup' or 'Out for Delivery'
    case 'Completed':
      return 3; // 'Completed' or 'Delivered'
    default:
      return 0;
  }
};

export const ActiveOrderTracker = ({ order }) => {
  if (!order) {
    return null; // Don't render anything if there's no active order
  }

  // 3. Determine which steps to show (Delivery vs. Pickup)
  const steps = order.orderType === 'Delivery' ? deliverySteps : pickupSteps;
  
  // 4. Determine the current active step number
  const activeStep = getActiveStep(order.status);

  return (
    <Paper 
      elevation={0}
      sx={{ 
        mb: 4,
        borderRadius: 3,
        border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
        overflow: 'hidden',
        background: (theme) => theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(243, 156, 18, 0.1) 100%)'
          : 'linear-gradient(135deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.05) 100%)',
        p: { xs: 2, sm: 3 },
        animation: 'fadeInUp 0.6s ease-out',
        '@keyframes fadeInUp': {
          'from': { opacity: 0, transform: 'translateY(20px)' },
          'to': { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 600, 
          mb: 3, 
          textAlign: 'center', 
          color: 'text.primary' 
        }}
      >
        Tracking Your Order
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ textAlign: 'center', mb: 2, wordBreak: 'break-all' }}
      >
        Order ID: {order._id}
      </Typography>
      
      {/* 5. The MUI Stepper Component */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          
          // If the order is cancelled, show an error on the current step
          if (order.status === 'Cancelled' && index === activeStep) {
            labelProps.error = true;
            labelProps.optional = (
              <Typography variant="caption" color="error">
                Order Cancelled
              </Typography>
            );
          }
          
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Paper>
  );
};