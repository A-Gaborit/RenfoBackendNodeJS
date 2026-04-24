const { createTransport } = require('nodemailer');
require('dotenv').config();

const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE === 'true' ?? false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PSWD
    }
});

const mail = async (to, subject, text, html) => {
    try {
        const result = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject,
            text,
            html
        });
        return true;
    } catch (error) {
        return error;
    }
};

const mailLogin = async (user) => {
    try {
        const result = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: user.email,
            subject: `Notification de connexion`,
            text: `Bonjour ${user.firstname} ${user.lastname}`,
            html: `<h2>Bonjour ${user.firstname} ${user.lastname}</h2><br><p>Une nouvelle connexion à votre compte a été effectuée.</p>`
        });
        return true;
    } catch (error) {
        return error;
    }
}

module.exports = { 
    mail,
    mailLogin
};