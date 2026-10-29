import React, { useState } from 'react';
import { dataPorExtenso } from '../utils/dataExtenso';
import { useCaseId, caseKey, TEST_CASE_ID } from '../context/CaseContext';
import { usePersistedState } from '../hooks/usePersistedState';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  ShieldAlert,
  HelpCircle,
  Scale,
  Award,
} from 'lucide-react';

interface VicioCPCItem {
  id: number;
  label: string;
  artigoCPC: string;
  descricao: string;
  checked: boolean;
}

const INITIAL_VICIOS: VicioCPCItem[] = [
  {
    id: 1,
    label: 'Ausência de Método Científico Reconhecido',
    artigoCPC: 'Art. 473, III',
    descricao: 'O perito emitiu opinião pessoal ou vaga, sem citar bibliografia médica consagrada ou critérios objetivos (ex.: Simonin, SUSEP, Schilling).',
    checked: true,
  },
  {
    id: 2,
    label: 'Exame Clínico Superficial ou Incompleto',
    artigoCPC: 'Art. 473, II',
    descricao: 'Não realizou testes ortopédicos especiais essenciais, não mediu goniometria em graus ou o exame durou menos de 10 minutos.',
    checked: true,
  },
  {
    id: 3,
    label: 'Contradição entre Discussão e Conclusão',
    artigoCPC: 'Art. 473, § 1º',
    descricao: 'Na discussão o perito descreve limitação funcional severa e dor, porém conclui por ausência de incapacidade sem justificar a discrepância.',
    checked: false,
  },
  {
    id: 4,
    label: 'Resposta Evasiva a Quesitos ("Vide Laudo")',
    artigoCPC: 'Art. 473, IV',
    descricao: 'Respondeu quesito relevante com termos vagos como "vide histórico" ou "prejudicado", sem responder o questionamento técnico pontual.',
    checked: false,
  },
  {
    id: 5,
    label: 'Extrapolação dos Limites da Designação (Julgamento Jurídico)',
    artigoCPC: 'Art. 473, § 2º',
    descricao: 'O perito opinou sobre culpa, dolo, imperícia, erro médico ou concessão de benefício judicial, invadindo competência exclusiva do magistrado.',
    checked: false,
  },
];

const EXEMPLO_JOAO = {
  peritoJudicialNome: 'Dr. Perito do Juízo',
  objetoDivergencia: 'O laudo do perito judicial reconheceu a fratura e a rigidez articular, contudo fixou erroneamente a perda funcional em grau leve (25%), desconsiderando a perda de 50% dos arcos de flexoextensão e a profissiografia de mecânico automotivo que exige ampla mobilidade.',
  quesitosElucidativos: '1. Queira o Sr. Perito Judicial retificar ou esclarecer a medição goniométrica em graus da flexão e extensão do cotovelo direito do periciando;\n2. Considerando que o periciando perdeu metade do arco articular funcional, esclareça por qual motivo técnico não foi aplicado o enquadramento em Grau Médio (50%) da Tabela SUSEP.',
};

