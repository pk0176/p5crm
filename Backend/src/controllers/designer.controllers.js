import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const designerTest = asyncHandler(async (req, res) => {
    const designerUser = req.user;
    return res
        .status(200)
        .json(new ApiResponse(200, designerTest, "Accounts user is logged in"));
});
export { designerTest };
