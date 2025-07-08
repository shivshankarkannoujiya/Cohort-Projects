import { getDBStatus } from "../db/index.js";

export const checkHealth = async (_, res) => {
    try {
        const dbStatus = getDBStatus();

        const healthStatus = {
            status: "OK",
            timeStamp: new Date().toISOString(),
            services: {
                database: {
                    status: dbStatus.isConnected ? "healthy" : "unhealthy",
                    details: {
                        ...dbStatus,
                        readyState: getReadyStateText(dbStatus.readyState),
                    },
                },

                server: {
                    status: "healthy",
                    uptime: process.uptime(),
                    memoryUsage: process.memoryUsage,
                },
            },
        };

        const httpStatus =
            healthStatus.services.database === "healthy" ? 200 : 503;
        return res.status(httpStatus).json(healthStatus);
    } catch (error) {
        console.error("Health check Failed", error);
        res.status(503).json({
            status: "ERROR",
            timeStamp: new Date().toISOString(),
            error: error.message,
        });
    }
};

function getReadyStateText(state) {
    switch (state) {
        case 0:
            return "disconnected";
        case 1:
            return "connected";
        case 2:
            return "connecting";
        case 3:
            return "disconnecting";
        default:
            return "unknown";
    }
}
