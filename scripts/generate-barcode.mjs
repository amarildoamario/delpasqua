/**
 * @file generate-barcode.mjs
 * @description Script per generare codici a barre in formato EAN-13 (sia SVG che PNG).
 * Salva i risultati all'interno della cartella public/codice-a-barre/.
 * 
 * Uso:
 *   node scripts/generate-barcode.mjs [codice_12_o_13_cifre] [nome_file]
 * Esempio:
 *   node scripts/generate-barcode.mjs 805902340500 olio-evo-500ml
 *   node scripts/generate-barcode.mjs 805902340501 olio-evo-750ml
 */

import { promises as fs } from 'fs';
import path from 'path';
import { Jimp, loadFont, measureText } from 'jimp';

// Impostazioni di default
const DEFAULT_CODE = '805902340500'; // 12 cifre dell'Olio EVO 500ml, il check digit (4) verrà calcolato automaticamente.
const DEFAULT_FILENAME = 'olio-evo-500ml';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'codice-a-barre');

// Palette colori coordinata con il design del sito
const COLOR_WHITE = '#ffffff';
const COLOR_DARK = '#131713'; // Grigio scurissimo/verde tipico del sito
const JIMP_COLOR_WHITE = 0xffffffff;
const JIMP_COLOR_DARK = 0x131713ff;

/**
 * Calcola il check digit (tredicesima cifra) per un codice EAN-13 a 12 cifre.
 * @param {string} code12 
 * @returns {number}
 */
function calculateEan13CheckDigit(code12) {
  if (code12.length !== 12) {
    throw new Error('Il codice sorgente deve essere di 12 cifre');
  }
  
  const digits = code12.split('').map(Number);
  
  // Calcolo pesato: posizioni pari (1-based: 2, 4, 6, 8, 10, 12) moltiplicate per 3, posizioni dispari per 1
  let sumOdd = 0;  // 1, 3, 5, 7, 9, 11
  let sumEven = 0; // 2, 4, 6, 8, 10, 12
  
  for (let i = 0; i < 12; i++) {
    if (i % 2 === 0) {
      sumOdd += digits[i];
    } else {
      sumEven += digits[i];
    }
  }
  
  const total = sumOdd + (sumEven * 3);
  const remainder = total % 10;
  const checkDigit = remainder === 0 ? 0 : 10 - remainder;
  
  return checkDigit;
}

/**
 * Codifica una stringa EAN-13 a 13 cifre in un pattern binario (95 moduli).
 * @param {string} code13 
 * @returns {string} Stringa di 95 caratteri '0' (spazio/bianco) o '1' (barra/scuro).
 */
