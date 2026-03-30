import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

async function initTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Fallback to Ethereal for testing
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Using Ethereal Email for testing. Check console for preview URLs.');
  }
}

initTransporter().catch(err => {
  console.error('Failed to initialize email transporter:', err);
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if (!transporter) {
      await initTransporter();
    }
  
    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || '"Nexus Edge" <noreply@nexusedge.finance>';
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
    });
    
    console.log(`Email sent to ${to}: ${subject}`);
    if (info.messageId && (transporter.options as any).host === 'smtp.ethereal.email') {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
