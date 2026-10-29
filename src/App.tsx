import React, { useState } from 'react';
import {
  FileText,
  Calculator,
  ShieldCheck,
  Eye,
  BookOpen,
  Scale,
  Download,
  Copy,
  Check,
  Coins,
  HelpCircle,
  Briefcase,
  Layers,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { JoaoCaseViewer } from './components/JoaoCaseViewer';
import { SusepCalculator } from './components/SusepCalculator';
import { SimoninMatrix } from './components/SimoninMatrix';
import { WaddellValidator } from './components/WaddellValidator';
import { LegalGuide } from './components/LegalGuide';
import { HonorariosCalculator } from './components/HonorariosCalculator';
import { QuesitosBank } from './components/QuesitosBank';
import { ParecerGenerator } from './components/ParecerGenerator';
import { CaptacaoScripts } from './components/CaptacaoScripts';
import { AIAssistantModal } from './components/AIAssistantModal';
import { JOAO_DISCUSSAO_TEXT, JOAO_CONCLUSAO_TEXT } from './data/joaoCase';

type ActiveTab =
  | 'laudo'
  | 'susep'
  | 'simonin'
  | 'honorarios'
  | 'quesitos'
  | 'parecer'
  | 'waddell'
  | 'captacao'
  | 'legislacao';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('laudo');
  const [copiedAllHeader, setCopiedAllHeader] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleCopyAllHeader = () => {
    const full = `${JOAO_DISCUSSAO_TEXT}\n\n========================================\n\n${JOAO_CONCLUSAO_TEXT}`;
    navigator.clipboard.writeText(full);
    setCopiedAllHeader(true);
    setTimeout(() => setCopiedAllHeader(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const navItems = [
    { id: 'laudo', label: 'Laudo: João da Silva', icon: FileText, badge: 'Caso Ativo', group: 'pericia' },
    { id: 'susep', label: 'Tabela SUSEP & Balthazar', icon: Calculator, badge: '12,5%', group: 'pericia' },
    { id: 'simonin', label: 'Nexo Causal (Simonin)', icon: ShieldCheck, badge: '6/6 Pleno', group: 'pericia' },
    { id: 'honorarios', label: 'Proposta de Honorários', icon: Coins, badge: 'CPC 465', group: 'negocio' },
    { id: 'quesitos', label: 'Banco de Quesitos', icon: HelpCircle, badge: 'IFHFLIX', group: 'assistencia' },
    { id: 'parecer', label: 'Parecer do Assistente', icon: Layers, badge: 'Impugnação', group: 'assistencia' },
    { id: 'waddell', label: 'Validação & Waddell', icon: Eye, badge: 'Simulação', group: 'pericia' },
    { id: 'captacao', label: 'Captação & Tribunais', icon: Briefcase, badge: 'B2B', group: 'negocio' },
    { id: 'legislacao', label: 'Normas & Decisões STF', icon: BookOpen, badge: null, group: 'legislacao' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  MedPerícia Studio
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Acervo IFHFLIX &amp; CFM 2.430
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Plataforma Completa para Laudos Judiciais, Assistência Técnica e Negócios Periciais
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm transition-all"
              title="Abrir Assistente de IA Médico-Legal"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assistente IA</span>
            </button>
            <button
              type="button"
              onClick={handleCopyAllHeader}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
              title="Copiar Discussão e Conclusão formatadas"
            >
              {copiedAllHeader ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedAllHeader ? 'Copiado!' : 'Copiar Laudo'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
              title="Imprimir ou Salvar em PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-800/60 overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1 py-1.5" aria-label="Abas da Aplicação">
            {navItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                        isActive
                          ? 'bg-blue-700 text-blue-100'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'laudo' && <JoaoCaseViewer />}
        {activeTab === 'susep' && <SusepCalculator />}
        {activeTab === 'simonin' && <SimoninMatrix />}
        {activeTab === 'honorarios' && <HonorariosCalculator />}
        {activeTab === 'quesitos' && <QuesitosBank />}
        {activeTab === 'parecer' && <ParecerGenerator />}
        {activeTab === 'waddell' && <WaddellValidator />}
        {activeTab === 'captacao' && <CaptacaoScripts />}
        {activeTab === 'legislacao' && <LegalGuide />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-5 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-blue-500" />
            <span>
              <strong>MedPerícia Studio:</strong> Integrando as melhores práticas do Instituto Felipe Hurtado (IFHFLIX), Lei do Ato Médico (Lei 12.842/2013) e Resoluções CFM 2.430/2025 e 2.217/2018.
            </span>
          </div>
          <div>
            Desenvolvido para Peritos Judiciais e Médicos Assistentes Técnicos.
          </div>
        </div>
      </footer>

      {/* Modal do Assistente de IA */}
      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
