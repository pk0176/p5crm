import { User } from "../models/user.model.js";
import { asyncHandler } from "./asyncHandler.js";

export const seedAdmin = asyncHandler(async () => {
    try {
        const existingAdmin = await User.findOne({ roles: "admin" });
        if (!existingAdmin) {
            await User.create({
                email: "admin@gmail.com",
                password: "Admin@123",
                roles: ["admin"],
            });
            console.log("admin created");
        } else {
            console.log("Admin already exist");
        }
    } catch (err) {
        console.error("Error in creating admin");
    }
});
