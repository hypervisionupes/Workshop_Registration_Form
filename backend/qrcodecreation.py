import qrcode
from email_service import send_registration_email

def genQr(document):
    data={
        "name":document["name"],
        "sapId":document["sap"],
        "HypId":document["hypId"]
    }
    qr=qrcode.QRCode()
    qr.add_data(data)
    participantQr=qr.make_image()
    send_registration_email(participantQr,document["email"])
    return

