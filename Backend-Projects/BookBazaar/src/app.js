import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";

const app = express();

// Global Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too Many reuest from this IP, Please try later ",
});

// Security Middleware
app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());
app.use("/api", limiter);

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(
    cors({
        origin: process.env.BASE_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "device-remember-token",
            "Access-Control-Allow-Origin",
            "Origin",
            "Accept",
        ],
    }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Global Error Handler
app.use((err, _, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

//import routes
import authRouter from "./routes/auth.routes.js";
import bookRouter from "./routes/book.routes.js";
import orderRouter from "./routes/order.routes.js";
import reviewRouter from "./routes/review.routes.js";
import cartRouter from "./routes/cart.routes.js";
import paymentRouter from "./routes/payment.routes.js";

// routes
app.use("/api/v1/users", authRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/payments", paymentRouter);

// Handle 404
app.use((_, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found",
    });
});

export default app;
