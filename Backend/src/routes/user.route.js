import { Router } from "express";
import { loginUser } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { backendTest } from "../controllers/backend.controllers.js";
import { frontendTest } from "../controllers/frontend.controllers.js";
import { accountsTest } from "../controllers/accounts.controller.js";

const router = Router();

router.route("/login").post(loginUser);

//backend
router.route("/b/btest").get(verifyJWT(["backend"]), backendTest);

//frontend
router.route("/f/ftest").get(verifyJWT(["frontend"]), frontendTest);

//accounts
router.route("/a/atest").get(verifyJWT(["accounts"]), accountsTest);
export default router;
