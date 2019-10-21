var nodemailer = require("nodemailer")

// nodemailer instance
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD }
})

const sendEmail = (to, subject, link) => {
    transporter.sendMail({
        to, subject,
        from: "Qurba",
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    }).then(console.log).catch(console.log)
}

module.exports = sendEmail