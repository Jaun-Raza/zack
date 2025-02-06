import express from "express";
import { body } from "express-validator";

import {
  forgot,
  login,
  register,
  reset,
  verify,
} from "../controllers/authController.js";
import validate from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Username is required.")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters.")
      .isLength({ max: 24 })
      .withMessage("Username must be maximum 24 characters.")
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage(
        "Username must contain only letters, numbers, underscores, or hyphens."
      ),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Invalid email address."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("password").trim().notEmpty().withMessage("Password is required."),
  ],
  validate,
  login
);

router.post(
  "/forgot",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Invalid email address."),
  ],
  validate,
  forgot
);

router.post(
  "/verify",
  [body("token").trim().notEmpty().withMessage("Token is required.")],
  validate,
  verify
);

router.post(
  "/reset",
  [
    body("token").trim().notEmpty().withMessage("Token is required."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  validate,
  reset
);

export default router;
