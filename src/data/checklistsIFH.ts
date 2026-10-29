export interface ChecklistGroup {
  title: string;
  items: string[];
}

export interface ChecklistDef {
  id: string;
  label: string;
  fonte: string;
  groups: ChecklistGroup[];
}

export const CHECKLISTS_IFH: ChecklistDef[] = [
  {
    id: 'cadastro',
    label: 'Cadastro em Tribunais',
    fonte: 'Template IFHFLIX — cadastro em tribunais e primeiras nomeações',
    groups: [
      {
        title: 'Antes do cadastro',
        items: [
          'Definiu o tipo de perícia que pretende realizar',
          'Identificou o(s) tribunal(is) correspondente(s) (TJ, TRF, TRT)',
          'Criou e-mail exclusivo para perícias',
          'Preparou foto profissional (preferencialmente com jaleco)',
          'Conferiu CRM ativo no estado (ou visto provisório)',
          'Organizou diploma e certificado de treinamento em perícia',
          'Preparou currículo resumido (1 página, especialidades em negrito)',
          'Levantou certidões negativas cíveis e criminais',
          'Preparou modelo de laudo (sem dados identificáveis das partes)',
          'Verificou se o tribunal exige ISS antes de fazer cadastro municipal',
        ],
      },
      {
        title: 'Durante o cadastro',
        items: [
          'Buscou no Google o link de cadastro do tribunal',
          'Preencheu todos os dados pessoais, financeiros e profissionais',
          'Anexou todos os documentos solicitados',
          'Cadastrou-se na AJG (se atuará em previdenciária ou AJG)',
          'Enviou e-mail para a AJG solicitando avaliação acelerada',
          'Cadastrou-se em TODOS os tribunais relevantes (TJ + TRF + TRT)',
          'Colocou todas as especialidades no cadastro',
          'Preencheu bio/apresentação no sistema do tribunal estrategicamente',
        ],
      },
      {
        title: 'Após o cadastro (ativar)',
        items: [
          'Verificou que o cadastro está ATIVO no sistema',
          'Se pendente, ligou na vara/tribunal para acelerar a validação',
          'Obteve acesso ao PJe (sistema de processos)',
          'Validou login no sistema de cadastro E no sistema de processos',
          'Certificado digital instalado e funcionando (CFM gratuito)',
        ],
      },
      {
        title: 'Prospecção ativa (primeiras nomeações)',
        items: [
          'Pesquisou contatos (e-mail e telefone) das varas no Google',
          'Montou lista de varas-alvo (cíveis, previdenciárias, família, trabalho)',
          'Enviou e-mail de apresentação para juízes e diretores de secretaria',
          'Anexou currículo + modelo de laudo no e-mail',
          'Ligou para as varas para follow-up',
          'Visitou presencialmente pelo menos as varas mais próximas',
          'Levou currículo impresso + modelo de laudo em pasta',
          'Procurou juiz E diretor da vara',
          'Criou planilha de controle de envios/respostas',
        ],
      },
      {
        title: 'Após a primeira nomeação',
        items: [
          'Verificou suspensão, impugnação ou questão processual pendente',
          'Apresentou proposta de honorários e currículo (se aplicável)',
          'Ligou para a vara perguntando se há mais perícias para o mesmo dia',
          'Enviou e-mail para outras varas do mesmo fórum convidando',
          'Prospectou outras varas da mesma cidade/região',
          'Avaliou se vale a pena perícia em cidade distante (negociar volume)',
        ],
      },
      {
        title: 'Gestão contínua',
        items: [
          'Diluiu receita entre múltiplas varas e juízes',
          'Diversificou entre TJ, TRF e TRT',
          'Prospectou perícia particular (além da judicial)',
          'Monitorou pagamentos de cada vara',
          'Follow-up periódico (reenvio a cada 15-20 dias para não respondedores)',
        ],
      },
    ],
  },
  {
    id: 'laudo',
    label: 'Laudo Judicial (pré-entrega)',
    fonte: 'Template IFHFLIX — laudo pericial judicial, seção 5',
    groups: [
      {
        title: 'Estrutura e forma',
        items: [
          'Timbrado profissional com logo/marca d\'água adequada',
          'Endereçamento correto (vara, esfera, juiz)',
          'Preâmbulo completo (nome, CRM-UF, RQE, formação, data, local, horário, assistentes técnicos)',
          'Qualificação do periciando completa',
          'Quesitos na ordem: Juízo → Autor → Réu → demais',
          'Se o juiz não formulou quesitos: suprimir ou listar pontos controvertidos',
          'Histórico: petição inicial + contestação + relato + documentos (ordem cronológica)',
          'Documentos numerados e em ordem cronológica de cima para baixo',
          'Descrição: exame físico geral + especial + registros fotográficos + vistoria (se aplicável)',
          'Discussão com subtópicos numerados (introdução + metodologia + análise + literatura)',
          'Metodologia descrita (parágrafo obrigatório)',
          'Conclusão em tópicos, objetiva, limitada ao objeto da perícia',
          'Resposta aos quesitos: quesito copiado + resposta objetiva (em negrito)',
          'Ordem das respostas: Juízo → Autor → Réu',
          'Referências bibliográficas',
          'Encerramento: local, data, assinatura, "Médico Perito Judicial", CRM-UF',
          'Texto de encerramento na mesma página da assinatura',
          'Numeração de páginas em todas as folhas',
          'Total de laudas indicado',
          'Sem espaçamentos excessivos entre tópicos',
          'Formatação consistente (mesma fonte, tamanho, estilo)',
          'Texto justificado (sugestão estética)',
        ],
      },
      {
        title: 'Conteúdo',
        items: [
          'Objeto da perícia claramente exposto',
          'Metodologia reprodutível e aceita pela área',
          'Relato do periciando com preservação de autoria ("relatou que informou")',
          'Exame físico inclui apenas o que interessa ao objeto da perícia',
          'Discussão permite antever a conclusão antes de lê-la',
          'Critérios de nexo (Miller, Cordonnier, Schilling) na discussão — não na conclusão',
          'Tudo que está na conclusão já foi discutido na discussão',
          'Conclusão é resumo objetivo, limitada ao objeto da perícia',
          'Respostas congruentes com discussão e conclusão',
          'Sem opiniões sobre culpa, responsabilidade, dano moral/material',
          'Sem termos técnicos sem tradução',
          'Linguagem simples e coerente (entendível por leigos)',
          'Documentos traduzidos/transcritos com aspas quando citados',
        ],
      },
      {
        title: 'Proteção contra fraude/impugnação',
        items: [
          'Paginação em cada página ("página X de Y")',
          'Texto de encerramento + assinatura na mesma página',
          'Sem espaçamentos grandes entre tópicos',
          'Total de laudas indicado',
          'Frase de encerramento com cláusula sobre novos documentos',
        ],
      },
    ],
  },
  {
    id: 'impugnacao',
    label: 'Manifestação ao Laudo',
    fonte: 'Template IFHFLIX — impugnação e manifestação ao laudo, seção 5',
    groups: [
      {
        title: 'Antes de redigir',
        items: [
          'Verificar prazo processual (15 dias úteis no cível/previdenciária; mesmo prazo do perito na trabalhista)',
          'Confirmar se o juiz já abriu o prazo de impugnação',
          'Prazo conta a partir do dia seguinte à intimação; dias úteis (cível) ou contínuos (trabalhista)',
          'Se o último dia for feriado, prazo se estende ao próximo dia útil',
          'Reunir: laudo completo, petição inicial, contestação, decisão saneadora, todos os quesitos, documentos médicos dos autos',
        ],
      },
      {
        title: 'Na redação',
        items: [
          'Título: "PARECER MÉDICO-LEGAL DE MANIFESTAÇÃO AO LAUDO PERICIAL" (não "Impugnação")',
          'Endereçamento correto (vara, comarca, tipo de juiz)',
          'Identificação do processo e das partes com terminologia consistente',
          'Qualificação do assistente técnico (CRM, RQE, formação)',
          'Metodologia descrita (análise documental + revisão da literatura)',
          'Cada ponto contestado: trecho do laudo → COMENTÁRIOS',
          'Argumentação baseada em literatura médica, documentos dos autos e normas legais',
          'Termos médicos traduzidos para linguagem acessível ao juiz leigo',
          'Formatação facilita recorte/destaque (sem informação quebrada entre páginas)',
          'Referências bibliográficas em formato de trabalho científico',
          'Quesitos de esclarecimento (se necessário): específicos, encadeados, curtos, sem perguntas de julgamento',
          'Encerramento com disponibilidade para esclarecimentos',
          'Assinatura + CRM + número de folhas',
        ],
      },
      {
        title: 'Após redigir',
        items: [
          'Nenhuma informação começa em uma página e termina em outra',
          'Nenhuma menção a "paciente" (usar "periciando/periciado")',
          'Nenhuma afirmação sobre exame físico ou relato que não se acompanhou presencialmente',
          'Nenhuma citação seletiva (só partes favoráveis)',
          'Nomenclatura "parecer" (não "laudo" nem "impugnação") no título',
          'Entregar ao advogado com tempo para leitura e revisão',
          'Protocolar nos autos dentro do prazo',
        ],
      },
    ],
  },
];
