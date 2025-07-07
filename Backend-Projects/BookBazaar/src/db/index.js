import mongoose from "mongoose";
import { DB_NAME } from "../utils/constant.js";

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000;

class DatabaseConnection {
    constructor() {
        this.retryCount = 0;
        this.isConnected = false;

        // Configure Mongoose settings
        mongoose.set("strictQuery", true);

        mongoose.connection.on("connected", () => {
            console.log("🌲MONGODB CONNECTED SUCCESSFULLY");
            this.isConnected = true;
        });

        mongoose.connection.on("error", () => {
            console.log("MONGODB CONNECTION ERROR");
            this.isConnected = false;
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MONGODB DISCONNECTED");
            this.handleDisconnection();
        });

        process.on("SIGTERM", this.handleAppTermination.bind(this));
    }

    async connect() {
        try {
            if (!process.env.MONGO_URI) {
                throw new Error("MongoDB URI is not defined in env variables");
            }

            const connectionOptions = {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 4500,
                family: 4,
            };

            if (process.env.NODE_ENV === "development") {
                mongoose.set("debug", true);
            }

            await mongoose.connect(
                `${process.env.MONGO_URI}/${DB_NAME}`,
                connectionOptions,
            );

            // reset retryCount on success connection
            this.retryCount = 0;
        } catch (error) {
            console.error(`MONGODB CONNECTION ERROR: `, error);
            await this.handleConnectionError();
        }
    }

    async handleConnectionError() {
        if (this.retryCount < MAX_RETRIES) {
            this.retryCount++;
            console.log(
                `Retrying connection... ATTEMPT ${this.retryCount} of ${MAX_RETRIES}`,
            );
            await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
            return await this.connect();
        } else {
            console.error(
                `Failed to connect to MONGODB after ${MAX_RETRIES} attempts`,
            );
            process.exit(1);
        }
    }

    async handleDisconnection() {
        if (!this.isConnected) {
            console.log(`Attempting to Reconnect to MongoDB...`);
            await this.connect();
        }
    }

    async handleAppTermination() {
        try {
            await mongoose.connection.close();
            console.log("MongoDB connection closed through app termination");
            process.exit(0);
        } catch (error) {
            console.error("Error during database disconnection: ", error);
            process.exit(1);
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name,
        };
    }
}

const dbConnection = new DatabaseConnection();

export default dbConnection.connect.bind(dbConnection);
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);
