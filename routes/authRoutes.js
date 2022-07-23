import express from "express";
import { login, register, updateUser } from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";

// create router function
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateuser").patch(authenticateUser, updateUser);

export default router;
