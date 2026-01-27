import resend
import io
import base64

def image_to_base64(img):
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")


resend.api_key = "re_P1UqJ27D_HyoJ32H2HxCYqT72DiLd3jPr"

def send_registration_email(qr_img, email_id):

    qr_b64 = image_to_base64(qr_img)

    resend.Emails.send({
    "from": "noreply@upeshypervision.in",
    "to": [email_id],
    "subject": "Your QR Code",
    "html": f"""
<table width="100%" bgcolor="#242424" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <img
                src="https://raw.githubusercontent.com/dev-rjav/BORING_IMAGE_ASSET_TUFF/refs/heads/main/Workshop.png"
                width="600"
                style="display:block;"
                alt=""
            />
        </td>
    </tr>

    <!-- WhatsApp icon -->
    <tr>
        <td align="center">
            <a href="https://chat.whatsapp.com/LPjZ17PgePy7QqvIY2KzT7">
                <img
                    src="https://raw.githubusercontent.com/dev-rjav/BORING_IMAGE_ASSET_TUFF/main/download.png  "
                    width="48"
                    alt="Whatsapp"
                    style="display:block;"
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
