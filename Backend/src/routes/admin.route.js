import { Router } from "express";
import {
    createStaff,
    listStaff,
    admintest,
    updateStaff,
    changePassword,
    createClient,
    listClients,
    createProject,
    listProject,
    updateProject,
} from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply JWT Authentication middleware to every routes
router.use(verifyJWT(["admin"]));

router.route("/createStaff").post(createStaff);
router.route("/listAllStaff").get(listStaff);
router.route("/admintest").get(admintest);
router.route("/updateStaff/:staffId").patch(updateStaff);
router.route("/change-password/:userId").patch(changePassword);
router.route("/createClient").post(createClient);
router.route("/listAllClients").get(listClients);
router.route("/createProject").post(createProject);
router.route("/listAllProjects").get(listProject);
router.route("/updateProject/:projectId").patch(updateProject);

export default router;
