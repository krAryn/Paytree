import { useEffect, useState } from 'react'
import { useAppContext } from '../contexts/AppContext'
import { useForm } from "react-hook-form" 
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'

const Cart = () => {
    const [showAddress, setShowAddress] = useState(false)
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm()
    
    const DELIVERY_CHARGE = 25
    const HANDLING_CHARGE = 2
    
    const {products, cartItems, setCartItems, removeFromCart, getTotalCartItems, getTotalCartAmount, updateCartItems, navigate, currentAddress, setCurrentAddress, addresses, user, axios} = useAppContext()

    const [productsInCart, setProductsInCart] = useState()
    const [paymentMode, setPaymentMode] = useState("none");

    useEffect(() => {
        // search for all the itemid in cartItems on products and append it in productsInCart array
        let product = {}
        let prodInCart = []
        for (let item in cartItems) {
            product = products.find(prod => prod._id === item)
            
            product.quantity = cartItems[item]
            prodInCart.push(product)
        }

        setProductsInCart(prodInCart)
    }, [cartItems])

    // placing order simulator
    const placeOrder = async () => {
        try {
            if (!currentAddress) {
                toast.error("Please select a Delivery Address!")
            } else {
                if (paymentMode === "COD") {
                    
                    const {data} = await axios.post("/api/order/cod", {
                        userId: user._id,
                        items: productsInCart.map(item => ({product: item._id, quantity: item.quantity})),
                        address: currentAddress._id
                    })

                    if (data.success) {
                        toast.success(data.message)
                        setCartItems({})
                        navigate("/myorders")
                        // navigate(0)
                    } else {
                        toast.error(data.message)
                    }
                } else if (paymentMode === "Online") {
                    const {data} = await axios.post("/api/order/online", {
                        userId: user._id,
                        items: productsInCart.map(item => ({product: item._id, quantity: item.quantity})),
                        address: currentAddress._id
                    })

                    window.open(data.url, "_self")
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const placeOrderHandler = async (data) => {
        // console.log(data)
        if (data.paymentMode === "none") {
            toast.error("Please choose a payment mode", {duration: 1000})
        } else {
            await placeOrder()
        }
    }

    return productsInCart && (
        <div className="flex flex-col md:flex-row pt-16 max-w-7xl w-full px-6 md:px-16 lg:px-32 mx-auto">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart&nbsp; 
                    {getTotalCartItems() ? <span className="text-sm text-white rounded-full bg-primary px-2 pb-0.5">{getTotalCartItems()} items</span>: ""}
                </h1>

                <div>

                </div>

                {productsInCart.length > 0 ? (<div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>): (<div className='flex items-center justify-center h-[20vh]'><p className='text-2xl font-medium text-gray-400'> "Your Cart is Empty!" </p></div>)}

                {productsInCart.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={() => {navigate(`/allproducts/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)}} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Category: <span>{product.category || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select className='outline-none' onChange={e => updateCartItems(product._id, Number(e.currentTarget.value))} value={cartItems[product._id]}>
                                            {Array(5).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">₹{product.offerPrice * product.quantity}</p>
                        <button className="cursor-pointer mx-auto" onClick={
                            () => {
                                updateCartItems(product._id, undefined)
                                // console.log(cartItems)
                            }
                        }>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0" stroke="#FF532E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>)
                )}

                <button onClick={() => {navigate("/allproducts"); scrollTo(0,0)}} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img src={assets.arrow_right_icon_colored} className='group-hover:-translate-x-1 transition' alt="" />
                    Continue Shopping
                </button>

            </div>

            {productsInCart.length > 0 && <form onSubmit={handleSubmit(placeOrderHandler)} className="md:max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2 gap-3">
                        <p className="text-gray-500">{currentAddress? `${currentAddress.street}, ${currentAddress.city}, ${currentAddress.state}, ${currentAddress.zipcode}`: "No address found"}</p>
                        <button type="button" onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {Array.from(addresses).map((address, index) => {
                                return (<p key={index} onClick={() => {setCurrentAddress(address); setShowAddress(false)}} className="text-gray-500 p-2 hover:bg-gray-100">
                                    {address.street}, {address.city}, {address.state}, {address.zipcode}
                                </p>)
                                })}
                                <p onClick={() => {
                                        if (!user) {
                                            toast.error("Please Log In to Continue!", {duration: 1000})
                                            setShowAddress(false)
                                        } else {
                                            navigate("/addaddress")
                                        }
                                    }} className="text-primary text-center cursor-pointer p-2 hover:bg-primary-dull hover:text-white">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none" 
                        {...register("paymentMode")}
                    >
                        <option value="none" selected disabled>Choose a payment mode</option>
                        <option value="COD" onClick={(e) => setPaymentMode(e.currentTarget.value)}>Cash On Delivery</option>
                        <option value="Online" onClick={(e) => setPaymentMode(e.currentTarget.value)}>Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>₹{getTotalCartAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Delivery Charge</span><span>₹{DELIVERY_CHARGE}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Handling Charges</span><span>₹{HANDLING_CHARGE}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span className='font-semibold'>Total Amount:</span><span className='text-primary'>₹{getTotalCartAmount() + DELIVERY_CHARGE + HANDLING_CHARGE}</span>
                    </p>
                </div>

                {!isSubmitting ? <input type="submit" value={paymentMode === "none"? "Choose a payment mode": (paymentMode === "COD"? "Place Order": "Proceed to Checkout")} className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition" />
                : (
                    <button className="w-full py-3 mt-6 cursor-pointer text-gray-500 bg-gray-500/20 font-medium transition" disabled>Please Wait</button>
                )
                }
            </form>}
        </div>
    )
}

export default Cart
