import React, { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { buildAssunto, buildEmail, DICAS_ENVIO, EMPTY_EMAIL, type Destinatario, type EmailData } from '../utils/emailVaras';

const FIELDS: { key: keyof EmailData; label: string }[] = [
  { key: 'nomeDestinatario', label: 'Nome do juiz/diretor' }, { key: 'vara', label: 'Vara (ex.: 3ª Vara Cível)' },
  { key: 'forum', label: 'Fórum' }, { key: 'tribunal', label: 'Tribunal (TJSP, TJES…)' },
  { key: 'perito', label: 'Seu nome' }, { key: 'crm', label: 'CRM (UF + nº)' }, { key: 'cpf', label: 'CPF' },
  { key: 'anos', label: 'Anos de experiência' }, { key: 'areas', label: 'Áreas de experiência' },
  { key: 'numeroAutos', label: 'Nº dos autos (pós-nomeação)' },
];
const inputCls = 'w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm';

export function EmailVaras() {
  const [d, setD] = useState<EmailData>(EMPTY_EMAIL);
  const [copied, setCopied] = useState('');
  const set = <K extends keyof EmailData>(k: K, v: EmailData[K]) => setD((x) => ({ ...x, [k]: v }));
  const assunto = useMemo(() => buildAssunto(d), [d]);
  const corpo = useMemo(() => buildEmail(d), [d]);

  const copiar = async (id: string, txt: string) => {
    await navigator.clipboard.writeText(txt);
    setCopied(id);
    setTimeout(() => setCopied(''), 1800);
  };
  const Btn = ({ id, txt }: { id: string; txt: string }) => (
    <button onClick={() => copiar(id, txt)} className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700">
      {copied === id ? <Check size={14} /> : <Copy size={14} />} {copied === id ? 'Copiado' : 'Copiar'}
    </button>
  );

  return (
    <section aria-labelledby="email-heading" className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h2 id="email-heading" className="font-bold text-lg">E-mails de Apresentação às Varas</h2>
        <label className="block text-xs font-semibold">Destinatário
          <select className={inputCls} value={d.destinatario} onChange={(e) => set('destinatario', e.target.value as Destinatario)}>
            <option value="juiz">Juiz</option>
            <option value="diretor">Diretor de secretaria</option>
            <option value="posNomeacao">Pós-nomeação (pedir mais perícias)</option>
          </select>
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          {FIELDS.map(({ key, label }) => (
            <label key={key} className="block text-xs font-semibold">{label}
              <input className={inputCls} value={d[key] as string} onChange={(e) => set(key, e.target.value)} />
            </label>
          ))}
        </div>
        <label className="block text-xs font-semibold">Sua apresentação (cursos, titulações, docência)
          <textarea rows={3} className={inputCls} value={d.apresentacao} onChange={(e) => set('apresentacao', e.target.value)} />
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={d.complemento} onChange={(e) => set('complemento', e.target.checked)} />
          Incluir frase de disponibilidade para sugestões (e-mail ao juiz)
        </label>
        <ul className="text-xs space-y-1 list-disc pl-4 opacity-80">
          {DICAS_ENVIO.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between"><h3 className="text-sm font-bold">Assunto</h3><Btn id="a" txt={assunto} /></div>
        <p className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-sm font-mono">{assunto}</p>
        <div className="flex items-center justify-between"><h3 className="text-sm font-bold">Corpo (serve também para WhatsApp)</h3><Btn id="c" txt={corpo} /></div>
        <pre className="whitespace-pre-wrap text-sm leading-relaxed rounded-xl border border-slate-200 dark:border-slate-800 p-4">{corpo}</pre>
      </div>
    </section>
  );
}
