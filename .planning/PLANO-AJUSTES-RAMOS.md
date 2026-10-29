# PLANO — Campos por ramo + marcação de EXEMPLO

Data: 2026-10-29 · Autor: planejador (Opus) · Status: **regra R1 aprovada; aguardando decisões D1–D5, D7–D11 do médico; tarefas T1, T1b, T2–T9 prontas para execução**
Base: HEAD `1306ebf` (árvore limpa no momento da auditoria).

Legenda de fonte:
- `[IFH aula X #trecho]` = confirmado no acervo `~/ifhflix-transcricoes` (kb/buscar.py).
- `INFERÊNCIA` = conhecimento geral, **não** confirmado no acervo → validar com o médico.
- `LACUNA` = o acervo não cobre; não inventar, deixar texto livre/opção "Outro".

---

## 0. Contexto técnico que todo executor precisa saber

- Stack: Vite + React + TS. Validação de tipos: `npm run lint` (= `tsc --noEmit`). Testes: `node --test` via `tsx` (`npx tsx --test <arquivo>.test.ts`). O script `npm test` hoje só roda `src/utils/pericia-calc.test.ts`.
- `App.tsx:219` monta `<CaseProvider id={caseId} key={`${caseId}-${resetN}`}>` → **trocar de caso remonta as abas**. Componentes que usam `useState` com defaults do João (Viabilidade, Parecer, Simonin, Waddell, Susep, Honorários) **reaparecem com dados do João em qualquer caso novo**.
- Caso de teste: `TEST_CASE_ID = 'teste'` em `src/context/CaseContext.tsx`; `useCaseId()` devolve o id ativo. Persistência por caso: `usePersistedState(caseKey(caseId, 'campo'), default)` (padrão já usado em `LaudoJudicialGenerator.tsx`).
- Não existe teste de componente (sem RTL/jsdom). Validação de UI = navegador (`npm run dev`, porta 3000).

---

## 0.1 Regra R1 — "campo em branco = deduzir dos documentos, sem inventar" (APROVADA pelo médico)

Vale para todos os campos e todos os ramos (viabilidade, laudo, parecer, `SYSTEM_PROMPTS`).
1. Campo vazio = "não sei / deduzir dos documentos". **Nenhum campo de entrada vem pré-preenchido com dado do caso de teste** (ex.: hoje `ViabilidadeAnalyzer.tsx:25` começa com `'10/01/2026'`), em nenhum caso, inclusive o caso teste.
2. A IA só deduz um valor quando ele consta nos documentos anexados ou no relato, e cita o trecho de origem.
3. Valor deduzido sai na nota como `[INFERIDO – confirmar]` + trecho entre aspas.
4. Sem base → `[NÃO INFORMADO]`, e a nota lista o que falta e o impacto (ex.: sem DII não dá para fixar início da incapacidade nem avaliar consequências que dependem dela). Nunca inventar data, CID, valor ou norma.

Marcadores literais (usar exatamente, em código, prompt e teste):
- `MARCADOR_VAZIO = '[NÃO INFORMADO — deduzir dos documentos]'` (no prompt enviado à IA)
- `[INFERIDO – confirmar]` e `[NÃO INFORMADO]` (na saída da IA)

Tarefas que implementam R1: **T1** (marcador no bloco do ramo), **T1b** (builders puros + teste com campos vazios), **T2/T7** (estado inicial vazio), **T4** (regra no `SYSTEM_PROMPTS`), **T3/T5** (usar builders), **T7** (parecer com `[NÃO INFORMADO]` no template), **T9** (verificação no navegador).

---

## (a) Tabela de achados

