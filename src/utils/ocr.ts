import type { PDFDocumentProxy } from 'pdfjs-dist';

/** OCR local (Tesseract.js, idioma português): custo zero de tokens e o documento não sai do navegador. */
export const MAX_OCR_PAGES = 25;
const RENDER_SCALE = 2;
export const MIN_OCR_CONFIDENCE = 55;

export type OcrProgress = (msg: string, pct?: number) => void;

function fmtTempo(ms: number): string {
  const s = Math.max(1, Math.round(ms / 1000));
  if (s < 60) return `${s} s`;
  return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s`;
}

export interface OcrResult {
  text: string;
  confidence: number;
  pagesDone: number;
  pagesTotal: number;
}

async function newWorker(onProgress?: OcrProgress, onPageProgress?: (p: number) => void) {
  const { createWorker } = await import('tesseract.js');
  onProgress?.('OCR: carregando motor e idioma (1ª vez pode levar alguns segundos)…', 0);
  return createWorker('por', 1, {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text') onPageProgress?.(m.progress);
    },
  });
}

export async function ocrPdf(pdf: PDFDocumentProxy, onProgress?: OcrProgress): Promise<OcrResult> {
  const total = Math.min(pdf.numPages, MAX_OCR_PAGES);
  let current = 1;
  let pageFrac = 0;
  let started = 0;
  let pagesFinished = 0;

  const report = () => {
    const done = pagesFinished + pageFrac;
    const pct = Math.min(99, Math.round((done / total) * 100));
    let eta = ' · calculando tempo restante…';
    if (started && done >= 0.15) {
      const perPage = (Date.now() - started) / done;
      eta = ` · ~${fmtTempo(perPage * (total - done))} restantes`;
    }
    const de = pdf.numPages > total ? ` (limite ${total} de ${pdf.numPages})` : '';
    onProgress?.(`OCR ${pct}% — página ${current} de ${total}${de}${eta}`, pct);
  };

  const worker = await newWorker(onProgress, (p) => { pageFrac = p; report(); });
  const pages: string[] = [];
  let confSum = 0;
  started = Date.now();

  try {
    for (let i = 1; i <= total; i += 1) {
      current = i;
      pageFrac = 0;
      report();
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
      pagesFinished = i;
    }
  } finally {
    await worker.terminate();
  }

  onProgress?.('OCR 100% — concluído', 100);
  return {
    text: pages.join('\n\n'),
    confidence: total ? confSum / total : 0,
    pagesDone: total,
    pagesTotal: pdf.numPages,
  };
}

export async function ocrImage(file: File, onProgress?: OcrProgress): Promise<OcrResult> {
  const worker = await newWorker(onProgress, (p) => onProgress?.(`OCR ${Math.round(p * 100)}% — lendo imagem…`, Math.round(p * 100)));
  try {
    onProgress?.('OCR: lendo imagem…', 0);
    const { data } = await worker.recognize(file);
    const text = data.text.replace(/\s+/g, ' ').trim();
    return { text, confidence: data.confidence, pagesDone: 1, pagesTotal: 1 };
  } finally {
    await worker.terminate();
  }
}
