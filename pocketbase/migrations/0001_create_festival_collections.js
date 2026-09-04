migrate(
  (app) => {
    const editions = new Collection({
      name: 'editions',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true, min: 2, max: 180 },
        { name: 'year', type: 'number', required: true, onlyInt: true, min: 2020, max: 2100 },
        { name: 'description', type: 'text', required: true, min: 10, max: 10000 },
        { name: 'stats_public', type: 'text', max: 500 },
        {
          name: 'cover',
          type: 'file',
          maxSelect: 1,
          maxSize: 15728640,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
          thumbs: ['480x320', '1200x800'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_editions_year ON editions (year)',
        'CREATE INDEX idx_editions_created ON editions (created)',
      ],
    })
    app.save(editions)

    const media = new Collection({
      name: 'media',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'edition',
          type: 'relation',
          required: true,
          collectionId: editions.id,
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1,
        },
        {
          name: 'file',
          type: 'file',
          required: true,
          maxSelect: 1,
          maxSize: 52428800,
          mimeTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/avif',
            'image/gif',
            'video/mp4',
            'video/webm',
            'video/quicktime',
          ],
        },
        { name: 'type', type: 'select', required: true, values: ['image', 'video'], maxSelect: 1 },
        { name: 'caption', type: 'text', max: 1000 },
        { name: 'sort_order', type: 'number', onlyInt: true, min: 0 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_media_edition ON media (edition)'],
    })
    app.save(media)

    const leads = new Collection({
      name: 'leads',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: '',
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true, min: 2, max: 180 },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text', required: true, min: 10, max: 20 },
        {
          name: 'source',
          type: 'select',
          required: true,
          values: ['landing', 'whatsapp', 'instagram', 'tickets'],
          maxSelect: 1,
        },
        {
          name: 'interest',
          type: 'select',
          values: ['ingresso', 'lineup', 'experiencia', 'parceria'],
          maxSelect: 1,
        },
        { name: 'consent', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_leads_email ON leads (email)',
        'CREATE INDEX idx_leads_created ON leads (created)',
        'CREATE INDEX idx_leads_source ON leads (source)',
      ],
    })
    app.save(leads)

    const links = new Collection({
      name: 'links',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'label', type: 'text', required: true, min: 2, max: 120 },
        { name: 'url', type: 'url', required: true },
        {
          name: 'icon',
          type: 'select',
          required: true,
          values: ['whatsapp', 'instagram', 'ticket', 'map', 'email'],
          maxSelect: 1,
        },
        { name: 'highlight', type: 'bool' },
        { name: 'sort_order', type: 'number', onlyInt: true, min: 0 },
        { name: 'active', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(links)
  },
  (app) => {
    for (const name of ['media', 'leads', 'links', 'editions']) {
      try {
        app.delete(app.findCollectionByNameOrId(name))
      } catch (_) {}
    }
  },
)
