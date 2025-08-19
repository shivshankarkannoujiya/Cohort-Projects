import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Book Bazaar",
            link: "https://mailgen.js/",
        },
    });

    const emailText = mailGenerator.generatePlaintext(options.mailGenContent);
    const emailHtml = mailGenerator.generate(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },
    });

    const mail = {
        from: "abc@bookbazaar.com",
        to: options.email,
        subject: options.subject,
        text: emailText,
        html: emailHtml,
    };

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error("Error Failed: ", error);
    }
};

const orderConfirmationMailGenContent = (username, order) => {
    return {
        body: {
            name: username,
            intro: "Thank you for your order! 🎉 ",
            outro: `
                We’ll notify you when your items are shipped.  
            `,
        },
    };
};

export { sendEmail, orderConfirmationMailGenContent };