| # | Arquivo:linha | Problema | Sev. | Correção (tarefa) |
|---|---|---|---|---|
| A1 | `src/components/ViabilidadeAnalyzer.tsx:206-217` | Rótulo fixo "Data do Sinistro / Início" para **todos** os ramos. Em previdenciário o marco é DID/DII/DER/DCB e espécie do benefício; em trabalhista é tipo de acidente/doença + CAT; em erro médico é a data do ato. | ALTA | Campos dinâmicos por ramo (T1, T3) |
| A2 | `ViabilidadeAnalyzer.tsx:104` | Prompt envia "Data do Evento/Sinistro" independentemente do ramo → IA raciocina como sinistro. | ALTA | T3 |
| A3 | `ViabilidadeAnalyzer.tsx:44-56` | Nota Técnica do João (acidente 10/01/2026, 85%) é estado inicial do resultado, sem nenhuma marcação de exemplo; botão "Copiar Nota Técnica" copia o exemplo como se fosse real. | ALTA | T2 |
| A4 | `ViabilidadeAnalyzer.tsx:42-43, 157-173` | Cabeçalho exibe "85% Viabilidade / Alta Probabilidade de Êxito" antes de qualquer análise. | ALTA | T2 |
| A5 | `ViabilidadeAnalyzer.tsx:394-413` | Badges "Compatível (Simonin)", "Estimativa SUSEP 12,5% (Médio)", "Ajuizar c/ Provas" são **hardcoded** e continuam na tela depois de uma análise real da IA e em qualquer ramo (inclusive previdenciário). Parecem resultado. | ALTA | T2 (exemplo) + T3 (SUSEP só se ramo usa) |
| A6 | `ViabilidadeAnalyzer.tsx:23-37` | Estado em `useState` com defaults do João, não persistido por caso → caso novo abre com João preenchido. | ALTA | T2 |
| A7 | `ViabilidadeAnalyzer.tsx:318-325` | Checklist probatório fixo: BO aparece em doença ocupacional/previdenciário; "Laudo SABI" aparece em securitário; falta CAT (trabalhista) e atestados de afastamento/prontuário contemporâneo à DII (previdenciário). | MÉDIA | T1 (checklist no config) + T3 |
| A8 | `ViabilidadeAnalyzer.tsx:121-128` | Score heurístico ignora ramo (CTPS soma +10 em DPVAT; BO/SABI não contam). Não é saída da IA, mas é exibido como "Viabilidade". | MÉDIA | T3 (pesos no config) + T2 (rótulo "heurístico documental") |
| A9 | `ViabilidadeAnalyzer.tsx:170-172` | Status `'baixa'` exibe "Viável com Ressalvas" (bug de texto). | BAIXA | T2 |
| A10 | `src/services/aiService.ts:137` (`laudoPericial` item 3) | Obriga valoração pela Tabela SUSEP em todo laudo. O curso: "só não pode valorar incapacidade laboral através de SUSEP" `[IFH aula 8662126 #8085]`; em previdenciário o objeto é incapacidade. | ALTA | T4 |
| A11 | `aiService.ts:139` (`laudoPericial` item 5) | Vazamento do caso João no prompt de sistema: "classifique consolidação viciosa como intercorrência inerente à severidade da fratura articular" — enviesa todo laudo. | ALTA | T4 |
| A12 | `aiService.ts:153-163` (`analiseViabilidade` itens 3-4) | Item 4 fixo "TABELA SUSEP/DPVAT"; item 3 fala só em "seguradora/empresa" (adverso em previdenciário é o INSS). | ALTA | T4 |
| A13 | `src/utils/laudoBuilder.ts:3-30, 106` | `LaudoData` não tem ramo nem marcos (DID/DII/espécie/CAT/data do evento); item 4.3 fixa "valoração do dano — SUSEP" para cível, trabalhista e federal. | MÉDIA | T5 |
| A14 | `laudoBuilder.ts:43` | Esfera "Previdenciário/Federal" → acidentário (B91/B94) costuma tramitar na Justiça Estadual (INFERÊNCIA, CF art. 109, I — validar). | MÉDIA | D4, T5 |
| A15 | `src/components/LaudoJudicialGenerator.tsx:48-60` | Prompt de Discussão/Conclusão não recebe o ramo nem os marcos temporais. | MÉDIA | T5 |
| A16 | `src/components/SusepCalculator.tsx:20-27, 78-80` | Cabeçalho "Caso João da Silva 12,50%" fixo, sem marca de exemplo, em qualquer caso. | MÉDIA | T6 (badge), T7 (vazio fora do teste) |
| A17 | `src/components/SimoninMatrix.tsx:5-48` | Justificativas do João (10/01/2026, olécrano) como estado inicial em qualquer caso. | MÉDIA | T6, T7 |
| A18 | `src/components/WaddellValidator.tsx:52-54` | Observação espontânea do João como default em qualquer caso. | MÉDIA | T6, T7 |
| A19 | `src/components/ParecerGenerator.tsx:64-69` | Objeto de divergência e quesitos do João (cotovelo, 25%→50%) como default. | MÉDIA | T6, T7 |
| A20 | `src/components/HonorariosCalculator.tsx:19-34` | Defaults fictícios (processo `1004589-32.2026.8.26.0100`, "Dr. Roberto Mendes CRM 184.920/SP", "Seguradora Alfa") entram na proposta copiada. | MÉDIA | T6, T7 |
| A21 | `HonorariosCalculator.tsx:57` | Escopo da proposta sempre cita "Tabela SUSEP/DPVAT", também em previdenciário/trabalhista. | MÉDIA | T8 |
| A22 | `HonorariosCalculator.tsx:56` | Com `horasVistoria > 0` saem duas alíneas "c)". | BAIXA | T8 |
| A23 | `src/App.tsx:99` | Aba SUSEP tem badge fixo "12,5%" (número do João) em todos os casos. | BAIXA | T6 |
| A24 | `aiService.ts:132`, `HonorariosCalculator.tsx:52` (e laudo) | Citam "Resolução CFM nº 2.430/2025" e "Lei nº 11.945/2009": **não localizadas no acervo** (busca `11.945` e `CFM 2.430` sem hit). Não é erro comprovado. | INFO | D7 (médico confirma; nenhuma tarefa altera) |
| A25 | `src/data/ifhflixKnowledge.ts:118-138`, `QuesitosBank.tsx:88-93` | Quesitos já separados por área e previdenciário já usa DID/DII — **OK**. Única ressalva: `QuesitosBank.tsx:8` pré-seleciona `sec-1, sec-2, ast-1` em qualquer caso. | BAIXA | T7 (opcional) |

---

## (b) Modelo de dados proposto — `src/data/ramos.ts` (fonte única)

Consumidores: Viabilidade (campos, checklist, score, badge SUSEP, prompt), LaudoJudicialGenerator/laudoBuilder (bloco de marcos, 4.3, esfera sugerida), aiService (bloco de contexto do ramo), Honorários (alínea de valoração).

```ts
// src/data/ramos.ts
import type { Esfera } from '../utils/laudoBuilder';

export type RamoId = 'securitario' | 'civel_dano' | 'trabalhista' | 'previdenciario' | 'erro_medico';

export type TipoCampo = 'data' | 'texto' | 'select';

export interface CampoRamo {
  key: string;            // chave estável (persistida)
  label: string;          // rótulo exibido
  tipo: TipoCampo;
  opcoes?: readonly string[];
  ajuda?: string;         // texto curto sob o campo
  fonte?: string;         // ex.: 'IFH aula 8662081' | 'INFERÊNCIA' | 'LACUNA'
}

export interface ChecklistItem { key: string; label: string; peso: number; }

export type Valoracao = 'susep' | 'incapacidade' | 'dano_corporal' | 'conduta';

export interface RamoConfig {
  id: RamoId;
  label: string;
  esferaSugerida: Esfera;              // só sugestão; usuário pode trocar (D4)
  adverso: string;                     // "seguradora", "reclamada", "INSS", "réu (médico/hospital)"
  campos: readonly CampoRamo[];
  checklist: readonly ChecklistItem[];
  valoracao: readonly Valoracao[];     // primeira = principal
  usaSusep: 'principal' | 'opcional' | 'nao';
  contextoIA: string;                  // bloco injetado nos prompts
}

export const RAMOS: Record<RamoId, RamoConfig>;
export const RAMO_IDS: readonly RamoId[];
export function getRamo(id: string): RamoConfig;           // fallback 'securitario'
export function buildRamoPromptBlock(id: RamoId, valores: Record<string, string>): string;
```

