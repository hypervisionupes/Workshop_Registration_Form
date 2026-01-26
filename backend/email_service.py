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
        "from": "noreply@upeshypervision.in",  # use verified sender
        "to": [email_id],
        "subject": "Your QR Code",
        "html": "<p>Your QR code is attached.</p>",
        "attachments": [
            {
                "filename": "qr.png",
                "content": qr_b64
            }
        ]
    })

