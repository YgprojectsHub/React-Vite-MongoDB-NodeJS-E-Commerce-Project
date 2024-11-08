import express from "express"

import productRouter from "./products.js"
import categoryRouter from "./categories.js"
import authRouter from "./auth.js"
import imageRouter from "./images.js"
import couponRouter from "./coupons.js"
import userRouter from "./users.js"
import reviewRouter from "./reviews.js"
import searchRouter from "./search.js"
import paymentRouter from "./payment.js"
import orderRouter from "./orders.js"
import statisticRouter from "./statistics.js"
import mailActionsRouter from "./mailActions.js"
import tagRouter from "./tags.js"

const router = express.Router()

router.use("/auth", authRouter)
router.use("/products", productRouter)
router.use("/categories", categoryRouter)
router.use("/uploads", imageRouter)
router.use("/coupons", couponRouter)
router.use("/users", userRouter)
router.use("/reviews", reviewRouter)
router.use("/search", searchRouter)
router.use("/payment", paymentRouter)
router.use("/orders", orderRouter)
router.use("/statistic", statisticRouter)
router.use("/mailActions", mailActionsRouter)
router.use("/tags", tagRouter)

export default router
