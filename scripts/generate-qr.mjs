import QRCode from 'qrcode';
import { promises as fs } from 'fs';
import path from 'path';
import { Jimp } from 'jimp';

const TARGET_URL = 'https://delpasqua.com/smaltimenti';
const QR_DIR = path.join(process.cwd(), 'public', 'qr');
const QR_WIDTH = 512;

async function generateQRCodes() {
  try {
    // 1. Create public/qr directory
    await fs.mkdir(QR_DIR, { recursive: true });

    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    const logoBuffer = await fs.readFile(logoPath);
    const logoBase64 = logoBuffer.toString('base64');
    const logoDataUri = `data:image/png;base64,${logoBase64}`;

    // 2. Generate raw SVG to extract coordinates and module grid dimensions
    const rawSvg = await QRCode.toString(TARGET_URL, {
      type: 'svg',
      color: {
        dark: '#131713',
        light: '#ffffff'
      },
      margin: 2,
      errorCorrectionLevel: 'H'
    });

    // Extract viewBox dimensions
    const viewBoxMatch = rawSvg.match(/viewBox="0 0 (\d+) (\d+)"/);
    if (!viewBoxMatch) {
      throw new Error('Could not parse viewBox from generated SVG');
    }
    const viewBoxWidthVal = parseInt(viewBoxMatch[1], 10);

    // Calculate logo module size (occupies ~22% of QR module width)
    const logoModules = Math.floor(viewBoxWidthVal * 0.22);
    
    // SVG coordinates
    const svgX = (viewBoxWidthVal - logoModules) / 2;
    const svgY = (viewBoxWidthVal - logoModules) / 2;

    // SVG elements: white background mask (rect) and logo image
    const rectElement = `<rect x="${svgX}" y="${svgY}" width="${logoModules}" height="${logoModules}" fill="#ffffff" rx="0.3" ry="0.3" />`;
    const logoElement = `<image x="${svgX + 0.4}" y="${svgY + 0.4}" width="${logoModules - 0.8}" height="${logoModules - 0.8}" href="${logoDataUri}" />`;

    const closingTagIndex = rawSvg.lastIndexOf('</svg>');
    if (closingTagIndex === -1) {
      throw new Error('Invalid SVG format');
    }

    // Combine standard SVG with embedded logo
    let logoSvg = rawSvg.slice(0, closingTagIndex) + rectElement + logoElement + rawSvg.slice(closingTagIndex);
    if (logoSvg.startsWith('<svg')) {
      logoSvg = logoSvg.replace('<svg', `<svg width="${QR_WIDTH}" height="${QR_WIDTH}"`);
    }

    // Write SVG files
    const svgPath = path.join(QR_DIR, 'qr-smaltimento.svg');
    const svgLogoPath = path.join(QR_DIR, 'qr-smaltimento-logo.svg');
    
    await fs.writeFile(svgPath, rawSvg.replace('<svg', `<svg width="${QR_WIDTH}" height="${QR_WIDTH}"`), 'utf8');
    await fs.writeFile(svgLogoPath, logoSvg, 'utf8');
    console.log(`✅ Standard SVG generated at: ${svgPath}`);
    console.log(`✅ SVG with Logo generated at: ${svgLogoPath}`);

    // 3. Generate Standard PNG
    const pngPath = path.join(QR_DIR, 'qr-smaltimento.png');
    await QRCode.toFile(pngPath, TARGET_URL, {
      color: {
        dark: '#131713',
        light: '#ffffff'
      },
      margin: 2,
      width: QR_WIDTH,
      errorCorrectionLevel: 'H'
    });
    console.log(`✅ Standard PNG generated at: ${pngPath}`);

    // 4. Generate PNG with Logo using proportional math to avoid distortion
    const pngLogoPath = path.join(QR_DIR, 'qr-smaltimento-logo.png');
    try {
      const qrImage = await Jimp.read(pngPath);
      const logoImage = await Jimp.read(logoPath);

      // Compute exact pixel dimensions matching the SVG coordinate grid
      const maskSizePx = Math.round(QR_WIDTH * (logoModules / viewBoxWidthVal));
      const logoBoxSizePx = Math.round(QR_WIDTH * ((logoModules - 0.8) / viewBoxWidthVal));

      // Proportional scale to fit logo inside logoBoxSizePx box while preserving aspect ratio
      const originalW = logoImage.width;
      const originalH = logoImage.height;
      const scale = Math.min(logoBoxSizePx / originalW, logoBoxSizePx / originalH);
      const targetW = Math.round(originalW * scale);
      const targetH = Math.round(originalH * scale);

      logoImage.resize({ w: targetW, h: targetH });

      // Create white background mask (rounded corners simulated or solid square)
      const whiteMask = new Jimp({ width: maskSizePx, height: maskSizePx, color: 0xffffffff });

      // Center the mask and the logo exactly
      const maskX = Math.round((QR_WIDTH - maskSizePx) / 2);
      const maskY = Math.round((QR_WIDTH - maskSizePx) / 2);
      const logoX = Math.round((QR_WIDTH - targetW) / 2);
      const logoY = Math.round((QR_WIDTH - targetH) / 2);

      // Composite and save
      qrImage.composite(whiteMask, maskX, maskY);
      qrImage.composite(logoImage, logoX, logoY);
      
      await qrImage.write(pngLogoPath);
      console.log(`✅ PNG with Logo generated at: ${pngLogoPath}`);
    } catch (jimpError) {
      console.error('❌ Error compositing logo on PNG:', jimpError);
    }

    console.log(`🚀 All QR codes successfully stored under public/qr/`);
  } catch (error) {
    console.error('❌ Error generating QR codes:', error);
    process.exit(1);
  }
}

generateQRCodes();
