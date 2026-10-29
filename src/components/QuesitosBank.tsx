import React, { useState } from 'react';
import { useCaseId, caseKey } from '../context/CaseContext';
import { usePersistedState } from '../hooks/usePersistedState';
import { QUESITOS_LIBRARY, QuesitoItem } from '../data/ifhflixKnowledge';
import { HelpCircle, CheckSquare, Square, Copy, Check, Filter, Lightbulb, Shield } from 'lucide-react';

export function QuesitosBank() {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const caseId = useCaseId();
  const [selectedIds, setSelectedIds] = usePersistedState<string[]>(caseKey(caseId, 'quesitos-sel'), []);
  const [copied, setCopied] = useState(false);

  const filteredQuesitos = QUESITOS_LIBRARY.filter((q) => {
    const matchArea = selectedArea === 'all' || q.area === selectedArea;
    const matchRole = selectedRole === 'all' || q.targetRole === selectedRole;
    return matchArea && matchRole;
  });

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAllFiltered = () => {
    const ids = filteredQuesitos.map((q) => q.id);
    const combined = Array.from(new Set([...selectedIds, ...ids]));
    setSelectedIds(combined);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const generateQuesitosText = () => {
    const selected = QUESITOS_LIBRARY.filter((q) => selectedIds.includes(q.id));
    let out = `ROL DE QUESITOS MÉDICO-PERICIAIS\n\n`;
    selected.forEach((q, idx) => {
      out += `${idx + 1}. ${q.pergunta}\n\n`;
    });
    return out;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateQuesitosText());
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
              <HelpCircle className="w-3.5 h-3.5" />
              Acervo Estratégico de Quesitos IFHFLIX
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Banco Completo de Quesitos Especializados</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Perguntas técnicas formuladas com técnica de "holofotes", forçando o perito do juízo a realizar exame físico criterioso e impedindo respostas evasivas.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={selectedIds.length === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all ${
                selectedIds.length > 0
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Quesitos Copiados!' : `Copiar ${selectedIds.length} Selecionados`}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Selection Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Todos os Ramos' },
            { id: 'securitario', label: 'Securitário / DPVAT' },
            { id: 'trabalhista', label: 'Trabalhista' },
            { id: 'erro_medico', label: 'Erro Médico' },
            { id: 'previdenciario', label: 'Previdenciário' },
            { id: 'estrategicos_assistente', label: 'Holofotes do Assistente' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedArea(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedArea === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAllFiltered}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Selecionar Filtrados
          </button>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Limpar Seleção
          </button>
        </div>
      </div>

      {/* Quesitos Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredQuesitos.map((q) => {
          const isSelected = selectedIds.includes(q.id);
          return (
            <div
              key={q.id}
              onClick={() => toggleSelect(q.id)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all text-left ${
                isSelected
                  ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-400 dark:border-blue-800 ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {q.area.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Ideal para: {q.targetRole === 'autor' ? 'Parte Autora' : q.targetRole === 'reu' ? 'Parte Ré' : 'Juízo'}
                    </span>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {q.title}
                    </h3>
                  </div>

                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 font-sans leading-relaxed">
                    "{q.pergunta}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                      <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                        <Shield className="w-3.5 h-3.5 text-blue-500" />
                        Objetivo Estratégico:
                      </div>
                      {q.objetivoEstrategico}
                    </div>

                    <div className="bg-amber-50/70 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/40 text-amber-900 dark:text-amber-200">
                      <div className="font-semibold flex items-center gap-1.5 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        Dica de Ouro do IFHFLIX:
                      </div>
                      {q.dicaIFH}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 text-transparent'
                  }`}
                >
                  ✓
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
