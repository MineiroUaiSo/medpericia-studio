export interface QuesitoItem {
  id: string;
  area: 'securitario' | 'trabalhista' | 'erro_medico' | 'previdenciario' | 'estrategicos_assistente';
  title: string;
  targetRole: 'autor' | 'reu' | 'juizo';
  pergunta: string;
  objetivoEstrategico: string;
  dicaIFH: string;
}

export const QUESITOS_LIBRARY: QuesitoItem[] = [
  // Securitário / DPVAT / Dano Corporal
  {
    id: 'sec-1',
    area: 'securitario',
    title: 'Enquadramento na Tabela SUSEP / DPVAT',
    targetRole: 'autor',
    pergunta: 'Queira o Sr. Perito informar se as sequelas constatadas no periciando decorrem do acidente narrado na exordial e qual o seu enquadramento objetivo na Tabela anexa à Lei nº 11.945/2009 e normas SUSEP.',
    objetivoEstrategico: 'Fixar o nexo causal com o acidente e exigir o enquadramento topográfico exato com o teto percentual legal.',
    dicaIFH: 'Evite perguntas genéricas sobre gravidade; exija o percentual aritmético da tabela.',
  },
  {
    id: 'sec-2',
    area: 'securitario',
    title: 'Gradação da Perda Funcional (Leve / Médio / Grave / Total)',
    targetRole: 'autor',
    pergunta: 'Tratando-se de perda funcional incompleta, queira o Sr. Perito quantificar o grau do déficit apresentado pelo periciando, indicando se é de grau leve (25%), médio (50%), intenso (75%) ou total (100%), apresentando a goniometria ou medição objetiva correspondente.',
    objetivoEstrategico: 'Evitar que o perito deixe a graduação em aberto ou use adjetivos vagos.',
    dicaIFH: 'A Lei 11.945/2009 exige expressamente a graduação percentual da perda anatômica ou funcional residual.',
  },
  {
    id: 'sec-3',
    area: 'securitario',
    title: 'Estabilidade e Consolidação Médica das Sequelas',
    targetRole: 'reu',
    pergunta: 'As lesões decorrentes do evento encontram-se em fase de consolidação médica definitiva e irreversível, ou ainda há indicação de tratamento médico, cirúrgico ou fisioterápico com expectativa razoável de melhora funcional?',
    objetivoEstrategico: 'Verificar se o sinistro está maduro para liquidação securitária de invalidez permanente.',
    dicaIFH: 'Invalidez permanente só pode ser indenizada após esgotados os recursos terapêuticos (consolidação médica estável).',
  },
  {
    id: 'sec-4',
    area: 'securitario',
    title: 'Múltiplas Sequelas e Regra de Balthazar',
    targetRole: 'autor',
    pergunta: 'Havendo mais de uma lesão ou segmento anatômico afetado, queira o perito quantificar cada uma isoladamente e demonstrar o cálculo cumulativo de capacidade restante (Regra de Balthazar).',
    objetivoEstrategico: 'Demonstrar cálculo técnico blindado caso haja mais de uma lesão traumática.',
    dicaIFH: 'Soma aritmética simples em múltiplas sequelas é erro grave combatido na prova de título de especialista.',
  },

  // Trabalhista / Ocupacional
  {
    id: 'trab-1',
    area: 'trabalhista',
    title: 'Nexo Causal e Classificação de Schilling',
    targetRole: 'autor',
    pergunta: 'A patologia diagnosticada possui nexo causal ou concausal com as condições de trabalho e as atividades desempenhadas na reclamada? Em caso positivo, qual o enquadramento na Classificação de Schilling (Grupo I, II ou III)?',
    objetivoEstrategico: 'Identificar se o trabalho foi causa única (Schilling I), fator de risco contributivo (Schilling II) ou desencadeador de doença preexistente (Schilling III).',
    dicaIFH: 'Perguntar sobre Schilling obriga o perito a demonstrar a correlação etiológica com a ergonomia ou agentes físicos.',
  },
  {
    id: 'trab-2',
    area: 'trabalhista',
    title: 'Incapacidade Laboral Específica vs. Geral',
    targetRole: 'autor',
    pergunta: 'O periciando apresenta incapacidade laborativa para o exercício das funções habituais que desempenhava na reclamada? Essa incapacidade é temporária ou definitiva? Parcial ou total?',
    objetivoEstrategico: 'Diferenciar a incapacidade para o cargo de registro da capacidade geral residual para outras profissões.',
    dicaIFH: 'No âmbito trabalhista, a indenização foca no dano ao exercício da profissão habitual do reclamante.',
  },
  {
    id: 'trab-3',
    area: 'trabalhista',
    title: 'Ergonomia, Vistoria e Histórico do Posto de Trabalho',
    targetRole: 'autor',
    pergunta: 'A reclamada fornecia pausas ergonômicas regulares, mobiliário ajustável e rodízio de tarefas para mitigação de esforço repetitivo e sobrecarga postural conforme a NR-17?',
    objetivoEstrategico: 'Questionar o cumprimento das normas regulamentadoras de medicina e segurança do trabalho.',
    dicaIFH: 'Essencial em casos de LER/DORT, tendinopatias e lombalgias.',
  },
  {
    id: 'trab-4',
    area: 'trabalhista',
    title: 'Doença Degenerativa e Fator Idiopático (Defesa da Empresa)',
    targetRole: 'reu',
    pergunta: 'A patologia diagnosticada possui etiologia primariamente degenerativa, multifatorial ou associada à faixa etária e biotipo do periciando, consoante o art. 20, § 1º, alínea "a" e "c", da Lei nº 8.213/91?',
    objetivoEstrategico: 'Afastar o nexo causal com o trabalho demonstrando condição de gênese degenerativa intrínseca.',
    dicaIFH: 'Quesito clássico da reclamada para afastar estabilidade provisória acidentária e indenização por danos materiais.',
  },

  // Erro Médico / Responsabilidade Civil Médica
  {
    id: 'err-1',
    area: 'erro_medico',
    title: 'Obrigação de Meio e Conformidade com a Literatura Médica',
    targetRole: 'reu',
    pergunta: 'A conduta diagnóstica e terapêutica adotada pela equipe médica assistente esteve alinhada às boas práticas, protocolos clínicos reconhecidos e diretrizes das sociedades de especialidade vigentes à época do atendimento?',
    objetivoEstrategico: 'Consagrar que a obrigação médica é de meio e diligência técnica, e não de garantia de resultado.',
    dicaIFH: 'Lembre-se: o perito médico jamais deve julgar culpa jurídica (imprudência/negligência/imperícia), mas apenas a adequação técnica da conduta.',
  },
  {
    id: 'err-2',
    area: 'erro_medico',
    title: 'Intercorrência e Complicação Conhecida da Literatura',
    targetRole: 'reu',
    pergunta: 'A complicação ou desfecho desfavorável apresentado pelo paciente constitui risco previsível e inerente ao procedimento médico realizado, ainda que executado com rigorosa técnica cirúrgica?',
    objetivoEstrategico: 'Demonstrar que o evento adverso não decorre de falha profissional, mas de complicação estatisticamente descrita.',
    dicaIFH: 'Fundamental para descaracterizar imputações levianas em cirurgias de alta complexidade.',
  },
  {
    id: 'err-3',
    area: 'erro_medico',
    title: 'Dever de Informação e Termo de Consentimento Livre e Esclarecido (TCLE)',
    targetRole: 'autor',
    pergunta: 'Consta nos autos documento comprobatório de que o paciente ou seus familiares foram prévia e detalhadamente informados acerca dos riscos cirúrgicos, complicações potenciais e alternativas terapêuticas?',
    objetivoEstrategico: 'Verificar a observância ao dever de informação e autonomia do paciente (arts. 22 e 34 do CEM).',
    dicaIFH: 'TCLE genérico sem assinatura ou sem menção ao risco concreto ocorrido é vulnerável perante o juízo.',
  },

  // Previdenciário / Benefícios por Incapacidade
  {
    id: 'prev-1',
    area: 'previdenciario',
    title: 'Fixação Técnica da DII e DID',
    targetRole: 'juizo',
    pergunta: 'Com base em documentos médicos contemporâneos fidedignos, queira o Sr. Perito fixar a Data de Início da Doença (DID) e a Data de Início da Incapacidade (DII), indicando os elementos objetivos que balizaram tal conclusão.',
    objetivoEstrategico: 'Diferenciar quando a doença começou de quando ela realmente se tornou impeditiva do exercício laboral.',
    dicaIFH: 'A fixação da DII define a qualidade de segurado e o período de graça previdenciário.',
  },
  {
    id: 'prev-2',
    area: 'previdenciario',
    title: 'Possibilidade de Reabilitação Profissional',
    targetRole: 'autor',
    pergunta: 'Considerando a escolaridade, idade, limitações funcionais e o mercado de trabalho regional, é clinicamente viável a reabilitação profissional do segurado para outra atividade compatível?',
    objetivoEstrategico: 'Fundamentar o pedido de aposentadoria por incapacidade permanente (invalidez) quando a reabilitação for inviável.',
    dicaIFH: 'A Súmula 47 da TNU exige ponderação das condições socioeconômicas e culturais do segurado.',
  },

  // Quesitos Estratégicos com Holofotes para o Assistente Técnico
  {
    id: 'ast-1',
    area: 'estrategicos_assistente',
    title: 'Quesito Indutor de Holofote: Testes Físicos Específicos',
    targetRole: 'autor',
    pergunta: 'Queira o Sr. Perito descrever detalhadamente os testes ortopédicos especiais realizados no exame físico pericial (ex.: Neer, Hawkins, Jobe, Yergason, Phalen, Tinel, Lasègue) e registrar a resposta e goniometria em graus apurada em cada membro.',
    objetivoEstrategico: 'Obrigar o perito a realizar exame clínico minucioso e registrar graus. Se o perito omitir ou fizer exame superficial de 5 minutos, o assistente técnico terá munição para lavrar parecer divergente fundamentado.',
    dicaIFH: 'Dica de ouro do curso IFHFLIX: este quesito serve como holofote para a perícia presencial.',
  },
  {
    id: 'ast-2',
    area: 'estrategicos_assistente',
    title: 'Quesito Indutor: Exclusão de Concausa por Exame Físico Negativo',
    targetRole: 'autor',
    pergunta: 'Queira o perito informar se foram aplicadas manobras de validação funcional e testes comportamentais de Waddell para investigação de componentes não-orgânicos ou simulação, e quais foram os achados objetivos observados.',
    objetivoEstrategico: 'Blindar o periciando autêntico contra insinuações de simulação pela parte adversa.',
    dicaIFH: 'Quando o periciando tem lesão real comprovada, registrar o escore 0/5 de Waddell blinda o laudo contra teses defensivas de metasimulação.',
  },
];

