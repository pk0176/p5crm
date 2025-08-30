import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        throw new ApiError(400, "Email, password and roles are required");
    }
    const roleInLowerCase = role.toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) {
        throw new ApiError(400, "User already exists");
    }

    const user = await User.create({
        email,
        password,
        roles: [roleInLowerCase],
    });
    return res
        .status(201)
        .json(new ApiResponse(201, user, "User created successfully"));
});

const listUser = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    return res.status(200).json(new ApiResponse(200, users, "Fetch all users"));
});

const admintest = asyncHandler(async (req, res) => {
    const admin = req.user;
    return res
        .status(200)
        .json(new ApiResponse(200, admin, "Admin is logged in"));
});

export { createUser, listUser, admintest };
