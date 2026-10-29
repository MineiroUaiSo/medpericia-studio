import { getRamo, type RamoId, type Valoracao } from '../data/ramos';

export type Esfera = 'civel' | 'trabalhista' | 'federal';

export interface LaudoData {
  esfera: Esfera;
  ramo: RamoId;
  marcos: Record<string, string>;
  vara: string;
  comarca: string;
  processo: string;
  autor: string;
  reu: string;
  perito: string;
  crm: string;
  rqe: string;
  formacao: string;
  dataPericia: string;
  horaPericia: string;
  localPericia: string;
  atParte: string;
  atNome: string;
  periciando: string;
  rg: string;
  cpf: string;
  nascimento: string;
  profissao: string;
  quesitosJuizo: string;
  quesitosAutor: string;
  quesitosReu: string;
  laudas: string;
  cidadeUF: string;
  dataLaudo: string;
}

export const EMPTY_LAUDO: LaudoData = {
  esfera: 'civel', ramo: 'civel_dano', marcos: {}, vara: '', comarca: '', processo: '', autor: '', reu: '',
  perito: '', crm: '', rqe: '', formacao: '', dataPericia: '', horaPericia: '',
  localPericia: '', atParte: '', atNome: '', periciando: '', rg: '', cpf: '',
  nascimento: '', profissao: '', quesitosJuizo: '', quesitosAutor: '',
  quesitosReu: '', laudas: '', cidadeUF: '', dataLaudo: '',
};

export const ESFERAS: Record<Esfera, { label: string; juiz: string; autor: string; reu: string }> = {
  civel: { label: 'Cível', juiz: 'JUIZ(A) DE DIREITO DA {v} VARA CÍVEL', autor: 'Autor', reu: 'Réu' },
  trabalhista: { label: 'Trabalhista', juiz: 'JUIZ(A) DO TRABALHO DA {v} VARA DO TRABALHO', autor: 'Reclamante', reu: 'Reclamada' },
  federal: { label: 'Previdenciário/Federal', juiz: 'JUIZ(A) FEDERAL DA {v} VARA FEDERAL', autor: 'Autor', reu: 'Réu' },
};

const ANALISE_43: Record<Valoracao, string> = {
  susep: 'nexo causal — Simonin; valoração do dano (tabela indicada pelo juízo/SUSEP)',
  dano_corporal: 'nexo causal — Simonin; valoração do dano (tabela indicada pelo juízo/SUSEP)',
  incapacidade: 'nexo (se acidentário); existência, DID, DII, tipo e grau de incapacidade; reabilitação',
  conduta: 'conduta × boas práticas à época; nexo conduta–dano; dano',
};

const f = (v: string, ph: string) => (v.trim() ? v.trim() : `[${ph}]`);

function numerar(prefixo: string, texto: string): string {
  const linhas = texto.split('\n').map((l) => l.trim()).filter(Boolean);
  if (!linhas.length) return '';
  return linhas.map((l, i) => `${prefixo}.${i + 1} ${l.replace(/^\d+[\).\-\s]+/, '')}`).join('\n');
}

