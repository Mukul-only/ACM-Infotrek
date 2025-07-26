// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import User from "../models/users.model.js"; // Assuming you have a User model
// import dotenv from "dotenv";
// import nodemailer from "nodemailer";
// import { redisClient } from "../utils/redis-client.js";

// dotenv.config();

// function generateRandomPassword() {
//   const chars =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const passwordLength = Math.floor(Math.random() * 12) + 9;
//   let newPassword = "";
//   for (let i = 0; i < passwordLength; i++) {
//     newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return newPassword;
// }

// // Generate OTP
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
// }

// // Send OTP Email
// async function sendOTPEmail(email, otp) {
//   // const transporter = nodemailer.createTransport({
//   //   service: 'gmail',
//   //   auth: {
//   //     user: process.env.EMAIL_USER,
//   //     pass: process.env.EMAIL_PASS
//   //   }
//   // });

//   const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP code is: ${otp}`,
//   });
// }

// // Store pending OTPs in-memory (for demo; use DB/Redis for production)
// // const pendingOtps = new Map();

// // Signup Step 1: Request OTP
// export const requestSignUpOTP = async ({
//   username,
//   dept,
//   branch,
//   mobno,
//   rollNumber,
//   email,
//   password,
// }) => {
//   const existing = await User.findOne({
//     $or: [{ email }, { username }, { rollNumber }, { mobno }],
//   });
//   if (existing)
//     throw new Error(
//       "User with this email,mobno, username, or roll number already exists"
//     );
//   const otp = generateOTP();
//   const otpExpires = 10 * 60; // 10 minutes in seconds

//   // Store OTP and user data in Redis
//   await redisClient.setEx(
//     `otp:${email}`,
//     otpExpires,
//     JSON.stringify({ username, mobno, dept, branch, rollNumber, password, otp })
//   );

//   await sendOTPEmail(email, otp);
//   return { message: "OTP sent to email" };
// };

// // Signup Step 2: Verify OTP and Create Account
// export const verifySignUpOTP = async ({ email, otp }) => {
//   const recordStr = await redisClient.get(`otp:${email}`);
//   if (!recordStr) throw new Error("No OTP requested for this email");
//   const record = JSON.parse(recordStr);

//   if (record.otp !== otp) throw new Error("Invalid OTP");

//   const hashedPassword = await bcrypt.hash(record.password, 10);
//   const user = new User({
//     username: record.username,
//     rollNumber: record.rollNumber,
//     mobno: record.mobno,
//     dept: record.dept,
//     branch: record.branch,
//     email,
//     password: hashedPassword,
//   });
//   await user.save();

//   // Remove OTP from Redis
//   await redisClient.del(`otp:${email}`);

//   return { message: "Account created successfully" };
// };

// // Handle Sign In
// export const handleSignIn = async ({ email, password }) => {
//   const user = await User.findOne({ email });
//   if (!user) throw new Error("User not found");

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) throw new Error("Invalid credentials");

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "12h",
//   });
//   return { token, user };
// };

// // Handle Sign Out
// export const handleSignOut = async () => {
//   // Implement sign-out logic (e.g., token invalidation if using a token blacklist)
//   return { message: "Sign out successful" };
// };

// export const forgotPasswordServive = async (email) => {
//   const user = await User.findOne({ email });
//   if (!user) throw new Error("User not found");

//   const newPassword = generateRandomPassword();
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   user.password = hashedPassword;
//   await user.save();

//   // Send email with new password
//   // const transporter = nodemailer.createTransport({
//   //     service: 'gmail',
//   //     auth: {
//   //     user: process.env.EMAIL_USER,
//   //     pass: process.env.EMAIL_PASS
//   //     }
//   // });

//   const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Your New Password",
//     text: `Your new password is: ${newPassword}`,
//   });

//   return { message: "New password sent to your email" };
// };

// export const resetPasswordService = async (email, newPassword) => {
//   const user = await User.findOne({ email });
//   if (!user) throw new Error("User not found");
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   user.password = hashedPassword;
//   await user.save();
//   return { message: "Password reset successfully" };
// };

// ACM-Backend/services/authService.js
// --- MODIFIED WITH DEBUG LOGGING ---

// ACM-Backend/services/authService.js
// --- REFACTORED FOR PRODUCTION WITH SENDGRID ---

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import { redisClient } from "../utils/redis-client.js";

dotenv.config();

