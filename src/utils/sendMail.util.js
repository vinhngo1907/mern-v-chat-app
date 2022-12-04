const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const CLIENT_ID = process.env.MAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.MAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN;
const SENDER_MAIL = process.env.SENDER_EMAIL_ADDRESS;
const CLIENT_URL = process.env.CLIENT_URL;

const sendMail = async (to, url, txt) => {
    const oAuth2Client = new OAuth2Client(
        CLIENT_ID, CLIENT_SECRET, OAUTH_PLAYGROUND
    );
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    try {
        const access_token = await oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: "OAuth2",
                user: SENDER_MAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                access_token
            }
        });
        const mailOptions = {
            from: SENDER_MAIL,
            to: to,
            subject: "V-Chat Dev-VN with love",
            html: require('./emailTemplate.util')({
                url, txt, CLIENT_URL 
            })
        }
        const result = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;