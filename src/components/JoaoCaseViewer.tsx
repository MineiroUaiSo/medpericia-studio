import React, { useState } from 'react';
import {
  JOAO_CASE_INFO,
  JOAO_DISCUSSAO_TEXT,
  JOAO_CONCLUSAO_TEXT,
  JOAO_QUESITOS_EXEMPLO,
} from '../data/joaoCase';
import {
  FileText,
  Copy,
  Check,
  User,
  Activity,
  Award,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

export function JoaoCaseViewer() {
  const [discussaoText, setDiscussaoText] = useState(JOAO_DISCUSSAO_TEXT);
  const [conclusaoText, setConclusaoText] = useState(JOAO_CONCLUSAO_TEXT);
  const [copiedDiscussao, setCopiedDiscussao] = useState(false);
  const [copiedConclusao, setCopiedConclusao] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'both' | 'discussao' | 'conclusao' | 'quesitos'>('both');

  const handleCopyDiscussao = () => {
    navigator.clipboard.writeText(discussaoText);
    setCopiedDiscussao(true);
    setTimeout(() => setCopiedDiscussao(false), 2500);
  };

  const handleCopyConclusao = () => {
    navigator.clipboard.writeText(conclusaoText);
    setCopiedConclusao(true);
    setTimeout(() => setCopiedConclusao(false), 2500);
  };

  const handleCopyAll = () => {
    const full = `${discussaoText}\n\n----------------------------------------\n\n${conclusaoText}`;
    navigator.clipboard.writeText(full);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Patient & Case Summary Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 border border-slate-800 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <FileText className="w-3.5 h-3.5" />
              Laudo Pericial Cível / Securitário — Estruturação Pronta
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Caso: João da Silva, 45 anos</h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl">
              Sinistro automobilístico (10/01/2026) • Fratura articular de olécrano direito com osteossíntese e consolidação viciosa • Rigidez de cotovelo • Profissão: Mecânico automotivo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedAll ? 'Tudo Copiado!' : 'Copiar Discussão + Conclusão'}
            </button>
          </div>
        </div>

        {/* 4 Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <User className="w-3.5 h-3.5 text-blue-400" />
              Periciando & Ocupação
            </div>
            <div className="font-semibold text-sm text-slate-100 mt-1">João da Silva, 45 a.</div>
            <div className="text-[11px] text-slate-400">Mecânico de Veículos</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Nexo Causal (Simonin)
            </div>
            <div className="font-semibold text-sm text-emerald-400 mt-1">Nexo Pleno / Direto</div>
            <div className="text-[11px] text-slate-400">6/6 critérios positivos</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Tabela SUSEP / DPVAT
            </div>
            <div className="font-semibold text-sm text-amber-400 mt-1">12,50% Invalidez</div>
            <div className="text-[11px] text-slate-400">25% Cotovelo × 50% Médio</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Briefcase className="w-3.5 h-3.5 text-purple-400" />
              Impacto Laboral
            </div>
            <div className="font-semibold text-sm text-purple-300 mt-1">Incapacidade Parcial</div>
            <div className="text-[11px] text-slate-400">Restrição p/ esforço extremo</div>
          </div>
        </div>
      </div>

      {/* Sub-navigation Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'both', label: 'Visão Completa (4 & 5)' },
            { id: 'discussao', label: '4. Discussão Pormenorizada' },
            { id: 'conclusao', label: '5. Conclusão Pericial' },
            { id: 'quesitos', label: 'Banco de Quesitos do Caso' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Edição em tempo real disponível nos blocos de texto
        </span>
      </div>

      {/* View: DISCUSSÃO */}
      {(activeSubTab === 'both' || activeSubTab === 'discussao') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  Item 4 do Laudo
                </span>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  4. DISCUSSÃO MÉDICO-LEGAL
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Fundamentação técnico-científica, critérios de Simonin, ausência de alegação infundada de erro médico, enquadramento SUSEP e profissiografia.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyDiscussao}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0"
            >
              {copiedDiscussao ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedDiscussao ? 'Discussão Copiada!' : 'Copiar Apenas a Discussão'}
            </button>
          </div>

          {/* Key Checklist Badges for Discussion */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong>Terminologia rigorosa:</strong> "Periciando" (sem usar "paciente")
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong>Simonin explícito:</strong> Todos os 6 critérios descritos
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong>Tabela SUSEP:</strong> 25% × 50% = 12,5% fundamentado
              </span>
            </div>
          </div>

          <label htmlFor="discussao-textarea" className="sr-only">Texto da Discussão do Laudo</label>
          <textarea
            id="discussao-textarea"
            rows={14}
            value={discussaoText}
            onChange={(e) => setDiscussaoText(e.target.value)}
            className="w-full text-xs sm:text-sm p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed"
          />
        </div>
      )}

      {/* View: CONCLUSÃO */}
      {(activeSubTab === 'both' || activeSubTab === 'conclusao') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                  Item 5 do Laudo
                </span>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  5. CONCLUSÃO MÉDICO-LEGAL
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Síntese categórica dos achados: diagnósticos CID, nexo direto, estabilidade, 12,5% SUSEP e incapacidade laboral parcial.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyConclusao}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0"
            >
              {copiedConclusao ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copiedConclusao ? 'Conclusão Copiada!' : 'Copiar Apenas a Conclusão'}
            </button>
          </div>

          <label htmlFor="conclusao-textarea" className="sr-only">Texto da Conclusão do Laudo</label>
          <textarea
            id="conclusao-textarea"
            rows={12}
            value={conclusaoText}
            onChange={(e) => setConclusaoText(e.target.value)}
            className="w-full text-xs sm:text-sm p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono leading-relaxed"
          />
        </div>
      )}

      {/* View: QUESITOS DO CASO */}
      {activeSubTab === 'quesitos' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
              Respostas Modelo aos Quesitos Formulados na Lide
            </h3>
            <p className="text-xs text-slate-500">
              Padrão de resposta pericial: direto, fundamentado, sem termos vagos como "vide histórico" e sem invasão de mérito estritamente jurídico.
            </p>
          </div>

          <div className="space-y-4">
            {JOAO_QUESITOS_EXEMPLO.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    Quesito #{idx + 1} — {q.autor}
                  </span>
                </div>
                <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                  "{q.pergunta}"
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                  <strong>Resposta pericial:</strong> {q.resposta}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practical Warning Box */}
      <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="font-bold">Aviso Técnico de Boas Práticas Periciais (Res. CFM 2.430/2025):</div>
          <p>
            1. <strong>Jamais utilize a palavra "paciente":</strong> O termo correto é sempre <em>periciando</em> (ou <em>periciado</em> no pretérito). Na perícia não há relação médico-paciente assistencial terapêutica, mas sim compromisso com a verdade técnica perante a autoridade judicial.
          </p>
          <p>
            2. <strong>Cuidado com imputações à equipe médica anterior:</strong> A consolidação viciosa pós-fratura articular de cotovelo decorre da severidade anátomo-traumática intrínseca da lesão. O perito judicial não deve aventar levianamente "erro médico" sem que isso seja expressamente o objeto da ação com contraditório e ampla defesa.
          </p>
        </div>
      </div>
    </div>
  );
}