### Conteúdo por ramo (o executor de T1 copia exatamente)

**securitario** — label "Securitário (DPVAT / seguro de pessoas)"; esfera `civel`; adverso "seguradora"; usaSusep `principal`; valoração `['susep','dano_corporal']`.
- campos: `dataSinistro` "Data do sinistro (acidente)" data · `tipoSeguro` "Tipo de seguro" select [`DPVAT`, `Seguro privado (AP/vida)`, `Outro`] fonte LACUNA (D8) · `dataConsolidacao` "Data da consolidação / alta (se houver)" data, ajuda "Período de danos temporários vai do evento à consolidação" fonte `IFH 8741227 (areas-de-atuacao.md, 'data da consolidação médico-legal')`.
- checklist (peso): prontuarioUrgencia "Prontuário de PS imediato" 15 · laudoImagem "Laudo de imagem (RX/TC/RNM)" 15 · relatorioCirurgico "Ficha / relatório cirúrgico" 10 · boletimOcorrencia "Boletim de Ocorrência (BO)" 10.
- contextoIA: "RAMO: securitário. Marco temporal: data do sinistro. Valoração: enquadramento na tabela SUSEP do segmento afetado, com grau de perda. Parte adversa: seguradora."

**civel_dano** (D3) — label "Cível — dano corporal (responsabilidade civil)"; esfera `civel`; adverso "réu"; usaSusep `opcional`; valoração `['dano_corporal','susep']`.
- campos: `dataEvento` "Data do evento" data · `dataConsolidacao` "Data da consolidação médico-legal" data (fonte `IFH 8741227`).
- checklist: prontuarioUrgencia 15 · laudoImagem 15 · relatorioCirurgico 10 · boletimOcorrencia 10.
- contextoIA: "RAMO: cível/dano corporal. Marcos: data do evento e data da consolidação. Valorar danos temporários (déficit, repercussão profissional, quantum doloris) e permanentes (déficit funcional, dano estético) [IFH ebook TEPEM v2 p.98; método AIPE]. Tabela SUSEP só se o juízo pedir; nunca para incapacidade laboral."

**trabalhista** — label "Trabalhista / ocupacional"; esfera `trabalhista`; adverso "reclamada (empregador)"; usaSusep `opcional` (D9); valoração `['dano_corporal','incapacidade']`.
- campos: `tipoEvento` "Tipo de evento" select [`Acidente típico`, `Acidente de trajeto`, `Doença profissional`, `Doença do trabalho`] fonte `IFH aula 8662079 #17151; ebook TEPEM v2 p.57 #9573` · `dataEvento` "Data do acidente / do diagnóstico da doença" data, ajuda "Acidente: data do evento. Doença: data do diagnóstico ou do início dos sintomas (DID)" · `cat` "CAT emitida?" select [`Sim`, `Não`, `Não sabe`], ajuda "CAT pode ser emitida também pelo próprio trabalhador, sindicato ou serviço de saúde" fonte `IFH aula 8662079 #17156` · `funcao` "Função / posto de trabalho" texto · `beneficioINSS` "Recebeu benefício do INSS? (espécie)" select [`Não`, `B31`, `B91`, `Outro`] fonte `IFH aula 8662124 #7850`.
- checklist: cat "CAT" 15 · carteiraTrabalho "CTPS / descrição da função" 10 · aso "ASOs (admissional/periódicos)" 10 (fonte `IFH aula 8662131 #8624`) · prontuarioUrgencia "Prontuário / atendimento contemporâneo" 15 · laudoImagem 10 · laudoINSS "Laudo/benefício INSS (SABI)" 5.
- contextoIA: "RAMO: trabalhista. Classificar o evento (típico, trajeto, doença profissional ou do trabalho). Nexo: Simonin para trauma; para doença considerar concausa/Schilling. Valorar dano e incapacidade separadamente; a tabela SUSEP pode valorar dano mas NÃO incapacidade laboral [IFH aula 8662126 #8085]. Nexo profissional/epidemiológico é só elemento auxiliar, não isolado [IFH ebook TEPEM v2 p.16 #9448]. Parte adversa: reclamada."

**previdenciario** — label "Previdenciário (INSS)"; esfera `federal` (D4); adverso "INSS"; usaSusep `nao`; valoração `['incapacidade']`.
- campos: `especie` "Espécie do benefício" select [`B31 — aux. incapacidade temporária previdenciário`, `B91 — aux. incapacidade temporária acidentário`, `B32 — aposent. incapacidade permanente previdenciária`, `B92 — aposent. incapacidade permanente acidentária`, `B36 — auxílio-acidente previdenciário`, `B94 — auxílio-acidente acidentário`, `BPC/LOAS (87)`, `Outro`] fonte `IFH aula 8662078 #17148; ebook TEPEM v2 p.11 #9434; IN 128/2022 #10747` (D2) · `natureza` "Natureza" select [`Previdenciária (sem nexo com trabalho)`, `Acidentária (com nexo com trabalho)`] fonte `IFH aula 8662078 #17148` · `did` "DID — data do início da doença" data · `dii` "DII — data do início da incapacidade" data, ajuda "Fixar preferencialmente por documento, não só pelo relato" fonte `IFH ebook TEPEM v2 p.24 #9474` · `der` "DER — data de entrada do requerimento" data fonte `IN 128/2022 #10461` · `dcb` "DCB — data de cessação do benefício (se houve)" data fonte `IN 128/2022 #10480`.
- **sem** campo de qualidade de segurado/carência (D1): "não é tarefa do perito judicial" `[IFH aula 8662081 #17193]`.
- checklist: laudoINSS "Laudos SABI / comunicações do INSS" 15 · atestadosAfastamento "Atestados com afastamento" 15 · prontuarioContemporaneo "Prontuário contemporâneo à DII" 15 · laudoImagem "Exames complementares" 10 · carteiraTrabalho "CTPS / descrição da atividade habitual" 10.
- contextoIA: "RAMO: previdenciário (INSS). Objeto: incapacidade laborativa, não indenização. Responder: existe doença (DID)? existe incapacidade (DII, fixada por documento)? temporária ou permanente — preferir 'indefinida' quando cabível [IFH aula 8662081 #17177]; parcial/total; uni/multi/omniprofissional; reabilitação só se houver incapacidade [IFH aula 8662123 #7794]. Espécie e natureza (previdenciária × acidentária) informadas acima. Não usar tabela SUSEP. Qualidade de segurado e carência não são matéria do perito [IFH aula 8662081 #17193]. Parte adversa: INSS."

