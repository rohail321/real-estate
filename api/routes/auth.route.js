import express from "express";
import { auth } from "../controller/auth.contoller.js";
const router = express.Router();

router.post("/signup", auth);

export default router;
