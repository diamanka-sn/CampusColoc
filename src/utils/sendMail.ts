import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendMail = async (destinataire: string, objet: string, messages: string): Promise<{ error: boolean; message: string }> => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        const message = {
            from: process.env.GMAIL_USERNAME,
            to: destinataire,
            subject: objet,
            html: messages,
        };

        const info = await transporter.sendMail(message);

        console.log('Mail envoyé :', info);

        return { error: false, message: 'Mail envoyé avec succès' };
    } catch (error) {
        console.error('Erreur lors de l\'envoi du mail :', error);
        return { error: true, message: 'Erreur lors de l\'envoi du mail' };
    }
};
