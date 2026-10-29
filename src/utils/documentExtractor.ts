export type ExtractionStatus =
  | 'extracting'
  | 'extracted'
  | 'needs_transcription'
  | 'unsupported'
  | 'error';

export interface ExtractedDocument {
  id: string;
  name: string;
  size: string;
  mime: string;
  status: ExtractionStatus;
  markdown: string;
  pageCount?: number;
  charCount: number;
  warning?: string;
}

const MAX_CHARS_PER_FILE = 12_000;
const MIN_CHARS_PER_PDF_PAGE = 40;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function truncateMarkdown(text: string, max = MAX_CHARS_PER_FILE): string {
  const trimmed = text.replace(/\u0000/g, '').trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}\n\n…[texto truncado para economizar tokens — ${trimmed.length} caracteres originais]`;
}

function fileKind(file: File): 'pdf' | 'docx' | 'text' | 'image' | 'other' {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
  if (type.includes('wordprocessingml') || name.endsWith('.docx')) return 'docx';
  if (
    type.startsWith('text/') ||
    name.endsWith('.txt') ||
    name.endsWith('.md') ||
    name.endsWith('.csv')
  ) {
    return 'text';
  }
  if (type.startsWith('image/') || /\.(png|jpe?g|webp|gif|tif{1,2})$/.test(name)) {
    return 'image';
  }
  return 'other';
}

async function extractPdf(file: File): Promise<Pick<ExtractedDocument, 'markdown' | 'pageCount' | 'status' | 'warning'>> {
  const [{ GlobalWorkerOptions, getDocument }, workerUrl] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);
  GlobalWorkerOptions.workerSrc = workerUrl.default;

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocument({ data }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (line) pages.push(`## Página ${i}\n\n${line}`);
  }

  const markdown = pages.join('\n\n');
  const charsPerPage = pdf.numPages > 0 ? markdown.length / pdf.numPages : 0;

  if (!markdown || charsPerPage < MIN_CHARS_PER_PDF_PAGE) {
    return {
      markdown: markdown || '',
      pageCount: pdf.numPages,
      status: 'needs_transcription',
      warning:
        'PDF digitalizado ou com pouco texto selecionável. Extração automática falhou. Transcreva o conteúdo (ou use OCR) antes de analisar.',
    };
  }

  return {
    markdown: truncateMarkdown(markdown),
    pageCount: pdf.numPages,
    status: 'extracted',
  };
}

async function extractDocx(file: File): Promise<Pick<ExtractedDocument, 'markdown' | 'status' | 'warning'>> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const markdown = truncateMarkdown(result.value || '');
  if (!markdown) {
    return {
      markdown: '',
      status: 'needs_transcription',
      warning: 'DOCX sem texto extraível (provavelmente só imagens). Transcreva o conteúdo.',
    };
  }
  return { markdown, status: 'extracted' };
}

export async function extractDocument(file: File): Promise<ExtractedDocument> {
  const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const base: ExtractedDocument = {
    id,
    name: file.name,
    size: formatSize(file.size),
    mime: file.type || 'application/octet-stream',
    status: 'extracting',
    markdown: '',
    charCount: 0,
  };

  try {
    const kind = fileKind(file);

    if (kind === 'image' || kind === 'other') {
      return {
        ...base,
        status: kind === 'image' ? 'needs_transcription' : 'unsupported',
        warning:
          kind === 'image'
            ? 'Imagem (scan/foto/manuscrito). Sem OCR neste módulo. Transcreva o texto e cole no relato ou envie um PDF/DOCX com texto.'
            : `Formato não suportado (${file.name}). Envie PDF, DOCX, TXT ou MD.`,
      };
    }

    if (kind === 'text') {
      const text = truncateMarkdown(await file.text());
      if (!text) {
        return { ...base, status: 'needs_transcription', warning: 'Arquivo de texto vazio.' };
      }
      return { ...base, status: 'extracted', markdown: text, charCount: text.length };
    }

    const extracted = kind === 'pdf' ? await extractPdf(file) : await extractDocx(file);
    return {
      ...base,
      ...extracted,
      charCount: extracted.markdown.length,
    };
  } catch (err) {
    return {
      ...base,
      status: 'error',
      warning: `Falha ao ler ${file.name}: ${err instanceof Error ? err.message : 'erro desconhecido'}`,
    };
  }
}

export function buildDocumentsPrompt(docs: ExtractedDocument[]): string {
  if (docs.length === 0) {
    return 'Nenhum documento anexado.';
  }

  const extracted = docs.filter((d) => d.status === 'extracted' && d.markdown);
  const blocked = docs.filter((d) => d.status !== 'extracted');

  const extractedBlock = extracted
    .map(
      (d) =>
        `### ${d.name} (${d.size}${d.pageCount ? `, ${d.pageCount} pág.` : ''})\n\n${d.markdown}`,
    )
    .join('\n\n---\n\n');

  const blockedBlock = blocked
    .map((d) => `- ${d.name} [${d.status}]: ${d.warning || 'não extraído'}`)
    .join('\n');

  return [
    extracted.length
      ? `DOCUMENTOS EXTRAÍDOS PARA MARKDOWN (texto selecionável):\n\n${extractedBlock}`
      : 'Nenhum documento com texto extraível.',
    blocked.length
      ? `\n\nDOCUMENTOS NÃO EXTRAÍDOS (exigem transcrição manual / OCR):\n${blockedBlock}`
      : '',
  ].join('');
}
