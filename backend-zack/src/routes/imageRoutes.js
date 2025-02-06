import express from "express";
import { body } from "express-validator";

import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

import {
  load,
  upload,
  setProfile,
  get,
  getMe,
  metadata,
  like,
  dislike,
  unlike,
  comment,
  getList,
  getAdminList,
  getCount,
  animate,
  deleteImage,
} from "../controllers/imageController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import verifiedMiddleware from "../middleware/verifiedMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, load.array("file"), upload);
router.put(
  "/profile",
  authMiddleware,
  [body("name").notEmpty()],
  validate,
  setProfile
);
router.get("/count", getCount);
router.get("/list", authMiddleware, getList);
router.get("/list/all", authMiddleware, adminMiddleware, getAdminList);
router.get("/me", authMiddleware, getMe);
router.get("/:name", get); // Individual
router.delete("/:name", authMiddleware, deleteImage);
router.get("/:name/metadata", authMiddleware, metadata);
router.post("/:name/like", authMiddleware, verifiedMiddleware, like);
router.post("/:name/dislike", authMiddleware, verifiedMiddleware, dislike);
router.delete("/:name/like", authMiddleware, verifiedMiddleware, unlike);
router.post(
  "/:name/comment",
  authMiddleware,
  verifiedMiddleware,
  [body("text").notEmpty().withMessage("Message is required.")],
  comment
);
router.post(
  "/animate",
  load.single("file"),
  [
    body(["color1", "color2"])
      .notEmpty()
      .withMessage("Colors are required.")
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage("Invalid color(s)."),
  ],
  validate,
  animate
);

export default router;
