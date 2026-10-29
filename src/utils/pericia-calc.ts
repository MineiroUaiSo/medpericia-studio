export interface SusepItem {
  id: string;
  category: 'membros_superiores' | 'membros_inferiores' | 'tronco_orgaos' | 'sentidos_cabeca';
  name: string;
  maxPercentage: number;
  description: string;
}

export type LossDegree = 'leve' | 'medio' | 'intenso' | 'total';

export const DEGREE_MULTIPLIERS: Record<LossDegree, { label: string; multiplier: number; desc: string }> = {
  leve: { label: 'Leve (25%)', multiplier: 0.25, desc: 'Permanece >75% da função' },
  medio: { label: 'Médio (50%)', multiplier: 0.50, desc: 'Permanece 50% a 75% da função (limitação pela metade)' },
  intenso: { label: 'Intenso / Grave (75%)', multiplier: 0.75, desc: 'Permanece 25% a 50% da função' },
  total: { label: 'Total (100%)', multiplier: 1.00, desc: 'Função residual <25% ou anquilose completa' },
};

export const SUSEP_TABLE: SusepItem[] = [
  // Membros Superiores
  { id: 'cotovelo_anquilose', category: 'membros_superiores', name: 'Anquilose total de um cotovelo', maxPercentage: 25, description: 'Perda total dos movimentos do cotovelo' },
  { id: 'ombro_anquilose', category: 'membros_superiores', name: 'Anquilose total de um ombro', maxPercentage: 25, description: 'Rigidez completa da articulação gleno-umeral' },
  { id: 'punho_anquilose', category: 'membros_superiores', name: 'Anquilose total de um punho', maxPercentage: 20, description: 'Rigidez radiocarpal total' },
  { id: 'membro_superior_total', category: 'membros_superiores', name: 'Perda total ou impotência funcional permanente de membro superior', maxPercentage: 70, description: 'Amputação ou perda motora completa' },
  { id: 'mao_total', category: 'membros_superiores', name: 'Perda total de uma das mãos', maxPercentage: 60, description: 'Desarticulação ou anquilose global' },
  { id: 'polegar_total', category: 'membros_superiores', name: 'Perda total de um polegar', maxPercentage: 25, description: 'Incluindo metacarpiano' },
  { id: 'indicador_total', category: 'membros_superiores', name: 'Perda total de um indicador', maxPercentage: 15, description: 'Dedo indicador completo' },
  { id: 'outros_dedos_total', category: 'membros_superiores', name: 'Perda total de qualquer outro dedo da mão', maxPercentage: 10, description: 'Médio, anelar ou mínimo' },

  // Membros Inferiores
  { id: 'quadril_anquilose', category: 'membros_inferiores', name: 'Anquilose total de um quadril', maxPercentage: 20, description: 'Rigidez coxo-femoral' },
  { id: 'joelho_anquilose', category: 'membros_inferiores', name: 'Anquilose total de um joelho', maxPercentage: 20, description: 'Rigidez fêmoro-tibial' },
  { id: 'tornozelo_anquilose', category: 'membros_inferiores', name: 'Anquilose total de um tornozelo', maxPercentage: 15, description: 'Rigidez tibiotársica' },
  { id: 'membro_inferior_total', category: 'membros_inferiores', name: 'Perda total ou impotência funcional de membro inferior', maxPercentage: 70, description: 'Amputação ou perda motora total' },
  { id: 'pe_total', category: 'membros_inferiores', name: 'Perda total de um dos pés', maxPercentage: 60, description: 'Desarticulação ou perda' },
  { id: 'halux_total', category: 'membros_inferiores', name: 'Perda total do hálux', maxPercentage: 10, description: 'Primeiro pododáctilo' },

  // Tronco e Órgãos
  { id: 'coluna_cervical', category: 'tronco_orgaos', name: 'Imobilidade do segmento cervical', maxPercentage: 20, description: 'Rigidez anquilosante cervical' },
  { id: 'coluna_toraco_lombar', category: 'tronco_orgaos', name: 'Imobilidade do segmento toraco-lombo-sacro', maxPercentage: 25, description: 'Rigidez da coluna toracolombar' },

  // Sentidos e Cabeça
  { id: 'visao_ambos', category: 'sentidos_cabeca', name: 'Perda total da visão de ambos os olhos', maxPercentage: 100, description: 'Cegueira bilateral completa' },
  { id: 'visao_um_olho', category: 'sentidos_cabeca', name: 'Perda total da visão de um olho', maxPercentage: 30, description: 'Cegueira monocular' },
  { id: 'audicao_ambos', category: 'sentidos_cabeca', name: 'Perda total da audição de ambos os ouvidos', maxPercentage: 40, description: 'Surdez bilateral' },
  { id: 'audicao_um_ouvido', category: 'sentidos_cabeca', name: 'Perda total da audição de um ouvido', maxPercentage: 20, description: 'Surdez unilateral' },
];

