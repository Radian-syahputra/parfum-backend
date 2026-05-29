import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoute from './modules/auth/auth.routes'
import productRoute from './modules/product/product.routes'
import orderRoute from './modules/order/order.routes'
import reviewRoute from './modules/review/review.routes'
import wishlistRoute from './modules/wishlist/wishlist.routes'
import notificationRoute from './modules/notification/notification.routes'
import adminRoute from './modules/admin/admin.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials : true
}))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.json({ message: "Parfum API is running!" });
});

// Routes
app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)
app.use("/api/orders", orderRoute)
app.use("/api/reviews", reviewRoute)  
app.use("/api/wishlist", wishlistRoute)
app.use("/api/notifications", notificationRoute)
app.use("/api/admin", adminRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});