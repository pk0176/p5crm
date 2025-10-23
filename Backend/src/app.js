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
import adminRouter from "./routes/admin.route.js";
import designerRouter from "./routes/designer.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/project-lead", projectLeadRouter);
app.use("/api/v1/designer", designerRouter);

export default app;
