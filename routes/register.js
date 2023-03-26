import express from "express";
import { registerGETController, registerPOSTController } from "../controller/registerController.js";

const router = express.Router();

router
    .route('/')
    .get(registerGETController)
    .post(registerPOSTController)

export default router;
