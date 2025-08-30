import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import { seedAdmin } from "./utils/seedAdmin.js";

dotenv.config({
    path: "./.env",
});
connectDB()
    .then(async () => {
        app.on("error", (err) => {
            console.log("Error", err);
            throw err;
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        });
        seedAdmin();
    })
    .catch((err) => {
        console.log("Mongo db connection failed!!", err);
    });
