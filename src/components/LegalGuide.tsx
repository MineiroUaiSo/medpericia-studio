import React from 'react';
import { BookOpen, Scale, Award, ShieldAlert, CheckCircle2, ExternalLink } from 'lucide-react';

export function LegalGuide() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Compêndio Jurídico & Deontológico
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Fundamentos Normativos da Perícia Médica</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Legislação brasileira atualizada, Resoluções do CFM (2.430/2025 e 2.217/2018), Código de Processo Civil e jurisprudência do STF.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 min-w-[200px] text-right">
            <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Marco Regulatório</span>
            <div className="text-base font-bold text-blue-300 mt-1">Res. CFM 2.430/2025</div>
            <span className="text-xs text-slate-400">Atividade Privativa do Médico</span>
          </div>
        </div>
      </div>

      {/* Grid of Key Legal Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: CFM 2.430/2025 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Resolução CFM nº 2.430/2025</h3>
              <p className="text-xs text-slate-500">Marco Regulatório Geral do Ato Médico Pericial</p>
            </div>
          </div>

          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Art. 2º:</strong> Perícia médica é ato propedêutico com formulação de diagnósticos para contribuir com autoridades; atividade privativa médica.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Art. 5º:</strong> Não há relação médico-paciente tradicional. O vínculo do perito é com a verdade técnico-científica e o compromisso ético de neutralidade.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Art. 21º:</strong> O laudo pericial é documento técnico dotado de autonomia probatória, devendo obrigatoriamente fundamentar histórico, exame clínico e nexo causal.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 2: Código de Processo Civil */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-purple-600 dark:text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Código de Processo Civil (CPC/2015)</h3>
              <p className="text-xs text-slate-500">Arts. 464 a 480 — Da Prova Pericial</p>
            </div>
          </div>

          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Art. 465:</strong> Nomeação de perito especializado no objeto da perícia e direito das partes de indicarem assistentes técnicos e formularem quesitos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Art. 473:</strong> Requisitos intrínsecos do laudo: objeto, exame minucioso, linguagem acessível, método científico e resposta a todos os quesitos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Art. 479:</strong> Livre convencimento motivado do juiz. O magistrado pode discordar do laudo, mas deve fundamentar exaustivamente. Na prática, &gt;90% das sentenças homologam o laudo.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 3: Código de Ética Médica */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Código de Ética Médica (Arts. 85-92)</h3>
              <p className="text-xs text-slate-500">Deveres e Impedimentos Deontológicos</p>
            </div>
          </div>

          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Art. 85:</strong> Imparcialidade e isenção obrigatórias. Vedado submeter a conclusão a pressões patronais, estatais ou financeiras.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Art. 86:</strong> Vedado realizar perícia em pessoa que seja ou tenha sido seu paciente próprio. Conflito ético intransponível.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Art. 88:</strong> Vedado assinar laudo sem ter realizado pessoalmente o exame clínico quando este é possível e necessário.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 4: Especialidade vs Especializado */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">É Preciso Ser Especialista? (Não!)</h3>
              <p className="text-xs text-slate-500">Fundamentação contra Impugnações de Advogados</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Conforme a Constituição Federal (Art. 5º, XIII), Lei do Ato Médico (Lei 12.842/2013, art. 4º) e decisão histórica do <strong>Supremo Tribunal Federal (STF - Min. Dias Toffoli, 2022)</strong>:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs italic text-slate-700 dark:text-slate-300">
            "Quanto mais extenso for o conhecimento médico geral, tanto melhor será a qualidade da avaliação, o que confere ao clínico, bem formado e experiente, plenas condições para o exercício da atividade pericial."
          </div>
          <p className="text-xs text-slate-500">
            O CPC exige profissional "especializado no objeto" (médico para questões médicas), e não RQE específico de cada subespecialidade clínica.
          </p>
        </div>
      </div>
    </div>
  );
}
