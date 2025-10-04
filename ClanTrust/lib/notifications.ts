import SendGrid from '@sendgrid/mail';
import twilio from 'twilio';

SendGrid.setApiKey(process.env.SENDGRID_API_KEY || 'SG.testKeyExample');

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID || 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  process.env.TWILIO_AUTH_TOKEN || 'twilio_test_token'
);

export async function sendEmail(to: string, subject: string, text: string) {
  if (process.env.NODE_ENV === 'test') return;
  await SendGrid.send({ to, from: 'noreply@clantrust.co.ug', subject, text });
}

export async function sendSMS(to: string, body: string) {
  if (process.env.NODE_ENV === 'test') return;
  await twilioClient.messages.create({
    to,
    from: process.env.TWILIO_FROM || '+15005550006',
    body
  });
}
