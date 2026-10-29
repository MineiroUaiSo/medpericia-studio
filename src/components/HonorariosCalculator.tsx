import React, { useState } from 'react';
import { useCaseId, caseKey, TEST_CASE_ID } from '../context/CaseContext';
import { usePersistedState } from '../hooks/usePersistedState';
import {
  HonorariosConfig,
  calculateHonorariosHours,
} from '../data/ifhflixKnowledge';
import {
  Calculator,
  Coins,
  FileText,
  Copy,
  Check,
  Clock,
  Sparkles,
  Info,
  Scale,
} from 'lucide-react';

const EXEMPLO_JOAO = {
  comarca: 'São Paulo/SP',
  vara: '3ª Vara Cível',
  numeroProcesso: '1004589-32.2026.8.26.0100',
  autorNome: 'João da Silva',
  reuNome: 'Seguradora Alfa S/A',
  peritoNome: 'Dr. Roberto Mendes',
  peritoCrm: '184.920/SP',
  peritoEspecialidade: 'Médico Perito Judicial e Assistente Técnico',
};

const nz = (v: string): string => v.trim() || '[NÃO INFORMADO]';

export function HonorariosCalculator() {
  const caseId = useCaseId();
  const isTest = caseId === TEST_CASE_ID;
  const [config, setConfig] = usePersistedState<HonorariosConfig>(caseKey(caseId, 'honorarios'), {
    paginasProntuario: 300,
    quantidadeQuesitos: 16,
    horasExameClinico: 2,
    horasDiscussaoRedacao: 4,
    horasVistoria: 0,
    valorHora: 450,
    comarca: '',
    vara: '',
    numeroProcesso: '',
    autorNome: '',
    reuNome: '',
    peritoNome: '',
    peritoCrm: '',
    peritoEspecialidade: '',
  });

  const [copied, setCopied] = useState(false);

  const result = calculateHonorariosHours(config);

  const generatePetitionText = () => {
    const escopo: string[] = [
      `Leitura, estudo minucioso e fichamento dos autos eletrônicos e prontuários médicos acostados (${config.paginasProntuario} páginas);`,
      `Realização do exame físico pericial objetivo com goniometria, manobras ortopédicas/neurológicas específicas e aplicação de protocolos de validação funcional;`,
      ...(config.horasVistoria > 0 ? ['Deslocamento e vistoria técnica ao posto de trabalho/local dos fatos;'] : []),
      `Análise do nexo causal etiopatogênico pelos critérios médico-legais consagrados (Critérios de Simonin);`,
      `Valoração médico-legal do dano corporal e/ou da incapacidade, conforme o objeto da perícia e a metodologia indicada pelo juízo;`,
      `Redação analítica da discussão e conclusão médico-legal;`,
      `Resposta fundamentada a cada um dos ${config.quantidadeQuesitos} quesitos apresentados pelas partes e pelo Juízo.`,
    ];
    return `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ${nz(config.vara).toUpperCase()} DA COMARCA DE ${nz(config.comarca).toUpperCase()}

Processo nº: ${nz(config.numeroProcesso)}
Autor(a): ${nz(config.autorNome)}
Réu(ré): ${nz(config.reuNome)}

${nz(config.peritoNome).toUpperCase()}, médico, inscrito no Conselho Regional de Medicina sob o nº ${nz(config.peritoCrm)}, ${nz(config.peritoEspecialidade)}, nomeado por este Douto Juízo para atuar como Perito Judicial nos autos em epígrafe, vem, respeitosamente, à presença de Vossa Excelência, em cumprimento ao r. despacho de nomeação, apresentar a presente:

PROPOSTA DE HONORÁRIOS PERICIAIS PROVISÓRIOS

1. DO ESCOPO DOS TRABALHOS PERICIAIS
Para a elaboração de laudo pericial médico consistente, fundamentado e em estrita consonância com os preceitos do art. 473 do Código de Processo Civil e da Resolução CFM nº 2.430/2025, faz-se necessária a execução das seguintes etapas técnico-procedimentais:

${escopo.map((t, i) => `${'abcdefgh'[i]}) ${t}`).join('\n')}

2. DO CÁLCULO ESTIMATIVO DE HORAS TÉCNICAS (PARÂMETROS DA DOUTRINA MÉDICO-LEGAL)
Adota-se a metodologia consagrada de discriminação de horas trabalhadas por complexidade de tarefa:

• Leitura e análise documental dos prontuários (${config.paginasProntuario} páginas — base doutrinária de 1h a cada 150 páginas): ${result.horasProntuario.toFixed(1)} horas;
• Exame físico pericial presencial, anamnese dirigida e registros fotográficos: ${result.horasExame.toFixed(1)} horas;
${config.horasVistoria > 0 ? `• Vistoria técnica in loco e deslocamento: ${result.horasVistoria.toFixed(1)} horas;\n` : ''}• Estudo da literatura médica, análise de nexo e redação da discussão/conclusão: ${result.horasRedacao.toFixed(1)} horas;
• Análise e resposta pormenorizada aos ${config.quantidadeQuesitos} quesitos das partes (média de 5 minutos por quesito): ${result.horasQuesitos.toFixed(1)} horas.

Total de horas técnicas estimadas: ${result.totalHoras.toFixed(1)} horas de trabalho especializado.

3. DA FIXAÇÃO DOS HONORÁRIOS
Considerando o valor da hora técnica pericial compatível com a responsabilidade profissional e a complexidade da lide (R$ ${config.valorHora.toFixed(2)}/hora):

${result.totalHoras.toFixed(1)} horas × R$ ${config.valorHora.toFixed(2)} = R$ ${result.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

4. DOS PEDIDOS
Diante do exposto, requer a Vossa Excelência:
a) O arbitramento dos honorários periciais provisórios no valor de R$ ${result.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })};
b) A intimação das partes para manifestação no prazo legal de 5 (cinco) dias;
c) A determinação do depósito prévio dos honorários periciais em conta vinculada a este Juízo, ressalvada eventual gratuidade de justiça a ser deliberada.

Termos em que,
Pede deferimento.

${nz(config.comarca)}, 2026.

_______________________________________
${nz(config.peritoNome)}
CRM ${nz(config.peritoCrm)} — Perito do Juízo`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePetitionText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
              <Coins className="w-3.5 h-3.5" />
              Metodologia de Precificação IFHFLIX / CPC Art. 465
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Calculadora de Honorários Periciais & Gerador de Proposta</h2>
            {isTest && <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300">Exemplo — caso fictício de teste</span>}
            {isTest && (
              <button type="button" onClick={() => setConfig({ ...config, ...EXEMPLO_JOAO })} className="ml-2 mt-1 px-2 py-0.5 rounded text-[10px] font-semibold border border-amber-300 text-amber-200">
                Carregar exemplo (João)
              </button>
            )}
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Fórmula científica de horas técnicas detalhadas: 1h a cada 150 páginas de prontuário e 5 minutos por quesito, gerando petição pronta e blindada contra impugnações.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 min-w-[220px] text-right">
            <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Honorários Estimados</span>
            <div className="text-3xl font-extrabold text-amber-400 mt-1">
              R$ {result.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-slate-400 font-mono">{result.totalHoras.toFixed(1)} horas × R$ {config.valorHora}/h</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Section */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">
              1. Parâmetros de Complexidade do Caso
            </h3>
          </div>

          {/* Páginas do Prontuário */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="paginas-prontuario" className="font-semibold text-slate-700 dark:text-slate-300">
                Páginas de Prontuários e Documentos
              </label>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {config.paginasProntuario} páginas ({result.horasProntuario.toFixed(1)}h)
              </span>
            </div>
            <input
              id="paginas-prontuario"
              type="range"
              min="0"
              max="2000"
              step="50"
              value={config.paginasProntuario}
              onChange={(e) => setConfig({ ...config, paginasProntuario: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>0 pág.</span>
              <span>Regra do curso: 1 hora a cada 150 páginas</span>
              <span>2.000 pág.</span>
            </div>
          </div>

          {/* Quantidade de Quesitos */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="quantidade-quesitos" className="font-semibold text-slate-700 dark:text-slate-300">
                Total de Quesitos (Partes + Juízo)
              </label>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {config.quantidadeQuesitos} quesitos ({result.horasQuesitos.toFixed(1)}h)
              </span>
            </div>
            <input
              id="quantidade-quesitos"
              type="range"
              min="2"
              max="60"
              step="2"
              value={config.quantidadeQuesitos}
              onChange={(e) => setConfig({ ...config, quantidadeQuesitos: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>2 quesitos</span>
              <span>Média de 5 minutos por quesito fundamentado</span>
              <span>60 quesitos</span>
            </div>
          </div>

          {/* Horas de Exame Físico */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="horas-exame" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Exame Presencial
              </label>
              <select
                id="horas-exame"
                value={config.horasExameClinico}
                onChange={(e) => setConfig({ ...config, horasExameClinico: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100"
              >
                <option value={1}>1.0 hora (Exame simples)</option>
                <option value={1.5}>1.5 horas (Padrão)</option>
                <option value={2}>2.0 horas (Ortopédico amplo)</option>
                <option value={3}>3.0 horas (Politrauma)</option>
              </select>
            </div>

            <div>
              <label htmlFor="horas-redacao" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Redação do Laudo
              </label>
              <select
                id="horas-redacao"
                value={config.horasDiscussaoRedacao}
                onChange={(e) => setConfig({ ...config, horasDiscussaoRedacao: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100"
              >
                <option value={2}>2.0 horas (Direto)</option>
                <option value={3}>3.0 horas (Intermediário)</option>
                <option value={4}>4.0 horas (Padrão ouro)</option>
                <option value={6}>6.0 horas (Erro médico/Complexo)</option>
              </select>
            </div>
          </div>

          {/* Vistoria e Valor Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="horas-vistoria" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vistoria / Deslocamento
              </label>
              <select
                id="horas-vistoria"
                value={config.horasVistoria}
                onChange={(e) => setConfig({ ...config, horasVistoria: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100"
              >
                <option value={0}>Sem vistoria (Clínica/Consultório)</option>
                <option value={2}>2.0 horas (Vistoria local)</option>
                <option value={4}>4.0 horas (Posto fabril + viagem)</option>
              </select>
            </div>

            <div>
              <label htmlFor="valor-hora" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Valor da Hora Técnica
              </label>
              <select
                id="valor-hora"
                value={config.valorHora}
                onChange={(e) => setConfig({ ...config, valorHora: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100"
              >
                <option value={350}>R$ 350,00/h (Básico / Interior)</option>
                <option value={450}>R$ 450,00/h (Recomendado IFH)</option>
                <option value={550}>R$ 550,00/h (Alta complexidade)</option>
                <option value={650}>R$ 650,00/h (Erro médico / Capitais)</option>
              </select>
            </div>
          </div>

          {/* Resumo visual em cards */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[11px]">
              Tabela de Horas por Atividade:
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
              <div>• Leitura documental: {result.horasProntuario.toFixed(1)}h</div>
              <div>• Exame clínico: {result.horasExame.toFixed(1)}h</div>
              <div>• Resposta a quesitos: {result.horasQuesitos.toFixed(1)}h</div>
              <div>• Redação e discussão: {result.horasRedacao.toFixed(1)}h</div>
              {config.horasVistoria > 0 && <div>• Vistoria: {result.horasVistoria.toFixed(1)}h</div>}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-slate-900 dark:text-slate-100">
              <span>Total Estimado:</span>
              <span className="text-amber-600 dark:text-amber-400">{result.totalHoras.toFixed(1)} horas</span>
            </div>
          </div>
        </div>

        {/* Generated Petition Output */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Petição de Proposta de Honorários (Pronta para Protocolo)
              </h3>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Petição Copiada!' : 'Copiar Petição'}
            </button>
          </div>

          <label htmlFor="honorarios-petition-output" className="sr-only">Texto da Petição de Honorários</label>
          <textarea
            id="honorarios-petition-output"
            rows={17}
            readOnly
            value={generatePetitionText()}
            className="w-full text-xs p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none font-mono leading-relaxed"
          />

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Dica prática do IFHFLIX:</strong> Ao discriminar detalhadamente as horas e tarefas, o perito agrega valor e demonstra trabalho hercúleo antes de revelar o preço, reduzindo as impugnações e evitando arbitramentos depreciativos pelo magistrado.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
