import express from "express"
import authUser from "../middlewares/user.auth.js"
import { getAllOrders, getUserOrder, placeOrderCOD, placeOrderOnline, verifyOnlineOrder } from "../controllers/order.controller.js"
import authSeller from "../middlewares/seller.auth.js"

const orderRouter = express.Router()

orderRouter.post("/cod", authUser, placeOrderCOD)
orderRouter.post("/online", authUser, placeOrderOnline)
orderRouter.post("/verify", authUser, verifyOnlineOrder)
orderRouter.post("/user", authUser, getUserOrder)
orderRouter.post("/seller", authSeller, getAllOrders)

export default orderRouter