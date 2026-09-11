import type enNav from '../en/nav'

const nav: typeof enNav = {
  toggleNavigation: 'Mostrar u ocultar la navegación',
  search: {
    label: 'Buscar',
    placeholder: 'Buscar datos para analizar',
    open: 'Abrir la búsqueda',
    close: 'Cerrar la búsqueda',
  },
  credits: {
    unlimited: 'Ilimitado',
    label: 'créditos',
  },
  language: 'Idioma: {name}',
  theme: {
    label: 'Tema: {name}',
    system: 'Sistema',
    dark: 'Oscuro',
    light: 'Claro',
  },
  account: {
    label: 'Cuenta: {name}',
    plan: 'Plan {plan}',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
  },
  sidebar: {
    categories: {
      main: 'Principal',
      appPages: 'Páginas de la aplicación',
    },
    links: {
      dashboard: 'Panel de control',
      billing: 'Facturación',
      settings: 'Configuración',
      helpCenter: 'Centro de ayuda',
    },
    common: 'Común',
    commonLinks: {
      login: 'Iniciar sesión',
      register: 'Regístrate',
      forgotPassword: 'Contraseña olvidada',
    },
    language: 'Idioma',
    theme: 'Tema',
    dismissTip: 'Descartar el consejo',
    tips: [
      { label: 'Consejo:', text: 'Combina radio y palabras clave para segmentar tus leads con más precisión.' },
      { label: 'Consejo:', text: 'Un radio de menos de 5 km encuentra negocios hiperlocales.' },
      { label: 'Nuevo:', text: 'Exporta los resultados a CSV directamente desde el panel.' },
      { label: 'Dato curioso:', text: 'Visitar el sitio web de un negocio suele revelar correos que no aparecen en Maps.' },
    ],
  },
}
export default nav
