import qrcode
from email_service import send_registration_email
from PIL import Image
import os

logo_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Qr_logo.png")


def genQr(document):
    data={
        "name":document["name"],
        "sapId":int(document["sap"]),
        "HypId":document["hypId"]
    }
    qr=qrcode.QRCode()
    qr.add_data(data)
    img = qr.make_image(
        fill_color="#2596be",
        back_color="#000000"
    ).convert("RGBA")

    if logo_path:
        logo = Image.open(logo_path).convert("RGBA")

        qr_w, qr_h = img.size
        size = qr_w // 4
        logo = logo.resize((size, size), Image.LANCZOS)

        pos = ((qr_w - size) // 2, (qr_h - size) // 2)
        img.paste(logo, pos, mask=logo)

    send_registration_email(img,document["email"])
    return

