migrate(
  (app) => {
    const siteContent = new Collection({
      name: 'site_content',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'key', type: 'text', required: true, min: 2, max: 120 },
        { name: 'value', type: 'text', max: 50000 },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['text', 'richtext', 'image', 'color', 'font', 'url'],
          maxSelect: 1,
        },
        {
          name: 'image_file',
          type: 'file',
          maxSelect: 1,
          maxSize: 20971520,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'],
        },
        { name: 'label', type: 'text', max: 150 },
        { name: 'section', type: 'text', max: 80 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_site_content_key ON site_content (key)',
        'CREATE INDEX idx_site_content_section ON site_content (section)',
      ],
    })
    app.save(siteContent)

    // Sementes iniciais completas com todo o conteúdo atual da Landing Page
    const seeds = [
      // Configurações Globais / Identidade Visual
      {
        key: 'theme_color_bg',
        value: '#F2E9D3',
        type: 'color',
        label: 'Cor de Fundo Principal (Creme)',
        section: 'Identidade & Tema',
      },
      {
        key: 'theme_color_text',
        value: '#181410',
        type: 'color',
        label: 'Cor de Texto Principal (Preto)',
        section: 'Identidade & Tema',
      },
      {
        key: 'theme_color_primary',
        value: '#E8622C',
        type: 'color',
        label: 'Acento Laranja Tropical (Destaque)',
        section: 'Identidade & Tema',
      },
      {
        key: 'theme_color_secondary',
        value: '#2E6B4F',
        type: 'color',
        label: 'Acento Verde Floresta / Folha',
        section: 'Identidade & Tema',
      },
      {
        key: 'theme_color_gold',
        value: '#C9962E',
        type: 'color',
        label: 'Acento Dourado / Sol',
        section: 'Identidade & Tema',
      },
      {
        key: 'theme_font_display',
        value: 'Archivo Black',
        type: 'font',
        label: 'Fonte de Títulos & Display',
        section: 'Identidade & Tema',
      },

      // Hero / Capa
      {
        key: 'hero_badge',
        value: '04 & 05 Julho · São Thomé das Letras – MG',
        type: 'text',
        label: 'Badge Superior (Data e Local)',
        section: 'Hero',
      },
      {
        key: 'hero_title_line1',
        value: 'Puma Punku',
        type: 'text',
        label: 'Título Principal Linha 1',
        section: 'Hero',
      },
      {
        key: 'hero_title_line2',
        value: 'Festival 2026',
        type: 'text',
        label: 'Título Principal Linha 2 (Destaque)',
        section: 'Hero',
      },
      {
        key: 'hero_subtitle',
        value:
          'Dois dias entre montanhas, música e mistério. Atravesse o portal para uma experiência que pulsa além da pista.',
        type: 'richtext',
        label: 'Subtítulo do Hero',
        section: 'Hero',
      },
      {
        key: 'hero_btn_primary_label',
        value: 'Garantir meu lugar',
        type: 'text',
        label: 'Texto Botão Principal',
        section: 'Hero',
      },
      {
        key: 'hero_btn_primary_url',
        value: '#contato',
        type: 'url',
        label: 'Link Botão Principal',
        section: 'Hero',
      },
      {
        key: 'hero_btn_secondary_label',
        value: 'Ver edições passadas',
        type: 'text',
        label: 'Texto Botão Secundário',
        section: 'Hero',
      },
      {
        key: 'hero_btn_secondary_url',
        value: '#edicoes',
        type: 'url',
        label: 'Link Botão Secundário',
        section: 'Hero',
      },
      {
        key: 'hero_bg_banner',
        value: '',
        type: 'image',
        label: 'Banner / Imagem de Fundo do Hero (Opcional)',
        section: 'Hero',
      },

      // Letreiro Rotativo (Marquee)
      {
        key: 'marquee_text',
        value: 'PUMA PUNKU FESTIVAL ✦ 04 & 05 JULHO 2026 ✦ SÃO THOMÉ DAS LETRAS ✦',
        type: 'text',
        label: 'Texto do Letreiro Rotativo',
        section: 'Marquee',
      },

      // Seção "O Festival"
      {
        key: 'festival_eyebrow',
        value: 'O festival',
        type: 'text',
        label: 'Subtítulo / Eyebrow',
        section: 'O Festival',
      },
      {
        key: 'festival_title',
        value: 'Onde a pista encontra o extraordinário.',
        type: 'text',
        label: 'Título da Seção',
        section: 'O Festival',
      },
      {
        key: 'festival_description',
        value:
          'No alto das montanhas de São Thomé, o Puma Punku abre um portal para dois dias de música eletrônica, arte, natureza e conexão. Uma celebração que nasce da terra, atravessa a madrugada e fica para sempre.',
        type: 'richtext',
        label: 'Texto Descritivo Principal',
        section: 'O Festival',
      },
      {
        key: 'festival_pill_1',
        value: 'Imersão na natureza',
        type: 'text',
        label: 'Pílula de Destaque 1',
        section: 'O Festival',
      },
      {
        key: 'festival_pill_2',
        value: 'Arte & ancestralidade',
        type: 'text',
        label: 'Pílula de Destaque 2',
        section: 'O Festival',
      },
      {
        key: 'festival_stat1_number',
        value: '24',
        type: 'text',
        label: 'Estatística 1 - Número',
        section: 'O Festival',
      },
      {
        key: 'festival_stat1_label',
        value: 'horas de música',
        type: 'text',
        label: 'Estatística 1 - Rótulo',
        section: 'O Festival',
      },
      {
        key: 'festival_stat2_number',
        value: '03',
        type: 'text',
        label: 'Estatística 2 - Número',
        section: 'O Festival',
      },
      {
        key: 'festival_stat2_label',
        value: 'palcos vivos',
        type: 'text',
        label: 'Estatística 2 - Rótulo',
        section: 'O Festival',
      },
      {
        key: 'festival_stat3_number',
        value: '04',
        type: 'text',
        label: 'Estatística 3 - Número',
        section: 'O Festival',
      },
      {
        key: 'festival_stat3_label',
        value: 'edições realizadas',
        type: 'text',
        label: 'Estatística 3 - Rótulo',
        section: 'O Festival',
      },

      // Seção Edições Anteriores
      {
        key: 'editions_eyebrow',
        value: 'Nossa história',
        type: 'text',
        label: 'Subtítulo / Eyebrow',
        section: 'Edições Anteriores',
      },
      {
        key: 'editions_title',
        value: 'Edições anteriores',
        type: 'text',
        label: 'Título da Seção',
        section: 'Edições Anteriores',
      },
      {
        key: 'editions_subtitle',
        value: 'Cada edição, um novo portal.\nReviva os capítulos da nossa história.',
        type: 'richtext',
        label: 'Texto Lateral',
        section: 'Edições Anteriores',
      },

      // Seção Galeria de Memórias
      {
        key: 'gallery_eyebrow',
        value: 'Memórias da pista',
        type: 'text',
        label: 'Subtítulo / Eyebrow',
        section: 'Galeria',
      },
      {
        key: 'gallery_title',
        value: 'Você precisa sentir.',
        type: 'text',
        label: 'Título da Galeria',
        section: 'Galeria',
      },

      // Seção Formulário "Entre na Tribo"
      {
        key: 'tribo_eyebrow',
        value: 'Faça parte desde agora',
        type: 'text',
        label: 'Subtítulo / Eyebrow',
        section: 'Formulário Tribo',
      },
      {
        key: 'tribo_title',
        value: 'Entre na tribo',
        type: 'text',
        label: 'Título Principal',
        section: 'Formulário Tribo',
      },
      {
        key: 'tribo_description',
        value: 'Receba primeiro o lineup, pré-venda exclusiva e condições especiais de ingresso.',
        type: 'richtext',
        label: 'Subtítulo / Chamada',
        section: 'Formulário Tribo',
      },
      {
        key: 'tribo_banner',
        value: '',
        type: 'image',
        label: 'Banner / Fundo da Seção Tribo (Opcional)',
        section: 'Formulário Tribo',
      },

      // Seção Conecte-se / Sinais
      {
        key: 'connect_eyebrow',
        value: 'Conecte-se',
        type: 'text',
        label: 'Subtítulo / Eyebrow',
        section: 'Conexão & Redes',
      },
      {
        key: 'connect_title',
        value: 'Siga os sinais',
        type: 'text',
        label: 'Título da Seção',
        section: 'Conexão & Redes',
      },

      // Seção Destino / Localização
      {
        key: 'location_eyebrow',
        value: 'O destino',
        type: 'text',
        label: 'Subtítulo / Eyebrow',
        section: 'Localização',
      },
      {
        key: 'location_title',
        value: 'São Thomé das Letras · MG',
        type: 'text',
        label: 'Nome do Destino',
        section: 'Localização',
      },
      {
        key: 'location_description',
        value: 'Montanhas, misticismo e uma vista inesquecível.',
        type: 'text',
        label: 'Descrição Curta do Destino',
        section: 'Localização',
      },
      {
        key: 'location_maps_url',
        value: 'https://maps.google.com/?q=São+Thomé+das+Letras+MG',
        type: 'url',
        label: 'Link Google Maps',
        section: 'Localização',
      },
      {
        key: 'location_btn_label',
        value: 'Abrir no Google Maps',
        type: 'text',
        label: 'Texto do Botão Maps',
        section: 'Localização',
      },

      // Rodapé
      {
        key: 'footer_tagline',
        value: 'Música, natureza e ancestralidade em uma experiência além da pista.',
        type: 'text',
        label: 'Frase do Rodapé',
        section: 'Rodapé',
      },
      {
        key: 'footer_dates',
        value: '04 & 05 JULHO',
        type: 'text',
        label: 'Datas do Festival',
        section: 'Rodapé',
      },
      {
        key: 'footer_place',
        value: 'São Thomé das Letras · MG',
        type: 'text',
        label: 'Local do Festival',
        section: 'Rodapé',
      },
      {
        key: 'footer_copyright',
        value: 'Puma Punku Festival · 04 & 05 Julho 2026 · São Thomé das Letras – MG',
        type: 'text',
        label: 'Texto de Copyright',
        section: 'Rodapé',
      },
    ]

    for (const item of seeds) {
      try {
        app.findFirstRecordByData('site_content', 'key', item.key)
      } catch (_) {
        const record = new Record(siteContent)
        record.set('key', item.key)
        record.set('value', item.value)
        record.set('type', item.type)
        record.set('label', item.label)
        record.set('section', item.section)
        app.save(record)
      }
    }
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('site_content'))
    } catch (_) {}
  },
)
