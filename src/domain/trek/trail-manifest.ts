export interface TrailEntry {
  gpxPath: string
  region: string
  description: string
}

export const TRAIL_MANIFEST: TrailEntry[] = [
  // Puerto Varas (3)
  {
    gpxPath: '/gpx-samples/puerto-varas/cascada-de-los-novios.gpx',
    region: 'Puerto Varas',
    description: 'Caminata corta a una cascada escondida en el bosque nativo, perfecta para familias. Cerca del centro de Puerto Varas.',
  },
  {
    gpxPath: '/gpx-samples/puerto-varas/cerro-philippi.gpx',
    region: 'Puerto Varas',
    description: 'Sendero popular desde Puerto Varas al mirador del Cerro Philippi con vistas al Lago Llanquihue y Volcán Osorno',
  },
  {
    gpxPath: '/gpx-samples/puerto-varas/costanera-llanquihue.gpx',
    region: 'Puerto Varas',
    description: 'Paseo costero plano por la ribera del Lago Llanquihue desde Puerto Varas hacia Puerto Chico',
  },

  // PN Vicente Pérez Rosales (6)
  {
    gpxPath: '/gpx-samples/pn-vpr/cerro-la-picada.gpx',
    region: 'PN Vicente Pérez Rosales',
    description: 'Ascenso al mirador con vistas panorámicas de 6 volcanes.',
  },
  {
    gpxPath: '/gpx-samples/pn-vpr/laguna-verde.gpx',
    region: 'PN Vicente Pérez Rosales',
    description: 'Paseo familiar por bosque siempreverde hasta laguna esmeralda.',
  },
  {
    gpxPath: '/gpx-samples/pn-vpr/paso-desolacion.gpx',
    region: 'PN Vicente Pérez Rosales',
    description: 'Travesía clásica del parque conectando La Picada con Petrohué.',
  },
  {
    gpxPath: '/gpx-samples/pn-vpr/saltos-petrohue.gpx',
    region: 'PN Vicente Pérez Rosales',
    description: 'Circuito por los senderos del Parque Nacional Vicente Pérez Rosales, pasando por los Saltos del Petrohué y miradores al Volcán Osorno',
  },
  {
    gpxPath: '/gpx-samples/pn-vpr/sendero-el-solitario.gpx',
    region: 'PN Vicente Pérez Rosales',
    description: 'Sendero por la ladera sur del Volcán Osorno con vistas al lago.',
  },
  {
    gpxPath: '/gpx-samples/pn-vpr/sendero-los-alerces.gpx',
    region: 'PN Vicente Pérez Rosales',
    description: 'Travesía por bosques de alerces centenarios con vistas al Lago Todos los Santos.',
  },

  // Volcán Osorno (3)
  {
    gpxPath: '/gpx-samples/volcan-osorno/ascenso-volcan-osorno.gpx',
    region: 'Volcán Osorno',
    description: 'Ascenso técnico al cráter (2652m). Requiere crampones y guía.',
  },
  {
    gpxPath: '/gpx-samples/volcan-osorno/circuito-telesilla.gpx',
    region: 'Volcán Osorno',
    description: 'Circuito por el centro de esquí del Volcán Osorno.',
  },
  {
    gpxPath: '/gpx-samples/volcan-osorno/crater-rojo.gpx',
    region: 'Volcán Osorno',
    description: 'Caminata al borde del cráter del Volcán Osorno.',
  },

  // Frutillar (2)
  {
    gpxPath: '/gpx-samples/frutillar/mirador-teatro-del-lago.gpx',
    region: 'Frutillar',
    description: 'Paseo costero por Frutillar con vistas al lago.',
  },
  {
    gpxPath: '/gpx-samples/frutillar/playa-maqui.gpx',
    region: 'Frutillar',
    description: 'Caminata a la playa Maqui con vistas al lago Llanquihue.',
  },

  // Puerto Octay (2)
  {
    gpxPath: '/gpx-samples/pto-octay/mirador-pirepillan.gpx',
    region: 'Puerto Octay',
    description: 'Ruta panorámica con vistas del lago Llanquihue.',
  },
  {
    gpxPath: '/gpx-samples/pto-octay/salto-las-cascadas.gpx',
    region: 'Puerto Octay',
    description: 'Sendero fácil por bosque nativo hasta cascada de 50m.',
  },

  // Lago Chapo (3)
  {
    gpxPath: '/gpx-samples/lago-chapo/cascadas-rio-amarillo.gpx',
    region: 'Lago Chapo',
    description: 'Ruta exigente con 645m de desnivel.',
  },
  {
    gpxPath: '/gpx-samples/lago-chapo/salto-rio-este.gpx',
    region: 'Lago Chapo',
    description: 'Sendero a cascada del Río Este en laderas del Calbuco.',
  },
  {
    gpxPath: '/gpx-samples/lago-chapo/volcan-calbuco.gpx',
    region: 'Lago Chapo',
    description: 'Ascenso exigente al volcán activo (2015m).',
  },

  // Cochamó (3)
  {
    gpxPath: '/gpx-samples/cochamo/cochamo-la-junta.gpx',
    region: 'Cochamó',
    description: 'Sendero principal del Valle de Cochamó, el Yosemite de Chile.',
  },
  {
    gpxPath: '/gpx-samples/cochamo/laguna-trinidad.gpx',
    region: 'Cochamó',
    description: 'Sendero remoto hacia laguna alpina en bosque primario.',
  },
  {
    gpxPath: '/gpx-samples/cochamo/sendero-arco-iris.gpx',
    region: 'Cochamó',
    description: 'Ascenso desafiante desde La Junta con vistas a paredes de granito.',
  },

  // Puelo (3)
  {
    gpxPath: '/gpx-samples/puelo/cascada-llanada-grande.gpx',
    region: 'Puelo',
    description: 'Caminata familiar a cascada en el Valle del Puelo.',
  },
  {
    gpxPath: '/gpx-samples/puelo/cerro-ano-nuevo.gpx',
    region: 'Puelo',
    description: 'Ascenso al filo de cumbre con vistas panorámicas del Puelo.',
  },
  {
    gpxPath: '/gpx-samples/puelo/lago-azul.gpx',
    region: 'Puelo',
    description: 'Caminata al Lago Azul de aguas turquesas.',
  },

  // Parque Alerce Andino (4)
  {
    gpxPath: '/gpx-samples/alerce-andino/laguna-chaiquenes.gpx',
    region: 'Parque Alerce Andino',
    description: 'Ruta larga por bosque profundo hasta lagunas Chaiquenes y Triángulo.',
  },
  {
    gpxPath: '/gpx-samples/alerce-andino/laguna-sargazo.gpx',
    region: 'Parque Alerce Andino',
    description: 'Sendero a la Laguna Sargazo por bosques de alerces milenarios.',
  },
  {
    gpxPath: '/gpx-samples/alerce-andino/salto-rio-chaicas.gpx',
    region: 'Parque Alerce Andino',
    description: 'Sendero por sector Chaicas hasta cascada en bosque nativo.',
  },
  {
    gpxPath: '/gpx-samples/alerce-andino/sendero-huillifotem.gpx',
    region: 'Parque Alerce Andino',
    description: 'Sendero corto y familiar para observación de aves.',
  },

  // Río Maullín (3)
  {
    gpxPath: '/gpx-samples/maullin/humedal-de-quenuir.gpx',
    region: 'Río Maullín',
    description: 'Recorrido por humedal protegido con más de 68 especies de aves.',
  },
  {
    gpxPath: '/gpx-samples/maullin/mirador-san-pedro.gpx',
    region: 'Río Maullín',
    description: 'Paseo costero en Carelmapu con vistas al mar y Chiloé.',
  },
  {
    gpxPath: '/gpx-samples/maullin/playa-quenuir-bajo.gpx',
    region: 'Río Maullín',
    description: 'Caminata larga por playa extensa, paisajes costeros.',
  },
]
