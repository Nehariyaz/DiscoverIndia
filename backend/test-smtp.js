require('dotenv').config();
const nodemailer = require('nodemailer');

async function test() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("SMTP server is ready");

    let info = await transporter.sendMail({
      from: `"Test" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: "Test Email",
      text: "This is a test email to verify SMTP settings",
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending test email:", error);
  }
}

test();
