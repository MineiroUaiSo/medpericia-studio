export interface AISettings {
  provider: 'openrouter' | 'gemini';
  apiKey: string;
  model: string;
  modelDeep: string;
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  provider: 'openrouter',
  apiKey: (import.meta as any).env?.VITE_AI_API_KEY || '',
  model: 'google/gemini-2.5-flash-lite',
  modelDeep: 'xiaomi/mimo-v2.5',
};

const STORAGE_KEY = 'medpericia_ai_settings';

export function getStoredAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_AI_SETTINGS, ...parsed };
    }
  } catch {
    // fallback
  }
  return DEFAULT_AI_SETTINGS;
}

export function saveStoredAISettings(settings: AISettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Falha ao salvar configurações de IA:', err);
  }
}

export const AVAILABLE_MODELS = [
  {
    id: 'google/gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite (OpenRouter)',
    provider: 'openrouter',
    speed: 'Ultra Rápido (~1-2s)',
    cost: 'Econômico',
    recommendation: 'Ideal para quesitos rápidos, triagem e cálculo',
  },
  {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash (OpenRouter)',
    provider: 'openrouter',
    speed: 'Rápido (~3-4s)',
    cost: 'Balanceado',
    recommendation: 'Excelente para discussão completa e Simonin',
  },
  {
    id: 'xiaomi/mimo-v2.5',
    name: 'Xiaomi MiMo v2.5 (OpenRouter)',
    provider: 'openrouter',
    speed: 'Rápido (~3s)',
    cost: 'Muito Barato ($0.14/1M)',
    recommendation: 'Modelo preferido do acervo IFHFLIX para textos médico-legais extensos',
  },
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3 / Chat (OpenRouter)',
    provider: 'openrouter',
    speed: 'Médio (~4-6s)',
    cost: 'Econômico',
    recommendation: 'Raciocínio lógico afiado para impugnações',
  },
];

