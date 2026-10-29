import { ESFERAS, type LaudoData } from './laudoBuilder';
import { MARCADOR_VAZIO, buildRamoPromptBlock, getRamo, type RamoId } from '../data/ramos';

export const INSTRUCAO_DEDUCAO = `REGRA DE CAMPOS EM BRANCO (OBRIGATÓRIA):
- Campo marcado ${MARCADOR_VAZIO} significa que o usuário não sabe o valor.
- Deduza o valor SOMENTE se ele constar nos documentos anexados ou no relato; cite o trecho de origem entre aspas.
- Valor deduzido: escreva "[INFERIDO – confirmar]" + valor + trecho de origem.
- Sem base documental: escreva "[NÃO INFORMADO]".
- Ao final, seção "DADOS FALTANTES E IMPACTO": liste cada campo [NÃO INFORMADO] e o que deixa de poder ser avaliado.
- Nunca invente data, CID, valor, percentual ou norma.`;

export interface ViabilidadeInput {
  ramoId: RamoId;
  profissao: string;
  relato: string;
  marcos: Record<string, string>;
  checklist: Record<string, boolean>;
  docsSummary: string;
}

const orVazio = (v: string): string => (v.trim() === '' ? MARCADOR_VAZIO : v);

export function buildViabilidadePrompt(i: ViabilidadeInput): string {
  const ramo = getRamo(i.ramoId);
  const checklistSummary = ramo.checklist
    .map((c) => `- ${c.label}: ${i.checklist[c.key] ? 'DISPONÍVEL' : 'AUSENTE'}`)
    .join('\n');
  const docs = i.docsSummary.trim() === '' ? 'Nenhum documento anexado.' : i.docsSummary;

  return `REALIZAR ANÁLISE PRÉVIA DE VIABILIDADE MÉDICO-LEGAL:
Ramo: ${ramo.label}
Profissão do Periciando: ${orVazio(i.profissao)}

${buildRamoPromptBlock(i.ramoId, i.marcos)}

RELATO DOS FATOS:
${orVazio(i.relato)}

DOCUMENTOS ACOSTADOS E EXAMES ENVIADOS:
${docs}

CHECKLIST DE DOCUMENTAÇÃO:
${checklistSummary}

${INSTRUCAO_DEDUCAO}

Com base nestes elementos e nas diretrizes do Instituto Felipe Hurtado (IFHFLIX), emita a Nota Técnica de Viabilidade completa para o advogado, apontando diagnóstico, plausibilidade do nexo (Simonin), riscos da defesa adversa, enquadramento de dano e veredito final com score de viabilidade (0 a 100%).`;
}

export interface LaudoDiscussaoInput {
  data: LaudoData;
  notas: string;
}

export function buildLaudoDiscussaoPrompt({ data: d, notas }: LaudoDiscussaoInput): string {
  const e = ESFERAS[d.esfera];
  return `Redija APENAS "4. DISCUSSÃO" (4.1 introdução, 4.2 metodologia, 4.3 análise, 4.4 literatura) e "5. CONCLUSÃO" do laudo, usando SOMENTE os dados abaixo. Não invente achados.

Esfera: ${e.label}

${buildRamoPromptBlock(d.ramo, d.marcos)}

Quesitos do juízo:
${orVazio(d.quesitosJuizo)}
Quesitos ${e.autor}:
${orVazio(d.quesitosAutor)}
Quesitos ${e.reu}:
${orVazio(d.quesitosReu)}

${INSTRUCAO_DEDUCAO}

DADOS DO CASO:
${notas}`;
}