function encodeEan13(code13) {
  if (code13.length !== 13) {
    throw new Error('Il codice EAN-13 deve essere composto da esattamente 13 cifre');
  }

  const digits = code13.split('').map(Number);
  const firstDigit = digits[0];

  // Set di codifica per la parte sinistra (L-code e G-code)
  const L_CODE = [
    "0001101", "0011001", "0010011", "0111101", "0100011",
    "0110001", "0101111", "0111011", "0110111", "0001011"
  ];

  // G-code è il codice L invertito temporalmente (specchiato) e logico (0<->1)
  const G_CODE = L_CODE.map(code => 
    code.split('').reverse().map(bit => bit === '0' ? '1' : '0').join('')
  );

  // R-code (parte destra) è il codice L invertito logicamente (0<->1)
  const R_CODE = L_CODE.map(code => 
    code.split('').map(bit => bit === '0' ? '1' : '0').join('')
  );

  // Mappa delle parità per i primi 6 caratteri a seconda della prima cifra
  const PARITY_PATTERNS = [
    ['L', 'L', 'L', 'L', 'L', 'L'], // 0
    ['L', 'L', 'G', 'L', 'G', 'G'], // 1
    ['L', 'L', 'G', 'G', 'L', 'G'], // 2
    ['L', 'L', 'G', 'G', 'G', 'L'], // 3
    ['L', 'G', 'L', 'L', 'G', 'G'], // 4
    ['L', 'G', 'G', 'L', 'L', 'G'], // 5
    ['L', 'G', 'G', 'G', 'L', 'L'], // 6
    ['L', 'G', 'L', 'G', 'L', 'G'], // 7
    ['L', 'G', 'L', 'G', 'G', 'L'], // 8
    ['L', 'G', 'G', 'L', 'G', 'L']  // 9
  ];

  const leftParity = PARITY_PATTERNS[firstDigit];

  let modules = '';

  // 1. Guard iniziale (sinistro): 101
  modules += '101';

  // 2. Cifre da 2 a 7 (parte sinistra)
  for (let i = 1; i <= 6; i++) {
    const digit = digits[i];
    const type = leftParity[i - 1];
    modules += (type === 'L' ? L_CODE[digit] : G_CODE[digit]);
  }

  // 3. Guard centrale: 01010
  modules += '01010';

  // 4. Cifre da 8 a 13 (parte destra)
  for (let i = 7; i <= 12; i++) {
    const digit = digits[i];
    modules += R_CODE[digit];
  }

  // 5. Guard finale (destro): 101
  modules += '101';

  return modules;
}

/**
 * Genera il file SVG per il codice a barre con altezze uniformi e testo centrato.
 * @param {string} code13 
 * @param {string} modules 
 * @returns {string} Contenuto SVG
 */
function generateSVG(code13, modules) {
  const moduleWidth = 3;
  const quietZoneLeft = 20;
  const barHeight = 110;
  const totalBarWidth = 95 * moduleWidth;
  const svgWidth = totalBarWidth + (quietZoneLeft * 2);
  const svgHeight = 150;
  const yStart = 10;

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">\n`;
  
  // Sfondo bianco
  svgContent += `  <rect width="${svgWidth}" height="${svgHeight}" fill="${COLOR_WHITE}" />\n`;

  // Disegno delle barre (tutte ad altezza uniforme)
  for (let i = 0; i < 95; i++) {
    if (modules[i] === '1') {
      const x = quietZoneLeft + (i * moduleWidth);
      svgContent += `  <rect x="${x}" y="${yStart}" width="${moduleWidth}" height="${barHeight}" fill="${COLOR_DARK}" />\n`;
    }
  }

  // Disegno dei numeri in basso centrati
  const textY = yStart + barHeight + 20;
  const formattedCode = `${code13.slice(0, 1)}  ${code13.slice(1, 7)}  ${code13.slice(7)}`; // Spaziatura standard per leggibilità

  svgContent += `  <text x="${svgWidth / 2}" y="${textY}" font-family="monospace, Courier New, Courier, sans-serif" font-size="16" font-weight="bold" fill="${COLOR_DARK}" text-anchor="middle" letter-spacing="1">${formattedCode}</text>\n`;

  svgContent += '</svg>\n';
  return svgContent;
}

/**
 * Genera il file PNG usando Jimp con altezze uniformi e testo centrato.
 * @param {string} code13 
 * @param {string} modules 
 * @param {string} outputPath 
 */
