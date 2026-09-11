import type enHelp from '../en/help'

const help: typeof enHelp = {
  title: 'Centro de ayuda',
  subtitle: 'Encuentra respuestas, guías y soporte para todo LeadEasyGen.',
  search: {
    label: 'Buscar en el centro de ayuda',
    placeholder: 'Busca artículos de ayuda, guías y preguntas frecuentes…',
  },
  actions: {
    liveChat: 'Chat en vivo',
    contactSupport: 'Contactar con soporte',
  },
  soon: {
    toast: '{label} aún no está disponible',
    description: 'Próximamente.',
    liveChat: 'El chat en vivo',
    articleLibrary: 'La biblioteca completa de artículos',
    tutorialLibrary: 'La biblioteca de tutoriales',
    statusPage: 'La página de estado',
  },
  popular: {
    title: 'Artículos populares',
    subtitle: 'Explora nuestras guías y recursos más útiles.',
    empty: 'Ningún artículo coincide con tu búsqueda.',
    viewAll: 'Ver todos los artículos',
  },
  faq: {
    title: 'Preguntas frecuentes',
    subtitle: 'Respuestas rápidas a preguntas habituales.',
    empty: 'Ninguna pregunta frecuente coincide con tu búsqueda.',
    contact: '¿Aún necesitas ayuda? Contacta con soporte',
  },
  faqs: [
    {
      id: 'credits',
      title: '¿Cómo funcionan los créditos?',
      content:
        'Compras paquetes de créditos a través de Stripe y nunca caducan. Cada tarea de extracción descuenta créditos según su alcance: una base de 10, más 2 por palabra clave, más un cargo por distancia según el radio de búsqueda. El formulario muestra el coste exacto antes de empezar.',
    },
    {
      id: 'data',
      title: '¿Qué datos devuelve una extracción?',
      content:
        'Nombre del negocio, categoría, valoración, número de reseñas, teléfono, sitio web, dirección y las direcciones de correo descubiertas. Todas las tareas completadas se exportan a CSV.',
    },
    {
      id: 'failed',
      title: '¿Por qué falló mi tarea?',
      content:
        'Las fuentes cambian de vez en cuando el diseño de sus páginas o limitan las peticiones de los extractores. Las tareas fallidas y canceladas se reembolsan automáticamente a tu saldo de créditos; puedes ver cada reembolso en Facturación, en Actividad de créditos.',
    },
    {
      id: 'limits',
      title: '¿Hay un límite de leads que puedo extraer?',
      content:
        'El plan Gratis permite 1 tarea activa a la vez; el plan Ilimitado elimina los límites de tareas y de créditos. Más allá de eso, tu saldo de créditos es el único tope práctico.',
    },
    {
      id: 'refunds',
      title: '¿Puedo pedir un reembolso?',
      content:
        'Los créditos comprados no son reembolsables, así que empieza con un paquete pequeño para validar el servicio en tu caso de uso. Las tareas fallidas y canceladas siempre devuelven sus créditos automáticamente.',
    },
  ],
  tutorials: {
    title: 'Tutoriales en vídeo',
    subtitle: 'Aprende de forma visual con guías paso a paso.',
    viewAll: 'Ver todos los tutoriales',
    items: [
      { id: 't1', title: 'Recorrido completo por la plataforma', duration: '12:34' },
      { id: 't2', title: 'Cómo lanzar una extracción de leads', duration: '8:45' },
      { id: 't3', title: 'Del lead al presupuesto', duration: '15:21' },
      { id: 't4', title: 'Exportación a CSV e integraciones', duration: '10:15' },
    ],
  },
  contact: {
    title: 'Contactar con soporte',
    subtitle: 'Recibe ayuda personalizada de nuestro equipo.',
    liveChat: 'Chat en vivo',
    liveChatNote: 'Incluido en los planes de pago',
    email: 'Soporte por correo',
    responseTime: 'Tiempo de respuesta',
    responseValue: 'Normalmente menos de 2 horas',
    startChat: 'Iniciar chat en vivo',
    sendEmail: 'Enviar correo',
  },
  resources: {
    title: 'Recursos',
    subtitle: 'Materiales adicionales y documentación.',
    items: [
      { id: 'r1', title: 'Documentación de la API', description: 'Referencia completa de la API y guías' },
      { id: 'r2', title: 'Guías de extracción', description: 'Playbooks descargables de captación de leads' },
      { id: 'r3', title: 'Plantillas de operaciones de campo', description: 'Plantillas de presupuestos y facturas' },
      { id: 'r4', title: 'Buenas prácticas de seguridad', description: 'Pautas para mantener los datos seguros' },
    ],
  },
  status: {
    operational: 'Todos los sistemas funcionan con normalidad',
    lastUpdated: 'Última actualización: hace 10 minutos',
    viewPage: 'Ver página de estado',
  },
  article: {
    notFoundTitle: 'Artículo no encontrado',
    notFoundBody: 'Ese artículo de ayuda no existe o puede que se haya movido.',
    back: 'Volver al centro de ayuda',
    stillNeedHelp: '¿Aún necesitas ayuda?',
    responseNote: 'Nuestro equipo de soporte suele responder en menos de 2 horas.',
    contactSupport: 'Contactar con soporte',
  },
  categories: {
    all: 'Todos los temas',
    'getting-started': 'Primeros pasos',
    scraping: 'Extracción de leads',
    jobs: 'Trabajos y presupuestos',
    billing: 'Facturación y créditos',
    account: 'Cuenta',
    security: 'Seguridad',
  },
  articles: {
    'getting-started': {
      title: 'Primeros pasos con LeadEasyGen',
      updated: 'Actualizado hace 2 días',
      summary: 'Pasa del registro a tu primera lista de leads exportada en pocos minutos.',
      sections: [
        {
          heading: 'Crea y verifica tu cuenta',
          body: [
            'Regístrate con tu correo electrónico y una contraseña, y luego introduce el código de 6 dígitos que te enviamos por correo para verificar la dirección. La verificación desbloquea la compra de créditos y mantiene tu cuenta recuperable.',
          ],
        },
        {
          heading: 'Añade créditos',
          body: [
            'Cada extracción consume créditos, así que compra un paquete desde Facturación antes de tu primera tarea. Los créditos se compran a través de Stripe y nunca caducan: empieza con el paquete más pequeño para probar el servicio.',
          ],
        },
        {
          heading: 'Lanza tu primera extracción',
          body: [
            'Desde el panel, introduce una ubicación, un radio de búsqueda y una o varias palabras clave. El formulario muestra el coste exacto en créditos antes de lanzarla. Consulta «Cómo lanzar tu primera extracción de leads» para una guía paso a paso.',
          ],
        },
        {
          heading: 'Exporta tus resultados',
          body: [
            'Cuando una tarea termina, ábrela y exporta los leads a CSV. Cada fila incluye el nombre del negocio, los datos de contacto, la valoración y los correos electrónicos descubiertos.',
          ],
        },
      ],
    },
    'first-lead-scrape': {
      title: 'Cómo lanzar tu primera extracción de leads',
      updated: 'Actualizado hace 1 semana',
      summary: 'Configura palabras clave, ubicación y radio, y luego lanza y supervisa una tarea.',
      sections: [
        {
          heading: 'Elige tus palabras clave',
          body: [
            'Las palabras clave describen los negocios que buscas, por ejemplo «tejados», «climatización» o «jardinería». Combina palabras clave con un radio ajustado para dirigirte a un oficio concreto en una zona concreta.',
          ],
        },
        {
          heading: 'Define la ubicación y el radio',
          body: [
            'Introduce una ciudad o una dirección como punto central y un radio en kilómetros. Un radio de menos de 5 km muestra negocios hiperlocales; amplíalo para cubrir un área metropolitana.',
          ],
        },
        {
          heading: 'Revisa la estimación del coste',
          body: [
            'El formulario muestra el coste en créditos antes de confirmar: una tarifa base, más un cargo por palabra clave, más un componente por distancia. Ajusta el alcance hasta que el coste encaje en tu presupuesto.',
          ],
        },
        {
          heading: 'Lanza y supervisa',
          body: [
            'Inicia la tarea y sigue su estado en el panel. Las tareas completadas están listas para exportar; las tareas fallidas o canceladas devuelven sus créditos automáticamente.',
          ],
        },
      ],
    },
    'credit-costs': {
      title: 'Entender los costes en créditos',
      updated: 'Actualizado hace 3 días',
      summary: 'Cómo se calcula el coste en créditos de cada tarea de extracción y cuándo se te reembolsa.',
      sections: [
        {
          heading: 'La fórmula de precios',
          body: [
            'Una tarea cuesta una base de 10 créditos, más 2 créditos por palabra clave, más un cargo por distancia que crece con tu radio de búsqueda. Más palabras clave y un radio mayor implican un coste más alto, y un conjunto de leads más amplio.',
          ],
        },
        {
          heading: 'Consulta el coste antes de empezar',
          body: [
            'El formulario de extracción recalcula el total a medida que cambias las palabras clave y el radio, así que siempre conoces el precio antes de lanzar. No se gasta nada hasta que inicias la tarea.',
          ],
        },
        {
          heading: 'Reembolsos por tareas fallidas',
          body: [
            'Si una tarea falla o la cancelas, sus créditos vuelven automáticamente a tu saldo. Puedes revisar cada cargo y cada reembolso en Facturación, en Actividad de créditos.',
          ],
        },
      ],
    },
    'export-csv': {
      title: 'Exportar leads a CSV',
      updated: 'Actualizado hace 5 días',
      summary: 'Descarga los resultados de las tareas completadas como un CSV que puedes abrir en cualquier parte.',
      sections: [
        {
          heading: 'Qué incluye la exportación',
          body: [
            'Cada lead incluye el nombre del negocio, la categoría, la valoración, el número de reseñas, el teléfono, el sitio web, la dirección y las direcciones de correo descubiertas durante la extracción.',
          ],
        },
        {
          heading: 'Cómo exportar',
          body: [
            'Abre una tarea completada y elige Exportar. El CSV se descarga en tu dispositivo con una fila por lead, listo para una hoja de cálculo, una importación a tu CRM o una combinación de correspondencia.',
          ],
        },
        {
          heading: 'Cómo usar los datos',
          body: [
            'Importa el CSV en tu CRM o herramienta de prospección para empezar a contactar leads. Los correos encontrados en el propio sitio web de un negocio a menudo no aparecen en los perfiles de mapas, así que la exportación puede revelar contactos que no encontrarás en ningún otro sitio.',
          ],
        },
      ],
    },
    'leads-to-jobs': {
      title: 'Convertir leads en trabajos y presupuestos',
      updated: 'Actualizado hace 1 día',
      summary: 'Lleva un lead extraído a tu flujo de operaciones de campo y presupuesta el trabajo.',
      sections: [
        {
          heading: 'Del lead al trabajo',
          body: [
            'Convierte un lead prometedor en un trabajo para seguirlo a lo largo de tu pipeline. Los datos de contacto del lead se trasladan automáticamente, así que no vuelves a introducir nada.',
          ],
        },
        {
          heading: 'Crea un presupuesto',
          body: [
            'Adjunta un presupuesto al trabajo con partidas y precios. Los presupuestos mantienen el alcance y la cifra acordada en un solo lugar.',
          ],
        },
        {
          heading: 'Envía y haz seguimiento',
          body: [
            'Envía el presupuesto al cliente y sigue su estado hasta que se convierta en factura. Todo queda vinculado al lead original para conservar un historial completo.',
          ],
        },
      ],
    },
    'subscription-plan': {
      title: 'Gestionar tu plan de suscripción',
      updated: 'Actualizado hace 4 días',
      summary: 'Compara los planes Gratis e Ilimitado, y cambia de plan cuando tus necesidades crezcan.',
      sections: [
        {
          heading: 'Diferencias entre planes',
          body: [
            'El plan Gratis ejecuta una sola tarea activa a la vez, suficiente para evaluar el servicio. El plan Ilimitado elimina los límites de tareas y de créditos para que puedas lanzar extracciones en paralelo.',
          ],
        },
        {
          heading: 'Mejorar de plan',
          body: [
            'Mejora tu plan desde la página de Facturación. Los cambios surten efecto de inmediato y tu saldo de créditos existente se conserva sin cambios.',
          ],
        },
        {
          heading: 'Gestionar la facturación',
          body: [
            'Revisa las facturas, el historial de pagos y la actividad de créditos en Facturación. Los créditos comprados no son reembolsables, pero las tareas fallidas y canceladas siempre se reembolsan automáticamente.',
          ],
        },
      ],
    },
  },
}
export default help
