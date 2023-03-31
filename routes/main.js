import express from "express";
import fallbackMETHODController from "../controller/fallbackController.js";

const router = express.Router();

router
    .route('/')
    .get(fallbackMETHODController)
    .post(fallbackMETHODController)
    .put(fallbackMETHODController)
    .delete(fallbackMETHODController)

export default router;
