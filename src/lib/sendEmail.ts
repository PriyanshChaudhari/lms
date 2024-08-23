// src/lib/sendEmail.ts
import nodemailer from 'nodemailer';

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // App password generated
    },
});

export async function sendPasswordResetEmail(to: string, resetLink: string) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Please use the following link to reset your password: ${resetLink}`,
        html: `<p>You requested a password reset. Please use the following link to reset your password: <a href="${resetLink}">Reset Password</a></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("success")
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
}
