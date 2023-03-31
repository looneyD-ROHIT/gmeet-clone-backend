import express from "express";
import fallbackMETHODController from "../controller/fallbackController.js";

const router = express.Router();

router
    .route('/')
    .get(fallbackMETHODController)
    .post(fallbackMETHODController)
    .patch(fallbackMETHODController)
    .delete(fallbackMETHODController)

export default router;
