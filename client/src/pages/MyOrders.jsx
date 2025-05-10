import { useEffect, useState } from 'react'
import { useAppContext } from '../contexts/AppContext'
import { useSearchParams } from 'react-router'
import axios from 'axios'
import PaymentSuccess from '../components/PaymentSuccess'

const MyOrders = () => {

    const {myOrders, fetchUserOrder, cartItems, setCartItems, user, navigate} = useAppContext()
    const [searchParams, _] = useSearchParams()
    const [showSuccessBar, setShowSuccessBar] = useState(false)

    useEffect(() => {
        
        const sessionId = searchParams.get("session_id") 
        if (sessionId) {
            
            const verifyPurchase = async () => {
                // console.log("Verification.............")
                const {data} = await axios.post("/api/order/verify", {sessionId})
                if (data.paymentStatus === "paid"){
                    console.log("Paid")
                    setShowSuccessBar(true)
                } else {
                    setShowSuccessBar(false)
                    console.log("Not Paid")
                }
            }

            verifyPurchase().then(() => fetchUserOrder())
            // if i remove then here, output is absurd.................. find it out **********************************************
        } else {
            fetchUserOrder()
        }
        console.log()
            // console.log("Fetch Order.......")
            
        }, [])

        useEffect(() => {
            if (showSuccessBar) {
                setCartItems({})
            }
        }, [showSuccessBar])

    return (
        <div className='mt-16 flex flex-col px-6 md:px-16 lg:px-32 relative'>
                {showSuccessBar && <PaymentSuccess />}
            <div className='flex flex-col items-end w-max mb-8'>
                <p className='text-2xl font-medium uppercase'>My Orders</p>
                <div className="w-16 rounded-full bg-primary h-0.5"></div>
            </div>

            {
                myOrders.map((order, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl">
                        <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
                            <span>Order Id: {order._id}</span>
                            <span>Payment: {order.paymentType}</span>
                            <span>Total Amount: ₹{order.amount}</span>
                        </p>
                        {
                            order.items.map((item, index) => (
                                <div key={index} 
                                    className={`relative bg-white text-gray-500/70 ${order.items.length !== index + 1 && "border-b border-gray-300"}  flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
                                >
                                    <div className="flex items-center mb-4 md:mb-0">
                                        <div className="p-4 rounded-lg bg-primary/10 cursor-pointer" onClick={() => {
                                                navigate(`/allproducts/${item.product.category}/${item.product._id}`)
                                            }}>
                                            <img src={item.product.image[0]} className='w-16 h-16' alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <h2 className="text-xl font-medium text-gray-800">{item.product.name}</h2>
                                            <p>Category: {item.product.category}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                                        <p>Quantity: {item.quantity || "1"}</p>
                                        <p>Status: {order.status}</p>
                                        <p>Data: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-primary text-xl font-medium">
                                        Amount: ₹{item.product.offerPrice * item.quantity}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default MyOrders
