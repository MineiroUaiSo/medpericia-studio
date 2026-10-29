import React, { useState } from 'react';
import { SCRIPT_CAPTACAO_7_PASSOS } from '../data/ifhflixKnowledge';
import {
  Briefcase,
  PhoneCall,
  MessageSquare,
  Landmark,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Flame,
  Award,
  Users,
} from 'lucide-react';

export function CaptacaoScripts() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [activeSubView, setActiveSubView] = useState<'scripts' | 'tribunais' | 'pacotes'>('scripts');

  const currentStepData = SCRIPT_CAPTACAO_7_PASSOS.find((s) => s.step === activeStep) || SCRIPT_CAPTACAO_7_PASSOS[0];

  const handleCopyScript = () => {
    navigator.clipboard.writeText(currentStepData.scriptLiteral);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              Gestão, Captação & Escala IFHFLIX
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Studio Comercial: Captação de Advogados & Credenciamento</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              O método validado de prospecção B2B de escritórios de advocacia, scripts literais dos 7 passos da reunião e estratégias de primeiras nomeações nos tribunais.
            </p>
          </div>

          {/* Subview Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl">
            {[
              { id: 'scripts', label: '7 Passos da Reunião' },
              { id: 'tribunais', label: 'Tribunais & Cadastro' },
              { id: 'pacotes', label: 'Tabela de Pacotes' },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveSubView(v.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeSubView === v.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW 1: OS 7 PASSOS DA REUNIÃO */}
      {activeSubView === 'scripts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Step Selector List */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase text-slate-500 block px-2 pb-1">
              Roteiro dos 7 Passos com o Advogado
            </span>
            {SCRIPT_CAPTACAO_7_PASSOS.map((st) => (
              <button
                key={st.step}
                type="button"
                onClick={() => setActiveStep(st.step)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  activeStep === st.step
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-xs">{st.title.split(':')[0]}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {st.title.split(':')[1]}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>

          {/* Step Detail Card */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {currentStepData.title.split(':')[0]}
                </span>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mt-1">
                  {currentStepData.title.split(':')[1]}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCopyScript}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0"
              >
                {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedScript ? 'Script Copiado!' : 'Copiar Script'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Objetivo Técnico-Comercial da Etapa:
                </label>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {currentStepData.goal}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Script Literal Sugerido (Fala / Mensagem):
                </label>
                <div className="p-4 bg-slate-900 text-emerald-300 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-wrap border border-slate-800">
                  {currentStepData.scriptLiteral}
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Dica de Ouro IFHFLIX:</strong> {currentStepData.dicaOuro}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TRIBUNAIS & CADASTRO */}
      {activeSubView === 'tribunais' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <Landmark className="w-5 h-5" />
              Tribunais de Justiça (TJ Estadual)
            </div>
            <p className="text-xs text-slate-500">27 Tribunais Estaduais (Varas Cíveis e de Família)</p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
              <li><strong>Demandas:</strong> Danos corporais, DPVAT, seguros de vida, acidentes de trânsito, suposto erro médico, interdição e curatela.</li>
              <li><strong>Remuneração:</strong> Honorários pagos pelas seguradoras ou partes rés via depósito judicial prévio (média R$ 2.500 a R$ 6.000).</li>
              <li><strong>Estratégia:</strong> Despacho presencial com o juiz ou diretor de secretaria da vara cível.</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
              <Landmark className="w-5 h-5" />
              Tribunais Regionais do Trabalho (TRT)
            </div>
            <p className="text-xs text-slate-500">24 Regiões Trabalhistas</p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
              <li><strong>Demandas:</strong> LER/DORT, tendinopatias, acidentes de trabalho típicos, ergonomia (NR-17), nexo com a empresa.</li>
              <li><strong>Remuneração:</strong> Parte sucumbente (geralmente reclamada) arca com os honorários após o laudo.</li>
              <li><strong>Particularidade:</strong> O assistente técnico deve apresentar o parecer ANTES ou JUNTO com o perito do juízo.</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Landmark className="w-5 h-5" />
              Tribunais Regionais Federais (TRF)
            </div>
            <p className="text-xs text-slate-500">6 Regiões Federais (JEFs / Varas Previdenciárias)</p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
              <li><strong>Demandas:</strong> Benefício por incapacidade temporária (antigo auxílio-doença), incapacidade permanente e BPC/LOAS.</li>
              <li><strong>Vantagem:</strong> Alto volume e fluxo contínuo de perícias (mutirões periciais semanais).</li>
              <li><strong>Ideal para:</strong> Início de carreira para acumular dezenas de laudos e dominar a anamnese pericial.</li>
            </ul>
          </div>
        </div>
      )}

      {/* VIEW 3: PACOTES DE SERVIÇOS & PREÇOS */}
      {activeSubView === 'pacotes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs uppercase font-bold text-slate-500">Entrada / Filtro</span>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">1. Análise Prévia de Viabilidade</h3>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">R$ 800 a R$ 1.500</div>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
              <li>Leitura de prontuários e exames de imagem</li>
              <li>Parecer verbal ou nota técnica preliminar</li>
              <li>Parecer sobre chance real de nexo causal antes do ajuizamento</li>
              <li>Evita que o advogado perca tempo com casos sem viabilidade</li>
            </ul>
          </div>

          <div className="bg-gradient-to-b from-blue-50/50 dark:from-blue-950/30 to-white dark:to-slate-900 border-2 border-blue-500 rounded-2xl p-6 shadow-md space-y-4 relative">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-600 text-white">
              Mais Vendido
            </div>
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs uppercase font-bold text-blue-600 dark:text-blue-400">Pacote Essencial</span>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">2. Assistência Técnica Completa</h3>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">R$ 3.500 a R$ 6.000</div>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
              <li>Elaboração de quesitos estratégicos com holofotes</li>
              <li>Acompanhamento presencial no ato da perícia</li>
              <li>Emissão do Parecer Médico-Legal conclusivo</li>
              <li>Elaboração de quesitos elucidativos se necessário</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs uppercase font-bold text-slate-500">100% Remoto / Alta Margem</span>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">3. Manifestação / Impugnação Avulsa</h3>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">R$ 1.800 a R$ 3.000</div>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
              <li>100% documental (sem deslocamento)</li>
              <li>Análise dos 8 vícios do art. 473 do CPC no laudo contrário</li>
              <li>Parecer divergente fundamentado com literatura</li>
              <li>Margem líquida típica de 85%</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
