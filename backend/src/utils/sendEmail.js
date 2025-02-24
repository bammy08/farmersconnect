import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:3000/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    html: `<p>Click the link below to verify your email:</p>
           <a href="${verificationLink}">${verificationLink}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return false;
  }
};
