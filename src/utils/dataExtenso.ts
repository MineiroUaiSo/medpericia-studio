/** Data de hoje por extenso em pt-BR (ex.: "29 de outubro de 2026"). */
export const dataPorExtenso = (d: Date = new Date()): string =>
  d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