**erro_medico** — label "Erro médico / responsabilidade profissional"; esfera `civel`; adverso "réu (médico/hospital)"; usaSusep `nao` (INFERÊNCIA); valoração `['conduta','dano_corporal']`.
- campos: `dataAto` "Data do ato / procedimento" data · `procedimento` "Procedimento / especialidade" texto · `dataDano` "Data em que o dano/complicação foi constatado" data fonte INFERÊNCIA · `tcle` "TCLE nos autos?" select [`Sim`, `Não`, `Não sabe`] fonte `ifhflixKnowledge.ts` quesito de consentimento.
- checklist: prontuarioCompleto "Prontuário completo do atendimento" 20 · descricaoCirurgica "Descrição cirúrgica / anestésica" 15 · tcle "TCLE" 10 · laudoImagem "Exames pré e pós" 10.
- contextoIA: "RAMO: erro médico. Analisar conduta frente às boas práticas vigentes à época do ato, nexo conduta–dano, risco inerente/previsível × falha, consentimento informado. Não imputar culpa: isso é matéria jurídica [IFH aula 8662132 #8688]. Parte adversa: médico/hospital."

`buildRamoPromptBlock` gera:
```
CONTEXTO DO RAMO
<contextoIA>
MARCOS / IDENTIFICAÇÃO INFORMADOS:
- <label>: <valor ou MARCADOR_VAZIO>   (um por campo, na ordem do config; valor só com espaços = vazio)
```
`MARCADOR_VAZIO` é exportado de `src/data/ramos.ts` (ver R1).

---

## (c) Tarefas

Regras para TODO executor: ler no máximo os arquivos listados na tarefa; não refatorar fora do trecho; não adicionar validação/fallback além do pedido; 1 commit por tarefa; terminar com `npm run lint` verde. Não tocar em `.planning/` exceto se a tarefa pedir. Commits terminam com a linha de atribuição exigida pelo ambiente.

### T1 — [sonnet] Criar `src/data/ramos.ts` + teste
- Arquivos: criar `src/data/ramos.ts`, `src/data/ramos.test.ts`; editar `package.json` (script `test`).
- Passos:
  1. Implementar tipos e constantes exatamente como na seção (b), com o conteúdo por ramo copiado literalmente (rótulos, opções, pesos, fontes, contextoIA). Usar `readonly`/`as const` onde couber.
  2. `getRamo(id)`: `RAMOS[id as RamoId] ?? RAMOS.securitario`.
  3. `export const MARCADOR_VAZIO = '[NÃO INFORMADO — deduzir dos documentos]';` `buildRamoPromptBlock(id, valores)`: formato da seção (b); valor ausente ou `trim() === ''` → `MARCADOR_VAZIO`; para campos `data` não reformatar.
  4. Teste (`node:test` + `assert`): (i) cada ramo tem ≥1 campo e ≥1 item de checklist; (ii) chaves de campo únicas por ramo; (iii) `previdenciario` contém `did`, `dii`, `especie` e **não** contém `dataSinistro`; (iv) `previdenciario.usaSusep === 'nao'`; (v) `buildRamoPromptBlock('previdenciario', {dii:'01/02/2026'})` contém `DII` e `01/02/2026` e `MARCADOR_VAZIO`; (vi) `buildRamoPromptBlock('previdenciario', {})` tem `MARCADOR_VAZIO` em **todas** as linhas de campo (contar = nº de campos) e não contém nenhuma data `\d{2}/\d{2}/\d{4}`; (vii) `buildRamoPromptBlock('trabalhista', {dataEvento:'   '})` trata espaços como vazio; (viii) `getRamo('xyz').id === 'securitario'`.
  5. `package.json`: `"test": "tsx --test src/utils/pericia-calc.test.ts src/data/ramos.test.ts"`.
- Validação: `npm run lint` e `npm test` verdes.
- Commit: `feat: config declarativa de ramos (campos, checklist, contexto IA)`

