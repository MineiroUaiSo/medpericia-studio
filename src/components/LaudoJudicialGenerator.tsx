import React, { useMemo, useState } from 'react';
import { Check, Copy, Loader2, Sparkles } from 'lucide-react';
import { buildLaudoSkeleton, EMPTY_LAUDO, ESFERAS, type Esfera, type LaudoData } from '../utils/laudoBuilder';
import { callAI, SYSTEM_PROMPTS } from '../services/aiService';

const FIELDS: { key: keyof LaudoData; label: string }[] = [
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
  const [data, setData] = useState<LaudoData>(EMPTY_LAUDO);
  const [notas, setNotas] = useState('');
  const [ia, setIa] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [copied, setCopied] = useState(false);

  const set = (k: keyof LaudoData, v: string) => setData((d) => ({ ...d, [k]: v }));
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
      const prompt = `Redija APENAS "4. DISCUSSÃO" (4.1 introdução, 4.2 metodologia, 4.3 análise, 4.4 literatura) e "5. CONCLUSÃO" do laudo, usando SOMENTE os dados abaixo. Não invente achados; o que faltar, marque [NÃO INFORMADO].\n\nEsfera: ${ESFERAS[data.esfera].label}\nQuesitos do juízo:\n${data.quesitosJuizo}\nQuesitos ${ESFERAS[data.esfera].autor}:\n${data.quesitosAutor}\nQuesitos ${ESFERAS[data.esfera].reu}:\n${data.quesitosReu}\n\nDADOS DO CASO:\n${notas}`;
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
