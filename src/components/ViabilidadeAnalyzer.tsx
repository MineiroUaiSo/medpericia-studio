import React, { useState } from 'react';
import {
  FileCheck,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Sparkles,
  Loader2,
  Trash2,
  Scale,
  ShieldCheck,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';
import { callAI, SYSTEM_PROMPTS } from '../services/aiService';

interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  contentSnippet: string;
}

export function ViabilidadeAnalyzer() {
  const [caseType, setCaseType] = useState<string>('securitario');
  const [profissao, setProfissao] = useState<string>('Mecânico de veículos automotores');
  const [dataSinistro, setDataSinistro] = useState<string>('10/01/2026');
  const [relatoFatos, setRelatoFatos] = useState<string>(
    'Periciando sofreu colisão automobilística em 10/01/2026, com choque direto do cotovelo direito no painel do carro. No PS, radiografia evidenciou fratura de olécrano. Foi submetido a cirurgia de fixação com placa e parafusos em 14/01/2026. Evoluiu com calo ósseo exuberante e rigidez articular, perdendo metade da amplitude de movimento de flexoextensão. Prontuários antigos do plano de saúde não registram queixas anteriores no membro.'
  );

  const [documentChecklist, setDocumentChecklist] = useState({
    prontuarioUrgencia: true,
    laudoImagem: true,
    relatorioCirurgico: true,
    boletimOcorrencia: true,
    laudoINSS: false,
    carteiraTrabalho: true,
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedDocument[]>([
    {
      id: 'doc-1',
      name: 'Laudo_Radiografia_Olecranon_10jan.pdf',
      size: '1.2 MB',
      type: 'Laudo de Imagem',
      contentSnippet: 'Fratura cominutiva do olécrano direito com desvio de 4mm dos fragmentos articulares. Ausência de artrose prévia.',
    },
    {
      id: 'doc-2',
      name: 'Boletim_Atendimento_PS_Trauma.pdf',
      size: '850 KB',
      type: 'Prontuário de PS',
      contentSnippet: 'Entrada às 18h40 vítima de acidente automobilístico (passageiro dianteiro). Dor intensa, edema e impotência funcional em cotovelo D.',
    },
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viabilityScore, setViabilityScore] = useState<number>(85);
  const [viabilityStatus, setViabilityStatus] = useState<'alta' | 'media' | 'baixa'>('alta');
  const [notaTecnicaResult, setNotaTecnicaResult] = useState<string>(`NOTA TÉCNICA DE VIABILIDADE MÉDICO-PERICIAL

1. OBJETO DA ANÁLISE: Avaliação de viabilidade de ação securitária/indenizatória decorrente de acidente de trânsito em 10/01/2026.
2. PERICIANDO: João da Silva, 45 anos, Mecânico de veículos.
3. ROBUSTEZ DOCUMENTAL: EXCELENTE. Há comprovação contemporânea imediata no Pronto-Socorro na mesma data do sinistro com laudo de imagem atestando fratura articular aguda de olécrano direito e relatório cirúrgico de osteossíntese.
4. NEXO CAUSAL (SIMONIN): PLENO. Compatibilidade biomecânica e ausência de histórico pregresso no cotovelo dominante.
5. VULNERABILIDADES / RISCOS QUE A PARTE ADVERSA APONTARÁ:
   - A seguradora poderá alegar que a rigidez decorre de falta de fisioterapia pós-operatória.
   - Tese de defesa: argumentar que a consolidação viciosa é complicação estatisticamente descrita e inerente ao trauma articular de alta energia.
6. ESTIMATIVA DO DANO (TABELA SUSEP): "Anquilose total de cotovelo" (teto 25%) em grau médio (50%) = 12,50% de invalidez permanente parcial incompleta.
7. REPERCUSSÃO LABORAL: Redução da capacidade para tarefas de mecânico que demandem flexão extrema e torque vigoroso.
8. VEREDITO DE VIABILIDADE: VIÁVEL (ALTA PROBABILIDADE DE ÊXITO TÉCNICO - 85%).
RECOMENDAÇÃO AO ADVOGADO: O caso está pronto para ajuizamento seguro. Juntar aos autos o exame de imagem inicial, a ficha de internação cirúrgica e solicitar ao médico assistente atestado atualizado com a medição dos arcos articulares.`);

  const [copied, setCopied] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newDocs: UploadedDocument[] = [];
    Array.from(files).forEach((file, index) => {
      newDocs.push({
        id: `upload-${Date.now()}-${index}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        type: file.type || 'Documento',
        contentSnippet: `Documento recebido: ${file.name} (${(file.size / 1024).toFixed(0)} KB). Pronto para processamento técnico.`,
      });
    });

    setUploadedFiles([...uploadedFiles, ...newDocs]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
  };

  const toggleChecklist = (key: keyof typeof documentChecklist) => {
    setDocumentChecklist({ ...documentChecklist, [key]: !documentChecklist[key] });
  };

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setNotaTecnicaResult('');

    const docsSummary = uploadedFiles.map((d) => `• ${d.name} (${d.type}): ${d.contentSnippet}`).join('\n');
    const checklistSummary = Object.entries(documentChecklist)
      .map(([k, v]) => `- ${k}: ${v ? 'DISPONÍVEL' : 'AUSENTE'}`)
      .join('\n');

    const prompt = `REALIZAR ANÁLISE PRÉVIA DE VIABILIDADE MÉDICO-LEGAL:
Ramo do Direito: ${caseType.toUpperCase()}
Profissão do Periciando: ${profissao}
Data do Evento/Sinistro: ${dataSinistro}

RELATO DOS FATOS:
${relatoFatos}

DOCUMENTOS ACOSTADOS E EXAMES ENVIADOS:
${docsSummary}

CHECKLIST DE DOCUMENTAÇÃO:
${checklistSummary}

Com base nestes elementos e nas diretrizes do Instituto Felipe Hurtado (IFHFLIX), emita a Nota Técnica de Viabilidade completa para o advogado, apontando diagnóstico, plausibilidade do nexo (Simonin), riscos da defesa adversa, enquadramento de dano e veredito final com score de viabilidade (0 a 100%).`;

    try {
      const response = await callAI(prompt, SYSTEM_PROMPTS.analiseViabilidade, true);
      setNotaTecnicaResult(response);

      // Calcula score estimado com base na presença documental
      let score = 50;
      if (documentChecklist.prontuarioUrgencia) score += 15;
      if (documentChecklist.laudoImagem) score += 15;
      if (documentChecklist.relatorioCirurgico) score += 10;
      if (documentChecklist.carteiraTrabalho) score += 10;
      setViabilityScore(Math.min(score, 95));
      setViabilityStatus(score >= 75 ? 'alta' : score >= 50 ? 'media' : 'baixa');
    } catch (err: any) {
      setNotaTecnicaResult(`Erro na análise automatizada: ${err.message}. Verifique a conexão com a IA.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(notaTecnicaResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <FileCheck className="w-3.5 h-3.5" />
              Módulo de Entrada IFHFLIX (Serviço de R$ 800 a R$ 1.500)
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Análise Prévia de Viabilidade Técnica &amp; Documental</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Envie informações, prontuários e laudos de exames para avaliar a viabilidade médico-legal antes do ajuizamento, prevenindo riscos de sucumbência e orientando a produção de provas.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 min-w-[220px] text-right">
            <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Termômetro do Caso</span>
            <div
              className={`text-3xl font-extrabold mt-1 ${
                viabilityStatus === 'alta'
                  ? 'text-emerald-400'
                  : viabilityStatus === 'media'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {viabilityScore}% Viabilidade
            </div>
            <span className="text-xs text-slate-400">
              {viabilityStatus === 'alta' ? 'Alta Probabilidade de Êxito' : 'Viável com Ressalvas'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column: Form & Document Upload */}
        <div className="lg:col-span-5 space-y-5">
          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Scale className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">
                1. Informações Básicas do Caso
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Ramo da Lide
                </label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100 font-sans"
                >
                  <option value="securitario">Securitário / DPVAT</option>
                  <option value="trabalhista">Trabalhista / Ocupacional</option>
                  <option value="erro_medico">Erro Médico / Civil</option>
                  <option value="previdenciario">Previdenciário (INSS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Data do Sinistro / Início
                </label>
                <input
                  type="text"
                  value={dataSinistro}
                  onChange={(e) => setDataSinistro(e.target.value)}
                  placeholder="dd/mm/aaaa"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Profissão / Atividade Habitual do Periciando
              </label>
              <input
                type="text"
                value={profissao}
                onChange={(e) => setProfissao(e.target.value)}
                placeholder="Ex.: Mecânico automotivo, Motorista, Pedreiro..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Relato dos Fatos &amp; Queixas Funcionais (Petição / Entrevista)
              </label>
              <textarea
                rows={4}
                value={relatoFatos}
                onChange={(e) => setRelatoFatos(e.target.value)}
                placeholder="Descreva o mecanismo do trauma, lesões diagnosticadas, cirurgias e limitações atuais..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed"
              />
            </div>
          </div>

          {/* Document Upload & Checklist Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">
                  2. Documentos Médicos Anexados
                </h3>
              </div>
              <label className="cursor-pointer px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                Anexar Arquivo
                <input
                  type="file"
                  multiple
                  accept=".pdf,.txt,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Uploaded Files List */}
            <div className="space-y-2">
              {uploadedFiles.map((f) => (
                <div
                  key={f.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      {f.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {f.type} • {f.size}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 italic line-clamp-1">
                      "{f.contentSnippet}"
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(f.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Checklist of Critical Documents */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">
                Checklist Probatório (IFHFLIX):
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'prontuarioUrgencia', label: 'Prontuário de PS imediato' },
                  { key: 'laudoImagem', label: 'Laudo de Imagem (RX/RNM)' },
                  { key: 'relatorioCirurgico', label: 'Ficha / Relatório Cirúrgico' },
                  { key: 'boletimOcorrencia', label: 'Boletim de Ocorrência (BO)' },
                  { key: 'carteiraTrabalho', label: 'CTPS / Descrição da Função' },
                  { key: 'laudoINSS', label: 'Laudo SABI do INSS' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleChecklist(item.key as any)}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                      (documentChecklist as any)[item.key]
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <span className="font-bold">
                      {(documentChecklist as any)[item.key] ? '✓' : '○'}
                    </span>
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleRunAnalysis}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processando Análise de Viabilidade com IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Executar Análise de Viabilidade com IA
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Column: Technical Viability Opinion */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Parecer Preliminar
                </span>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Nota Técnica de Viabilidade Pronta para o Advogado
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Fundamentação médica, pontos vulneráveis previstos e recomendações processuais.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Nota Copiada!' : 'Copiar Nota Técnica'}
            </button>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Nexo Preliminar</span>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                Compatível (Simonin)
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Estimativa SUSEP</span>
              <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                12,5% (Médio)
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Recomendação</span>
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                Ajuizar c/ Provas
              </div>
            </div>
          </div>

          <label htmlFor="viabilidade-output" className="sr-only">Texto da Nota Técnica de Viabilidade</label>
          <textarea
            id="viabilidade-output"
            rows={17}
            readOnly
            value={notaTecnicaResult}
            className="w-full text-xs sm:text-sm p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono leading-relaxed focus:outline-none"
          />

          <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>Doutrina IFHFLIX:</strong> A análise de viabilidade é o melhor cartão de visitas do assistente técnico. Ao entregar uma nota técnica clara de 1 a 2 páginas apontando antecipadamente as armadilhas que o réu vai alegar, o advogado percebe valor imediato e contrata a assistência técnica completa para o processo.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
