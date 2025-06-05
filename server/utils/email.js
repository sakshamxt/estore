import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
    port: process.env.SMTP_PORT, // 587 for TLS, 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email address from .env
      pass: process.env.EMAIL_PASS, // Your email password or app password from .env
    },
  });

  const mailOptions = {
    from: `eStore <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: '<b>Hello world?</b>' // You can use HTML body as well
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;