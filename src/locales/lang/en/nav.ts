const nav = {
  toggleNavigation: 'Toggle navigation',
  search: {
    label: 'Search',
    placeholder: 'Search data for analysis',
    open: 'Open search',
    close: 'Close search',
  },
  credits: {
    unlimited: 'Unlimited',
    label: 'credits',
  },
  language: 'Language: {name}',
  theme: {
    label: 'Theme: {name}',
    system: 'System',
    dark: 'Dark',
    light: 'Light',
  },
  account: {
    label: 'Account: {name}',
    plan: '{plan} plan',
    settings: 'Settings',
    logout: 'Log out',
  },
  sidebar: {
    categories: {
      main: 'Main',
      appPages: 'App Pages',
    },
    links: {
      dashboard: 'Dashboard',
      billing: 'Billing',
      settings: 'Settings',
      helpCenter: 'Help Center',
    },
    common: 'Common',
    commonLinks: {
      login: 'Login',
      register: 'Register',
      forgotPassword: 'Forgot password',
    },
    language: 'Language',
    theme: 'Theme',
    dismissTip: 'Dismiss tip',
    // Labels carry their own colon: punctuation spacing is locale-specific.
    tips: [
      { label: 'Tip:', text: 'Use radius + keywords together for tighter lead targeting.' },
      { label: 'Tip:', text: 'Radius under 5km finds hyper-local businesses.' },
      { label: 'New:', text: 'Export results directly to CSV from the dashboard.' },
      { label: 'Did you know:', text: "Visiting a business's website often reveals emails not listed on Maps." },
    ],
  },
}
export default nav
