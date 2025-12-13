import { Router } from "express";
import {
    listBackendProjects,
    implementApiEndpoint,
} from "../controllers/backend.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply JWT verification middleware to all routes in this file
router.use(verifyJWT(["backend"]));

router.route("/list-projects").get(listBackendProjects);
router.route("/implement-api/:projectID/:apiId").patch(implementApiEndpoint);

export default router;
