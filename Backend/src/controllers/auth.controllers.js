import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/user.model.js";

const loginUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        throw new ApiError(400, "Email and password are required");
    }
    const roleInLowerCase = role.toLowerCase();
    const user = await User.findOne({
        email,
        roles: { $in: [roleInLowerCase] },
    });

    if (!user) {
        throw new ApiError(400, "Invalid credentials");
    }
    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) throw new ApiError(400, "credentials does'nt match");

    const token = user.generateAccessToken();
    const options = {
        httpOnly: true,
        secure: true, //by this only server can modify
    };
    return res
        .status(200)
        .cookie("accessToken", token, options)
        .json(new ApiResponse(200, token, "Login successful"));
});

export { loginUser };
