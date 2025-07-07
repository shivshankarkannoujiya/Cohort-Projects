import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT ?? 8000;

(async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀Server is listening on port: ${PORT}`);
        });
    } catch (error) {
        console.error(
            "☠️ Failed to start server due to DB connection error:",
            error,
        );
        process.exit(1);
    }
})();
