import React, { useState } from 'react';
import { Eye, ShieldAlert, Check, Copy, AlertOctagon } from 'lucide-react';

interface WaddellItem {
  id: number;
  name: string;
  description: string;
  howToTest: string;
  positive: boolean;
}

const INITIAL_WADDELL: WaddellItem[] = [
  {
    id: 1,
    name: '1. Sensibilidade Superficial Difusa',
    description: 'Dor desproporcional ao toque leve na pele ou dor que não respeita dermátomos.',
    howToTest: 'Pinçamento cutâneo leve ou toque suave provocando reação álgica extrema.',
    positive: false,
  },
  {
    id: 2,
    name: '2. Simulação (Testes Falsos)',
    description: 'Manobras que simulam sobrecarga mas não geram estresse mecânico real na articulação.',
    howToTest: 'Compressão axial no topo do crânio provocando dor lombar; rotação passiva em bloco de ombros e pelve.',
    positive: false,
  },
  {
    id: 3,
    name: '3. Distração',
    description: 'Sinal aparentemente positivo desaparece quando testado com o periciando distraído.',
    howToTest: 'Ex: Lasègue formal positivo a 30° em decúbito dorsal, mas periciando senta-se na maca com joelhos a 90° confortavelmente ao conversar.',
    positive: false,
  },
  {
    id: 4,
    name: '4. Distúrbios Regionais',
    description: 'Fraqueza em "roda denteada" (cogwheel) ou anestesia anatômica não explicável por raízes nervosas.',
    howToTest: 'Perda de força súbita e intermitente ("giving way") sem hipotrofia muscular compatível.',
    positive: false,
  },
  {
    id: 5,
    name: '5. Reação Exagerada',
    description: 'Verbalizações teatrais, suspiros, fácies de agonia e tremores desproporcionais ao estímulo.',
    howToTest: 'Avaliação da coerência global do padrão álgico demonstrado durante todo o ato pericial.',
    positive: false,
  },
];

export function WaddellValidator() {
  const [waddellList, setWaddellList] = useState<WaddellItem[]>(INITIAL_WADDELL);
  const [spontaneousObs, setSpontaneousObs] = useState<string>(
    'Durante a anamnese, o periciando retirou e colocou sua jaqueta com auxílio de ambos os membros, porém com nítida cautela ao estender o cotovelo direito. Não foram observadas incongruências com a limitação de arco de movimento relatada.'
  );
  const [copied, setCopied] = useState(false);

  const positiveCount = waddellList.filter((w) => w.positive).length;
  const isHighRiskNonOrganic = positiveCount >= 3;

  const toggleTest = (id: number) => {
    setWaddellList(
      waddellList.map((item) => (item.id === id ? { ...item, positive: !item.positive } : item))
    );
  };

  const generateReportText = () => {
    let out = `OBSERVAÇÃO COMPORTAMENTAL E SINAIS DE VALIDAÇÃO (WADDELL)\n\n`;
    out += `Aplicação dos testes de validação clínico-funcional de Waddell:\n`;
    waddellList.forEach((w) => {
      out += `- ${w.name}: ${w.positive ? 'POSITIVO (presente)' : 'NEGATIVO (ausente)'}.\n`;
    });
    out += `\nEscore de Waddell: ${positiveCount}/5 testes positivos. (${
      isHighRiskNonOrganic
        ? 'Indica componente comportamental ou não-orgânico relevante a ser ponderado.'
        : 'Quadro compatível com etiologia orgânica genuína, sem evidências de simulação ou exagero sintomático deliberado.'
    })\n\n`;
    out += `Observações de Comportamento Espontâneo:\n"${spontaneousObs}"`;
    return out;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
              <Eye className="w-3.5 h-3.5" />
              Sinais de Waddell & Validação Funcional
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Avaliação de Componente Não-Orgânico e Simulação</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Identificação objetiva de metasimulação (amplificação) sem juízos morais pejorativos, registrando inconsistências anatômicas de forma estritamente técnica.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 text-right min-w-[200px]">
            <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Escore de Waddell</span>
            <div
              className={`text-2xl font-black mt-1 ${
                isHighRiskNonOrganic ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {positiveCount} de 5 positivos
            </div>
            <span className="text-xs text-slate-400">
              {isHighRiskNonOrganic ? 'Componente não-orgânico' : 'Padrão orgânico congruente'}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Waddell Tests Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {waddellList.map((test) => (
          <div
            key={test.id}
            onClick={() => toggleTest(test.id)}
            className={`cursor-pointer rounded-2xl p-5 border transition-all text-left ${
              test.positive
                ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-400 dark:border-rose-800 ring-2 ring-rose-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{test.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{test.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold ${
                  test.positive
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'border-slate-300 dark:border-slate-700 text-transparent'
                }`}
              >
                ✓
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Como testar: </span>
              {test.howToTest}
            </div>
          </div>
        ))}

        {/* Additional Clinical Maneuvers Card */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
            <AlertOctagon className="w-4 h-4 text-amber-500" />
            Outras Manobras de Validação Clássicas
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
            <li>
              <strong>Teste de Hoover:</strong> Apoio sinérgico contralateral na paresia de membro inferior.
            </li>
            <li>
              <strong>Sinal de Mankopf:</strong> Aumento reflexo de frequência cardíaca (&gt;20%) à palpação de ponto verdadeiramente doloroso.
            </li>
            <li>
              <strong>Teste da Cegonha (Stork):</strong> Vertigem real apresenta oscilação sem viés direcional deliberado.
            </li>
          </ul>
        </div>
      </div>

      {/* Behavioral Observation Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <label htmlFor="waddell-spontaneous-obs" className="block text-xs font-bold uppercase text-slate-500">
          Observações de Comportamento Espontâneo (Entrada, Saída, Sentar, Manuseio de Objetos)
        </label>
        <textarea
          id="waddell-spontaneous-obs"
          rows={3}
          value={spontaneousObs}
          onChange={(e) => setSpontaneousObs(e.target.value)}
          className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans"
        />
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400 italic">
            O perito deve sempre registrar inconsistências de forma estritamente descritiva (Visum et Repertum), sem agressões verbais ou acusações.
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : 'Copiar Texto de Waddell'}
          </button>
        </div>
      </div>
    </div>
  );
}
