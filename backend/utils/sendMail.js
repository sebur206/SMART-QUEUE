import nodemailer from 'nodemailer';


export  const sendMail = async (options)=>{

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.text,
    }

    await transporter.sendMail(mailOptions);
}