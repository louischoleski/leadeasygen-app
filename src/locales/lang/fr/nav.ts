import type enNav from '../en/nav'

const nav: typeof enNav = {
  toggleNavigation: 'Afficher ou masquer la navigation',
  search: {
    label: 'Rechercher',
    placeholder: 'Rechercher des données à analyser',
    open: 'Ouvrir la recherche',
    close: 'Fermer la recherche',
  },
  credits: {
    unlimited: 'Illimité',
    label: 'crédits',
  },
  language: 'Langue : {name}',
  theme: {
    label: 'Thème : {name}',
    system: 'Système',
    dark: 'Sombre',
    light: 'Clair',
  },
  account: {
    label: 'Compte : {name}',
    plan: 'Forfait {plan}',
    settings: 'Paramètres',
    logout: 'Se déconnecter',
  },
  sidebar: {
    categories: {
      main: 'Principal',
      appPages: "Pages de l'application",
    },
    links: {
      dashboard: 'Tableau de bord',
      billing: 'Facturation',
      settings: 'Paramètres',
      helpCenter: "Centre d'aide",
    },
    common: 'Commun',
    commonLinks: {
      login: 'Connexion',
      register: 'Inscription',
      forgotPassword: 'Mot de passe oublié',
    },
    language: 'Langue',
    theme: 'Thème',
    dismissTip: 'Ignorer le conseil',
    tips: [
      { label: 'Conseil :', text: 'Combinez rayon et mots-clés pour un ciblage de prospects plus précis.' },
      { label: 'Conseil :', text: 'Un rayon de moins de 5 km fait ressortir les commerces hyper-locaux.' },
      { label: 'Nouveau :', text: 'Exportez vos résultats en CSV directement depuis le tableau de bord.' },
      { label: 'Le saviez-vous :', text: "Visiter le site web d'une entreprise révèle souvent des e-mails absents de Maps." },
    ],
  },
}
export default nav