// --- HELPER FUNCTIONS (No changes needed) ---
function generateRandomPassword() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const passwordLength = Math.floor(Math.random() * 12) + 9;
  let newPassword = "";
  for (let i = 0; i < passwordLength; i++) {
    newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return newPassword;
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

// --- REUSABLE EMAIL UTILITY ---
// This single function now handles all email sending via SendGrid.
async function sendEmail(options) {
  const sgOptions = {
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  };
  const transporter = nodemailer.createTransport(sgTransport(sgOptions));

  try {
    console.log(
      `[Email Service] Sending email to ${options.to} with subject "${options.subject}"`
    );
    await transporter.sendMail({
      from: process.env.SENDGRID_FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html, // Allow sending rich HTML emails
    });
    console.log(`[Email Service] ✅ Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error(
      `[Email Service] ❌ FAILED to send email to ${options.to}`,
      error
    );
    if (error.response) {
      console.error(error.response.body);
    }
    // Throw a generic error to be caught by the calling function.
    throw new Error("The email service failed to send the email.");
  }
}

// --- SPECIALIZED EMAIL FUNCTIONS ---
// This function prepares and calls the main email utility for sending OTPs.
async function sendOTPEmail(email, otp) {
  await sendEmail({
    to: email,
    subject: "Your INFOTREK'25 OTP Code",
    text: `Your One-Time Password (OTP) is: ${otp}`,
    html: `<div style="font-family: sans-serif; text-align: center; padding: 20px;">
             <h2>INFOTREK'25 Verification</h2>
             <p>Your One-Time Password (OTP) is:</p>
             <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${otp}</p>
             <p>This code will expire in 10 minutes.</p>
           </div>`,
  });
}

// --- CORE AUTH SERVICES ---

export const requestSignUpOTP = async ({
  username,
  dept,
  branch,
  mobno,
  rollNumber,
  email,
  password,
}) => {
  try {
    console.log(`\n[requestSignUpOTP] Received request for email: ${email}`);
    const existing = await User.findOne({
      $or: [{ email }, { username }, { rollNumber }, { mobno }],
    });

    if (existing) {
      console.log(`[requestSignUpOTP] ❌ User already exists: ${email}`);
      throw new Error(
        "User with this email, mobno, username, or roll number already exists"
      );
    }
    console.log(`[requestSignUpOTP] ✅ User does not exist, proceeding...`);

    const otp = generateOTP();
    console.log(`[requestSignUpOTP] Generated OTP ${otp} for ${email}`);

    const otpExpires = 10 * 60; // 10 minutes
    await redisClient.setEx(
      `otp:${email}`,
      otpExpires,
      JSON.stringify({
        username,
        mobno,
        dept,
        branch,
        rollNumber,
        password,
        otp,
      })
    );
    console.log(`[requestSignUpOTP] ✅ Stored OTP in Redis for ${email}`);

    // Call the specialized OTP email function
    await sendOTPEmail(email, otp);

    console.log(
      `[requestSignUpOTP] ✅ Successfully processed request for ${email}`
    );
    return { message: "OTP sent to your email." };
  } catch (error) {
    console.error(
      `\n!!! [requestSignUpOTP] ❌ PROCESS FAILED for ${email}. Reason:`,
      error.message
    );
    throw error;
  }
};

export const verifySignUpOTP = async ({ email, otp }) => {
  // ... (No changes here, this function is correct)
  const recordStr = await redisClient.get(`otp:${email}`);
  if (!recordStr) throw new Error("No OTP requested for this email");
  const record = JSON.parse(recordStr);

  if (record.otp !== otp) throw new Error("Invalid OTP");

  const hashedPassword = await bcrypt.hash(record.password, 10);
  const user = new User({
    username: record.username,
    rollNumber: record.rollNumber,
    mobno: record.mobno,
    dept: record.dept,
    branch: record.branch,
    email,
    password: hashedPassword,
  });
  await user.save();

  await redisClient.del(`otp:${email}`);

  return { message: "Account created successfully" };
};

export const handleSignIn = async ({ email, password }) => {
  // ... (No changes here, this function is correct)
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
  return { token, user };
};

export const handleSignOut = async () => {
  // ... (No changes here, this function is correct)
  return { message: "Sign out successful" };
};

export const forgotPasswordServive = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    console.log(`[forgotPassword] Attempt for non-existent user: ${email}`);
    return {
      message:
        "If an account with this email exists, a password reset link has been sent.",
    };
  }

  const newPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  console.log(
    `[forgotPassword] ✅ Password has been reset in the database for ${email}.`
  );

  try {
    await sendEmail({
      to: email,
      subject: "Your INFOTREK'25 Password Reset",
      text: `Your new temporary password is: ${newPassword}\nPlease log in and change it as soon as possible.`,
    });
  } catch (error) {
    console.error(
      `[forgotPassword] CRITICAL: Password for ${email} was reset, but the notification email failed to send.`
    );
  }

  return {
    message:
      "If an account with this email exists, a password reset link has been sent.",
  };
};

export const resetPasswordService = async (email, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  return { message: "Password reset successfully" };
};
