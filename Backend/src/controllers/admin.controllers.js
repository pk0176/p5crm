import { Staff } from "../models/staff.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Staff
const createStaff = asyncHandler(async (req, res) => {
    const { name, email, password, role, internId, employeeType, status } =
        req.body;

    if (!name || !email || !password || !role || !internId || !employeeType) {
        throw new ApiError(400, "All required fields must be provided");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    //Create User (credentials)
    const user = await User.create({
        email,
        password,
        roles: [role.toLowerCase()],
    });

    //Create Staff Profile
    const staff = await Staff.create({
        name,
        internId,
        employeeType,
        status: status || "active",
        user: user._id,
    });
    return res
        .status(201)
        .json(
            new ApiResponse(201, { user, staff }, "Staff created successfully")
        );
});

//List all the staff
const listStaff = asyncHandler(async (req, res) => {
    const staff = await Staff.find().populate("user", "-password"); //exclude password
    return res
        .status(200)
        .json(new ApiResponse(200, staff, "Fetched all staff"));
});

const admintest = asyncHandler(async (req, res) => {
    const admin = req.user;
    return res
        .status(200)
        .json(new ApiResponse(200, admin, "Admin is logged in"));
});

const updateStaff = asyncHandler(async (req, res) => {
    const { staffId } = req.params;
    const { name, email, role, internId, employeeType, status } = req.body;

    // Check if staff exists
    const staff = await Staff.findById(staffId);
    if (!staff) {
        throw new ApiError(404, "Staff not found");
    }

    // Update user credentials if email or role is changed
    if (email || role) {
        const user = await User.findById(staff.user);
        if (!user) {
            throw new ApiError(404, "User account not found");
        }

        if (email) {
            // Check if new email already exists
            const existingUser = await User.findOne({
                email,
                _id: { $ne: user._id },
            });
            if (existingUser) {
                throw new ApiError(400, "Email already in use");
            }
            user.email = email;
        }

        if (role) {
            user.roles = [role.toLowerCase()];
        }

        await user.save();
    }

    // Update staff profile
    const updatedStaff = await Staff.findByIdAndUpdate(
        staffId,
        {
            $set: {
                name,
                internId,
                employeeType,
                status,
            },
        },
        { new: true }
    ).populate("user", "-password");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedStaff, "Staff updated successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!userId || !newPassword) {
        throw new ApiError(400, "User ID and new password are required");
    }

    // Find user and staff
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { message: "Password updated successfully" },
                "Password changed successfully"
            )
        );
});

export { createStaff, listStaff, admintest, changePassword, updateStaff };
