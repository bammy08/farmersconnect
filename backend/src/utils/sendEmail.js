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

export const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    const resetLink = `http://localhost:3000/reset?token=${resetToken}`;

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
      subject: 'Reset Your Password',
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    };

    console.log('📧 Sending email to:', email);
    console.log('🔗 Reset Link:', resetLink);

    await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};

export const sendNotificationEmail = async (email, message) => {
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
    subject: 'New Notification',
    html: `<p>You have a new notification:</p>
           <p><strong>${message}</strong></p>
           <p><a href="http://localhost:3000/notifications">View Notifications</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email notification sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    return false;
  }
};
