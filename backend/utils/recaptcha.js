// utils/recaptcha.js
async function verifyRecaptcha(token) {
  // Bypass verification in testing environment
  if (process.env.NODE_ENV === 'test') {
    console.log("✅ Test mode: Skipping reCAPTCHA validation");
    return true;
  }

  const fetch = (await import('node-fetch')).default;
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.error("Missing RECAPTCHA_SECRET_KEY in environment variables");
    return false;
  }

  try {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error.message);
    return false;
  }
}

module.exports = { verifyRecaptcha };
