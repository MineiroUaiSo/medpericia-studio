import React, { useState } from 'react';
import { useCaseId, TEST_CASE_ID } from '../context/CaseContext';
import {
  SUSEP_TABLE,
  DEGREE_MULTIPLIERS,
  LossDegree,
  calculateSusepLoss,
  calculateBalthazar,
  SusepItem,
} from '../utils/pericia-calc';
import { Calculator, Plus, Trash2, Info, CheckCircle2 } from 'lucide-react';

interface SequelaItem {
  id: string;
  itemId: string;
  degree: LossDegree;
  calculatedValue: number;
}

export function SusepCalculator() {
  const isTest = useCaseId() === TEST_CASE_ID;
  const [selectedItemId, setSelectedItemId] = useState<string>('cotovelo_anquilose');
  const [selectedDegree, setSelectedDegree] = useState<LossDegree>('medio');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sequelaList, setSequelaList] = useState<SequelaItem[]>([
    {
      id: 'seq-1',
      itemId: 'cotovelo_anquilose',
      degree: 'medio',
      calculatedValue: 12.5,
    },
  ]);

  const currentItem = SUSEP_TABLE.find((i) => i.id === selectedItemId);
  const currentResult = calculateSusepLoss(selectedItemId, selectedDegree);

  const filteredItems = activeCategory === 'all'
    ? SUSEP_TABLE
    : SUSEP_TABLE.filter((i) => i.category === activeCategory);

  const addSequela = () => {
    const item = SUSEP_TABLE.find((i) => i.id === selectedItemId);
    if (!item) return;
    const value = calculateSusepLoss(selectedItemId, selectedDegree);
    setSequelaList([
      ...sequelaList,
      {
        id: `seq-${Date.now()}`,
        itemId: selectedItemId,
        degree: selectedDegree,
        calculatedValue: value,
      },
    ]);
  };

  const removeSequela = (id: string) => {
    setSequelaList(sequelaList.filter((s) => s.id !== id));
  };

  // Balthazar calculation over the sequela list
  const nominalPercentages = sequelaList.map((s) => s.calculatedValue);
  const balthazarResult = calculateBalthazar(nominalPercentages);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <Calculator className="w-3.5 h-3.5" />
              Tabela SUSEP / DPVAT (Lei nº 11.945/2009)
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Calculadora Oficial de Invalidez Permanente</h2>
            {isTest && <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300">Exemplo — caso fictício de teste</span>}
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Quantificação pericial objetiva de dano corporal com graduação de perdas parciais e regra de Balthazar para sequelas cumulativas.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 min-w-[200px] text-right">
            <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">{isTest ? 'Exemplo: caso João (fictício)' : 'Resultado atual'}</span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">12,50%</div>
            <span className="text-xs text-slate-400">25% Cotovelo × 50% Médio</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Selector Section */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">1. Selecionar Lesão Anatômica</h3>
            <span className="text-xs text-slate-500">20 segmentos tabelados</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'membros_superiores', label: 'Membros Superiores' },
              { id: 'membros_inferiores', label: 'Membros Inferiores' },
              { id: 'tronco_orgaos', label: 'Tronco / Coluna' },
              { id: 'sentidos_cabeca', label: 'Sentidos' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Segment dropdown / list */}
          <div className="space-y-2">
            <label htmlFor="susep-segment-select" className="block text-xs font-semibold uppercase text-slate-500">Rubrica da Tabela SUSEP</label>
            <select
              id="susep-segment-select"
              aria-label="Rubrica da Tabela SUSEP"
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filteredItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — Teto: {item.maxPercentage}%
                </option>
              ))}
            </select>
          </div>

          {/* Selected Item Info Box */}
          {currentItem && (
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <div className="font-semibold text-sm">{currentItem.name}</div>
                <div>{currentItem.description}</div>
                <div className="font-mono text-blue-700 dark:text-blue-300 font-medium">
                  Teto Indenitário de Perda Total: {currentItem.maxPercentage}%
                </div>
              </div>
            </div>
          )}

          {/* Degree Multipliers */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase text-slate-500">
              2. Grau da Perda Funcional Observada no Exame
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(DEGREE_MULTIPLIERS) as LossDegree[]).map((deg) => {
                const conf = DEGREE_MULTIPLIERS[deg];
                const isSelected = selectedDegree === deg;
                return (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => setSelectedDegree(deg)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-sm">{conf.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      {conf.desc}
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 absolute top-2 right-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Calculation Breakdown */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Fórmula de Cálculo Legal</span>
              <div className="font-mono text-sm text-slate-700 dark:text-slate-200 mt-1">
                {currentItem?.maxPercentage}% (Tabela) × {DEGREE_MULTIPLIERS[selectedDegree].multiplier * 100}% ({DEGREE_MULTIPLIERS[selectedDegree].label})
              </div>
            </div>
            <div className="text-right flex items-center gap-3">
              <div>
                <span className="text-xs text-slate-400 font-medium">Resultado Parcial</span>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {currentResult.toFixed(2)}%
                </div>
              </div>
              <button
                type="button"
                onClick={addSequela}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Adicionar à Lista
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Sequela & Balthazar accumulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Regra de Balthazar</h3>
                <p className="text-xs text-slate-500">Capacidade Restante para Múltiplas Sequelas</p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {sequelaList.length} sequela(s)
              </span>
            </div>

            {sequelaList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Nenhuma sequela adicionada. Adicione itens da tabela ao lado para calcular.
              </div>
            ) : (
              <div className="space-y-3">
                {sequelaList.map((seq, idx) => {
                  const item = SUSEP_TABLE.find((i) => i.id === seq.itemId);
                  return (
                    <div
                      key={seq.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {idx + 1}. {item?.name}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          Grau: {DEGREE_MULTIPLIERS[seq.degree].label} ({item?.maxPercentage}% × {DEGREE_MULTIPLIERS[seq.degree].multiplier})
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-200">
                          {seq.calculatedValue.toFixed(2)}%
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSequela(seq.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Remover"
                          aria-label={`Remover sequela ${idx + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Balthazar Summary Result */}
                <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Soma Aritmética Simples:</span>
                    <span className="font-mono">{nominalPercentages.reduce((a, b) => a + b, 0).toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                    <div>
                      <div className="text-xs uppercase font-semibold text-emerald-400 tracking-wider">
                        Invalidez Final (Balthazar)
                      </div>
                      <div className="text-[11px] text-slate-400">Considerando capacidade restante</div>
                    </div>
                    <div className="text-2xl font-black text-emerald-400">
                      {balthazarResult.totalPercentage.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Step by step deduction table */}
                {balthazarResult.steps.length > 1 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-[11px] space-y-1 font-mono text-slate-600 dark:text-slate-400">
                    <div className="font-bold text-slate-700 dark:text-slate-300 pb-1">Passo a passo da dedução:</div>
                    {balthazarResult.steps.map((st) => (
                      <div key={st.sequelaIndex}>
                        • Sequela {st.sequelaIndex}: {st.nominalPercentage}% sobre {st.appliedOverRemaining}% residual = {st.resultingLoss}% (resta {st.remainingCapacity}%)
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Nota Legal: </span>
              A regra de Balthazar impede que somas aritméticas de lesões múltiplas ultrapassem 100% de incapacidade, respeitando a integridade global restante do organismo.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
