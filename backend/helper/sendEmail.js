dotenv.config();
import dotenv from "dotenv";
import { createTransport } from 'nodemailer';
import { renderFile } from 'ejs';
import { join } from 'path';

const templateArr = [
  {
    name: "EmailVerification",
    fullName: "Verification.ejs",
    subject: "E-mail doğrulama kodu",
    isEmailVer: true
  },
  {
    name: "Verification",
    fullName: "Verification.ejs",
    subject: "İşlem doğrulama kodu",
    isEmailVer: false
  },

  {
    name: "EmailOrderNotify",
    fullName: "Order.ejs",
    subject: "Sipariş hakkında bilgilendirme"
  },
]

export const sendEmail = async(to, templateName, templateData) => {
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const findTemp = templateArr.find((template) => template.name == templateName)

  const templatePath = join("./", 'templates', findTemp.fullName);
  const html = await renderFile(templatePath, {...templateData, isEmailVer: findTemp?.isEmailVer });

  const mailOptions = {
    from: `${process.env.EMAIL_NAME} ${process.env.EMAIL}`,
    to,
    subject: findTemp.subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions)
    return true;
  } catch (error) {
    console.error(error);
    throw false;
  }
}
