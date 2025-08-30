import { Router } from "express";
import {
    createUser,
    listUser,
    admintest,
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
router.route("/admin/createUser").post(verifyJWT(["admin"]), createUser);
router.route("/admin/listAllUser").get(verifyJWT(["admin"]), listUser);
router.route("/admin/admintest").get(verifyJWT(["admin"]), admintest);

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