### T1b — [sonnet] Builders puros de prompt (R1) + teste com campos vazios
- Depende de: T1. Arquivos: criar `src/utils/promptBuilders.ts` e `src/utils/promptBuilders.test.ts`; editar `package.json` (acrescentar o teste ao script `test`). Ler só `src/data/ramos.ts`, `src/utils/laudoBuilder.ts` (tipos), `src/utils/documentExtractor.ts` (assinatura de `buildDocumentsPrompt`).
- Passos:
  1. `export const INSTRUCAO_DEDUCAO` (string literal, usada nos dois builders):
     ```
     REGRA DE CAMPOS EM BRANCO (OBRIGATÓRIA):
     - Campo marcado [NÃO INFORMADO — deduzir dos documentos] significa que o usuário não sabe o valor.
     - Deduza o valor SOMENTE se ele constar nos documentos anexados ou no relato; cite o trecho de origem entre aspas.
     - Valor deduzido: escreva "[INFERIDO – confirmar]" + valor + trecho de origem.
     - Sem base documental: escreva "[NÃO INFORMADO]".
     - Ao final, seção "DADOS FALTANTES E IMPACTO": liste cada campo [NÃO INFORMADO] e o que deixa de poder ser avaliado.
     - Nunca invente data, CID, valor, percentual ou norma.
     ```
  2. `export interface ViabilidadeInput { ramoId: RamoId; profissao: string; relato: string; marcos: Record<string,string>; checklist: Record<string,boolean>; docsSummary: string; }`
     `export function buildViabilidadePrompt(i: ViabilidadeInput): string` — reproduz o texto atual de `ViabilidadeAnalyzer.tsx:101-115`, trocando: "Ramo do Direito" → `Ramo: ${label}`; "Data do Evento/Sinistro" → `buildRamoPromptBlock(...)`; profissão/relato vazios → `MARCADOR_VAZIO`; checklist listado pelos `label` do ramo (`DISPONÍVEL`/`AUSENTE`); `INSTRUCAO_DEDUCAO` antes da última frase. `docsSummary` vazio → `Nenhum documento anexado.`
  3. `export interface LaudoDiscussaoInput { data: LaudoData; notas: string; }` e `export function buildLaudoDiscussaoPrompt(i): string` — move o texto atual de `LaudoJudicialGenerator.tsx:48` para cá, acrescentando `buildRamoPromptBlock(d.ramo, d.marcos)` e `INSTRUCAO_DEDUCAO`; quesitos vazios → `MARCADOR_VAZIO`. (Se T5 ainda não tiver adicionado `ramo/marcos` ao `LaudoData`, este builder entra em T5; ver ordem.)
  4. Teste `promptBuilders.test.ts`:
     - (i) `buildViabilidadePrompt` com todos os campos vazios (`profissao:''`, `relato:''`, `marcos:{}`, checklist todo `false`, `docsSummary:''`) para **cada** `RAMO_IDS`: contém `INSTRUCAO_DEDUCAO`; contém `MARCADOR_VAZIO`; **não** contém `10/01/2026`, `João`, `olécrano`, `Mecânico`; não contém nenhuma data `/\d{2}\/\d{2}\/\d{4}/`.
     - (ii) previdenciário vazio: contém `DII` e `DID`; não contém `Sinistro`.
     - (iii) com `marcos:{dii:'05/03/2026'}`: contém `05/03/2026` e a linha da DII **não** tem o marcador.
     - (iv) `buildLaudoDiscussaoPrompt` com `EMPTY_LAUDO` e `notas:'x'`: contém `INSTRUCAO_DEDUCAO` e `MARCADOR_VAZIO`, sem datas.
- Validação: `npm run lint`; `npm test` verde (incluindo o novo arquivo).
- Commit: `feat: builders de prompt com regra de campos em branco (deduzir sem inventar)`

### T2 — [sonnet] Viabilidade: exemplo marcado + estado por caso + campos vazios (R1)
- Arquivo: `src/components/ViabilidadeAnalyzer.tsx` (apenas). Ler também `src/context/CaseContext.tsx` e `src/hooks/usePersistedState.ts`.
- Passos:
  1. `const caseId = useCaseId(); const isTest = caseId === TEST_CASE_ID;`
  2. Trocar os `useState` de `caseType`, `profissao`, `dataSinistro`, `relatoFatos`, `documentChecklist`, `viabilityScore`, `viabilityStatus`, `notaTecnicaResult` por `usePersistedState(caseKey(caseId, 'viab-<campo>'), <default>)`.
     - **Campos de entrada (R1): default vazio em TODOS os casos, inclusive o teste**: `profissao ''`, `dataSinistro ''`, `relatoFatos ''`, checklist todo `false`; `caseType 'securitario'` (é escolha de ramo, não dado do caso). Remover as strings do João das linhas 24-37.
     - Resultado: `notaTecnicaResult` = `isTest ? <nota João atual> : ''`; `viabilityScore` = `isTest ? 85 : null` (tipo `number | null`); `viabilityStatus` = `isTest ? 'alta' : null`. O exemplo fica só no painel de resultado, marcado (passo 5).
     - Placeholders (não são valor): `profissao` → `"Em branco = deduzir dos documentos"`; data → `"dd/mm/aaaa (em branco = deduzir)"`; relato → `"Em branco = a IA usa só os documentos anexados"`.
     - Se D11 = sim: no caso teste, botão "Carregar exemplo (João)" acima do formulário que preenche os campos com os valores antigos (constante `EXEMPLO_JOAO` no topo do arquivo, conteúdo = strings atuais l.24-37). Nada é preenchido sem clique.
  3. Novo estado persistido `viab-analisado` (boolean, default `false`); `handleRunAnalysis` seta `true` após a resposta (também no erro não setar).
  4. `const isExample = isTest && !analisado;`
  5. Quando `isExample`: no topo do card de resultado (antes de "Parecer Preliminar", ~l.371) renderizar badge `EXEMPLO — caso fictício de teste (João da Silva). Não é resultado de análise.` (classe âmbar: `bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300`); no termômetro do cabeçalho (~l.158) adicionar a mesma tag curta `EXEMPLO`; o botão Copiar fica `disabled` com title "Exemplo — rode a análise para gerar a nota".
  6. Badges l.394-413: renderizar **somente** se `isExample` (D5), cada um com sufixo "(exemplo)".
  7. Termômetro: rótulo "Termômetro documental (heurístico)"; se `score === null` mostrar `—` e "Sem análise". Corrigir l.171: `'alta'` → "Alta probabilidade de êxito", `'media'` → "Viável com ressalvas", `'baixa'` → "Baixa viabilidade documental".
  8. Fora do caso teste, textarea vazia com `placeholder="A Nota Técnica aparecerá aqui após executar a análise."`
- Validação: `npm run lint`; `grep -n "10/01/2026" src/components/ViabilidadeAnalyzer.tsx` → só dentro da nota de exemplo (e de `EXEMPLO_JOAO` se D11); navegador: (a) caso teste → **formulário vazio**, painel com badge EXEMPLO, Copiar desabilitado, 3 badges com "(exemplo)"; (b) rodar análise (ou forçar erro sem chave) → badge EXEMPLO some depois de resposta; (c) criar caso novo → formulário e resultado vazios, termômetro "—"; (d) digitar dados no caso novo, trocar para o teste e voltar → dados do caso novo preservados e não vazam para o teste.
- Commit: `fix: viabilidade marca exemplo do caso teste e persiste dados por caso`

