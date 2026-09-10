import nodemailer from "nodemailer";

/**
 * Send registration confirmation email with QR code attachment via SMTP.
 * Uses Nodemailer with SMTP transport — works on Vercel serverless, no separate server needed.
 */

function getTransporter() {
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    secure: port === 465, // true for 465 (SSL), false for 587 (TLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendRegistrationEmail(qrImageBuffer, emailId) {
  const whatsappLink = process.env.WHATSAPP_GROUP_LINK || "";
  const fromAddress = process.env.SMTP_FROM || "noreply@upeshypervision.in";

  const transporter = getTransporter();

  const htmlBody = `
<table width="100%" bgcolor="#242424" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
    <tr>
        <td align="center">
            <img
                src="https://raw.githubusercontent.com/dev-rjav/BORING_IMAGE_ASSET_TUFF/refs/heads/main/Workshop.png"
                width="600"
                style="display:block; max-width:100%; border-radius: 8px;"
                alt="Hypervision Workshop"
            />
        </td>
    </tr>

    <tr>
        <td align="center" style="padding: 24px 0 12px 0;">
            <p style="color: #ffffff; font-family: sans-serif; font-size: 16px; margin: 0 0 12px 0;">
                Click below to join our official WhatsApp group for event updates and announcements:
            </p>
            <a href="${whatsappLink}" target="_blank" style="display: inline-block;">
                <img
                    src="https://raw.githubusercontent.com/dev-rjav/BORING_IMAGE_ASSET_TUFF/main/download.png"
                    width="48"
                    alt="WhatsApp Group"
                    style="display:block; margin: 0 auto;"
                />
            </a>
        </td>
    </tr>
</table>
`;

  const mailOptions = {
    from: fromAddress,
    to: emailId,
    subject: "Your Registration & QR Code - Hypervision Launchpad 2026",
    html: htmlBody,
    attachments: [
      {
        filename: "qr.png",
        content: qrImageBuffer,
        contentType: "image/png",
      },
    ],
  };

  const result = await transporter.sendMail(mailOptions);
  console.log("Email sent successfully:", result.messageId);
  return result;
}
