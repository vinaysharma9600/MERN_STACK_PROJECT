import React from 'react';
import Payment from './Payment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const PaymentProceed = () => {
    const stripeApiKey = 'pk_test_51Myo4zSA6dfgso0JfrNkqvzpqoaHWFbqEKZ3sPDWkcGHqmTvXdimUU3ICGfi312IaN666BNwWzFwkqMfN3uOdqwJ00i7kKixp2';
  return (
    <>

        <Elements stripe = {loadStripe(stripeApiKey)}>
            <Payment/>
        </Elements>
    </>
  )
}

export default PaymentProceed