### T3 — [sonnet] Viabilidade: campos, checklist e score por ramo
- Depende de: T1, T2. Arquivo: `src/components/ViabilidadeAnalyzer.tsx` (+ leitura de `src/data/ramos.ts`).
- Passos:
  1. `<select>` de ramo gerado de `RAMO_IDS.map(id => RAMOS[id].label)` (inclui `civel_dano`).
  2. Substituir `dataSinistro` por `marcos: Record<string,string>` persistido em `viab-marcos`, default `{}` em todos os casos (R1). Sem migração de `viab-dataSinistro`.
  3. Renderizar `getRamo(caseType).campos` em grid 2 colunas: `data` → `<input type="text" placeholder="dd/mm/aaaa">` (manter padrão atual, sem máscara); `texto` → input; `select` → select com opção vazia "Selecione…". `ajuda` em `<p className="text-[10px] text-slate-500">`. Cada `label` com `htmlFor`.
  4. Checklist: gerar de `getRamo(caseType).checklist`; estado `documentChecklist: Record<string, boolean>` (persistido); ao trocar de ramo **não** apagar marcas de chaves que coincidam.
  5. Score: `50 + Σ peso dos itens marcados`, teto 95 (manter regra atual), status pelos mesmos limiares (≥75 alta, ≥50 média).
  6. Prompt (l.101-115): apagar o template inline e chamar `buildViabilidadePrompt({ ramoId: caseType, profissao, relato: relatoFatos, marcos, checklist: documentChecklist, docsSummary })` (T1b). Nenhum texto de prompt fica no componente.
  7. Badge "Estimativa SUSEP" (já só no exemplo, T2) — também condicionar a `ramo.usaSusep !== 'nao'`.
  8. Remover estado/const não usados.
- Depende também de: T1b.
- Validação: `npm run lint`; `npm test`; navegador: escolher Previdenciário → aparecem Espécie, Natureza, DID, DII, DER, DCB, todos vazios; **não** aparece "Data do Sinistro"; checklist mostra SABI/atestados, não mostra BO. Trabalhista → Tipo de evento, CAT. Erro médico → Data do ato, TCLE. **Teste R1 no navegador**: caso novo, Previdenciário, DII em branco, anexar um documento que contenha uma data de afastamento → executar → conferir no DevTools/Network que o prompt tem `[NÃO INFORMADO — deduzir dos documentos]` na linha da DII e o bloco "REGRA DE CAMPOS EM BRANCO"; a nota deve trazer a DII como `[INFERIDO – confirmar]` com o trecho, ou `[NÃO INFORMADO]` + seção "DADOS FALTANTES E IMPACTO". Repetir sem anexo → nenhuma data inventada.
- Commit: `feat: viabilidade com marcos e checklist específicos por ramo`

### T4 — [sonnet] Prompts da IA sem viés de ramo/caso
- Depende de: T1. Arquivo: `src/services/aiService.ts` (somente `SYSTEM_PROMPTS`).
- Passos:
  1. `laudoPericial` item 3 → "3. VALORAÇÃO CONFORME O RAMO: siga o bloco CONTEXTO DO RAMO enviado na mensagem. Tabela SUSEP só quando o contexto indicar; nunca use SUSEP para valorar incapacidade laboral. Sem contexto de ramo, não presuma o ramo: declare a lacuna."
  2. `laudoPericial` item 5 → manter só: "5. DEONTOLOGIA MÉDICA: nunca acuse colegas de 'erro médico' sem que isso seja objeto expressamente delimitado pelo juízo." (remover a frase sobre consolidação viciosa/fratura articular).
  3. `analiseViabilidade` item 3 → "…teses que a parte adversa indicada no CONTEXTO DO RAMO usará (ex.: doença degenerativa, concausa, hiato temporal sem atendimento, DII sem documento)."
  4. `analiseViabilidade` item 4 → "4. VALORAÇÃO PROVÁVEL CONFORME O RAMO: securitário → enquadramento SUSEP e percentual; cível → danos temporários e permanentes; trabalhista → dano e incapacidade separados; previdenciário → existência, início (DII) e tipo de incapacidade, sem SUSEP; erro médico → conduta × boas práticas e dano."
  5. **R1 nos 4 prompts**: criar no topo de `aiService.ts` `const REGRA_DADOS = \`REGRA DE DADOS (OBRIGATÓRIA): use só o que consta nos documentos anexados, no relato e nos campos preenchidos. Campo vazio ou marcado [NÃO INFORMADO — deduzir dos documentos] = deduzir dos documentos, citando o trecho de origem e marcando "[INFERIDO – confirmar]". Sem base: "[NÃO INFORMADO]" e listar em "DADOS FALTANTES E IMPACTO" o que falta e o que deixa de poder ser avaliado. Nunca invente data, CID, valor, percentual ou norma.\`;` e acrescentar `\n\n${REGRA_DADOS}` ao final de `laudoPericial`, `analiseViabilidade`, `quesitosEstrategicos` e `parecerAssistente` (é a única mudança nesses dois últimos).
  6. Não alterar citações de lei/resolução (D7).
- Validação: `npm run lint`; `grep -n "fratura articular" src/services/aiService.ts` → 0 linhas; `grep -n "CONTEXTO DO RAMO" src/services/aiService.ts` → ≥2 linhas; `grep -c "REGRA_DADOS" src/services/aiService.ts` → 5 (1 definição + 4 usos).
- Commit: `fix: prompts de laudo e viabilidade guiados pelo ramo, sem viés do caso teste`

