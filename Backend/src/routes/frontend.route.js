
import { Router } from "express";
import { listFrontendProjects, addApiEndpoint, verifyApiEndpoint } from "../controllers/frontend.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply JWT verification middleware to all routes in this file
router.use(verifyJWT(["frontend"]));

router.route("/list-projects").get(listFrontendProjects);
router.route("/add-api/:projectID").post(addApiEndpoint);
router.route("/verify-api/:projectID/:apiId").patch(verifyApiEndpoint);

export default router;
