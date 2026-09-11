import type enLegal from '../en/legal'

const legal: typeof enLegal = {
  lastUpdated: 'Dernière mise à jour : 1er juin 2025',
  terms: {
    title: "Conditions d'utilisation",
    sections: [
      {
        heading: '1. Acceptation des conditions',
        body: "En créant un compte LeadEasyGen, vous acceptez les présentes conditions. Ce texte est provisoire, dans l'attente d'une revue juridique — les conditions définitives seront publiées avant le lancement public.",
      },
      {
        heading: '2. Le service',
        body: "LeadEasyGen recherche des informations d'entreprises locales accessibles au public et les livre sous forme de listes de prospects. Les tâches d'extraction consomment des crédits, achetés en packs ponctuels ou inclus dans un abonnement.",
      },
      {
        heading: '3. Crédits et facturation',
        body: "Les crédits sont prépayés et non transférables. Les tâches échouées ou annulées sont recréditées sur votre solde. Les abonnements se renouvellent jusqu'à résiliation ; la résiliation prend effet à la fin de la période de facturation.",
      },
      {
        heading: '4. Utilisation acceptable',
        body: "Vous êtes responsable de l'utilisation des données exportées dans le respect des lois applicables, y compris les réglementations anti-spam et de protection des données en vigueur dans votre juridiction.",
      },
      {
        heading: '5. Contact',
        body: 'Toute question concernant les présentes conditions peut être adressée à support@leadeasygen.com.',
      },
    ],
  },
  privacy: {
    title: 'Politique de confidentialité',
    sections: [
      {
        heading: '1. Aperçu',
        body: "La présente politique décrit les données que LeadEasyGen collecte et les raisons de cette collecte. Ce texte est provisoire, dans l'attente d'une revue juridique — la politique définitive sera publiée avant le lancement public.",
      },
      {
        heading: '2. Ce que nous collectons',
        body: "Les informations de compte que vous fournissez (nom, e-mail), les enregistrements de facturation liés à vos achats et les tâches d'extraction que vous lancez. Les données de carte bancaire sont traitées par notre prestataire de paiement et ne transitent jamais par nos serveurs.",
      },
      {
        heading: '3. Comment nous les utilisons',
        body: 'Pour faire fonctionner le service : exécuter vos tâches, tenir votre solde de crédits à jour et envoyer des e-mails transactionnels tels que les reçus et les réinitialisations de mot de passe.',
      },
      {
        heading: '4. Conservation des données',
        body: "Les résultats des tâches restent dans votre compte jusqu'à ce que vous les supprimiez. Vous pouvez demander à tout moment la suppression de votre compte et de ses données.",
      },
      {
        heading: '5. Contact',
        body: 'Toute question relative à la confidentialité peut être adressée à privacy@leadeasygen.com.',
      },
    ],
  },
}
export default legal
