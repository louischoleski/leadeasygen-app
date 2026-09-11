import type enHelp from '../en/help'

const help: typeof enHelp = {
  title: "Centre d'aide",
  subtitle: "Trouvez des réponses, des guides et de l'assistance pour tout LeadEasyGen.",
  search: {
    label: "Rechercher dans le centre d'aide",
    placeholder: "Rechercher des articles d'aide, des guides et des FAQ…",
  },
  actions: {
    liveChat: 'Chat en direct',
    contactSupport: 'Contacter le support',
  },
  soon: {
    toast: "{label} n'est pas encore disponible",
    description: 'Bientôt disponible.',
    liveChat: 'Le chat en direct',
    articleLibrary: "La bibliothèque complète d'articles",
    tutorialLibrary: 'La bibliothèque de tutoriels',
    statusPage: "La page d'état",
  },
  popular: {
    title: 'Articles populaires',
    subtitle: 'Parcourez nos guides et ressources les plus utiles.',
    empty: 'Aucun article ne correspond à votre recherche.',
    viewAll: 'Voir tous les articles',
  },
  faq: {
    title: 'Questions fréquentes',
    subtitle: 'Des réponses rapides aux questions courantes.',
    empty: 'Aucune FAQ ne correspond à votre recherche.',
    contact: "Besoin d'aide supplémentaire ? Contactez le support",
  },
  faqs: [
    {
      id: 'credits',
      title: 'Comment fonctionnent les crédits ?',
      content:
        "Vous achetez des packs de crédits via Stripe — ils n'expirent jamais. Chaque tâche d'extraction déduit des crédits selon sa portée : une base de 10, plus 2 par mot-clé, plus un montant lié au rayon de recherche. Le formulaire affiche le coût exact avant de commencer.",
    },
    {
      id: 'data',
      title: 'Quelles données une extraction renvoie-t-elle ?',
      content:
        "Le nom de l'entreprise, la catégorie, la note, le nombre d'avis, le numéro de téléphone, le site web, l'adresse et les éventuelles adresses e-mail découvertes. Chaque tâche terminée s'exporte en CSV.",
    },
    {
      id: 'failed',
      title: 'Pourquoi ma tâche a-t-elle échoué ?',
      content:
        'Les sources changent parfois la mise en page de leurs sites ou limitent le débit des extracteurs. Les tâches échouées ou annulées sont automatiquement recréditées sur votre solde — chaque remboursement est visible dans Facturation, sous Activité des crédits.',
    },
    {
      id: 'limits',
      title: 'Y a-t-il une limite au nombre de prospects que je peux extraire ?',
      content:
        'Le forfait Gratuit autorise 1 tâche active à la fois ; le forfait Illimité supprime les limites de tâches et de crédits. Au-delà, votre solde de crédits est la seule limite pratique.',
    },
    {
      id: 'refunds',
      title: 'Puis-je être remboursé ?',
      content:
        'Les crédits achetés ne sont pas remboursables : commencez donc par un petit pack pour valider le service pour votre usage. Les tâches échouées ou annulées sont toujours recréditées automatiquement.',
    },
  ],
  tutorials: {
    title: 'Tutoriels vidéo',
    subtitle: 'Apprenez en images avec des guides pas à pas.',
    viewAll: 'Voir tous les tutoriels',
    items: [
      { id: 't1', title: 'Visite complète de la plateforme', duration: '12:34' },
      { id: 't2', title: 'Lancer une extraction de prospects', duration: '8:45' },
      { id: 't3', title: 'Du prospect au devis', duration: '15:21' },
      { id: 't4', title: 'Export CSV et intégrations', duration: '10:15' },
    ],
  },
  contact: {
    title: 'Contacter le support',
    subtitle: 'Obtenez une aide personnalisée de notre équipe.',
    liveChat: 'Chat en direct',
    liveChatNote: 'Inclus dans les forfaits payants',
    email: 'Support par e-mail',
    responseTime: 'Temps de réponse',
    responseValue: 'Généralement moins de 2 heures',
    startChat: 'Démarrer le chat en direct',
    sendEmail: 'Envoyer un e-mail',
  },
  resources: {
    title: 'Ressources',
    subtitle: 'Supports complémentaires et documentation.',
    items: [
      { id: 'r1', title: 'Documentation API', description: 'Référence API complète et guides' },
      { id: 'r2', title: "Guides d'extraction", description: 'Playbooks de génération de prospects à télécharger' },
      { id: 'r3', title: "Modèles d'opérations terrain", description: 'Modèles de devis et de factures' },
      { id: 'r4', title: 'Bonnes pratiques de sécurité', description: 'Recommandations pour protéger vos données' },
    ],
  },
  status: {
    operational: 'Tous les systèmes sont opérationnels',
    lastUpdated: 'Dernière mise à jour : il y a 10 minutes',
    viewPage: "Voir la page d'état",
  },
  article: {
    notFoundTitle: 'Article introuvable',
    notFoundBody: "Cet article d'aide n'existe pas ou a peut-être été déplacé.",
    back: "Retour au centre d'aide",
    stillNeedHelp: "Besoin d'aide supplémentaire ?",
    responseNote: 'Notre équipe de support répond généralement en moins de 2 heures.',
    contactSupport: 'Contacter le support',
  },
  categories: {
    all: 'Tous les sujets',
    'getting-started': 'Premiers pas',
    scraping: 'Extraction de prospects',
    jobs: 'Interventions et devis',
    billing: 'Facturation et crédits',
    account: 'Compte',
    security: 'Sécurité',
  },
  articles: {
    'getting-started': {
      title: 'Bien démarrer avec LeadEasyGen',
      updated: 'Mis à jour il y a 2 jours',
      summary: "Passez de l'inscription à votre première liste de prospects exportée en quelques minutes.",
      sections: [
        {
          heading: 'Créez et vérifiez votre compte',
          body: [
            "Inscrivez-vous avec votre e-mail et un mot de passe, puis saisissez le code à 6 chiffres que nous vous envoyons par e-mail pour vérifier l'adresse. La vérification débloque l'achat de crédits et garantit que votre compte reste récupérable.",
          ],
        },
        {
          heading: 'Ajoutez des crédits',
          body: [
            "Chaque extraction consomme des crédits : achetez donc un pack depuis Facturation avant votre première tâche. Les crédits s'achètent via Stripe et n'expirent jamais — commencez par le plus petit pack pour essayer le service.",
          ],
        },
        {
          heading: 'Lancez votre première extraction',
          body: [
            'Depuis le tableau de bord, saisissez un lieu, un rayon de recherche et un ou plusieurs mots-clés. Le formulaire affiche le coût exact en crédits avant le lancement. Consultez « Lancer votre première extraction de prospects » pour un guide pas à pas.',
          ],
        },
        {
          heading: 'Exportez vos résultats',
          body: [
            "Quand une tâche se termine, ouvrez-la et exportez les prospects au format CSV. Chaque ligne comprend le nom de l'entreprise, les coordonnées, la note et les éventuels e-mails découverts.",
          ],
        },
      ],
    },
    'first-lead-scrape': {
      title: 'Lancer votre première extraction de prospects',
      updated: 'Mis à jour il y a 1 semaine',
      summary: 'Configurez les mots-clés, le lieu et le rayon, puis lancez et suivez une tâche.',
      sections: [
        {
          heading: 'Choisissez vos mots-clés',
          body: [
            'Les mots-clés décrivent les entreprises que vous recherchez — par exemple « couverture », « chauffagiste » ou « paysagiste ». Combinez des mots-clés avec un rayon serré pour cibler un métier précis dans une zone précise.',
          ],
        },
        {
          heading: 'Définissez le lieu et le rayon',
          body: [
            "Saisissez une ville ou une adresse comme point central et un rayon en kilomètres. Un rayon de moins de 5 km fait ressortir les entreprises hyper-locales ; élargissez-le pour couvrir une agglomération.",
          ],
        },
        {
          heading: "Vérifiez l'estimation du coût",
          body: [
            "Le formulaire affiche le coût en crédits avant de vous engager : un tarif de base, plus un montant par mot-clé, plus une composante liée à la distance. Ajustez la portée jusqu'à ce que le coût rentre dans votre budget.",
          ],
        },
        {
          heading: 'Lancez et suivez',
          body: [
            'Démarrez la tâche et suivez son statut sur le tableau de bord. Les tâches terminées sont prêtes à exporter ; les tâches échouées ou annulées sont automatiquement remboursées en crédits.',
          ],
        },
      ],
    },
    'credit-costs': {
      title: 'Comprendre le coût en crédits',
      updated: 'Mis à jour il y a 3 jours',
      summary: "Comment le coût en crédits de chaque tâche d'extraction est calculé — et quand vous êtes remboursé.",
      sections: [
        {
          heading: 'La formule de tarification',
          body: [
            'Une tâche coûte une base de 10 crédits, plus 2 crédits par mot-clé, plus un montant lié à la distance qui augmente avec votre rayon de recherche. Plus de mots-clés et un rayon plus large signifient un coût plus élevé — et un ensemble de prospects plus large.',
          ],
        },
        {
          heading: 'Voyez le coût avant de commencer',
          body: [
            "Le formulaire d'extraction recalcule le total à mesure que vous modifiez les mots-clés et le rayon : vous connaissez donc toujours le prix avant de lancer. Rien n'est dépensé tant que vous n'avez pas démarré la tâche.",
          ],
        },
        {
          heading: 'Remboursement des tâches échouées',
          body: [
            "Si une tâche échoue ou si vous l'annulez, ses crédits sont automatiquement recrédités sur votre solde. Vous pouvez consulter chaque débit et chaque remboursement dans Facturation, sous Activité des crédits.",
          ],
        },
      ],
    },
    'export-csv': {
      title: 'Exporter les prospects en CSV',
      updated: 'Mis à jour il y a 5 jours',
      summary: 'Téléchargez les résultats des tâches terminées dans un fichier CSV lisible partout.',
      sections: [
        {
          heading: "Le contenu de l'export",
          body: [
            "Chaque prospect comprend le nom de l'entreprise, la catégorie, la note, le nombre d'avis, le numéro de téléphone, le site web, l'adresse et les éventuelles adresses e-mail découvertes pendant l'extraction.",
          ],
        },
        {
          heading: 'Comment exporter',
          body: [
            'Ouvrez une tâche terminée et choisissez Exporter. Le fichier CSV se télécharge sur votre appareil avec une ligne par prospect — prêt pour un tableur, un import CRM ou un publipostage.',
          ],
        },
        {
          heading: 'Exploiter les données',
          body: [
            "Importez le CSV dans votre CRM ou votre outil de prospection pour commencer à contacter vos prospects. Les e-mails trouvés sur le site web d'une entreprise ne figurent souvent pas sur les fiches cartographiques : l'export peut donc révéler des contacts introuvables ailleurs.",
          ],
        },
      ],
    },
    'leads-to-jobs': {
      title: 'Transformer les prospects en interventions et devis',
      updated: 'Mis à jour il y a 1 jour',
      summary: "Faites passer un prospect extrait dans votre flux d'opérations terrain et chiffrez le travail.",
      sections: [
        {
          heading: "Du prospect à l'intervention",
          body: [
            "Convertissez un prospect prometteur en intervention pour le suivre dans votre pipeline. Les coordonnées du prospect sont reprises automatiquement : vous n'avez rien à ressaisir.",
          ],
        },
        {
          heading: 'Créez un devis',
          body: [
            "Joignez un devis à l'intervention avec des lignes détaillées et leurs prix. Le devis regroupe au même endroit le périmètre et le montant convenu.",
          ],
        },
        {
          heading: 'Envoyez et suivez',
          body: [
            "Envoyez le devis au client et suivez son statut jusqu'à la facture. Tout reste lié au prospect d'origine pour un historique complet.",
          ],
        },
      ],
    },
    'subscription-plan': {
      title: 'Gérer votre forfait',
      updated: 'Mis à jour il y a 4 jours',
      summary: 'Comparez les forfaits Gratuit et Illimité, et changez de forfait quand vos besoins évoluent.',
      sections: [
        {
          heading: 'Différences entre les forfaits',
          body: [
            'Le forfait Gratuit exécute une seule tâche active à la fois — de quoi évaluer le service. Le forfait Illimité supprime les limites de tâches et de crédits pour lancer des extractions en parallèle.',
          ],
        },
        {
          heading: 'Passer au forfait supérieur',
          body: [
            'Passez au forfait supérieur depuis la page Facturation. Le changement prend effet immédiatement et votre solde de crédits existant est conservé tel quel.',
          ],
        },
        {
          heading: 'Gérer la facturation',
          body: [
            "Consultez les factures, l'historique des paiements et l'activité des crédits dans Facturation. Les crédits achetés ne sont pas remboursables, mais les tâches échouées ou annulées sont toujours recréditées automatiquement.",
          ],
        },
      ],
    },
  },
}
export default help
