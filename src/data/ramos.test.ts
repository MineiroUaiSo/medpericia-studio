import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RAMOS, RAMO_IDS, MARCADOR_VAZIO, buildRamoPromptBlock, getRamo } from './ramos';

test('cada ramo tem campos e checklist', () => {
  for (const id of RAMO_IDS) {
    assert.ok(RAMOS[id].campos.length >= 1, id);
    assert.ok(RAMOS[id].checklist.length >= 1, id);
  }
});

test('chaves de campo únicas por ramo', () => {
  for (const id of RAMO_IDS) {
    const keys = RAMOS[id].campos.map((c) => c.key);
    assert.equal(new Set(keys).size, keys.length, id);
  }
});

test('previdenciario tem did/dii/especie, sem dataSinistro, sem SUSEP', () => {
  const keys = RAMOS.previdenciario.campos.map((c) => c.key);
  for (const k of ['did', 'dii', 'especie']) assert.ok(keys.includes(k), k);
  assert.ok(!keys.includes('dataSinistro'));
  assert.equal(RAMOS.previdenciario.usaSusep, 'nao');
});

test('bloco do ramo usa valor informado', () => {
  const b = buildRamoPromptBlock('previdenciario', { dii: '01/02/2026' });
  assert.ok(b.includes('DII'));
  assert.ok(b.includes('01/02/2026'));
  assert.ok(b.includes(MARCADOR_VAZIO));
});

test('bloco vazio marca todas as linhas e não traz datas', () => {
  const b = buildRamoPromptBlock('previdenciario', {});
  const linhas = b.split('\n').filter((l) => l.startsWith('- '));
  assert.equal(linhas.length, RAMOS.previdenciario.campos.length);
  for (const l of linhas) assert.ok(l.includes(MARCADOR_VAZIO), l);
  assert.ok(!/\d{2}\/\d{2}\/\d{4}/.test(b));
});

test('espaços contam como vazio', () => {
  const b = buildRamoPromptBlock('trabalhista', { dataEvento: '   ' });
  const l = b.split('\n').find((x) => x.includes('Data do acidente'))!;
  assert.ok(l.includes(MARCADOR_VAZIO));
});

test('getRamo fallback', () => {
  assert.equal(getRamo('xyz').id, 'securitario');
});
