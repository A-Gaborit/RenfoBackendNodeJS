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

const mailPasswordReset = async (user, resetToken) => {
    try {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const result = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: user.email,
            subject: `Réinitialisation de votre mot de passe`,
            text: `Bonjour ${user.firstname || user.username},
            Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien suivant pour définir un nouveau mot de passe :
            ${resetUrl}
            Ce lien est valable pendant 1 heure.
            
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            
            Cordialement,
            L'équipe AssurMoi`,
            html: `<h2>Bonjour ${user.firstname || user.username},</h2>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <p>Cliquez sur le lien suivant pour définir un nouveau mot de passe :</p>
            <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a></p>
            <p>Ou copiez ce lien dans votre navigateur :<br>${resetUrl}</p>
            <p><small>Ce lien est valable pendant 1 heure.</small></p>
            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
            <br>
            <p>Cordialement,<br>L'équipe AssurMoi</p>`
        });
        return true;
    } catch (error) {
        return error;
    }
}

module.exports = { 
    mail,
    mailLogin,
    mailPasswordReset
};