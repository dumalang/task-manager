const sgMail = require('@sendgrid/mail');
const API_KEY = process.env.SENDGRID_API_KEY || undefined;

sgMail.setApiKey(API_KEY)

class Sendgrid {

    static send(to, from, subject, text, html) {
        const msg = {
            to,
            from,
            subject,
            text,
            html
        };
        sgMail.send(msg);
    }

}

module.exports = Sendgrid