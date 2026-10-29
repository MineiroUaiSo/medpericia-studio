import React, { useState } from 'react';
import { useCaseId, caseKey, TEST_CASE_ID } from '../context/CaseContext';
import { usePersistedState } from '../hooks/usePersistedState';
import { SimoninCriterion, evaluateSimoninNexity } from '../utils/pericia-calc';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle, Copy, Check } from 'lucide-react';

const EXEMPLO_JOAO: SimoninCriterion[] = [
  {
    id: 1,
    title: '1. Integridade Anterior',
    question: 'O periciando era assintomático e anatômica/funcionalmente íntegro antes do evento traumático?',
    status: 'positivo',
    justification: 'Prontuários médicos e histórico pregresso sem qualquer registro de dor, cirurgia ou afecção no cotovelo direito antes de 10/01/2026. Atuava ativamente como mecânico.',
  },
  {
    id: 2,
    title: '2. Natureza e Sede do Trauma',
    question: 'A sede anatômica atingida e o mecanismo do trauma são compatíveis com a lesão diagnosticada?',
    status: 'positivo',
    justification: 'Colisão veicular com desaceleração e choque contuso direto da face posterior do cotovelo direito contra o painel. O olécrano é a estrutura óssea de primeiro impacto.',
  },
  {
    id: 3,
    title: '3. Adequação Causa / Lesão',
    question: 'A intensidade, energia cinética e violência do trauma foram suficientes para provocar a fratura?',
    status: 'positivo',
    justification: 'Impacto automobilístico de média/alta desaceleração gera vetor compressivo e cisalhante direto plenamente capaz de produzir fratura articular de olécrano.',
  },
  {
    id: 4,
    title: '4. Encadeamento Anátomo-Clínico',
    question: 'Houve manifestação imediata e continuidade clínica temporal sem intervalo livre injustificado?',
    status: 'positivo',
    justification: 'Atendimento emergencial prestado no Pronto-Socorro na mesma data do sinistro (10/01/2026), com radiografia confirmatória imediata e conduta cirúrgica sequencial.',
  },
  {
    id: 5,
    title: '5. Continuidade Evolutiva',
    question: 'A evolução fisiopatológica da lesão ao longo do tempo é coerente com o padrão médico esperado?',
    status: 'positivo',
    justification: 'Fratura articular de cotovelo tratada cirurgicamente com osteossíntese, cursando com calo ósseo exuberante, retração capsular e rigidez anátomo-funcional crônica.',
  },
  {
    id: 6,
    title: '6. Exclusão de Causas Estranhas',
    question: 'Foram devidamente afastadas outras etiologias (artropatias inflamatórias, gota, novos traumas)?',
    status: 'positivo',
    justification: 'Investigação clínica e de imagem afasta artropatia autoimune, espondiloartropatia ou novo trauma mecânico intercorrente. A rigidez é estritamente pós-traumática.',
  },
];

const INITIAL_CRITERIA: SimoninCriterion[] = EXEMPLO_JOAO.map((c) => ({
  ...c,
  status: 'inconclusivo',
  justification: '',
}));

export function SimoninMatrix() {
  const caseId = useCaseId();
  const isTest = caseId === TEST_CASE_ID;
  const [criteria, setCriteria] = usePersistedState<SimoninCriterion[]>(caseKey(caseId, 'simonin'), INITIAL_CRITERIA);
  const [copied, setCopied] = useState(false);

  const evaluation = evaluateSimoninNexity(criteria);

  const updateStatus = (id: number, newStatus: 'positivo' | 'negativo' | 'inconclusivo') => {
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  const updateJustification = (id: number, text: string) => {
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, justification: text } : c)));
  };

  const generateReportText = () => {
    let out = `ANÁLISE DO NEXO CAUSAL — CRITÉRIOS DE SIMONIN\n\n`;
    criteria.forEach((c) => {
      out += `${c.title.toUpperCase()}: ${c.justification.trim() || '[NÃO INFORMADO]'} STATUS: ${c.status.toUpperCase()}.\n\n`;
    });
    out += `CONCLUSÃO DO NEXO: ${evaluation.label}. ${evaluation.summaryText}`;
    return out;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Padrão-Ouro de Medicina Legal (Camille Simonin)
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Matriz de Avaliação do Nexo Causal</h2>
            {isTest && <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300">Exemplo — caso fictício de teste</span>}
            {isTest && (
              <button type="button" onClick={() => setCriteria(EXEMPLO_JOAO)} className="ml-2 mt-1 px-2 py-0.5 rounded text-[10px] font-semibold border border-amber-300 text-amber-200">
                Carregar exemplo (João)
              </button>
            )}
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Os 6 critérios que blindam o laudo contra impugnações. O nexo deve ser explicitamente analisado critério por critério.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 text-right">
              <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Veredito do Nexo</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">{evaluation.label}</div>
              <span className="text-xs text-slate-400">{evaluation.positiveCount} de 6 critérios positivos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Criteria Cards */}
      <div className="space-y-4">
        {criteria.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Critério #{item.id}
                  </span>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-500 italic">{item.question}</p>
              </div>

              {/* Status Selectors */}
              <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => updateStatus(item.id, 'positivo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    item.status === 'positivo'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Positivo
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(item.id, 'negativo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    item.status === 'negativo'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Negativo
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(item.id, 'inconclusivo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    item.status === 'inconclusivo'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Dúvida
                </button>
              </div>
            </div>

            {/* Justification input */}
            <div className="mt-3">
              <label htmlFor={`simonin-justification-${item.id}`} className="block text-[11px] font-semibold text-slate-500 mb-1">
                Fundamentação médica no caso concreto:
              </label>
              <textarea
                id={`simonin-justification-${item.id}`}
                rows={2}
                value={item.justification}
                onChange={(e) => updateJustification(item.id, e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Generated Report Section Box */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-500">Texto Gerado para o Laudo</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">({evaluation.label})</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : 'Copiar Texto da Análise'}
          </button>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 font-mono whitespace-pre-wrap">
          {generateReportText()}
        </p>
      </div>
    </div>
  );
}
