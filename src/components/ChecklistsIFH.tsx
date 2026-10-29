import React, { useState } from 'react';
import { CheckSquare, RotateCcw, Square } from 'lucide-react';
import { CHECKLISTS_IFH } from '../data/checklistsIFH';
import { caseKey, useCaseId } from '../context/CaseContext';
import { usePersistedState } from '../hooks/usePersistedState';

type Progress = Record<string, string[]>;

// Cadastro em tribunais é do perito (vale para todos os casos); as demais listas são por caso.
const GLOBAL_LISTS = ['cadastro'];

export function ChecklistsIFH() {
  const caseId = useCaseId();
  const [activeId, setActiveId] = useState(CHECKLISTS_IFH[0].id);
  const [caseProg, setCaseProg] = usePersistedState<Progress>(caseKey(caseId, 'checklists'), {});
  const [globalProg, setGlobalProg] = usePersistedState<Progress>(caseKey('global', 'checklists'), {});
  const progressOf = (id: string) => (GLOBAL_LISTS.includes(id) ? globalProg : caseProg);
  const setProgressOf = (id: string, items: string[]) =>
    GLOBAL_LISTS.includes(id)
      ? setGlobalProg({ ...globalProg, [id]: items })
      : setCaseProg({ ...caseProg, [id]: items });

  const list = CHECKLISTS_IFH.find((c) => c.id === activeId) ?? CHECKLISTS_IFH[0];
  const done = new Set(progressOf(list.id)[list.id] ?? []);
  const total = list.groups.reduce((n, g) => n + g.items.length, 0);

  const toggle = (item: string) => {
    const next = new Set(done);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setProgressOf(list.id, [...next]);
  };

  const reset = () => setProgressOf(list.id, []);
  const pct = total ? Math.round((done.size / total) * 100) : 0;

  return (
    <section aria-labelledby="checklists-heading" className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CHECKLISTS_IFH.map((c) => {
          const d = progressOf(c.id)[c.id]?.length ?? 0;
          const active = c.id === list.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              aria-pressed={active}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                active
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {c.label} <span className="opacity-70">({d})</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h2 id="checklists-heading" className="font-bold">
            {list.label} — {done.size}/{total} ({pct}%)
          </h2>
          <div className="h-2 mt-1 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs opacity-60 mt-1">{list.fonte}</p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw size={14} /> Limpar
        </button>
      </div>

      {list.groups.map((g) => (
        <fieldset key={g.title} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <legend className="px-2 text-sm font-extrabold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            {g.title}
          </legend>
          <ul className="space-y-1">
            {g.items.map((item) => {
              const checked = done.has(item);
              return (
                <li key={item}>
                  <button
                    onClick={() => toggle(item)}
                    role="checkbox"
                    aria-checked={checked}
                    className="w-full flex items-start gap-2 text-left text-sm py-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded"
                  >
                    {checked ? (
                      <CheckSquare size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                    ) : (
                      <Square size={18} className="mt-0.5 shrink-0 opacity-50" />
                    )}
                    <span className={checked ? 'line-through opacity-60' : ''}>{item}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ))}
    </section>
  );
}
