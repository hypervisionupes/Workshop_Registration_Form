import resend
import io
import base64
import config

def image_to_base64(img):
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")

resend.api_key = config.RESEND_API_KEY

def send_registration_email(qr_img, email_id):
    qr_b64 = image_to_base64(qr_img)
    whatsapp_link = config.WHATSAPP_GROUP_LINK

    return resend.Emails.send({
        "from": "noreply@upeshypervision.in",
        "to": [email_id],
        "subject": "Your Registration & QR Code - Hypervision Launchpad 2026",
        "html": f"""
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
            <a href="{whatsapp_link}" target="_blank" style="display: inline-block;">
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
""",
        "attachments": [
            {
                "filename": "qr.png",
                "content": qr_b64
            }
        ]
    })