/** Monta o esqueleto do laudo; seções 4–9 ficam como guias a preencher. */
export function buildLaudoSkeleton(d: LaudoData): string {
  const e = ESFERAS[d.esfera];
  const ramo = getRamo(d.ramo);
  const objeto = ramo.campos.map((c) => `${c.label}: ${f(d.marcos[c.key] ?? '', 'NÃO INFORMADO')}`).join('\n');
  const rqe = d.rqe.trim() ? `, RQE ${d.rqe.trim()}` : '';
  const at = d.atNome.trim()
    ? `com a presença do assistente técnico da parte ${f(d.atParte, e.autor.toLowerCase())}, Dr(a). ${d.atNome.trim()}`
    : 'sem a presença de assistentes técnicos';

  const jui = numerar('1.1', d.quesitosJuizo);
  const aut = numerar('1.2', d.quesitosAutor);
  const reu = numerar('1.3', d.quesitosReu);
  const quesitos = [
    jui && `Quesitos do Juízo\n${jui}`,
    aut && `Quesitos do ${e.autor}\n${aut}`,
    reu && `Quesitos do ${e.reu}\n${reu}`,
  ].filter(Boolean).join('\n\n') || '[Transcrever integralmente os quesitos, apenas expostos. Ordem: Juízo → Autor → Réu → demais]';

  return `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) ${e.juiz.replace('{v}', f(d.vara, 'XX') + 'ª')} DA COMARCA DE ${f(d.comarca, 'CIDADE/UF')}

Processo Nº ${f(d.processo, 'número')}
${e.autor}: ${f(d.autor, 'nome')} versus ${e.reu}: ${f(d.reu, 'nome')}

LAUDO MÉDICO-LEGAL

${f(d.perito, 'NOME')}, CRM-${f(d.crm, 'UF número')}${rqe}, ${f(d.formacao, 'FORMAÇÃO')}, perito judicial nomeado por este juízo, em perícia médica realizada ao dia ${f(d.dataPericia, 'XX/XX/20XX')}, às ${f(d.horaPericia, 'XXhXX')}, à ${f(d.localPericia, 'endereço completo')}, ${at}, venho mui respeitosamente apresentar a esta egrégia vara o meu laudo pericial.

QUALIFICAÇÃO DO PERICIANDO
Nome: ${f(d.periciando, 'NOME COMPLETO')}
RG: ${f(d.rg, 'número')}
CPF: ${f(d.cpf, 'número')}
Data de nascimento: ${f(d.nascimento, 'XX/XX/XXXX')}
Profissão: ${f(d.profissao, 'profissão')}
Estado civil / Naturalidade / Sexo / Escolaridade / Endereço: [preencher]

DADOS DO OBJETO PERICIAL (${ramo.label})
${objeto}

1. QUESITOS
${quesitos}

2. HISTÓRICO
2.1 Petição inicial: [resumo fiel, ordem cronológica]
2.2 Contestação: [resumo fiel]
2.3 Relato do periciando: [preservar autoria — "relatou que informou"]
2.4 Documentos: [numerados, em ordem cronológica; transcrever trechos entre aspas]

3. DESCRIÇÃO (Visum et Reperto)
3.1 Exame físico geral: [somente o de interesse ao objeto]
3.2 Exame físico específico: [goniometria em graus, testes especiais]
3.3 Registros fotográficos (opcional)
3.4 Vistoria ambiental (trabalhista/acidentário, se aplicável)

4. DISCUSSÃO
4.1 Introdução / objeto da perícia
4.2 Metodologia (parágrafo obrigatório)
4.3 Análise (${ANALISE_43[ramo.valoracao[0]]})
4.4 Literatura médica

5. CONCLUSÃO
[Tópicos objetivos, limitados ao objeto; tudo o que está aqui já foi discutido em 4]

6. RESPOSTA AOS QUESITOS
[Copiar cada quesito + resposta objetiva em negrito. Ordem: Juízo → Autor → Réu]

7. REFERÊNCIAS BIBLIOGRÁFICAS
[formato científico]

O conteúdo deste laudo reflete o entendimento deste perito sobre o objeto da presente perícia, estando as conclusões baseadas nos dados coletados durante o relato, no exame físico pericial, na interpretação dos documentos médicos acostados aos autos, na literatura médica e na legislação vigente. Caso sejam apresentados novos elementos, as conclusões do presente laudo poderão ser revistas, ao elevado critério deste juízo. Sendo o que havia a ser relatado, exposto e discutido, este perito coloca-se à disposição para quaisquer esclarecimentos adicionais, encerrando o presente laudo digitado em ${f(d.laudas, 'XX')} laudas, e que vai assinado digitalmente por este perito.

${f(d.cidadeUF, 'CIDADE, UF')}, ${f(d.dataLaudo, 'XX de mês de XXXX')}

${f(d.perito, 'NOME')}
MÉDICO(A) PERITO(A) JUDICIAL
CRM-${f(d.crm, 'UF número')}`;
}
