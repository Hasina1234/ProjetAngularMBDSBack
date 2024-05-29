const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'assignmentnoreplymbds@gmail.com',
        pass: 'ajsgiwtuysnmahln'
    },
    tls: {
        rejectUnauthorized: false
    }
});

const SendMail = async (email, sujet, message, prof) =>
    transporter.sendMail({
        from: prof,
        to: email,
        subject: sujet,
        html: message,
        replyTo: prof
    }, (err, info) => err ? console.error(err) : console.log('Email envoyé: ' + info.response));

module.exports = { SendMail };
