import express from 'express';
import { signIn, signOut, signUpRequest, signUpVerify, resetPassword, forgotPassword } from '../controllers/authController.js';

import {AuthMiddleware} from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup/request', signUpRequest); 
router.post('/signup/verify', signUpVerify);   
router.post('/signin', signIn);
router.post('/signout', AuthMiddleware, signOut);
router.post('/reset-password', AuthMiddleware, resetPassword);
router.post('/forgot-password', forgotPassword);

export default router;