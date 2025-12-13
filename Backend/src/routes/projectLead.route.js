import { Router } from "express";
import {
    listAllProjects,
    editProject,
    listAllFrontend,
    listAllBackend,
    listAllDesigner,
} from "../controllers/projectLead.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply JWT verification middleware to all routes in this file
router.use(verifyJWT(["project lead"]));

router.route("/list-projects").get(listAllProjects);
router.route("/edit-project/:projectID").patch(editProject);
router.route("/getAllFrontendUser").get(listAllFrontend);
router.route("/getAllBackendUser").get(listAllBackend);
router.route("/getAllDesignerUser").get(listAllDesigner);

export default router;
