import React, { useState } from 'react';
import { FlaskConical, FolderPlus, Trash2 } from 'lucide-react';

export interface CaseInfo {
  id: string;
  name: string;
}

interface Props {
  cases: CaseInfo[];
  activeId: string;
  isTest: boolean;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  onClear: () => void;
  onDelete: () => void;
}

const btn = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors';

export function CaseBar({ cases, activeId, isTest, onSelect, onCreate, onClear, onDelete }: Props) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState<'clear' | 'delete' | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim().slice(0, 60));
    setName('');
    setCreating(false);
  };

  return (
    <div
      role="region"
      aria-label="Caso ativo"
      className={`border-b ${
        isTest
          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'
          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center gap-2 text-xs">
        {isTest && (
          <span className="inline-flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
            <FlaskConical size={14} /> CASO DE TESTE — dados de exemplo (João da Silva), não usar em perícia real.
          </span>
        )}
        <label className="inline-flex items-center gap-2 font-semibold">
          Caso:
          <select
            value={activeId}
            onChange={(e) => { setConfirm(null); onSelect(e.target.value); }}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1"
          >
            {cases.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>

        {creating ? (
          <form onSubmit={submit} className="inline-flex items-center gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do caso (ex.: Proc. 1234 – Maria)"
              aria-label="Nome do novo caso"
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 w-64"
            />
            <button type="submit" className={`${btn} bg-emerald-600 text-white border-emerald-600`}>Criar</button>
            <button type="button" onClick={() => setCreating(false)} className={`${btn} border-slate-300 dark:border-slate-700`}>Cancelar</button>
          </form>
        ) : (
          <button onClick={() => setCreating(true)} className={`${btn} bg-emerald-600 text-white border-emerald-600`}>
            <FolderPlus size={14} /> Novo caso
          </button>
        )}

        {confirm ? (
          <span className="inline-flex items-center gap-2" role="alert">
            <strong>{confirm === 'clear' ? 'Apagar todos os dados deste caso?' : 'Excluir este caso e seus dados?'}</strong>
            <button
              onClick={() => { (confirm === 'clear' ? onClear : onDelete)(); setConfirm(null); }}
              className={`${btn} bg-red-600 text-white border-red-600`}
            >
              Confirmar
            </button>
            <button onClick={() => setConfirm(null)} className={`${btn} border-slate-300 dark:border-slate-700`}>Cancelar</button>
          </span>
        ) : (
          <>
            <button onClick={() => setConfirm('clear')} className={`${btn} border-slate-300 dark:border-slate-700`}>
              <Trash2 size={14} /> Limpar este caso
            </button>
            {!isTest && (
              <button onClick={() => setConfirm('delete')} className={`${btn} border-red-300 text-red-700 dark:text-red-400`}>
                Excluir caso
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
