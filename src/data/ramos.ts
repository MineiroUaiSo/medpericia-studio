import type { Esfera } from '../utils/laudoBuilder';

export type RamoId = 'securitario' | 'civel_dano' | 'trabalhista' | 'previdenciario' | 'erro_medico';

export type TipoCampo = 'data' | 'texto' | 'select';

export interface CampoRamo {
  key: string;
  label: string;
  tipo: TipoCampo;
  opcoes?: readonly string[];
  ajuda?: string;
  /** Origem da informação: aula IFH, INFERÊNCIA ou LACUNA. */
  fonte?: string;
}

export interface ChecklistItem {
  key: string;
  label: string;
  peso: number;
}

export type Valoracao = 'susep' | 'incapacidade' | 'dano_corporal' | 'conduta';

export interface RamoConfig {
  id: RamoId;
  label: string;
  esferaSugerida: Esfera;
  adverso: string;
  campos: readonly CampoRamo[];
  checklist: readonly ChecklistItem[];
  valoracao: readonly Valoracao[];
  usaSusep: 'principal' | 'opcional' | 'nao';
  contextoIA: string;
}

export const MARCADOR_VAZIO = '[NÃO INFORMADO — deduzir dos documentos]';

const CHECK_BASE: readonly ChecklistItem[] = [
  { key: 'prontuarioUrgencia', label: 'Prontuário de PS imediato', peso: 15 },
  { key: 'laudoImagem', label: 'Laudo de imagem (RX/TC/RNM)', peso: 15 },
  { key: 'relatorioCirurgico', label: 'Ficha / relatório cirúrgico', peso: 10 },
  { key: 'boletimOcorrencia', label: 'Boletim de Ocorrência (BO)', peso: 10 },
];

