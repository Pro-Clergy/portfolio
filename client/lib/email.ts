import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

export function getTransporter(): nodemailer.Transporter | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587', 10),
    secure: parseInt(SMTP_PORT || '587', 10) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const mail = getTransporter();
  if (!mail) return;

  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const contactEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER!;

  await mail.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    replyTo: data.email,
    to: contactEmail,
    subject: `Portfolio: ${data.subject || 'No Subject'} — from ${data.name}`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#e8e6e3;padding:32px;border-radius:16px;">
        <div style="border-bottom:1px solid #1a1a26;padding-bottom:16px;margin-bottom:24px;">
          <h2 style="margin:0;color:#00e5a0;font-size:20px;">New Portfolio Message</h2>
        </div>
        <p style="color:#8a8a9a;margin:4px 0;">From</p>
        <p style="margin:0 0 16px;font-size:16px;">${esc(data.name)} &lt;${esc(data.email)}&gt;</p>
        <p style="color:#8a8a9a;margin:4px 0;">Subject</p>
        <p style="margin:0 0 16px;font-size:16px;">${esc(data.subject) || 'No Subject'}</p>
        <p style="color:#8a8a9a;margin:4px 0;">Message</p>
        <div style="background:#12121a;padding:20px;border-radius:12px;margin-top:8px;line-height:1.7;">
          ${esc(data.message).replace(/\n/g, '<br>')}
        </div>
        <p style="color:#546e7a;font-size:12px;margin-top:32px;text-align:center;">Sent from your portfolio contact form</p>
      </div>
    `,
  });
}
