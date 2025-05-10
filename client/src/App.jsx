import React from 'react'
import { Routes, Route, useLocation } from 'react-router'
import { useAppContext } from './contexts/AppContext.jsx'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Footer from './components/Footer.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import AllProducts from './pages/AllProducts.jsx'
import ProductCategory from './pages/ProductCategory.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import AddAddress from './pages/AddAddress.jsx'
import MyOrders from './pages/MyOrders.jsx'
import SellerLogin from './pages/seller/SellerLogin.jsx'
import SellerLayout from './pages/seller/SellerLayout.jsx'
import AddProduct from './pages/seller/AddProduct.jsx'
import ProductsList from './pages/seller/ProductsList.jsx'
import Orders from './pages/seller/Orders.jsx'
import Contact from './pages/Contact.jsx'
import Spinner from './components/Spinner.jsx'
import PaymentSuccess from './components/PaymentSuccess.jsx'
import PaymentFailed from './components/PaymentFailed.jsx'


const App = () => {
    const {products, isSeller, user, navigate} = useAppContext()

    const location = useLocation().pathname;

    const HomeNavigation = () => {
        navigate("/home")
        return (
            <></>
        )
    }

    return (
        <div className='min-h-screen text-gray-700 bg-white'>
            
                {!location.includes("seller") && !location.includes("login") && !location.includes("signup") && <Navbar />}
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={user? <HomeNavigation /> :<Login />} />
                    <Route path="/signup" element={user? <HomeNavigation /> :<SignUp />} />
                    <Route path="/allproducts" element={<AllProducts />} />
                    {products && <Route path="/allproducts/:category" element={<ProductCategory />} />}
                    {products && <Route path="/allproducts/:category/:id" element={<ProductDetails/>} />}
                    {products && <Route path="/mycart" element={<Cart />} />}
                    <Route path="/addaddress" element={<AddAddress />} />
                    <Route path="/myorders" element={<MyOrders />} />
                    <Route path="/seller" element={isSeller ? <SellerLayout /> :<SellerLogin />}>
                        <Route index element={<AddProduct />} />
                        <Route path="productslist" element={<ProductsList />} />
                        <Route path="orders" element={<Orders />} />
                    </Route>
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/spinner" element={<Spinner />} />
                    <Route path="/paymentSuccess" element={<PaymentSuccess />} />
                    <Route path="/paymentFailed" element={<PaymentFailed />} />
                    
                </Routes>
                {!location.includes("seller") && !location.includes("login") && !location.includes("signup") && <Footer />}
        </div>
    )
}

export default App
