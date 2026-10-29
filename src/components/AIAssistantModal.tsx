import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Settings,
  Bot,
  Check,
  AlertCircle,
  Copy,
  Loader2,
  X,
  KeyRound,
  Zap,
} from 'lucide-react';
import {
  callAI,
  getStoredAISettings,
  saveStoredAISettings,
  AVAILABLE_MODELS,
  SYSTEM_PROMPTS,
  AISettings,
} from '../services/aiService';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToLaudo?: (discussao: string, conclusao: string) => void;
}

export function AIAssistantModal({ isOpen, onClose, onApplyToLaudo }: AIAssistantModalProps) {
  const [activeTab, setActiveTab] = useState<'generate_laudo' | 'generate_quesitos' | 'settings'>('generate_laudo');
  const [settings, setSettings] = useState<AISettings>(getStoredAISettings());
  const [apiKeyInput, setApiKeyInput] = useState<string>(settings.apiKey);
  const [modelInput, setModelInput] = useState<string>(settings.model);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Generation state
  const [promptInput, setPromptInput] = useState<string>(
    `João da Silva, 45 anos. Sofreu acidente de carro (colisão traseira) em 10/01/2026. Bateu o cotovelo direito no painel. Prontuários antigos não mostram queixas no braço. No PS, raio-x mostrou fratura do olécrano. Fez cirurgia, mas consolidou mal.\nHoje, no exame físico, ele tem o cotovelo direito travado. A flexão e extensão estão pela metade (grau médio de perda funcional).\nEle quer indenização da seguradora dizendo que não pode mais trabalhar como mecânico.`
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const s = getStoredAISettings();
    setSettings(s);
    setApiKeyInput(s.apiKey);
    setModelInput(s.model);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    const updated: AISettings = {
      ...settings,
      apiKey: apiKeyInput,
      model: modelInput,
    };
    saveStoredAISettings(updated);
    setSettings(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleGenerate = async () => {
    if (!promptInput.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    setResultText('');

    try {
      let sysPrompt = SYSTEM_PROMPTS.laudoPericial;
      let isDeep = false;

      if (activeTab === 'generate_laudo') {
        sysPrompt = SYSTEM_PROMPTS.laudoPericial;
        isDeep = true; // Usa modelo profundo para laudo completo
      } else if (activeTab === 'generate_quesitos') {
        sysPrompt = SYSTEM_PROMPTS.quesitosEstrategicos;
        isDeep = false;
      }

      const response = await callAI(promptInput, sysPrompt, isDeep);
      setResultText(response);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Falha ao processar requisição com a IA.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Assistente de IA Médico-Legal
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {settings.model.split('/')[1] || settings.model}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Geração automatizada de Discussão, Simonin e Quesitos orientada pelas diretrizes IFHFLIX e CFM 2.430/2025
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'settings' ? 'generate_laudo' : 'settings')}
              className={`p-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
              }`}
              title="Configurações de Modelo e Chave"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Modelos &amp; Chaves</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        {activeTab !== 'settings' && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setActiveTab('generate_laudo')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'generate_laudo'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              Gerar Discussão &amp; Conclusão (Simonin + SUSEP)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('generate_quesitos')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'generate_quesitos'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              Gerar Quesitos Estratégicos com Holofotes
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'settings' ? (
            /* Settings View */
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Configuração de IA (OpenRouter / Gemini)
                </h4>
                <p className="text-xs text-slate-500">
                  Compatível com as chaves que você já possui em outros projetos (Assistente de Atendimento e Pediatria).
                </p>
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-500">
                  Chave de API (OpenRouter ou Gemini)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Sua chave fica armazenada exclusivamente no seu navegador (localStorage) para permitir que a página do GitHub Pages funcione perfeitamente de qualquer dispositivo.
                </p>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-500">
                  Modelo de LLM Recomendado
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {AVAILABLE_MODELS.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setModelInput(m.id)}
                      className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-start justify-between ${
                        modelInput === m.id
                          ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 ring-2 ring-purple-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          {m.name}
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {m.speed}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{m.recommendation}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border mt-0.5 text-[9px] font-bold ${
                          modelInput === m.id
                            ? 'bg-purple-600 border-purple-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 text-transparent'
                        }`}
                      >
                        ✓
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {isSaved ? 'Configurações salvas com sucesso!' : ''}
                </span>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Salvar Configurações
                </button>
              </div>
            </div>
          ) : (
            /* Prompt Input & Output View */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Notas Brutas do Caso (Histórico, Idade, Mecânica do Trauma, Prontuários e Exame Físico):
                </label>
                <textarea
                  rows={4}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Cole aqui o resumo do caso, dados da colisão, lesões e achados do exame clínico..."
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Bot className="w-4 h-4 text-purple-500" />
                  <span>
                    Executando com: <strong>{settings.model.split('/')[1] || settings.model}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleGenerate}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processando com IA...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Gerar com IA Agora
                    </>
                  )}
                </button>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Erro ao chamar a IA:</div>
                    <div>{errorMsg}</div>
                    <div className="mt-1 text-[11px] text-rose-600 dark:text-rose-300">
                      Verifique sua chave de API nas configurações ou selecione outro modelo.
                    </div>
                  </div>
                </div>
              )}

              {resultText && (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Resultado Gerado pela IA
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copiado!' : 'Copiar Texto'}
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    readOnly
                    value={resultText}
                    className="w-full p-4 rounded-xl bg-slate-900 text-slate-100 text-xs sm:text-sm font-mono leading-relaxed border border-slate-800 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
