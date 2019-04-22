const driver = process.env.EMAIL_DRIVER || 'default'
const sender = process.env.EMAIL_SENDER
const sendgrid = require('./Providers/sendgrid')

const DRIVER_SENDGRID = 'sendgrid'

class EmailService {

    constructor(to, subject, text, html) {
        this.from = sender
        this.to = to
        this.subject = subject
        this.text = text
        this.html = html
    }

    setFrom(from) {
        this.from = from
    }

    async send() {
        if (!this.from) {
            throw new Error('Email sender can\'t be empty')
        }
        switch (driver) {
            case DRIVER_SENDGRID :
                sendgrid.send(this.to, this.from, this.subject, this.text, this.html)
                break
        }
    }

}

module.exports = EmailService