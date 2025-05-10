import React from 'react'
import Alert from '@mui/material/Alert';

const PaymentFailed = () => {
    return (
        <div className='paymentStatus relative -translate-y-10'>
            <Alert variant="filled" severity="error">This is a filled error Alert.</Alert>
        </div>
    )
}

export default PaymentFailed

