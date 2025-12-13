import { Router } from "express";
import { loginUser } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { accountsTest } from "../controllers/accounts.controller.js";

const router = Router();

router.route("/login").post(loginUser);

//accounts
router.route("/a/atest").get(verifyJWT(["accounts"]), accountsTest);
export default router;
