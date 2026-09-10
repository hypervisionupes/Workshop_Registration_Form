import os
import qrcode
from PIL import Image
from services.email_service import send_registration_email

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
logo_path = os.path.join(backend_dir, "Qr_logo.png")

def gen_qr(document):
    """Generate QR code with participant data and send email."""
    data = {
        "name": document["name"],
        "sapId": int(document["sap"])
    }
    
    qr = qrcode.QRCode()
    qr.add_data(data)
    img = qr.make_image(
        fill_color="#2596be",
        back_color="#000000"
    ).convert("RGBA")

    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert("RGBA")
        qr_w, qr_h = img.size
        size = qr_w // 4
        logo = logo.resize((size, size), Image.LANCZOS)
        pos = ((qr_w - size) // 2, (qr_h - size) // 2)
        img.paste(logo, pos, mask=logo)

    send_registration_email(img, document["email"])
    return img
