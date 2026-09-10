import QRCode from "qrcode";
import sharp from "sharp";
import path from "path";
import fs from "fs";

/**
 * Generate a QR code PNG buffer with the Hypervision logo overlay.
 * Replaces backend/services/qr_service.py
 */
export async function generateQR(document) {
  const data = JSON.stringify({
    name: document.name,
    sapId: parseInt(document.sap, 10),
  });

  // Generate QR code as PNG buffer
  const qrBuffer = await QRCode.toBuffer(data, {
    width: 400,
    margin: 2,
    color: {
      dark: "#2596be",
      light: "#000000",
    },
    type: "png",
  });

  // Try to overlay the logo
  const logoPath = path.join(process.cwd(), "public", "Qr_logo.png");

  if (fs.existsSync(logoPath)) {
    const qrImage = sharp(qrBuffer);
    const qrMeta = await qrImage.metadata();
    const qrWidth = qrMeta.width || 400;
    const logoSize = Math.floor(qrWidth / 4);

    const resizedLogo = await sharp(logoPath)
      .resize(logoSize, logoSize, { fit: "contain" })
      .png()
      .toBuffer();

    const position = {
      left: Math.floor((qrWidth - logoSize) / 2),
      top: Math.floor((qrWidth - logoSize) / 2),
    };

    const finalImage = await qrImage
      .composite([{ input: resizedLogo, ...position }])
      .png()
      .toBuffer();

    return finalImage;
  }

  return qrBuffer;
}
