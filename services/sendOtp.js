import nodemailer from "nodemailer";
import { OTP } from "../models/otpModel.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ssr911999@gmail.com",
    pass: "yusj dozw kzrf vsus"
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 20000,
  socketTimeout: 20000,
});

/* 
const crypto = require('crypto');
 function generateOTP() {
   return crypto.randomInt(100000, 999999);
 }
 console.log(generateOTP());

*/

/* Function to Generate 6 Digit OTP: */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}




export default async function sentOtp({ email }) {
  const otp = generateOTP();

  const mailOptions = {
    from: '"Shopee" <ssr911999@gmail.com>',
    to: email,
    subject: 'Your One Time Password (OTP) for Shopee account',
html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Shopee</h1>
                <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Verify Your Account</p>
              </td>
            </tr>
            
            <!-- Body -->
            <tr>
              <td style="padding: 48px 40px;">
                <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 600; text-align: center;">Your Verification Code</h2>
                
                <p style="margin: 0 0 32px 0; color: #6b7280; font-size: 15px; line-height: 24px; text-align: center;">
                  Enter this code to complete your registration. This code will expire in <strong style="color: #111827;">10 minutes</strong>.
                </p>
                
                <!-- OTP Box -->
                <table role="presentation" style="width: 100%; margin: 0 0 32px 0;">
                  <tr>
                    <td align="center">
                      <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3px; border-radius: 12px;">
                        <div style="background-color: #ffffff; padding: 24px 48px; border-radius: 10px;">
                          <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 700; letter-spacing: 12px; color: #667eea; display: block;">${otp}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                
                <!-- Security Notice -->
                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 8px; margin: 0 0 24px 0;">
                  <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 20px;">
                    <strong>🔒 Security Tip:</strong> Never share this code with anyone. Shopee will never ask for your OTP via phone or email.
                  </p>
                </div>
                
                <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 20px; text-align: center;">
                  If you didn't request this code, please ignore this email or contact our support team.
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f9fafb; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 8px 0; color: #111827; font-size: 14px; font-weight: 500;">Best regards,</p>
                <p style="margin: 0 0 4px 0; color: #667eea; font-size: 15px; font-weight: 600;">Sanjay Singh Rawat</p>
                <p style="margin: 0; color: #6b7280; font-size: 13px;">Shopee Team</p>
                
                <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 18px;">
                    © ${new Date().getFullYear()} Shopee. All rights reserved.
                  </p>
                </div>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`,  };

  try {
    await OTP.updateOne({ email },
      { $set: { otp } },
      { upsert: true });
    await transporter.sendMail(mailOptions)
    return {
      success: true,
      message: `OTP sent successfully to ${email}.`,
    };
  } catch (error) {
    console.log("Error while sending Email:", error.message, "code:", error.code);
    return { success: false, error: 'Failed to send OTP. Please try again later.' };
  }
}





