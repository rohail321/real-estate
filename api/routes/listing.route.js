import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListingById,
  getListing,
  searchListing,
} from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/upload/:id", verifyToken, updateListing);
router.get("/user-listing/:id", getListingById);
router.get("/all", getListing);
router.get("/get", searchListing);
export default router;