async function generatePNG(code13, modules, outputPath) {
  const moduleWidth = 3;
  const quietZoneLeft = 20;
  const barHeight = 110;
  const totalBarWidth = 95 * moduleWidth;
  const pngWidth = totalBarWidth + (quietZoneLeft * 2);
  const pngHeight = 150;
  const yStart = 10;

  // Crea una nuova immagine bianca
  const image = new Jimp({ width: pngWidth, height: pngHeight, color: JIMP_COLOR_WHITE });

  // Funzione helper per colorare un rettangolo
  const drawRect = (startX, startY, width, height, color) => {
    for (let x = startX; x < startX + width; x++) {
      for (let y = startY; y < startY + height; y++) {
        if (x >= 0 && x < pngWidth && y >= 0 && y < pngHeight) {
          image.setPixelColor(color, x, y);
        }
      }
    }
  };

  // Disegna le barre
  for (let i = 0; i < 95; i++) {
    if (modules[i] === '1') {
      const x = quietZoneLeft + (i * moduleWidth);
      drawRect(x, yStart, moduleWidth, barHeight, JIMP_COLOR_DARK);
    }
  }

  // Carica il font per scrivere i numeri
  const fontPath = path.join(process.cwd(), 'node_modules', '@jimp', 'plugin-print', 'dist', 'fonts', 'open-sans', 'open-sans-14-black', 'open-sans-14-black.fnt');
  
  try {
    const font = await loadFont(fontPath);
    const textY = yStart + barHeight + 5; // offset per posizionamento del font open-sans
    const formattedCode = `${code13.slice(0, 1)}  ${code13.slice(1, 7)}  ${code13.slice(7)}`;

    // Calcolo automatico della larghezza del testo per centrarlo
    const textWidth = measureText(font, formattedCode);
    const textX = Math.round((pngWidth - textWidth) / 2);

    image.print({ font, x: textX, y: textY, text: formattedCode });
  } catch (fontError) {
    console.warn('⚠️ Impossibile caricare il font per la versione PNG, i numeri in basso non saranno inclusi nel PNG:', fontError.message);
  }

  await image.write(outputPath);
}

/**
 * Funzione principale
 */
async function main() {
  // Parsing argomenti CLI
  const args = process.argv.slice(2);
  let rawCode = args[0] || DEFAULT_CODE;
  let filename = args[1] || DEFAULT_FILENAME;

  // Pulisci il codice da eventuali caratteri non numerici
  rawCode = rawCode.replace(/\D/g, '');

  let code13 = '';
  if (rawCode.length === 12) {
    const checkDigit = calculateEan13CheckDigit(rawCode);
    code13 = rawCode + checkDigit;
    console.log(`ℹ️ Codice a 12 cifre fornito: ${rawCode}`);
    console.log(`✅ Calcolato Check Digit: ${checkDigit} -> Codice EAN-13 finale: ${code13}`);
  } else if (rawCode.length === 13) {
    code13 = rawCode;
    console.log(`ℹ️ Codice a 13 cifre fornito: ${code13}`);
    // Valida il codice
    const base12 = code13.slice(0, 12);
    const expectedCheck = calculateEan13CheckDigit(base12);
    if (Number(code13[12]) !== expectedCheck) {
      console.warn(`⚠️ ATTENZIONE: La tredicesima cifra (${code13[12]}) non corrisponde al check digit calcolato (${expectedCheck}). Si consiglia di utilizzare: ${base12}${expectedCheck}`);
    }
  } else {
    console.error('❌ ERRORE: Il codice deve essere composto da 12 o 13 cifre.');
    process.exit(1);
  }

  try {
    // Crea la cartella di output se non esiste
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Codifica
    const modules = encodeEan13(code13);

    // Genera e scrivi SVG
    const svgContent = generateSVG(code13, modules);
    const svgPath = path.join(OUTPUT_DIR, `${filename}.svg`);
    await fs.writeFile(svgPath, svgContent, 'utf8');
    console.log(`🚀 File SVG salvato con successo in: ${svgPath}`);

    // Genera e scrivi PNG
    const pngPath = path.join(OUTPUT_DIR, `${filename}.png`);
    await generatePNG(code13, modules, pngPath);
    console.log(`🚀 File PNG salvato con successo in: ${pngPath}`);

    console.log(`\n🎉 Generazione completata con successo.`);
    console.log(`   Codice EAN-13: ${code13}`);
  } catch (error) {
    console.error('❌ Errore durante la generazione del codice a barre:', error);
    process.exit(1);
  }
}

main();
