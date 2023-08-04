const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { gmail } = require('googleapis/build/src/apis/gmail');

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, REFRESH_TOKEN } = process.env;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendEmail(userEmail, subject, text, html, next) {

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'words.learner.site@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    const mailOptions = {
      from: 'WORDS-LEARNER <words.learner.site@gmail.com>',
      to: userEmail,
      subject,
      text,
      html
    };

    const result = await transport.sendMail(mailOptions);
    return result;

  } catch (error) {
    next(error);
  }

}

module.exports = { sendEmail };
