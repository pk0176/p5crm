import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const projectLeadTest = asyncHandler(async (req, res) => {
    const projectLeadUser = req.user;
    return res
        .status(200)
        .json(
            new ApiResponse(200, projectLeadUser, "Accounts user is logged in")
        );
});
export { projectLeadTest };
