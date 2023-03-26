import express from 'express';
import { loginGETController, loginPOSTController } from '../controller/loginController.js';

const router = express.Router();

router
    .route('/')
    .get(loginGETController)
    .post(loginPOSTController)

export default router;