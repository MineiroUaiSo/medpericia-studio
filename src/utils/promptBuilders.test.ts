import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RAMO_IDS, MARCADOR_VAZIO } from '../data/ramos';
import { INSTRUCAO_DEDUCAO, buildViabilidadePrompt, buildLaudoDiscussaoPrompt } from './promptBuilders';
import { EMPTY_LAUDO } from './laudoBuilder';

const vazio = (ramoId: (typeof RAMO_IDS)[number]) => ({
  ramoId,
  profissao: '',
  relato: '',
  marcos: {},
  checklist: {},
  docsSummary: '',
});

test('viabilidade com tudo vazio: marcador, regra e nada do João/datas', () => {
  for (const id of RAMO_IDS) {
    const p = buildViabilidadePrompt(vazio(id));
    assert.ok(p.includes(INSTRUCAO_DEDUCAO), id);
    assert.ok(p.includes(MARCADOR_VAZIO), id);
    for (const s of ['10/01/2026', 'João', 'olécrano', 'Mecânico']) assert.ok(!p.includes(s), `${id} ${s}`);
    assert.ok(!/\d{2}\/\d{2}\/\d{4}/.test(p), id);
  }
});

test('previdenciário vazio: DII e DID, sem Sinistro', () => {
  const p = buildViabilidadePrompt(vazio('previdenciario'));
  assert.ok(p.includes('DII') && p.includes('DID'));
  assert.ok(!p.includes('Sinistro'));
});

test('DII informada aparece sem marcador na própria linha', () => {
  const p = buildViabilidadePrompt({ ...vazio('previdenciario'), marcos: { dii: '05/03/2026' } });
  const linha = p.split('\n').find((l) => l.startsWith('- DII'))!;
  assert.ok(linha.includes('05/03/2026'));
  assert.ok(!linha.includes(MARCADOR_VAZIO));
});

test('discussão do laudo com EMPTY_LAUDO: regra, marcador, sem datas', () => {
  const p = buildLaudoDiscussaoPrompt({ data: EMPTY_LAUDO, notas: 'x' });
  assert.ok(p.includes(INSTRUCAO_DEDUCAO));
  assert.ok(p.includes(MARCADOR_VAZIO));
  assert.ok(!/\d{2}\/\d{2}\/\d{4}/.test(p));
});