export interface HonorariosConfig {
  paginasProntuario: number;
  quantidadeQuesitos: number;
  horasExameClinico: number;
  horasDiscussaoRedacao: number;
  horasVistoria: number;
  valorHora: number;
  comarca: string;
  vara: string;
  numeroProcesso: string;
  autorNome: string;
  reuNome: string;
  peritoNome: string;
  peritoCrm: string;
  peritoEspecialidade: string;
}

export function calculateHonorariosHours(config: HonorariosConfig): {
  horasProntuario: number;
  horasQuesitos: number;
  horasExame: number;
  horasRedacao: number;
  horasVistoria: number;
  totalHoras: number;
  valorTotal: number;
} {
  // Fórmula IFHFLIX: 1 hora a cada 150 páginas
  const horasProntuario = Number((config.paginasProntuario / 150).toFixed(1));
  // Fórmula IFHFLIX: 5 minutos por quesito (5/60 horas)
  const horasQuesitos = Number(((config.quantidadeQuesitos * 5) / 60).toFixed(1));
  const horasExame = config.horasExameClinico;
  const horasRedacao = config.horasDiscussaoRedacao;
  const horasVistoria = config.horasVistoria;

  const totalHoras = Number(
    (horasProntuario + horasQuesitos + horasExame + horasRedacao + horasVistoria).toFixed(1)
  );
  const valorTotal = Math.round(totalHoras * config.valorHora);

  return {
    horasProntuario,
    horasQuesitos,
    horasExame,
    horasRedacao,
    horasVistoria,
    totalHoras,
    valorTotal,
  };
}

