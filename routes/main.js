import express from "express";
import fallbackMETHODController from "../controller/fallbackController.js";
import { meetIdCreatePOSTController } from "../controller/meetIdCreateController.js";
import { meetIdCheckPOSTController } from "../controller/meetIdCheckController.js";

const router = express.Router();

router
    .route('/')
    .get(fallbackMETHODController)
    .post(fallbackMETHODController)
    .put(fallbackMETHODController)
    .delete(fallbackMETHODController)

router
    .route('/create')
    .post(meetIdCreatePOSTController)

router.route('/check')
    .post(meetIdCheckPOSTController)

export default router;