### T5 — [sonnet] Laudo judicial: ramo + marcos no esqueleto e no prompt
- Depende de: T1, T4. Arquivos: `src/utils/laudoBuilder.ts`, `src/components/LaudoJudicialGenerator.tsx`.
- Passos:
  1. `LaudoData`: adicionar `ramo: RamoId` e `marcos: Record<string,string>`; `EMPTY_LAUDO`: `ramo: 'civel_dano'` (ou conforme D3), `marcos: {}`.
  2. Compatibilidade com dados já salvos: no componente, `const d = { ...EMPTY_LAUDO, ...data }` antes de usar (único código defensivo permitido).
  3. Componente: `<select>` "Ramo" acima de "Esfera"; ao trocar ramo, setar `esfera` = `RAMOS[ramo].esferaSugerida` (usuário ainda pode trocar a esfera depois — D4). Renderizar `RAMOS[ramo].campos` como em T3 (input/select simples, `inputCls`).
  4. `buildLaudoSkeleton`: após "QUALIFICAÇÃO DO PERICIANDO" inserir bloco `DADOS DO OBJETO PERICIAL (${ramo.label})` com `label: f(valor, 'preencher')` por campo. No 4.3 trocar o texto fixo por mapa: `susep|dano_corporal` → "nexo causal — Simonin; valoração do dano (tabela indicada pelo juízo/SUSEP)"; `incapacidade` → "nexo (se acidentário); existência, DID, DII, tipo e grau de incapacidade; reabilitação"; `conduta` → "conduta × boas práticas à época; nexo conduta–dano; dano". Usar `ramo.valoracao[0]`.
  5. Prompt "redigir" (l.48): substituir o template inline por `buildLaudoDiscussaoPrompt({ data: d, notas })` (T1b; se o builder de laudo foi adiado para cá, implementá-lo e o teste (iv) de T1b agora). Manter a exigência `if (!notas.trim()) return setErro(...)`: sem notas não há documento de onde deduzir.
  6. No esqueleto, campos de marcos vazios saem como `[NÃO INFORMADO]` (usar `f(valor, 'NÃO INFORMADO')`), coerente com R1.
- Validação: `npm run lint`; `npm test`; navegador: aba Laudo (gerador) → Ramo Previdenciário mostra DID/DII/DER/DCB vazios, esqueleto exibe bloco "DADOS DO OBJETO PERICIAL (Previdenciário (INSS))" com `[NÃO INFORMADO]` e 4.3 sem "SUSEP"; "Redigir com IA" com DII vazia e notas contendo a data de afastamento → saída marca `[INFERIDO – confirmar]` com trecho; recarregar página com dados antigos não quebra.
- Commit: `feat: gerador de laudo com ramo e marcos temporais específicos`

### T6 — [haiku] Badges "EXEMPLO" nas demais abas (mecânico)
- Arquivos (só estes): `src/components/SusepCalculator.tsx`, `SimoninMatrix.tsx`, `WaddellValidator.tsx`, `ParecerGenerator.tsx`, `HonorariosCalculator.tsx`, `src/App.tsx`.
- Passos:
  1. Em cada um dos 5 componentes: `import { useCaseId, TEST_CASE_ID } from '../context/CaseContext';` e `const isTest = useCaseId() === TEST_CASE_ID;` na primeira linha do corpo.
  2. Logo abaixo do `<h2>` do cabeçalho de cada componente, inserir:
     `{isTest && <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300">Exemplo — caso fictício de teste</span>}`
  3. `SusepCalculator.tsx:78`: trocar texto `Caso João da Silva` por `{isTest ? 'Exemplo: caso João (fictício)' : 'Resultado atual'}`.
  4. `App.tsx:99`: remover `badge: '12,5%'` da aba `susep` (deixar o objeto sem `badge`).
- Validação: `npm run lint`; navegador no caso teste: as 5 abas mostram a tag âmbar; em caso novo a tag não aparece; aba SUSEP sem "12,5%" na barra.
- Commit: `fix: marca dados do caso teste como exemplo nas abas de cálculo e parecer`

### T7 — [sonnet] Demais abas: campos vazios (R1) e isolados por caso
- Depende de: T6. (D6 resolvida por R1: vazio em todos os casos, inclusive o teste.) Arquivos: os 5 componentes de T6 + `QuesitosBank.tsx`.
- Passos:
  1. Para cada estado com default do João — Susep `selectedItemId/selectedDegree/sequelaList` (→ nenhum item selecionado/lista vazia), Simonin `criteria` (justificativas → `''`, manter estrutura dos 6 critérios e pontuação neutra existente no tipo), Waddell `spontaneousObs` (→ `''`) e itens (→ todos desmarcados), Parecer `objetoDivergencia/quesitosElucidativos/peritoJudicialNome` (→ `''`), Honorários `comarca, vara, numeroProcesso, autorNome, reuNome, peritoNome, peritoCrm, peritoEspecialidade` (→ `''`; horas/valor/páginas mantêm default numérico, pois são parâmetros de cálculo) — usar `usePersistedState(caseKey(caseId, '<aba>-<campo>'), <vazio>)` em **todos** os casos.
  2. Mover os valores do João para uma constante `EXEMPLO_JOAO` no topo de cada arquivo; se D11 = sim, botão "Carregar exemplo (João)" visível só quando `isTest`, que aplica a constante. Sem clique, nada pré-preenchido.
  3. Textos gerados (Parecer, Simonin, Waddell, Honorários) com campo vazio: o template insere `[NÃO INFORMADO]` no lugar (ex.: `${v.trim() || '[NÃO INFORMADO]'}`) — nunca string vazia silenciosa nem valor inventado.
  4. QuesitosBank: `selectedIds` default `[]` em todos os casos.
  5. Não mudar lógica de cálculo (`pericia-calc.ts`). Se a calculadora SUSEP exigir item selecionado para renderizar, mostrar "Selecione uma rubrica" no lugar do resultado.
- Validação: `npm run lint`; `npm test` (pericia-calc continua verde); `grep -rn "10/01/2026\|olécrano\|João da Silva" src/components/{SusepCalculator,SimoninMatrix,WaddellValidator,ParecerGenerator,HonorariosCalculator}.tsx` → só dentro de `EXEMPLO_JOAO`; navegador: caso teste e caso novo → abas com campos vazios; texto copiado do Parecer com campos vazios contém `[NÃO INFORMADO]`; dados digitados num caso não aparecem no outro.
- Commit: `fix: abas de cálculo e parecer isolam dados por caso e iniciam vazias fora do teste`

### T8 — [haiku] Honorários: alínea de valoração e numeração
- Depende de: decisão D9 (texto). Arquivo: `src/components/HonorariosCalculator.tsx` (l.55-60).
- Passos:
  1. Linha 56: o item da vistoria passa a ser `c)`, e o de nexo vira `${config.horasVistoria > 0 ? 'd' : 'c'})`; renumerar as alíneas seguintes da mesma forma (usar um array de linhas filtrado e letras geradas por índice: `'abcdefgh'[i]`).
  2. Trocar "d) Quantificação objetiva do dano corporal permanente à luz da Tabela SUSEP/DPVAT (Lei nº 11.945/2009);" por "Valoração médico-legal do dano corporal e/ou da incapacidade, conforme o objeto da perícia e a metodologia indicada pelo juízo;".
