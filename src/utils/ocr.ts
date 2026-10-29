import type { PDFDocumentProxy } from 'pdfjs-dist';

/** OCR local (Tesseract.js, idioma português): custo zero de tokens e o documento não sai do navegador. */
export const MAX_OCR_PAGES = 25;
const RENDER_SCALE = 2;
export const MIN_OCR_CONFIDENCE = 55;

export type OcrProgress = (msg: string) => void;

export interface OcrResult {
  text: string;
  confidence: number;
  pagesDone: number;
  pagesTotal: number;
}

async function newWorker(onProgress?: OcrProgress) {
  const { createWorker } = await import('tesseract.js');
  onProgress?.('OCR: carregando motor e idioma (1ª vez pode levar alguns segundos)…');
  return createWorker('por', 1);
}

export async function ocrPdf(pdf: PDFDocumentProxy, onProgress?: OcrProgress): Promise<OcrResult> {
  const worker = await newWorker(onProgress);
  const total = Math.min(pdf.numPages, MAX_OCR_PAGES);
  const pages: string[] = [];
  let confSum = 0;

  try {
    for (let i = 1; i <= total; i += 1) {
      onProgress?.(`OCR: página ${i} de ${total}${pdf.numPages > total ? ` (de ${pdf.numPages})` : ''}…`);
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: RENDER_SCALE });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await page.render({ canvas, viewport }).promise;
      const { data } = await worker.recognize(canvas);
      canvas.width = 0;
      canvas.height = 0;
      const text = data.text.replace(/\s+/g, ' ').trim();
      confSum += data.confidence;
      if (text) pages.push(`## Página ${i} (OCR)\n\n${text}`);
    }
  } finally {
    await worker.terminate();
  }

  return {
    text: pages.join('\n\n'),
    confidence: total ? confSum / total : 0,
    pagesDone: total,
    pagesTotal: pdf.numPages,
  };
}

export async function ocrImage(file: File, onProgress?: OcrProgress): Promise<OcrResult> {
  const worker = await newWorker(onProgress);
  try {
    onProgress?.('OCR: lendo imagem…');
    const { data } = await worker.recognize(file);
    const text = data.text.replace(/\s+/g, ' ').trim();
    return { text, confidence: data.confidence, pagesDone: 1, pagesTotal: 1 };
  } finally {
    await worker.terminate();
  }
}