export const RAMOS: Record<RamoId, RamoConfig> = {
  securitario: {
    id: 'securitario',
    label: 'Securitário (DPVAT / seguro de pessoas)',
    esferaSugerida: 'civel',
    adverso: 'seguradora',
    campos: [
      { key: 'dataSinistro', label: 'Data do sinistro (acidente)', tipo: 'data' },
      {
        key: 'tipoSeguro',
        label: 'Tipo de seguro',
        tipo: 'select',
        opcoes: ['DPVAT', 'Seguro privado (AP/vida)', 'Outro'],
        fonte: 'LACUNA',
      },
      {
        key: 'dataConsolidacao',
        label: 'Data da consolidação / alta (se houver)',
        tipo: 'data',
        ajuda: 'Período de danos temporários vai do evento à consolidação',
        fonte: "IFH 8741227 (areas-de-atuacao.md, 'data da consolidação médico-legal')",
      },
    ],
    checklist: CHECK_BASE,
    valoracao: ['susep', 'dano_corporal'],
    usaSusep: 'principal',
    contextoIA:
      'RAMO: securitário. Marco temporal: data do sinistro. Valoração: enquadramento na tabela SUSEP do segmento afetado, com grau de perda. Parte adversa: seguradora.',
  },
  civel_dano: {
    id: 'civel_dano',
    label: 'Cível — dano corporal (responsabilidade civil)',
    esferaSugerida: 'civel',
    adverso: 'réu',
    campos: [
      { key: 'dataEvento', label: 'Data do evento', tipo: 'data' },
      { key: 'dataConsolidacao', label: 'Data da consolidação médico-legal', tipo: 'data', fonte: 'IFH 8741227' },
    ],
    checklist: CHECK_BASE,
    valoracao: ['dano_corporal', 'susep'],
    usaSusep: 'opcional',
    contextoIA:
      'RAMO: cível/dano corporal. Marcos: data do evento e data da consolidação. Valorar danos temporários (déficit, repercussão profissional, quantum doloris) e permanentes (déficit funcional, dano estético) [IFH ebook TEPEM v2 p.98; método AIPE]. Tabela SUSEP só se o juízo pedir; nunca para incapacidade laboral.',
  },
  trabalhista: {
    id: 'trabalhista',
    label: 'Trabalhista / ocupacional',
    esferaSugerida: 'trabalhista',
    adverso: 'reclamada (empregador)',
    campos: [
      {
        key: 'tipoEvento',
        label: 'Tipo de evento',
        tipo: 'select',
        opcoes: ['Acidente típico', 'Acidente de trajeto', 'Doença profissional', 'Doença do trabalho'],
        fonte: 'IFH aula 8662079 #17151; ebook TEPEM v2 p.57 #9573',
      },
      {
        key: 'dataEvento',
        label: 'Data do acidente / do diagnóstico da doença',
        tipo: 'data',
        ajuda: 'Acidente: data do evento. Doença: data do diagnóstico ou do início dos sintomas (DID)',
      },
      {
        key: 'cat',
        label: 'CAT emitida?',
        tipo: 'select',
        opcoes: ['Sim', 'Não', 'Não sabe'],
        ajuda: 'CAT pode ser emitida também pelo próprio trabalhador, sindicato ou serviço de saúde',
        fonte: 'IFH aula 8662079 #17156',
      },
      { key: 'funcao', label: 'Função / posto de trabalho', tipo: 'texto' },
      {
        key: 'beneficioINSS',
        label: 'Recebeu benefício do INSS? (espécie)',
        tipo: 'select',
        opcoes: ['Não', 'B31', 'B91', 'Outro'],
        fonte: 'IFH aula 8662124 #7850',
      },
    ],
    checklist: [
      { key: 'cat', label: 'CAT', peso: 15 },
      { key: 'carteiraTrabalho', label: 'CTPS / descrição da função', peso: 10 },
      { key: 'aso', label: 'ASOs (admissional/periódicos)', peso: 10 },
      { key: 'prontuarioUrgencia', label: 'Prontuário / atendimento contemporâneo', peso: 15 },
      { key: 'laudoImagem', label: 'Laudo de imagem (RX/TC/RNM)', peso: 10 },
      { key: 'laudoINSS', label: 'Laudo/benefício INSS (SABI)', peso: 5 },
    ],
    valoracao: ['dano_corporal', 'incapacidade'],
    usaSusep: 'opcional',
    contextoIA:
      'RAMO: trabalhista. Classificar o evento (típico, trajeto, doença profissional ou do trabalho). Nexo: Simonin para trauma; para doença considerar concausa/Schilling. Valorar dano e incapacidade separadamente; a tabela SUSEP pode valorar dano mas NÃO incapacidade laboral [IFH aula 8662126 #8085]. Nexo profissional/epidemiológico é só elemento auxiliar, não isolado [IFH ebook TEPEM v2 p.16 #9448]. Parte adversa: reclamada.',
  },
  previdenciario: {
    id: 'previdenciario',
    label: 'Previdenciário (INSS)',
    esferaSugerida: 'federal',
    adverso: 'INSS',
    campos: [
      {
        key: 'especie',
        label: 'Espécie do benefício',
        tipo: 'select',
        opcoes: [
          'B31 — aux. incapacidade temporária previdenciário',
          'B91 — aux. incapacidade temporária acidentário',
          'B32 — aposent. incapacidade permanente previdenciária',
          'B92 — aposent. incapacidade permanente acidentária',
          'B36 — auxílio-acidente previdenciário',
          'B94 — auxílio-acidente acidentário',
          'BPC/LOAS (87)',
          'Outro',
        ],
        fonte: 'IFH aula 8662078 #17148; ebook TEPEM v2 p.11 #9434; IN 128/2022 #10747',
      },
      {
        key: 'natureza',
        label: 'Natureza',
        tipo: 'select',
        opcoes: ['Previdenciária (sem nexo com trabalho)', 'Acidentária (com nexo com trabalho)'],
        fonte: 'IFH aula 8662078 #17148',
      },
      { key: 'did', label: 'DID — data do início da doença', tipo: 'data' },
      {
        key: 'dii',
        label: 'DII — data do início da incapacidade',
        tipo: 'data',
        ajuda: 'Fixar preferencialmente por documento, não só pelo relato',
        fonte: 'IFH ebook TEPEM v2 p.24 #9474',
      },
      { key: 'der', label: 'DER — data de entrada do requerimento', tipo: 'data', fonte: 'IN 128/2022 #10461' },
      {
        key: 'dcb',
        label: 'DCB — data de cessação do benefício (se houve)',
        tipo: 'data',
        fonte: 'IN 128/2022 #10480',
      },
    ],
    checklist: [
      { key: 'laudoINSS', label: 'Laudos SABI / comunicações do INSS', peso: 15 },
      { key: 'atestadosAfastamento', label: 'Atestados com afastamento', peso: 15 },
      { key: 'prontuarioContemporaneo', label: 'Prontuário contemporâneo à DII', peso: 15 },
      { key: 'laudoImagem', label: 'Exames complementares', peso: 10 },
      { key: 'carteiraTrabalho', label: 'CTPS / descrição da atividade habitual', peso: 10 },
    ],
    valoracao: ['incapacidade'],
    usaSusep: 'nao',
    contextoIA:
      "RAMO: previdenciário (INSS). Objeto: incapacidade laborativa, não indenização. Responder: existe doença (DID)? existe incapacidade (DII, fixada por documento)? temporária ou permanente — preferir 'indefinida' quando cabível [IFH aula 8662081 #17177]; parcial/total; uni/multi/omniprofissional; reabilitação só se houver incapacidade [IFH aula 8662123 #7794]. Espécie e natureza (previdenciária × acidentária) informadas acima. Não usar tabela SUSEP. Qualidade de segurado e carência não são matéria do perito [IFH aula 8662081 #17193]. Parte adversa: INSS.",
  },
  erro_medico: {
    id: 'erro_medico',
    label: 'Erro médico / responsabilidade profissional',
    esferaSugerida: 'civel',
    adverso: 'réu (médico/hospital)',
    campos: [
      { key: 'dataAto', label: 'Data do ato / procedimento', tipo: 'data' },
      { key: 'procedimento', label: 'Procedimento / especialidade', tipo: 'texto' },
      {
        key: 'dataDano',
        label: 'Data em que o dano/complicação foi constatado',
        tipo: 'data',
        fonte: 'INFERÊNCIA',
      },
      {
        key: 'tcle',
        label: 'TCLE nos autos?',
        tipo: 'select',
        opcoes: ['Sim', 'Não', 'Não sabe'],
        fonte: 'ifhflixKnowledge.ts quesito de consentimento',
      },
    ],
    checklist: [
      { key: 'prontuarioCompleto', label: 'Prontuário completo do atendimento', peso: 20 },
      { key: 'descricaoCirurgica', label: 'Descrição cirúrgica / anestésica', peso: 15 },
      { key: 'tcle', label: 'TCLE', peso: 10 },
      { key: 'laudoImagem', label: 'Exames pré e pós', peso: 10 },
    ],
    valoracao: ['conduta', 'dano_corporal'],
    usaSusep: 'nao',
    contextoIA:
      'RAMO: erro médico. Analisar conduta frente às boas práticas vigentes à época do ato, nexo conduta–dano, risco inerente/previsível × falha, consentimento informado. Não imputar culpa: isso é matéria jurídica [IFH aula 8662132 #8688]. Parte adversa: médico/hospital.',
  },
};

export const RAMO_IDS: readonly RamoId[] = ['securitario', 'civel_dano', 'trabalhista', 'previdenciario', 'erro_medico'];

export function getRamo(id: string): RamoConfig {
  return RAMOS[id as RamoId] ?? RAMOS.securitario;
}

export function buildRamoPromptBlock(id: RamoId, valores: Record<string, string>): string {
  const ramo = getRamo(id);
  const linhas = ramo.campos.map((c) => {
    const v = (valores[c.key] ?? '').trim();
    return `- ${c.label}: ${v === '' ? MARCADOR_VAZIO : v}`;
  });
  return `CONTEXTO DO RAMO\n${ramo.contextoIA}\nMARCOS / IDENTIFICAÇÃO INFORMADOS:\n${linhas.join('\n')}`;
}