export function ParecerGenerator() {
  const caseId = useCaseId();
  const isTest = caseId === TEST_CASE_ID;
  const [tipoConclusao, setTipoConclusao] = usePersistedState<'divergencia_parcial' | 'divergencia_total' | 'concordancia' | 'reforco' | 'correcao'>(caseKey(caseId, 'parecer-tipo'), 'divergencia_parcial');
  const [vicios, setVicios] = usePersistedState<VicioCPCItem[]>(caseKey(caseId, 'parecer-vicios'), INITIAL_VICIOS);
  const [peritoJudicialNome, setPeritoJudicialNome] = usePersistedState<string>(caseKey(caseId, 'parecer-perito'), '');
  const [objetoDivergencia, setObjetoDivergencia] = usePersistedState<string>(caseKey(caseId, 'parecer-objeto'), '');
  const [quesitosElucidativos, setQuesitosElucidativos] = usePersistedState<string>(caseKey(caseId, 'parecer-quesitos'), '');
  const [copied, setCopied] = useState(false);

  const toggleVicio = (id: number) => {
    setVicios(vicios.map((v) => (v.id === id ? { ...v, checked: !v.checked } : v)));
  };

  const generateParecerText = () => {
    const selectedVicios = vicios.filter((v) => v.checked);
    return `PARECER MÉDICO-LEGAL DO ASSISTENTE TÉCNICO

I. DA QUALIFICAÇÃO E OBJETO
O presente parecer técnico-científico tem por finalidade analisar criticamente as operações e conclusões periciais constantes no laudo apresentado pelo Nobre Perito Judicial, ${peritoJudicialNome.trim() || '[NÃO INFORMADO]'}, nos autos do processo em referência.

II. DA MODALIDADE DO PARECER: ${
      tipoConclusao === 'divergencia_parcial'
        ? 'DIVERGÊNCIA PARCIAL FUNDAMENTADA'
        : tipoConclusao === 'divergencia_total'
        ? 'DIVERGÊNCIA TOTAL (IMPUGNAÇÃO TÉCNICA INTEGRAL)'
        : tipoConclusao === 'reforco'
        ? 'REFORÇO E SUBSÍDIO PROBATÓRIO'
        : tipoConclusao === 'correcao'
        ? 'CORREÇÃO DE ERRO MATERIAL / ARITMÉTICO'
        : 'CONCORDÂNCIA TÉCNICA INTEGRAL'
    }

III. DOS APONTAMENTOS CRÍTICOS E VÍCIOS DE FORMA OBSERVADOS NO LAUDO
${
  selectedVicios.length > 0
    ? selectedVicios
        .map(
          (v, i) =>
            `${i + 1}. ${v.label.toUpperCase()} (${v.artigoCPC}):\n${v.descricao}`
        )
        .join('\n\n')
    : 'Não foram constatados vícios formais impeditivos.'
}

IV. DA DIVERGÊNCIA TÉCNICO-CIENTÍFICA (MÉTODO E PROFISSIOGRAFIA)
${objetoDivergencia.trim() || '[NÃO INFORMADO]'}

V. DOS QUESITOS SUPLEMENTARES E DE ESCLARECIMENTO
Para que não pairem dúvidas sobre a real extensão do dano corporal e a justa aplicação do direito, requer-se a intimação do D. Perito do Juízo para que responda fundamentadamente aos seguintes quesitos elucidativos:

${quesitosElucidativos.trim() || '[NÃO INFORMADO]'}

VI. CONCLUSÃO DO ASSISTENTE TÉCNICO
Diante da robusta literatura médico-legal e das diretrizes do CPC (art. 473) e da Resolução CFM nº 2.430/2025, conclui este assistente técnico que o laudo judicial merece os reparos técnicos pontuados, ratificando-se a necessidade de acolhimento das razões expostas.

[Cidade/UF], ${dataPorExtenso()}.

________________________________________
Médico Assistente Técnico — CRM`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateParecerText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <Scale className="w-3.5 h-3.5" />
              Atuação do Médico Assistente Técnico (CPC & IFHFLIX)
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Gerador de Parecer Técnico & Manifestação Crítica</h2>
            {isTest && <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300">Exemplo — caso fictício de teste</span>}
            {isTest && (
              <button
                type="button"
                onClick={() => {
                  setPeritoJudicialNome(EXEMPLO_JOAO.peritoJudicialNome);
                  setObjetoDivergencia(EXEMPLO_JOAO.objetoDivergencia);
                  setQuesitosElucidativos(EXEMPLO_JOAO.quesitosElucidativos);
                }}
                className="ml-2 mt-1 px-2 py-0.5 rounded text-[10px] font-semibold border border-amber-300 text-amber-200"
              >
                Carregar exemplo (João)
              </button>
            )}
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Nomenclatura técnica rigorosa: o médico emite Parecer Médico-Legal (não "impugnação", que é ato processual do advogado), blindado pelos 8 vícios do art. 473 do CPC.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Parecer Copiado!' : 'Copiar Parecer Completo'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          {/* As 5 Conclusões do Parecer segundo IFHFLIX */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-slate-500">
              1. Modalidade de Conclusão do Parecer
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'divergencia_parcial', label: 'Divergência Parcial (Mais Comum)', desc: 'Concorda com diagnóstico/nexo, mas diverge do grau de invalidez ou profissiografia.' },
                { id: 'divergencia_total', label: 'Divergência Total (Impugnação)', desc: 'Rejeita completamente as premissas e a conclusão do laudo judicial.' },
                { id: 'reforco', label: 'Reforço ao Laudo', desc: 'O laudo do juízo foi favorável e o parecer traz fundamentações complementares.' },
                { id: 'correcao', label: 'Correção de Erro Material', desc: 'Aponta equívoco de digitação, cálculo aritmético ou inversão de membros.' },
                { id: 'concordancia', label: 'Concordância Total', desc: 'Análise minuciosa ratificando a integralidade do laudo judicial.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTipoConclusao(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tipoConclusao === opt.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Checklist dos Vícios do CPC 473 */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold uppercase text-slate-500">
              2. Vícios Formais Identificados no Laudo (CPC 473)
            </label>
            <div className="space-y-2">
              {vicios.map((v) => (
                <div
                  key={v.id}
                  onClick={() => toggleVicio(v.id)}
                  className={`cursor-pointer p-3 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${
                    v.checked
                      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-400 dark:border-rose-800'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border mt-0.5 text-[10px] font-bold ${
                      v.checked
                        ? 'bg-rose-600 border-rose-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {v.label} <span className="text-rose-600 dark:text-rose-400 font-mono">({v.artigoCPC})</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 leading-snug">
                      {v.descricao}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Estrutura do Parecer Médico-Legal Formatado
              </h3>
            </div>
            <span className="text-xs text-slate-400">Edição livre nos campos</span>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="divergencia-teor" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Teor da Divergência Técnica / Profissiografia:
              </label>
              <textarea
                id="divergencia-teor"
                rows={4}
                value={objetoDivergencia}
                onChange={(e) => setObjetoDivergencia(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono leading-relaxed"
              />
            </div>

            <div>
              <label htmlFor="quesitos-elucidativos" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Quesitos Suplementares / Elucidativos (para intimar o perito a esclarecer):
              </label>
              <textarea
                id="quesitos-elucidativos"
                rows={4}
                value={quesitosElucidativos}
                onChange={(e) => setQuesitosElucidativos(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono leading-relaxed"
              />
            </div>

            <div>
              <label htmlFor="parecer-preview" className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                Pré-visualização do Parecer Completo:
              </label>
              <textarea
                id="parecer-preview"
                rows={10}
                readOnly
                value={generateParecerText()}
                className="w-full text-xs p-3 rounded-xl bg-slate-900 text-slate-100 font-mono leading-relaxed border border-slate-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
