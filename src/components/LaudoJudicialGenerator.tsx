import React, { useMemo, useState } from 'react';
import { Check, Copy, Loader2, Sparkles } from 'lucide-react';
import { buildLaudoSkeleton, EMPTY_LAUDO, ESFERAS, type Esfera, type LaudoData } from '../utils/laudoBuilder';
import { caseKey, useCaseId } from '../context/CaseContext';
import { usePersistedState } from '../hooks/usePersistedState';
import { callAI, SYSTEM_PROMPTS } from '../services/aiService';
import { RAMO_IDS, RAMOS, type RamoId } from '../data/ramos';
import { buildLaudoDiscussaoPrompt } from '../utils/promptBuilders';

type CampoTexto = Exclude<keyof LaudoData, 'marcos' | 'ramo' | 'esfera'>;

const FIELDS: { key: CampoTexto; label: string }[] = [
  { key: 'vara', label: 'Nº da vara' }, { key: 'comarca', label: 'Comarca/UF' },
  { key: 'processo', label: 'Processo Nº' }, { key: 'autor', label: 'Autor/Reclamante' },
  { key: 'reu', label: 'Réu/Reclamada' }, { key: 'perito', label: 'Perito' },
  { key: 'crm', label: 'CRM (UF + nº)' }, { key: 'rqe', label: 'RQE' },
  { key: 'formacao', label: 'Formação' }, { key: 'dataPericia', label: 'Data da perícia' },
  { key: 'horaPericia', label: 'Hora' }, { key: 'localPericia', label: 'Local da perícia' },
  { key: 'atParte', label: 'AT da parte (autor/réu)' }, { key: 'atNome', label: 'Nome do AT (vazio = sem AT)' },
  { key: 'periciando', label: 'Periciando' }, { key: 'rg', label: 'RG' }, { key: 'cpf', label: 'CPF' },
  { key: 'nascimento', label: 'Nascimento' }, { key: 'profissao', label: 'Profissão' },
  { key: 'laudas', label: 'Total de laudas' }, { key: 'cidadeUF', label: 'Cidade, UF (encerramento)' },
  { key: 'dataLaudo', label: 'Data do laudo' },
];

const inputCls = 'w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm';

export function LaudoJudicialGenerator() {
  const caseId = useCaseId();
  const [stored, setData] = usePersistedState<LaudoData>(caseKey(caseId, 'laudogen'), EMPTY_LAUDO);
  const data: LaudoData = { ...EMPTY_LAUDO, ...stored };
  const [notas, setNotas] = usePersistedState(caseKey(caseId, 'laudogen-notas'), '');
  const [ia, setIa] = usePersistedState(caseKey(caseId, 'laudogen-ia'), '');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [copied, setCopied] = useState(false);

  const set = (k: CampoTexto | 'esfera', v: string) => setData((d) => ({ ...EMPTY_LAUDO, ...d, [k]: v }));
  const setRamo = (ramo: RamoId) =>
    setData((d) => ({ ...EMPTY_LAUDO, ...d, ramo, esfera: RAMOS[ramo].esferaSugerida }));
  const setMarco = (key: string, v: string) =>
    setData((d) => ({ ...EMPTY_LAUDO, ...d, marcos: { ...(d.marcos ?? {}), [key]: v } }));
  const ramo = RAMOS[data.ramo] ?? RAMOS.civel_dano;
  const texto = useMemo(() => buildLaudoSkeleton(data), [data]);
  const completo = ia ? `${texto}\n\n--- RASCUNHO IA: DISCUSSÃO E CONCLUSÃO (revisar) ---\n${ia}` : texto;

  const copiar = async () => {
    await navigator.clipboard.writeText(completo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const redigir = async () => {
    if (!notas.trim()) return setErro('Cole o histórico, exame físico e documentos do periciando.');
    setErro('');
    setLoading(true);
    try {
      const prompt = buildLaudoDiscussaoPrompt({ data, notas });
      setIa(await callAI(prompt, SYSTEM_PROMPTS.laudoPericial, true));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha na IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-labelledby="laudo-gen-heading" className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h2 id="laudo-gen-heading" className="font-bold text-lg">Gerador de Laudo Judicial</h2>
        <p className="text-xs opacity-70">Deixe em branco o que não souber: o laudo marca <strong>[NÃO INFORMADO]</strong>. A IA só deduz do que você colar em "Dados do caso" e marca como <strong>[INFERIDO – confirmar]</strong>; nunca inventa datas.</p>
        <label className="block text-xs font-semibold">Ramo
          <select className={inputCls} value={data.ramo} onChange={(e) => setRamo(e.target.value as RamoId)}>
            {RAMO_IDS.map((id) => <option key={id} value={id}>{RAMOS[id].label}</option>)}
          </select>
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          {ramo.campos.map((c) => (
            <label key={c.key} className="block text-xs font-semibold">{c.label}
              {c.tipo === 'select' ? (
                <select className={inputCls} value={data.marcos[c.key] ?? ''} onChange={(e) => setMarco(c.key, e.target.value)}>
                  <option value="">Selecione…</option>
                  {c.opcoes?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input className={inputCls} value={data.marcos[c.key] ?? ''} placeholder={c.tipo === 'data' ? 'dd/mm/aaaa' : ''} onChange={(e) => setMarco(c.key, e.target.value)} />
              )}
              {c.ajuda && <span className="block text-[10px] font-normal opacity-60">{c.ajuda}</span>}
            </label>
          ))}
        </div>
        <label className="block text-xs font-semibold">Esfera
          <select className={inputCls} value={data.esfera} onChange={(e) => set('esfera', e.target.value as Esfera)}>
            {Object.entries(ESFERAS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          {FIELDS.map(({ key, label }) => (
            <label key={key} className="block text-xs font-semibold">{label}
              <input className={inputCls} value={data[key]} onChange={(e) => set(key, e.target.value)} />
            </label>
          ))}
        </div>
        {([['quesitosJuizo', 'Quesitos do Juízo (1 por linha)'], ['quesitosAutor', 'Quesitos do Autor/Reclamante'], ['quesitosReu', 'Quesitos do Réu/Reclamada']] as const).map(([k, l]) => (
          <label key={k} className="block text-xs font-semibold">{l}
            <textarea rows={3} className={inputCls} value={data[k]} onChange={(e) => set(k, e.target.value)} />
          </label>
        ))}
        <label className="block text-xs font-semibold">Dados do caso para a IA (relato, exame físico, documentos)
          <textarea rows={6} className={inputCls} value={notas} onChange={(e) => setNotas(e.target.value)} />
        </label>
        <button onClick={redigir} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Redigir Discussão e Conclusão (IA)
        </button>
        {erro && <p role="alert" className="text-sm text-red-600">{erro}</p>}
      </div>
      <div className="space-y-2">
        <button onClick={copiar} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm">
          {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copiado' : 'Copiar laudo'}
        </button>
        <pre className="whitespace-pre-wrap text-xs leading-relaxed rounded-xl border border-slate-200 dark:border-slate-800 p-4 max-h-[75vh] overflow-auto">{completo}</pre>
        <p className="text-xs opacity-60">Rascunho de apoio (template IFHFLIX). Revisar com o checklist de pré-entrega.</p>
      </div>
    </section>
  );
}
