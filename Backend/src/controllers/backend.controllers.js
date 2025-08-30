import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const backendTest = asyncHandler(async (req, res) => {
    const backendUser = req.user;
    return res
        .status(200)
        .json(new ApiResponse(200, backendUser, "backend user is logged in"));
});
export { backendTest };
