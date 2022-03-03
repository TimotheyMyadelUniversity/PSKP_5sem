const nodemailer = require("nodemailer");
module.exports.send = async (text) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'vldshss2000@gmail.com', // generated ethereal user
            pass: 'vladoshuesos', // generated ethereal password
        },
    })

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'vldshss@gmail.com', // sender address
        to: 'bad.bug39@gmail.com', // list of receivers
        subject: 'send method', // Subject line
        html: `<b>${text}</b>`, // html body
    })
}