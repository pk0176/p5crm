import { Router } from "express";
import {
    listDesignerProjects,
    updateDesignStatus,
    updateFigmaLink,
} from "../controllers/designer.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply JWT verification middleware to all routes in this file
router.use(verifyJWT(["designer"]));

router.route("/list-projects").get(listDesignerProjects);
router.route("/update-status/:projectID").patch(updateDesignStatus);
router.route("/update-figma/:projectID").patch(updateFigmaLink);

export default router;
