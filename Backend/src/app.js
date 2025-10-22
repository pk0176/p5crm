import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import projectLeadRouter from "./routes/projectLead.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/project-lead", projectLeadRouter);

export default app;
