const dotenv = require('dotenv');
dotenv.config()

console.log(process.env.MANDRILL_API_KEY,"mandrill api here")

const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MANDRILL_API_KEY);

const sendEmail = async (toEmail, subject, text) => {
    try {
        const message = {
            from_email: process.env.MANDRILL_SENDER_EMAIL,
            subject: subject,
            text: text,
            to: [
                {
                    email: toEmail,
                    type: 'to',
                },
            ],
        };

        console.log('Sending email with message:', message);

        const response = await mailchimp.messages.send({ message });
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.body : error.message);
    }
};

module.exports = sendEmail;