- Validação: `npm run lint`; navegador: com Vistoria = 0 alíneas a–f sem repetição; com Vistoria > 0, a–g sem repetição; texto não menciona SUSEP.
- Commit: `fix: proposta de honorários sem SUSEP fixo e alíneas sequenciais`

### T9 — [sonnet] Revisão final integrada (somente leitura + correções mínimas)
- Depende de: T1–T8. `npm run lint`, `npm test`, `npm run build`; percorrer no navegador os cenários de validação de T2, T3, T5, T6, T7. Checklist R1 final: (a) nenhuma aba abre com dado do João em campo de entrada; (b) viabilidade e laudo com campos vazios + documento → valores aparecem como `[INFERIDO – confirmar]` com trecho; (c) sem documento → `[NÃO INFORMADO]` + "DADOS FALTANTES E IMPACTO", sem data/CID/valor/norma inventados. Corrigir apenas regressões introduzidas por T1–T8.
- Commit (se houver correção): `fix: ajustes de integração dos campos por ramo`

---

## (d) Ordem e dependências

```
T1 ──► T1b ──► T3 ──┐
 │       └────► T5 ─┤
 ├──► T4 ──────► T5 ├─► T9
T2 ──────────► T3   │
T6 ──► T7 ──────────┘
T8 (independente, após D9)
```
Ordem sugerida: **T1 → T1b → T2 → T4 → T3 → T5 → T6 → T7 → T8 → T9**. T2 e T6 não dependem de T1 e podem ir primeiro se a prioridade for só "marcar exemplo / esvaziar campos". T3 e T2 editam o mesmo arquivo: nunca em paralelo. Builder de laudo (T1b passo 3) depende dos campos `ramo/marcos` de `LaudoData`: se T5 ainda não rodou, T1b entrega só `buildViabilidadePrompt` e T5 entrega `buildLaudoDiscussaoPrompt` + teste (iv).

---

## (e) Decisões do médico (resposta curta; opção recomendada primeiro)

- **D1 — Qualidade de segurado / carência no previdenciário.** O curso diz que não é tarefa do perito judicial `[IFH aula 8662081 #17193]`. → **(Rec.) Não incluir campo**; / incluir só como lembrete "verificação jurídica" no checklist da viabilidade.
- **D2 — Espécies no select.** → **(Rec.) B31, B91, B32, B92, B36, B94, BPC/LOAS (87), Outro**; / só B31, B91, B32, B94.
- **D3 — Separar "Cível — dano corporal" de "Securitário/DPVAT"?** → **(Rec.) Sim, ramo próprio**; / manter só securitário.
- **D4 — Esfera do laudo para previdenciário acidentário (B91/B94).** Competência estadual é INFERÊNCIA (CF art. 109, I), não confirmada no acervo. → **(Rec.) Ramo só sugere esfera; usuário escolhe livremente**; / forçar Federal.
- **D5 — Badges "Nexo/SUSEP/Recomendação" (hardcoded).** → **(Rec.) Mostrar só no exemplo, com "(exemplo)"**; / remover de vez; / tentar extrair da resposta da IA (mais trabalho, fora deste plano).
- ~~D6~~ — **RESOLVIDA por R1** (aprovada pelo médico): todos os campos começam vazios em todos os casos.
- **D11 — Botão "Carregar exemplo (João)" no caso teste** (preenche os campos só por clique; demonstração). → **(Rec.) Sim, só no caso teste**; / não — João fica apenas no visualizador do caso (`JoaoCaseViewer`) e na nota de exemplo da viabilidade.
- **D7 — Citações "Lei nº 11.945/2009" e "Resolução CFM nº 2.430/2025"** (prompts, SUSEP, Honorários) não foram achadas no acervo. → **(Rec.) Médico confirma vigência/número; plano não altera**; / remover citações numéricas e manter "legislação vigente".
- **D8 — Securitário: tipo de seguro.** Acervo não cobre DPVAT × seguro privado (LACUNA). → **(Rec.) Select DPVAT / Seguro privado (AP/vida) / Outro, sem citar norma**; / campo livre.
- **D9 — SUSEP em trabalhista/cível.** Curso: possível para dano, juízes pedem, mas nunca para incapacidade laboral `[IFH aula 8662126 #8085; aula 8662133 #8779]`. → **(Rec.) Opcional, com aviso "não valora incapacidade laboral"**; / ocultar.
- **D10 — Rótulos de datas.** Confirmar se quer DER e DCB na viabilidade (fonte: IN PRES/INSS 128/2022 na biblioteca do curso, #10461/#10480). → **(Rec.) Sim, opcionais**; / só DID e DII.

---

## (f) O que NÃO fazer

- Não inventar artigo, resolução, prazo ou valor; não adicionar citação normativa nova em texto de UI ou prompt (exceto as fontes já listadas na seção b, como comentário `fonte` no config).
- Não mexer em `src/utils/pericia-calc.ts` (cálculo SUSEP/Balthazar/Simonin), `src/data/joaoCase.ts`, `JoaoCaseViewer.tsx`, `ifhflixKnowledge.ts` (conteúdo dos quesitos está correto), `LegalGuide`, `Captacao*`, `EmailVaras`, `AIAssistantModal`.
- Não adicionar máscara/validação de data, biblioteca de formulário, zod, i18n ou testes de componente (RTL/jsdom) — fora do escopo.
- Não tentar parsear a resposta da IA para preencher score/badges (D5 alternativa — outro plano).
- Não renomear `Esfera`/`ESFERAS` nem mudar textos de cabeçalho do laudo além do 4.3 e do novo bloco.
- Não usar `git add -A`; adicionar só os arquivos da tarefa. Não fazer push/deploy (fica com o usuário).
- Não apagar dados salvos em localStorage nem criar migração de chaves antigas.
