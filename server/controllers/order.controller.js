import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Stripe from "stripe"
import mongoose from "mongoose";

// Path: /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const [DELIVERY_CHARGE, HANDLING_CHARGE] = [25, 2]

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data!" })
        }

        let amount = DELIVERY_CHARGE + HANDLING_CHARGE;
        for (let item of items) {
            const product = await Product.findById(item.product)
            amount += item.quantity * product.offerPrice
        }

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        })

        return res.json({ success: true, message: "Order Placed", order })
    } catch (error) {
        console.log(error.message)
        return res.json({ success: "false", message: error.message })
    }
}

// Path: /api/order/online
export const placeOrderOnline = async (req, res) => {
    const { userId, items, address } = req.body;
    const [DELIVERY_CHARGE, HANDLING_CHARGE] = [25, 2]

    if (!userId || !items || !address) {
        return res.json({ success: false, message: "Invalid Data!" })
    }

    // let overHeadCharge = DELIVERY_CHARGE + HANDLING_CHARGE;

    const line_items = []

    for (let item of items) {

        const product = await Product.findById(item.product)

        console.log(product)

        const line_item = {
            price_data: {
                product_data: {
                    name: product.name,
                    images: product.image,
                },
                currency: "inr",
                unit_amount: Number(product.offerPrice) * 100
            },
            quantity: item.quantity
        }

        line_items.push(line_item)
    }

    let amount = DELIVERY_CHARGE + HANDLING_CHARGE;
    for (let item of items) {
        const product = await Product.findById(item.product)
        amount += item.quantity * product.offerPrice
    }

    const order = await Order.create({
        userId,
        items,
        amount,
        address,
        paymentType: "Online",
    })

    const stripe = new Stripe("sk_test_51RN9W1FNDVSSS1tvozzLfYnf0lqMSU4eIsBpBViaCCMxCWIOGAM3yq1RbGSPFbv09Gkcrkawxb4QcRhpPVxaQ4BB00jwxY3YD9")

    const shippingRate = await stripe.shippingRates.create({
        display_name: 'Ground shipping',
        type: 'fixed_amount',
        fixed_amount: {
          amount: (DELIVERY_CHARGE + HANDLING_CHARGE) * 100,
          currency: 'inr',
        },
      });

    const session = await stripe.checkout.sessions.create({
        line_items,
        success_url: "http://localhost:5173/myorders?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:5173/mycart",
        mode: "payment",
        shipping_options: [{shipping_rate: shippingRate.id}],
        metadata: { orderId: String(order._id) }
    })

    return res.json({ success: true, url: session.url, id: session.id})
}

// Path: /api/order/verify
// in clients myOrders page, if paid then display paymentSuccess component else display paymentFailed component.
export const verifyOnlineOrder = async (req, res) => {
    const { sessionId } = req.body;

    const stripe = new Stripe("sk_test_51RN9W1FNDVSSS1tvozzLfYnf0lqMSU4eIsBpBViaCCMxCWIOGAM3yq1RbGSPFbv09Gkcrkawxb4QcRhpPVxaQ4BB00jwxY3YD9")

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    
    if (session.payment_status === "paid") {
        const order = await Order.findByIdAndUpdate(session.metadata.orderId, {isPaid: true})
    } else if (session.payment_status === "unpaid") {
        const order = await Order.findByIdAndDelete(session.metadata.orderId)
    }
    
    // console.log("This is the order: ", order)
    
    return res.json({ paymentStatus: session.payment_status })
    // console.log("Payment status: ", session.payment_status)
}


// Get order by user id: /api/order/user
export const getUserOrder = async (req, res) => {
    try {
        const { userId } = req.body
        console.log("user id: ", userId)
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })
        return res.json({ success: true, message: "Order Fetched Successfully", orders })
    } catch (error) {
        console.log(error.message)
        return res.json({ success: true, message: error.message })
    }
}

// Get all orders for admin: /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })
        return res.json({ success: true, message: "Order Fetched Successfully", orders })
    } catch (error) {
        console.log(error.message)
        return res.json({ success: true, message: error.message })
    }
}