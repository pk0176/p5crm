
import { Router } from "express";
import { listAllProjects, editProject } from "../controllers/projectLead.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply JWT verification middleware to all routes in this file
router.use(verifyJWT(["project lead"]));

router.route("/list-projects").get(listAllProjects);
router.route("/edit-project/:projectID").patch(editProject);

export default router;
