export type Destinatario = 'juiz' | 'diretor' | 'posNomeacao';

export interface EmailData {
  destinatario: Destinatario;
  nomeDestinatario: string;
  vara: string;
  forum: string;
  tribunal: string;
  perito: string;
  crm: string;
  cpf: string;
  apresentacao: string;
  anos: string;
  areas: string;
  numeroAutos: string;
  complemento: boolean;
}

export const EMPTY_EMAIL: EmailData = {
  destinatario: 'juiz', nomeDestinatario: '', vara: '', forum: '', tribunal: '',
  perito: '', crm: '', cpf: '', apresentacao: '', anos: '', areas: '',
  numeroAutos: '', complemento: true,
};

const f = (v: string, ph: string) => (v.trim() ? v.trim() : `[${ph}]`);

export function buildAssunto(d: EmailData): string {
  if (d.destinatario === 'posNomeacao') return `NOMEAÇÃO AUTOS ${f(d.numeroAutos, 'NÚMERO').toUpperCase()}`;
  return d.destinatario === 'diretor' ? 'AO DIRETOR DA SECRETARIA DA VARA' : 'IMPORTANTE / URGENTE';
}

export function buildEmail(d: EmailData): string {
  const assinatura = `${f(d.perito, 'Nome Completo')}\nCRM-${f(d.crm, 'UF número')}\nCPF: ${f(d.cpf, 'xxx.xxx.xxx-xx')}`;

  if (d.destinatario === 'posNomeacao') {
    return `Ilmo. Sr. ${f(d.nomeDestinatario, 'Fulano de Tal')}, diretor de secretaria da ${f(d.vara, 'Xª Vara')} do Fórum ${f(d.forum, 'Nome do Fórum')},

Em atenção à nomeação supracitada (autos ${f(d.numeroAutos, 'número')}), venho respeitosamente consultar se há outras perícias pendentes de designação que possam ser acumuladas na mesma data, otimizando assim o deslocamento e a realização dos exames periciais. Aproveito para verificar a disponibilidade do fórum para agendamento das referidas perícias.

${assinatura}`;
  }

  const saudacao = d.destinatario === 'juiz'
    ? `Exmo. Juiz de Direito ${f(d.nomeDestinatario, 'Dr. Fulano de Tal')},`
    : `Ilmo. Sr. ${f(d.nomeDestinatario, 'Fulano de Tal')}, diretor de secretaria da ${f(d.vara, 'Xª Vara')} do Fórum ${f(d.forum, 'Nome do Fórum')},`;

  const corpo = `Meu nome é ${f(d.perito, 'Nome')}, sou médico perito judicial cadastrado no ${f(d.tribunal, 'TJxx')}, ${f(d.apresentacao, 'cursos, titulações e docência')}. Trabalho há ${f(d.anos, 'X')} anos na área da perícia médica e durante este período adquiri experiência na realização de perícias envolvendo conhecimentos das áreas de ${f(d.areas, 'listar áreas de experiência e conhecimento')}. Desta forma, encaminho em anexo o meu currículo resumido, um modelo do meu laudo e me coloco à disposição deste E. Juízo para atuar como perito judicial.`;
  const compl = d.complemento && d.destinatario === 'juiz'
    ? ' Qualquer sugestão, estou disponível também para sugestões e para melhor me adaptar à necessidade do juízo.'
    : '';

  return `${saudacao}\n\n${corpo}${compl}\n\n${assinatura}\n\nAnexos: currículo resumido (1 página) + modelo de laudo (sem dados identificáveis).`;
}

export const DICAS_ENVIO: string[] = [
  'Chame o destinatário pelo nome (juízes e diretores de secretaria constam no site do tribunal). [aula 8741220, #9889]',
  'Assunto em caixa alta "NOMEAÇÃO AUTOS + número" funcionou em SP e MG (700+ e-mails). [aula 8864992, #2229-2230]',
  'Listar áreas de conhecimento sem dizer "especialista": "experiência e conhecimento em perícias nessas áreas". [aula 8864992, #2261]',
  'Moldar o e-mail ao juiz específico; iniciante não precisa mentir nem expor que está começando. [aula 8864992, #2262, #2228]',
  'Ritmo citado: ~80 e-mails/dia (1 a cada 2 min); desânimo = 10 por dia. [aula 8864992, #2237; 8662123, #7810]',
  'Reenvio: até 3 vezes, a cada 15-20 dias, só para quem não respondeu, alterando levemente assunto e corpo. [aula 8864992, #2235-2236; 8662123, #7814]',
  'Ligar para a vara na hora do envio para abrirem o e-mail. [aula 8864992, #2234]',
  'Sem e-mail, usar WhatsApp com o mesmo conteúdo, respeitando a liturgia do judiciário. [aula 8865035, #3195]',
  'Após a 1ª nomeação, escrever às demais varas do mesmo fórum ("9 de 10 respondem"). [aula 8864992, #2229]',
  'Controlar envios/respostas em planilha. [aula 8865035, #3195]',
  'Valores e taxas do curso podem estar desatualizados; transcrição Whisper pode errar números.',
];
