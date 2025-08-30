import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const accountsTest = asyncHandler(async (req, res) => {
    const accountUser = req.user;
    return res
        .status(200)
        .json(new ApiResponse(200, accountUser, "Accounts user is logged in"));
});
export { accountsTest };