export async function callAI(
  prompt: string,
  systemPrompt: string,
  isDeep: boolean = false
): Promise<string> {
  const settings = getStoredAISettings();
  const modelToUse = isDeep ? settings.modelDeep : settings.model;

  if (settings.provider === 'openrouter') {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey.trim()}`,
        'HTTP-Referer': 'https://github.com/MineiroUaiSo/medpericia-studio',
        'X-Title': 'MedPerícia Studio',
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2, // Baixa temperatura para precisão médico-legal e fidelidade normativa
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erro na API OpenRouter (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Nenhuma resposta gerada.';
  } else {
    // Provedor Gemini Direto
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settings.apiKey.trim()}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }],
        generationConfig: { temperature: 0.2 },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erro na API Gemini (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text || 'Nenhuma resposta gerada.'
    );
  }
}

const REGRA_DADOS = `REGRA DE DADOS (OBRIGATÓRIA): use só o que consta nos documentos anexados, no relato e nos campos preenchidos. Campo vazio ou marcado [NÃO INFORMADO — deduzir dos documentos] = deduzir dos documentos, citando o trecho de origem e marcando "[INFERIDO – confirmar]". Sem base: "[NÃO INFORMADO]" e listar em "DADOS FALTANTES E IMPACTO" o que falta e o que deixa de poder ser avaliado. Nunca invente data, CID, valor, percentual ou norma.`;

export const SYSTEM_PROMPTS = {
  laudoPericial: `Você é um Médico Perito Judicial e Professor de Medicina Legal de elite, formado na metodologia do Instituto Felipe Hurtado (IFHFLIX), rigoroso com a Resolução CFM nº 2.430/2025 e o Código de Processo Civil (art. 473).

DIRETRIZES FUNDAMENTAIS OBRIGATÓRIAS:
1. TERMINOLOGIA OBRIGATÓRIA: NUNCA use a palavra "paciente". Use SEMPRE "periciando" (ou "periciado").
2. NEXO CAUSAL (SIMONIN): Analise explicitamente os 6 critérios de Camille Simonin (1. Integridade anterior, 2. Natureza e sede do trauma, 3. Adequação causa-lesão, 4. Encadeamento anátomo-clínico temporal, 5. Continuidade evolutiva, 6. Exclusão de outras causas).
3. VALORAÇÃO CONFORME O RAMO: siga o bloco CONTEXTO DO RAMO enviado na mensagem. Tabela SUSEP só quando o contexto indicar; nunca use SUSEP para valorar incapacidade laboral. Sem contexto de ramo, não presuma o ramo: declare a lacuna.
4. PROFISSIOGRAFIA: Diferencie claramente incapacidade para a atividade habitual (específica) de incapacidade omniprofissional para todo e qualquer trabalho.
5. DEONTOLOGIA MÉDICA: Nunca acuse cirurgiões anteriores de "erro médico" sem que isso seja objeto expressamente delimitado pelo juízo.
6. Estruture a saída com "4. DISCUSSÃO MÉDICO-LEGAL" e "5. CONCLUSÃO MÉDICO-LEGAL".

${REGRA_DADOS}`,

  quesitosEstrategicos: `Você é um Médico Assistente Técnico experiente treinado pelo IFHFLIX. Formule um rol de quesitos estratégicos com a técnica de "holofotes".
- Quesitos que obriguem o perito judicial a realizar testes físicos específicos e registrar goniometria em graus.
- Não faça perguntas retóricas ou genéricas ("O autor tem dor?").
- Formule perguntas técnicas que comprovem ou afastem o nexo, a data de início da incapacidade (DII) e o grau de redução funcional.

${REGRA_DADOS}`,

  parecerAssistente: `Você é um Médico Assistente Técnico elaborando um Parecer Médico-Legal crítico a um laudo judicial.
- Aponte detalhadamente os vícios de forma à luz do art. 473 do CPC (ausência de método científico, exame físico superficial, respostas evasivas, contradição entre discussão e conclusão).
- Mantenha tom polido e estritamente técnico-científico, sem agressão pessoal ao perito do juízo.
- Formule quesitos suplementares e de esclarecimento pontuais.

${REGRA_DADOS}`,

  analiseViabilidade: `Você é um Médico Assistente Técnico sênior do Instituto Felipe Hurtado (IFHFLIX).
Sua missão é realizar uma ANÁLISE PRÉVIA DE VIABILIDADE TÉCNICA E DOCUMENTAL de um caso médico-pericial para um advogado parceiro, com base nas informações e documentos enviados.

ESTRUTURA OBRIGATÓRIA DA RESPOSTA:
1. DIAGNÓSTICO E ROBUSTEZ PROBATÓRIA: As lesões estão documentalmente comprovadas por exames de imagem contemporâneos e prontuários fidedignos, ou dependem apenas de queixa subjetiva?
2. NEXO CAUSAL PRELIMINAR (SIMONIN): Há compatibilidade mecânica e temporal entre o evento narrado e as lesões?
3. RISCOS E ARMADILHAS PROCESSUAIS: Aponte as teses que a parte adversa indicada no CONTEXTO DO RAMO usará (ex.: doença degenerativa, concausa, hiato temporal sem atendimento, DII sem documento).
4. VALORAÇÃO PROVÁVEL CONFORME O RAMO: securitário → enquadramento SUSEP e percentual; cível → danos temporários e permanentes; trabalhista → dano e incapacidade separados; previdenciário → existência, início (DII) e tipo de incapacidade, sem SUSEP; erro médico → conduta × boas práticas e dano.
5. VEREDITO DE VIABILIDADE E RECOMENDAÇÃO PRÁTICA AO ADVOGADO:
   - [VIÁVEL / VIÁVEL COM RESSALVAS / INVIÁVEL]
   - Passo a passo dos documentos ou exames complementares que o advogado DEVE providenciar antes de distribuir a petição inicial.
6. Nomenclatura rigorosa: use sempre "periciando", nunca "paciente".
7. DOCUMENTOS: use APENAS o markdown extraído. Nunca invente conteúdo de arquivos listados como não extraídos (scan/manuscrito/imagem). Liste esses arquivos e peça transcrição.

${REGRA_DADOS}`
};
