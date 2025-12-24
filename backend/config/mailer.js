const nodemailer = require('nodemailer');

function createTransport() {
  const { SMTP_AUTH } = process.env;
  if (SMTP_AUTH && SMTP_AUTH.toLowerCase() === 'oauth2') {
    const { OAUTH_USER, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN } = process.env;
    if (!OAUTH_USER || !OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET || !OAUTH_REFRESH_TOKEN) {
      throw new Error('OAuth2 configuration missing. Set OAUTH_USER, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN');
    }
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: OAUTH_USER,
        clientId: OAUTH_CLIENT_ID,
        clientSecret: OAUTH_CLIENT_SECRET,
        refreshToken: OAUTH_REFRESH_TOKEN,
      },
    });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP configuration missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env');
  }
  const secure = String(SMTP_PORT) === '465';
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

module.exports = {
  sendMail: async ({ to, subject, html, text }) => {
    const transporter = createTransport();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.OAUTH_USER;
    return transporter.sendMail({ from, to, subject, html, text });
  },
};