export const SCRIPT_CAPTACAO_7_PASSOS = [
  {
    step: 1,
    title: 'Passo 1: Apresentação (Quebra-gelo + Carteirada Sutil)',
    goal: 'Estabelecer autoridade técnica sem arrogância e posicionar a perícia como empresa estruturada.',
    scriptLiteral: `Olá Dr. [Nome do Advogado], tudo bem? Aqui é o Dr. [Seu Nome], sou médico e atuo como perito e consultor em perícias médicas na área cível e trabalhista. Tenho acompanhado a atuação do seu escritório na região e percebi a solidez dos processos de danos corporais e acidentes que vocês conduzem. Liguei para me colocar à disposição para estruturar a parte médica das suas ações.`,
    dicaOuro: 'Nunca se apresente como "fulano que faz laudo de bico". Apresente-se como consultoria técnica especializada.',
  },
  {
    step: 2,
    title: 'Passo 2: Conexão e Rapport com o Advogado',
    goal: 'Descobrir a dor do advogado com peritos judiciais desfavoráveis e laudos rasos.',
    scriptLiteral: `Dr. [Nome], você já deve ter passado por aquela situação em que a tese jurídica estava perfeita, mas o perito do juiz fez um exame de 5 minutos, não entendeu a profissiografia do cliente e entregou um laudo desfavorável que prejudicou toda a ação, não é? Como vocês têm lidado hoje quando isso acontece?`,
    dicaOuro: 'Faça perguntas abertas. Deixe o advogado desabafar sobre perícias judiciais ruins que ele já perdeu.',
  },
  {
    step: 3,
    title: 'Passo 3: Decisão Imediata (DI)',
    goal: 'Verificar se o interlocutor é quem decide e filtrar curiosos.',
    scriptLiteral: `Perfeito, Dr. [Nome]. Para que nosso trabalho faça sentido para o seu escritório, além de você, quem mais costuma avaliar a contratação do médico assistente técnico ou a indicação para os clientes da banca?`,
    dicaOuro: 'Se o decisor não estiver na reunião, agende com ambos presentes para evitar que o intermediário "pense a respeito".',
  },
  {
    step: 4,
    title: 'Passo 4: Apresentação do Projeto (A Esteira de Assistência Técnica)',
    goal: 'Apresentar a solução completa em vez de apenas "ir na perícia".',
    scriptLiteral: `Nossa consultoria médica não se resume a comparecer no dia do exame. Nós entregamos um pacote estratégico em 4 etapas:
1. Análise prévia de viabilidade documental (dizemos com clareza se vale a pena ou se o caso não tem nexo, economizando custas);
2. Formulação de quesitos estratégicos com "holofotes", forçando o perito judicial a investigar os pontos cruciais;
3. Acompanhamento presencial no ato pericial para garantir que o exame físico seja realizado com rigor;
4. Parecer Médico-Legal conclusivo e subsídios técnicos prontos para a petição de manifestação ou impugnação do advogado.`,
    dicaOuro: 'Venda a tranquilidade e a blindagem processual, não o tempo em horas.',
  },
  {
    step: 5,
    title: 'Passo 5: Ancoragem e Fechamento Financeiro',
    goal: 'Apresentar o investimento ancorado no risco de improcedência do processo.',
    scriptLiteral: `Dr. [Nome], em ações com pedidos indenizatórios de 100, 200 mil reais, perder a prova pericial significa a improcedência integral. O investimento para a assistência técnica completa nesse processo é de R$ [Valor, ex: 3.500 a 5.000], que pode ser parcelado [ex: entrada + saldo na entrega do parecer], ou repassado diretamente no contrato de honorários do cliente. Vamos reservar essa data na minha agenda pericial?`,
    dicaOuro: 'Nunca pergunte "quanto você acha que pode pagar?". Dê o preço com segurança e fique em silêncio.',
  },
  {
    step: 6,
    title: 'Passo 6: Superação de Objeções Clássicas',
    goal: 'Desarmar as 3 maiores barreiras do advogado.',
    scriptLiteral: `• Objeção "O cliente não tem dinheiro":
"Compreendo perfeitamente, Dr. Muitas vezes os clientes realmente estão descapitalizados pelo acidente. Nesses casos, os escritórios parceiros costumam incluir a taxa pericial no cálculo inicial de custas, permitindo parcelamento em cartão ou adicionando um percentual compensatório no êxito."

• Objeção "Eu mesmo faço os quesitos com modelos prontos da internet":
"Modelos genéricos da internet costumam ser indeferidos pelos juízes ou respondidos com 'prejudicado' pelo perito. Nossos quesitos são individualizados para os exames de imagem e para a goniometria específica daquele autor."`,
    dicaOuro: 'Valide a preocupação do advogado antes de contra-argumentar.',
  },
  {
    step: 7,
    title: 'Passo 7: Fechamento & Formalização',
    goal: 'Enviar minuta de contrato e dados para peticionamento de indicação.',
    scriptLiteral: `Excelente, Dr. [Nome]. Já estou te enviando pelo WhatsApp o modelo da petição de indicação de assistente técnico com meus dados cadastrais (CRM, especialidade e contatos) para juntada aos autos, e a minuta simplificada da nossa prestação de serviços. Já vou iniciar a análise dos prontuários!`,
    dicaOuro: 'Facilite a vida do advogado entregando a petição de indicação pronta para ele só assinar e protocolar.',
  },
];
