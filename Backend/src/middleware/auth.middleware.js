import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = (allowedRoles = []) =>
    asyncHandler(async (req, _, next) => {
        try {
            const token =
                req.cookies?.accessToken ||
                req.header("Authorization")?.replace("Bearer ", "");

            if (!token) {
                throw new ApiError(401, "Unauthorized request");
            }

            const decodedToken = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET
            );

            const user = await User.findById(decodedToken?._id).select(
                "-password"
            );
            if (!user) {
                throw new ApiError(401, "Invalid access token");
            }

            if (
                allowedRoles.length > 0 &&
                !allowedRoles.some((role) => user.roles.includes(role))
            ) {
                throw new ApiError(
                    403,
                    "Forbidden: You don't have access to this resource"
                );
            }

            req.user = user;
            next();
        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid access token");
        }
    });
