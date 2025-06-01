require('dotenv').config();  // Load .env variables

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');
const EmailLog = require('./models/EmailLog');
const User = require('./models/User');
const { verifyRecaptcha } = require('./utils/recaptcha');

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for all origins (adjust as needed)
app.use(cors());

// Middleware to parse JSON body
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Routes

app.post('/enquiry', async (req, res) => {
  console.log('Received enquiry:', req.body);

  const { name, email, subject, message, recaptchaToken } = req.body;

  try {
    // Send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.GMAIL_USER,
      subject: subject || "New Travel Enquiry",
      text: message,
    });

    // Log in DB
    await EmailLog.create({
      name,
      email,
      subject,
      message,
      status: "success",
    });

    res.status(200).json({ message: "Enquiry sent successfully" });
  } catch (error) {
    console.error('Error sending enquiry:', error);

    await EmailLog.create({
      name,
      email,
      subject,
      message,
      status: "failure",
      error: error.message,
    });

    res.status(500).json({ error: "Failed to send enquiry", details: error.message });
  }
});

app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ error: "Missing reCAPTCHA token" });
  }

  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return res.status(400).json({ error: "Failed reCAPTCHA verification" });
  }

  try {
     const emailNormalized = email.toLowerCase().trim();
    // Check if user already exists
    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists with this email" });
    }

    // Hash password and save new user
   
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email: emailNormalized, password: hashedPassword });
    await newUser.save();

    console.log('User registered:', email);
    res.status(200).json({ message: "Signup successful" });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  console.log('--- Login attempt ---');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('reCAPTCHA token:', recaptchaToken);


  try {
    const emailNormalized = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailNormalized });
    console.log('User from DB:', user);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log('Login successful!');
    res.status(200).json({ message: "Login successful" });

  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Normalize email
    const emailNormalized = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: emailNormalized });
    if (!user) {
      // Do not reveal user existence
      return res.status(200).json({ message: 'If your email exists, you will receive a reset link.' });
    }

    // Generate a JWT reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Compose reset link (frontend URL with token query param)
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send reset email
    await transporter.sendMail({
      from: `"Support" <${process.env.GMAIL_USER}>`,
      to: emailNormalized,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset.</p><p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
    });

    // Log email sent
    await EmailLog.create({
      name: 'Password Reset',
      email: emailNormalized,
      subject: 'Password Reset Request',
      message: `Reset link sent: ${resetLink}`,
      status: 'success'
    });

    res.json({ message: 'Reset link sent successfully' });

  } catch (error) {
    console.error('Forgot password error:', error);

    // Log failure
    await EmailLog.create({
      name: 'Password Reset',
      email: email,
      subject: 'Password Reset Request',
      message: error.message,
      status: 'failure',
      error: error.message
    });

    res.status(500).json({ error: 'Failed to send reset link', details: error.message });
  }

  const user = await User.findOne({ email: emailNormalized });
console.log('User found for forgot-password:', user);

if (!user) {
  console.log('User not found for email:', emailNormalized);
  return res.status(200).json({ message: 'If your email exists, you will receive a reset link.' });
}

console.log('Sending reset email to:', emailNormalized);

});

app.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  try {
    // Verify token and get payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ error: 'Invalid token or user not found' });
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Reset password error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    res.status(400).json({ error: 'Invalid token' });
  }
});



// Start server - LAST STEP
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
