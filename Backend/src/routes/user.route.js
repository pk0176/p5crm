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
import { loginUser } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { projectLeadTest } from "../controllers/projectLead.controller.js";
import { backendTest } from "../controllers/backend.controllers.js";
import { frontendTest } from "../controllers/frontend.controllers.js";
import { designerTest } from "../controllers/designer.controllers.js";
import { accountsTest } from "../controllers/accounts.controller.js";

const router = Router();

router.route("/login").post(loginUser);

//secureroute;

//admin
router.route("/admin/createStaff").post(verifyJWT(["admin"]), createStaff);
router.route("/admin/listAllStaff").get(verifyJWT(["admin"]), listStaff);
router.route("/admin/admintest").get(verifyJWT(["admin"]), admintest);
router
    .route("/admin/updateStaff/:staffId")
    .patch(verifyJWT(["admin"]), updateStaff);
router
    .route("/admin/change-password/:userId")
    .patch(verifyJWT(["admin"]), changePassword);
router.route("/admin/createClient").post(verifyJWT(["admin"]), createClient);
router.route("/admin/listAllClients").get(verifyJWT(["admin"]), listClients);
router.route("/admin/createProject").post(verifyJWT(["admin"]), createProject);
router.route("/admin/listAllProjects").get(verifyJWT(["admin"]), listProject);
router
    .route("/admin/updateProject/:projectId")
    .patch(verifyJWT(["admin"]), updateProject);

//project Lead
router.route("/pl/pltest").get(verifyJWT(["project lead"]), projectLeadTest);

//backend
router.route("/b/btest").get(verifyJWT(["backend"]), backendTest);

//frontend
router.route("/f/ftest").get(verifyJWT(["frontend"]), frontendTest);

//designer
router.route("/d/dtest").get(verifyJWT(["designer"]), designerTest);

//accounts
router.route("/a/atest").get(verifyJWT(["accounts"]), accountsTest);
export default router;
