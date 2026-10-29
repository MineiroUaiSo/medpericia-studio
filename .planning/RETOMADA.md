# Retomada — MedPerícia Studio (2026-10-29)

Repo: github.com/MineiroUaiSo/medpericia-studio · site: mineirouaiso.github.io/medpericia-studio/ (Pages via push na main).

## Pronto e no ar
- Gerador de Laudo, E-mails às Varas, Checklists IFH, casos separados (teste/novo/limpar/excluir).
- Plano `PLANO-AJUSTES-RAMOS.md` (Opus) executado: ramos em `src/data/ramos.ts`, regra "campo vazio = deduzir, sem inventar" (`[INFERIDO – confirmar]` / `[NÃO INFORMADO]`), exemplo João só via botão, abas isoladas por caso.
- Data do parecer/honorários automática (`src/utils/dataExtenso.ts`); aviso de campos em branco no gerador de laudo.

- OCR local (Tesseract.js, `src/utils/ocr.ts`): PDFs escaneados e imagens viram texto no navegador (até 25 págs/arquivo; confiança <55% pede transcrição; texto marcado "OCR" no prompt). Testado com PDF sintético (95%, 2 págs em 3,6 s). NÃO testado com os PDFs reais do médico (laudo de vistas 877 KB e laudos/exames 11,7 MB: só as 25 primeiras págs são lidas).

## Normas (pesquisado 2026-10-29)
- Res. CFM 2.430/2025: confirmada (publ. 30/05/2025, republ. 04/06/2025; revoga 1.497/1998 e 2.325/2022). Texto oficial: sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2025/2430_2025.pdf
- Lei 11.945/2009: origem da tabela de graduação anexa à Lei 6.194/1974; STJ Súm. 474 e 544 a sustentam. NÃO verificado: vigência atual do DPVAT/SPVAT (checar Planalto/SUSEP antes de afirmar "vigente").

## Pendências
1. Testar com documento anexado (valor deduzido deve sair `[INFERIDO – confirmar]` + trecho) — não verificado no navegador.
2. Testar "Redigir com IA" do laudo e honorários com vistoria > 0; telas estreitas.
3. Decisões D1–D11 do plano foram tomadas com a opção recomendada; médico pode vetar.
4. Segurança: chaves em texto puro em ~/.claude/settings.json (mover p/ env do shell).
