import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListingById,
} from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/upload/:id", verifyToken, updateListing);
router.get("/user-listing/:id", getListingById);

export default router;
