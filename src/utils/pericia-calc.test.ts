import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSusepLoss,
  calculateBalthazar,
  evaluateSimoninNexity,
  SimoninCriterion,
} from './pericia-calc';
import { calculateHonorariosHours } from '../data/ifhflixKnowledge';

test('calculateSusepLoss calculates correctly for João da Silva elbow case (25% table * 50% medium loss = 12.5%)', () => {
  const result = calculateSusepLoss('cotovelo_anquilose', 'medio');
  assert.equal(result, 12.5);
});

test('calculateSusepLoss returns 25% for total anquilosis and 6.25% for mild loss', () => {
  assert.equal(calculateSusepLoss('cotovelo_anquilose', 'total'), 25);
  assert.equal(calculateSusepLoss('cotovelo_anquilose', 'leve'), 6.25);
  assert.equal(calculateSusepLoss('cotovelo_anquilose', 'intenso'), 18.75);
});

test('calculateBalthazar applies remaining capacity rule correctly', () => {
  // Example from textbook: 70%, 30%, 20%
  // 1st: 70% -> leaves 30%
  // 2nd: 30% of 30% = 9% -> leaves 21%
  // 3rd: 20% of 21% = 4.2% -> leaves 16.8%
  // Total = 70 + 9 + 4.2 = 83.2%
  const result = calculateBalthazar([70, 30, 20]);
  assert.equal(result.totalPercentage, 83.2);
  assert.equal(result.steps.length, 3);
  assert.equal(result.steps[0].resultingLoss, 70);
  assert.equal(result.steps[1].resultingLoss, 9);
  assert.equal(result.steps[2].resultingLoss, 4.2);
});

test('evaluateSimoninNexity identifies Pleno nexo causal when all 6 criteria are positive', () => {
  const criteria: SimoninCriterion[] = [
    { id: 1, title: 'Integridade anterior', question: '', status: 'positivo', justification: 'Prontuários limpos' },
    { id: 2, title: 'Natureza e sede do trauma', question: '', status: 'positivo', justification: 'Trauma direto no painel' },
    { id: 3, title: 'Adequação entre lesão e causa', question: '', status: 'positivo', justification: 'Desaceleração automobilística' },
    { id: 4, title: 'Encadeamento anátomo-clínico', question: '', status: 'positivo', justification: 'Atendimento imediato no PS' },
    { id: 5, title: 'Continuidade evolutiva', question: '', status: 'positivo', justification: 'Cirurgia e consolidação viciosa' },
    { id: 6, title: 'Exclusão de outras causas', question: '', status: 'positivo', justification: 'Sem outras afecções' },
  ];

  const evaluation = evaluateSimoninNexity(criteria);
  assert.equal(evaluation.status, 'pleno');
  assert.equal(evaluation.positiveCount, 6);
});

test('evaluateSimoninNexity detects concausalidade when integrity criterion fails', () => {
  const criteria: SimoninCriterion[] = [
    { id: 1, title: 'Integridade anterior', question: '', status: 'negativo', justification: 'Hérnia prévia assintomática' },
    { id: 2, title: 'Natureza e sede do trauma', question: '', status: 'positivo', justification: 'Trauma direto' },
    { id: 3, title: 'Adequação entre lesão e causa', question: '', status: 'positivo', justification: 'Carga pesada' },
    { id: 4, title: 'Encadeamento anátomo-clínico', question: '', status: 'positivo', justification: 'Dor imediata' },
    { id: 5, title: 'Continuidade evolutiva', question: '', status: 'positivo', justification: 'Tratamento fisioterápico' },
    { id: 6, title: 'Exclusão de outras causas', question: '', status: 'positivo', justification: 'Sem doenças inflamatórias' },
  ];

  const evaluation = evaluateSimoninNexity(criteria);
  assert.equal(evaluation.status, 'concausa');
});

test('calculateHonorariosHours calculates hours based on IFHFLIX rules (150 pages/h, 5 min/quesito)', () => {
  const config = {
    paginasProntuario: 300, // 300 / 150 = 2.0h
    quantidadeQuesitos: 12, // 12 * 5 / 60 = 1.0h
    horasExameClinico: 2,
    horasDiscussaoRedacao: 4,
    horasVistoria: 0,
    valorHora: 450,
    comarca: 'São Paulo/SP',
    vara: '1ª Vara Cível',
    numeroProcesso: '1000000-00.2026.8.26.0100',
    autorNome: 'João da Silva',
    reuNome: 'Seguradora Alfa',
    peritoNome: 'Dr. Perito',
    peritoCrm: '123456/SP',
    peritoEspecialidade: 'Medicina Legal e Perícias Médicas',
  };

  const result = calculateHonorariosHours(config);
  assert.equal(result.horasProntuario, 2.0);
  assert.equal(result.horasQuesitos, 1.0);
  assert.equal(result.totalHoras, 9.0); // 2 + 1 + 2 + 4 + 0 = 9.0h
  assert.equal(result.valorTotal, 4050); // 9.0 * 450 = 4050
});
