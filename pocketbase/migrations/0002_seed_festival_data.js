migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'tecnocok@gmail.com')
    } catch (_) {
      const admin = new Record(users)
      admin.setEmail('tecnocok@gmail.com')
      admin.setPassword('Skip@Pass')
      admin.setVerified(true)
      admin.set('name', 'Admin Puma Punku')
      app.save(admin)
    }

    const editionCollection = app.findCollectionByNameOrId('editions')
    const editionSeeds = [
      [
        2023,
        'Edição 2023',
        'A primeira travessia do Puma Punku nasceu no coração místico de São Thomé das Letras. Uma noite íntima de música eletrônica, encontros e natureza que deu origem à nossa tribo.',
        '10h de música · 1 palco · 800 pessoas',
      ],
      [
        2024,
        'Edição 2024',
        'Nossa expansão para dois palcos conectou novas vertentes, instalações de arte e uma pista que dançou do pôr do sol ao amanhecer entre as montanhas de Minas.',
        '16h de música · 2 palcos · 1.400 pessoas',
      ],
      [
        2025,
        'Edição 2025',
        'A maior edição até aqui reuniu um lineup nacional de psytrance e techno, experiências sensoriais e uma comunidade vibrante em dois dias inesquecíveis.',
        '24h de música · 3 palcos · 2.000 pessoas',
      ],
    ]
    for (const item of editionSeeds) {
      try {
        app.findFirstRecordByData('editions', 'year', item[0])
      } catch (_) {
        const record = new Record(editionCollection)
        record.set('year', item[0])
        record.set('title', item[1])
        record.set('description', item[2])
        record.set('stats_public', item[3])
        app.save(record)
      }
    }

    const linkCollection = app.findCollectionByNameOrId('links')
    const linkSeeds = [
      ['WhatsApp Oficial', 'https://wa.me/55XXXXXXXXXXX', 'whatsapp', true, 1],
      ['Instagram @pumapunku', 'https://instagram.com/pumapunku', 'instagram', false, 2],
      ['Garantir Ingresso', 'https://ingressos.exemplo.com/pumapunku2026', 'ticket', true, 3],
    ]
    for (const item of linkSeeds) {
      try {
        app.findFirstRecordByData('links', 'label', item[0])
      } catch (_) {
        const record = new Record(linkCollection)
        record.set('label', item[0])
        record.set('url', item[1])
        record.set('icon', item[2])
        record.set('highlight', item[3])
        record.set('sort_order', item[4])
        record.set('active', true)
        app.save(record)
      }
    }

    const leadCollection = app.findCollectionByNameOrId('leads')
    const leadSeeds = [
      [
        'Marina Costa',
        'marina.costa@example.com',
        '(11) 98876-2211',
        'landing',
        'lineup',
        true,
        '2026-08-07 14:20:00.000Z',
      ],
      [
        'Lucas Ribeiro',
        'lucas.ribeiro@example.com',
        '(31) 99712-8834',
        'instagram',
        'ingresso',
        true,
        '2026-08-12 18:10:00.000Z',
      ],
      [
        'Beatriz Santos',
        'bia.santos@example.com',
        '(21) 99221-7604',
        'whatsapp',
        'experiencia',
        true,
        '2026-08-18 11:45:00.000Z',
      ],
      [
        'Rafael Moura',
        'rafael.moura@example.com',
        '(35) 99103-5520',
        'tickets',
        'ingresso',
        false,
        '2026-08-23 20:15:00.000Z',
      ],
      [
        'Camila Nunes',
        'camila.nunes@example.com',
        '(19) 99822-1043',
        'landing',
        'parceria',
        true,
        '2026-08-27 09:30:00.000Z',
      ],
      [
        'Thiago Freitas',
        'thiago.freitas@example.com',
        '(41) 99651-3308',
        'instagram',
        'lineup',
        true,
        '2026-08-30 16:00:00.000Z',
      ],
      [
        'Ana Clara Lima',
        'ana.lima@example.com',
        '(51) 99177-4092',
        'landing',
        'experiencia',
        true,
        '2026-09-01 13:25:00.000Z',
      ],
      [
        'Diego Martins',
        'diego.martins@example.com',
        '(11) 98714-6651',
        'whatsapp',
        'ingresso',
        true,
        '2026-09-02 19:40:00.000Z',
      ],
      [
        'Júlia Rocha',
        'julia.rocha@example.com',
        '(31) 99880-2175',
        'landing',
        'lineup',
        true,
        '2026-09-03 10:05:00.000Z',
      ],
      [
        'Pedro Almeida',
        'pedro.almeida@example.com',
        '(27) 99242-7870',
        'tickets',
        'ingresso',
        true,
        '2026-09-04 17:55:00.000Z',
      ],
    ]
    for (const item of leadSeeds) {
      try {
        app.findFirstRecordByData('leads', 'email', item[1])
      } catch (_) {
        const record = new Record(leadCollection)
        record.set('name', item[0])
        record.set('email', item[1])
        record.set('phone', item[2])
        record.set('source', item[3])
        record.set('interest', item[4])
        record.set('consent', item[5])
        app.save(record)
        app
          .db()
          .newQuery('UPDATE leads SET created = {:created}, updated = {:created} WHERE id = {:id}')
          .bind({ created: item[6], id: record.id })
          .execute()
      }
    }
  },
  (app) => {
    const emails = [
      'marina.costa@example.com',
      'lucas.ribeiro@example.com',
      'bia.santos@example.com',
      'rafael.moura@example.com',
      'camila.nunes@example.com',
      'thiago.freitas@example.com',
      'ana.lima@example.com',
      'diego.martins@example.com',
      'julia.rocha@example.com',
      'pedro.almeida@example.com',
    ]
    for (const email of emails) {
      try {
        app.delete(app.findFirstRecordByData('leads', 'email', email))
      } catch (_) {}
    }
    for (const label of ['WhatsApp Oficial', 'Instagram @pumapunku', 'Garantir Ingresso']) {
      try {
        app.delete(app.findFirstRecordByData('links', 'label', label))
      } catch (_) {}
    }
    for (const year of [2023, 2024, 2025]) {
      try {
        app.delete(app.findFirstRecordByData('editions', 'year', year))
      } catch (_) {}
    }
    try {
      app.delete(app.findAuthRecordByEmail('_pb_users_auth_', 'tecnocok@gmail.com'))
    } catch (_) {}
  },
)
