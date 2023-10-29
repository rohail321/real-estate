import express from "express";
import {
  auth,
  signIn,
  google,
  signoutUser,
} from "../controller/auth.contoller.js";
const router = express.Router();

router.post("/signup", auth);
router.post("/signin", signIn);
router.post("/google", google);
router.get("/signout", signoutUser);

export default router;
