import express from 'express';
import { logoutPOSTController } from '../controller/logoutController.js';

const router = express.Router();

router
    .route('/')
    .post(logoutPOSTController)

export default router;