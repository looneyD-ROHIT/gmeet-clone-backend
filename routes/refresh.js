import express from "express";
import refreshTokenPOSTController from "../controller/refreshTokenController.js";

const router = express.Router();

router
    .route('/')
    .post(refreshTokenPOSTController)

export default router;
