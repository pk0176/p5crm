import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const frontendTest = asyncHandler(async (req, res) => {
    const frontendUser = req.user;
    return res
        .status(200)
        .json(new ApiResponse(200, frontendUser, "Accounts user is logged in"));
});
export { frontendTest };
