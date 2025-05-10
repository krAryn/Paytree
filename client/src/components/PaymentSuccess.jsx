import React from 'react'
import Alert from '@mui/material/Alert';

const PaymentSuccess = () => {
    return (
        <div className='paymentStatus relative -translate-y-10'>
            <Alert variant='filled' severity="success">Congratulations! Your items are on the way.</Alert>
        </div>
    )
}

export default PaymentSuccess

