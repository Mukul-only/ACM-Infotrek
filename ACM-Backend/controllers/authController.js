import {handleSignIn, handleSignOut, requestSignUpOTP, verifySignUpOTP, forgotPasswordServive, resetPasswordService } from '../services/authService.js';
import logger from '../utils/logger.js';

// Sign In Controller
export const signIn = async (req, res) => {
    try {
        const result = await handleSignIn(req.body);
        res.status(200).json({ message: 'User signed in successfully', data: result });
    } catch (error) {
        logger.error(`SignIn Error: ${error.message}`);
        res.status(401).json({ error: error.message });
    }
};

// Sign Out Controller
export const signOut = async (req, res) => {
    try {
        const result = await handleSignOut(req.body);
        res.status(200).json({ message: 'User signed out successfully', data: result });
    } catch (error) {
        logger.error(`SignOut Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Sign Up Request Controller
export const signUpRequest = async (req, res) => {
  try {
    const result = await requestSignUpOTP(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sign Up Verify Controller
export const signUpVerify = async (req, res) => {
  try {
    const result = await verifySignUpOTP(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    await forgotPasswordServive(req.body.email);     
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const result = await resetPasswordService(email, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}