/**
 * Calcula a indenização/invalidez percentual pela Tabela SUSEP para uma lesão parcial ou total
 * Fórmula: % Tabela Integral * Multiplicador do Grau (25%, 50%, 75% ou 100%)
 */
export function calculateSusepLoss(itemId: string, degree: LossDegree): number {
  const item = SUSEP_TABLE.find((i) => i.id === itemId);
  if (!item) return 0;
  const multiplier = DEGREE_MULTIPLIERS[degree]?.multiplier ?? 0;
  return Number((item.maxPercentage * multiplier).toFixed(2));
}

/**
 * Regra de Balthazar (Capacidade Restante) para múltiplas sequelas:
 * Cada sequela subsequente incide sobre a capacidade física residual (100% - perdas anteriores acumuladas).
 */
export function calculateBalthazar(percentages: number[]): {
  totalPercentage: number;
  steps: { sequelaIndex: number; nominalPercentage: number; appliedOverRemaining: number; resultingLoss: number; remainingCapacity: number }[];
} {
  let remainingCapacity = 100;
  let totalAccumulated = 0;
  const steps: { sequelaIndex: number; nominalPercentage: number; appliedOverRemaining: number; resultingLoss: number; remainingCapacity: number }[] = [];

  for (let i = 0; i < percentages.length; i++) {
    const nominal = percentages[i];
    if (nominal <= 0) continue;

    const resultingLoss = (nominal / 100) * remainingCapacity;
    totalAccumulated += resultingLoss;
    remainingCapacity -= resultingLoss;

    steps.push({
      sequelaIndex: i + 1,
      nominalPercentage: nominal,
      appliedOverRemaining: Number((remainingCapacity + resultingLoss).toFixed(2)),
      resultingLoss: Number(resultingLoss.toFixed(2)),
      remainingCapacity: Number(remainingCapacity.toFixed(2)),
    });
  }

  return {
    totalPercentage: Number(totalAccumulated.toFixed(2)),
    steps,
  };
}

export interface SimoninCriterion {
  id: number;
  title: string;
  question: string;
  status: 'positivo' | 'negativo' | 'inconclusivo';
  justification: string;
}

export function evaluateSimoninNexity(criteria: SimoninCriterion[]): {
  status: 'pleno' | 'provavel' | 'possivel' | 'concausa' | 'improvavel' | 'sem_nexo';
  positiveCount: number;
  label: string;
  summaryText: string;
} {
  const positiveCount = criteria.filter((c) => c.status === 'positivo').length;
  const hasNegativeCausality = criteria.some((c) => [2, 3, 4].includes(c.id) && c.status === 'negativo');
  const failsIntegrityOnly = criteria.find((c) => c.id === 1)?.status === 'negativo' && positiveCount >= 4;

  if (positiveCount === 6) {
    return {
      status: 'pleno',
      positiveCount: 6,
      label: 'Nexo Causal Pleno / Certo',
      summaryText: 'Os 6 critérios de Simonin foram preenchidos de forma inequívoca. O evento traumático é a causa direta e exclusiva da lesão.',
    };
  }

  if (failsIntegrityOnly) {
    return {
      status: 'concausa',
      positiveCount,
      label: 'Concausalidade (Agravamento)',
      summaryText: 'O critério de integridade anterior falhou (condição preexistente), porém o trauma agravou ou desencadeou os sintomas incapacitantes.',
    };
  }

  if (hasNegativeCausality || positiveCount <= 2) {
    return {
      status: 'sem_nexo',
      positiveCount,
      label: 'Inexistência de Nexo Causal',
      summaryText: 'Incompatibilidade entre a natureza/energia do trauma e a lesão apresentada, ou ausência de encadeamento clínico temporal.',
    };
  }

  if (positiveCount >= 5) {
    return {
      status: 'provavel',
      positiveCount,
      label: 'Nexo Causal Provável (Alta Probabilidade)',
      summaryText: 'Apresenta 5 de 6 critérios positivos, indicando altíssima probabilidade de correlação etiopatogênica com o sinistro.',
    };
  }

  return {
    status: 'possivel',
    positiveCount,
    label: 'Nexo Possível com Limitações Probatórias',
    summaryText: 'Há plausibilidade biológica, porém com lacunas documentais ou temporais que impedem juízo categórico de certeza.',
  };
}
