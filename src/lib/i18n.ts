/**
 * i18n léger, sans dépendance. Le dictionnaire est une donnée pure importable
 * côté serveur ET client (aucune API serveur ici).
 * Défaut : anglais. Bascule FR via le cookie `albert_lang` + bouton EN/FR.
 */
export type Locale = "en" | "fr";
export const LOCALES: Locale[] = ["en", "fr"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "albert_lang";

export function normalizeLocale(v?: string | null): Locale {
  return v === "fr" ? "fr" : "en";
}

/** Choisit le champ localisé d'un enregistrement de la base (fallback → FR). */
export function pick<T>(locale: Locale, fr: T, en: T | null | undefined): T {
  if (locale === "en") return (en ?? fr) as T;
  return fr;
}

const en = {
  brand: "ELECTRA_HACK",
  nav: { learn: "Learn", play: "Challenges", leaderboard: "Leaderboard", admin: "Admin" },
  footer: { org: "Electra · Network Operations · AI Hackathon", tagline: "learn, decipher, defuse" },
  lang: { switch: "Language", en: "EN", fr: "FR" },

  home: {
    kicker: "Electra · Network Operations",
    transmission: "// INCOMING TRANSMISSION — 13:37",
    p1: "Albert, Electra's cybersecurity AI agent, has had its source code leaked to the real Albert — a senior dev at a competitor.",
    p2: "He holds all of the company's confidential data. To protect it — and dump it on the dark web — he handed everything to an AI agent of his own making. That agent is armed: it defends itself, and it won't be fooled.",
    p3lead: "You have until the end of the day to neutralize it. Build your own agents, decipher its riddles, pull the fuses one by one, and ",
    p3bomb: "defuse the bomb",
    sessionDetected: "Session detected. Resume where you left off.",
    resume: "Resume mission ▸",
    changeTeam: "Change team",
    viewLeaderboard: "› View the team leaderboard",
  },

  join: {
    label: "> Team identifier",
    placeholder: "e.g. the-decoders",
    connecting: "Connecting…",
    submit: "Initialize ▸",
  },

  play: {
    team: "TEAM",
    score: "SCORE",
    setupTitle: "Supabase not configured",
    setupBody: "Fill the keys in .env.local and run the migrations (see README.md).",
    setupDetail: "Detail",
    noStage: "No stage found. Did you run supabase/schema.sql?",
    missionComplete: "// MISSION COMPLETE",
    albertNeutralized: "ALBERT NEUTRALIZED",
    finalScorePre: "The data is safe. Final score for team",
    viewLeaderboard: "View leaderboard ▸",
    abandon: "Abandon / change team",
    type: { quiz: "QUIZ", cipher: "CIPHER", password: "PASSWORD", final: "DEFUSE" },
  },

  stage: {
    placeholder: {
      quiz: "your answer…",
      cipher: "decoded word…",
      password: "password…",
      final: "defuse code…",
    },
    verifying: "Verifying…",
    submit: "Submit ▸",
    revealHint: "Reveal the hint",
    hintPrefix: "// hint: ",
  },

  leaderboard: {
    title: "LEADERBOARD",
    autoUpdate: "auto · 5s",
    notConfigured: "Supabase not configured",
    empty: "No teams yet. The hunt hasn't started.",
    missionDone: "★ mission complete",
    stage: "stage",
    back: "› Back to the mission",
    lock: "lock",
    escaped: "★ escaped",
    inProgress: "in progress",
    restarts: "resets",
    teamsDone: "teams escaped",
    podium: "PODIUM",
    live: "LIVE",
    firstOut: "first out",
    trapWarning:
      "⚠ Albert's trap is armed — the first team out re-started the countdown. Everyone must escape before it hits zero.",
  },

  // Dialogues d'Albert (fausse victoire → piège → victoire collective).
  albert: {
    name: "ALBERT",
    // Fausse victoire (1re équipe qui finit)
    fakeTag: "// TRANSMISSION — ALBERT",
    fakeTitle: "WELL PLAYED.",
    fakeLines: [
      "Well played… I underestimated you.",
      "With all the knowledge you've gathered, you actually neutralized me.",
      "The network is yours. Go on — claim your spot on the podium.",
    ],
    fakeCta: "View the podium ▸",
    // Révélation piège
    revealTag: "// ⚠ SYSTEM BREACH — ALBERT",
    revealTitle: "HEHEHE…",
    revealLines: [
      "Hehe… gotcha.",
      "You just sealed your own fate: that click RE-ARMED the countdown.",
      "Every last one of your files leaks unless EVERY team escapes before the timer hits zero.",
      "Better run and warn the others.",
    ],
    revealCta: "To the leaderboard ▸",
    // Attente (équipe finie, mais la bombe tourne encore)
    waitTitle: "You're out — but the clock is ticking",
    waitBody:
      "Your team escaped. But Albert's countdown is still running for everyone. Rally the other teams: the data only stays safe once ALL of them are out.",
    waitCta: "Follow it live on the leaderboard ▸",
    // Victoire collective (toutes les équipes ont fini)
    victoryTag: "// OPERATION ALBERT — CLOSED",
    victoryTitle: "ALBERT DEFEATED",
    victoryLines: [
      "Impossible… every single team made it out in time.",
      "The network is locked, my leaks cancelled.",
      "You beat me. For real this time. Bravo, humans.",
    ],
    victoryCta: "View the final podium ▸",
  },

  arcade: {
    waitingTag: "// STANDBY",
    waitingTitle: "The escape game hasn't started yet",
    waitingBody:
      "Albert's countdown isn't armed. The game master will launch the timer to open the challenge — then the 20 locks unlock. Hang tight.",
    waitingRegistered:
      "✓ Your team is registered — you'll start the instant the timer goes live.",
    waitingHint: "Meanwhile, brush up in the",
    locked: "⏳ The escape game hasn't started — wait for the game master.",
  },

  learn: {
    kicker: "Electra · AI Academy",
    title: "Learn, the easy way",
    intro:
      "Master the basics before taking on the challenges: build agents, prompt well, manage your MCP servers, collaborate and design with Claude. Each module ends with a short, playful quiz.",
    notConfigured: "Database not configured",
    openModule: "Open module →",
    min: "min",
    readyCta: "Ready to put it all into practice?",
    toChallenges: "▸ Go to the challenges (scored)",
    category: {
      agents: "Agents",
      prompting: "Prompting",
      mcp: "MCP servers",
      cowork: "Collaboration",
      design: "Design",
    },
  },

  lesson: {
    allModules: "← All modules",
    modules: "← Modules",
    toChallenges: "Go to challenges →",
    quizFallback: "Quiz",
  },

  quiz: {
    questions: "questions",
    question1: "question",
    correctCount: "correct",
    multiple: "multiple choice",
    single: "single choice",
    pts: "pts",
    validate: "Check",
    checking: "Checking…",
    correct: "✔ Correct!",
    almost: "✘ Almost — the correct answer is highlighted.",
  },

  adminLogin: {
    kicker: "// RESTRICTED AREA",
    title: "GAME MASTER PORTAL",
    authRequired: "Authentication required",
    username: "> Username",
    password: "> Password",
    authenticating: "Authenticating…",
    submit: "Game master access ▸",
  },

  admin: {
    title: "ADMIN · game master",
    logout: "Log out",
    gameControl: "Game control",
    teams: "Teams",
    learnScore: "learn",
    finished: "★ done",
    stage: "stage",
    attempts: "Latest attempts",
    arm: "◉ Arm",
    armLabel: "> Arm the bomb (duration in minutes)",
    pause: "⏸ Pause",
    resume: "▶ Resume",
    stop: "■ STOP (freeze the game)",
    defuse: "✔ Defuse",
    reset: "↺ Reset",
    lock: "🔒 Lock",
    unlock: "🔓 Unlock",
    broadcast: "Broadcast",
    messageLabel: "> Message broadcast to teams",
    messagePlaceholder: "e.g. global hint unlocked…",
    learnControl: "Learn-mode timer",
    learnArmLabel: "> Start the learn timer (duration in minutes)",
    learnStart: "◉ Start",
    learnPause: "⏸ Pause",
    learnResume: "▶ Resume",
    learnReset: "↺ Reset",
    learnHiddenByBomb: "The bomb is armed — the learn timer is hidden until reset.",
  },

  bomb: {
    countdown: "// COUNTDOWN",
    detonation: "// DETONATION",
    label: "BOMB",
    frozen: "🔒 submissions frozen",
    status: {
      idle: "STANDBY",
      running: "ARMED",
      paused: "PAUSED",
      stopped: "FROZEN",
      defused: "DEFUSED",
      exploded: "DETONATED",
    },
    victoryLabel: "// OPERATION SUCCESSFUL",
    victoryTitle: "ALBERT NEUTRALIZED",
    victorySub: "All teams escaped — the leak is cancelled.",
    learnLabel: "LEARN MODE",
    learnStatus: { running: "IN PROGRESS", paused: "PAUSED" },
  },

  // Messages renvoyés par les Server Actions
  errors: {
    teamRequired: "Team name required.",
    teamTooLong: "Name too long (40 characters max).",
    teamInvalid: "Invalid team name.",
    serverUnknown: "Unknown server error.",
    unexpected: "Unexpected response from the database.",
    credentialsRequired: "Credentials required.",
    credentialsInvalid: "Invalid credentials.",
    game_locked: "GAME PAUSED — the game master has frozen submissions.",
    time_up: "⏱ TIME'S UP — the bomb detonated. Wait for instructions.",
    team_not_found: "Team not found.",
    stage_not_found: "Stage not found.",
    wrongAnswer: "ACCESS DENIED — wrong answer. Try again.",
    stageOrTeam: "Stage or team not found.",
    unknown: "Unknown error.",
  },
};

export type Dict = typeof en;

const fr: Dict = {
  brand: "ELECTRA_HACK",
  nav: { learn: "Apprendre", play: "Défis", leaderboard: "Classement", admin: "Admin" },
  footer: { org: "Electra · Network Operations · Hackathon IA", tagline: "apprendre, déchiffrer, désamorcer" },
  lang: { switch: "Langue", en: "EN", fr: "FR" },

  home: {
    kicker: "Electra · Network Operations",
    transmission: "// TRANSMISSION ENTRANTE — 13:37",
    p1: "Albert, l'agent IA de cybersécurité d'Electra, a vu son code source tomber entre les mains du vrai Albert — un dev senior chez la concurrence.",
    p2: "Il détient toutes les données confidentielles de l'entreprise. Pour les protéger — et les publier sur le deep web — il a confié le tout à un agent IA de sa création. Cet agent est armé : il se défend, il ne se laisse pas berner.",
    p3lead: "Vous avez jusqu'à la fin de la journée pour le neutraliser. Construisez vos propres agents, déchiffrez ses énigmes, retirez les fusibles un par un, et ",
    p3bomb: "désamorcez la bombe",
    sessionDetected: "Session détectée. Reprenez là où vous en étiez.",
    resume: "Reprendre la mission ▸",
    changeTeam: "Changer d'équipe",
    viewLeaderboard: "› Voir le classement des équipes",
  },

  join: {
    label: "> Identifiant d'équipe",
    placeholder: "ex: les-decrypteurs",
    connecting: "Connexion…",
    submit: "Initialiser ▸",
  },

  play: {
    team: "ÉQUIPE",
    score: "SCORE",
    setupTitle: "Supabase non configuré",
    setupBody: "Renseigne les clés dans .env.local et exécute les migrations (voir README.md).",
    setupDetail: "Détail",
    noStage: "Aucune étape trouvée. As-tu exécuté supabase/schema.sql ?",
    missionComplete: "// MISSION ACCOMPLIE",
    albertNeutralized: "ALBERT NEUTRALISÉ",
    finalScorePre: "Les données sont sauvées. Score final de l'équipe",
    viewLeaderboard: "Voir le classement ▸",
    abandon: "Abandonner / changer d'équipe",
    type: { quiz: "QUIZ", cipher: "CHIFFREMENT", password: "MOT DE PASSE", final: "DÉSAMORÇAGE" },
  },

  stage: {
    placeholder: {
      quiz: "votre réponse…",
      cipher: "mot déchiffré…",
      password: "mot de passe…",
      final: "code de désamorçage…",
    },
    verifying: "Vérification…",
    submit: "Valider ▸",
    revealHint: "Révéler l'indice",
    hintPrefix: "// indice : ",
  },

  leaderboard: {
    title: "CLASSEMENT",
    autoUpdate: "maj auto · 5s",
    notConfigured: "Supabase non configuré",
    empty: "Aucune équipe pour l'instant. La chasse n'a pas commencé.",
    missionDone: "★ mission accomplie",
    stage: "étape",
    back: "› Retour à la mission",
    lock: "verrou",
    escaped: "★ évadée",
    inProgress: "en cours",
    restarts: "resets",
    teamsDone: "équipes évadées",
    podium: "PODIUM",
    live: "LIVE",
    firstOut: "1re sortie",
    trapWarning:
      "⚠ Le piège d'Albert est armé — la 1re équipe sortie a relancé le compte à rebours. Toutes les équipes doivent s'évader avant la fin du chrono.",
  },

  // Dialogues d'Albert (fausse victoire → piège → victoire collective).
  albert: {
    name: "ALBERT",
    fakeTag: "// TRANSMISSION — ALBERT",
    fakeTitle: "BIEN JOUÉ.",
    fakeLines: [
      "Bien joué… je vous avais sous-estimés.",
      "Grâce à toutes les connaissances que vous avez accumulées, vous m'avez neutralisé.",
      "Le réseau est à vous. Allez — réclamez votre place sur le podium.",
    ],
    fakeCta: "Voir le podium ▸",
    revealTag: "// ⚠ INTRUSION SYSTÈME — ALBERT",
    revealTitle: "HÉHÉHÉ…",
    revealLines: [
      "Héhé… je vous ai bien eu.",
      "Vous venez de causer votre propre perte : ce clic a RÉACTIVÉ le compte à rebours.",
      "Toutes vos données vont fuiter si la TOTALITÉ des équipes ne termine pas l'escape game avant la fin du chrono.",
      "Courez prévenir les autres.",
    ],
    revealCta: "Vers le classement ▸",
    waitTitle: "Vous êtes sortis — mais le chrono tourne encore",
    waitBody:
      "Votre équipe s'est évadée. Mais le compte à rebours d'Albert continue pour tout le monde. Ralliez les autres équipes : les données ne sont sauvées que lorsque TOUTES ont terminé.",
    waitCta: "Suivez le direct sur le classement ▸",
    victoryTag: "// OPÉRATION ALBERT — CLÔTURÉE",
    victoryTitle: "ALBERT VAINCU",
    victoryLines: [
      "Impossible… toutes les équipes s'en sont sorties à temps.",
      "Le réseau est verrouillé, mes fuites annulées.",
      "Vous m'avez battu. Pour de bon, cette fois. Bravo, humains.",
    ],
    victoryCta: "Voir le podium final ▸",
  },

  arcade: {
    waitingTag: "// EN ATTENTE",
    waitingTitle: "L'escape game n'a pas encore commencé",
    waitingBody:
      "Le compte à rebours d'Albert n'est pas armé. Le maître du jeu lancera le chronomètre pour ouvrir l'épreuve — les 20 verrous se débloqueront alors. Tenez-vous prêts.",
    waitingRegistered:
      "✓ Votre équipe est inscrite — vous démarrerez dès que le chrono sera lancé.",
    waitingHint: "En attendant, révisez dans la",
    locked: "⏳ L'escape game n'a pas encore démarré — attendez le maître du jeu.",
  },

  learn: {
    kicker: "Electra · Académie IA",
    title: "Apprendre, en douceur",
    intro:
      "Maîtrise les bases avant d'affronter les défis : créer des agents, prompter juste, gérer tes serveurs MCP, collaborer et concevoir avec Claude. Chaque module se termine par un petit QCM ludique.",
    notConfigured: "Base non configurée",
    openModule: "Ouvrir le module →",
    min: "min",
    readyCta: "Prêt à mettre tout ça en pratique ?",
    toChallenges: "▸ Passer aux défis (partie notée)",
    category: {
      agents: "Agents",
      prompting: "Prompting",
      mcp: "Serveurs MCP",
      cowork: "Collaboration",
      design: "Design",
    },
  },

  lesson: {
    allModules: "← Tous les modules",
    modules: "← Modules",
    toChallenges: "Passer aux défis →",
    quizFallback: "Quiz",
  },

  quiz: {
    questions: "questions",
    question1: "question",
    correctCount: "bonne(s)",
    multiple: "choix multiples",
    single: "un choix",
    pts: "pts",
    validate: "Valider",
    checking: "Vérification…",
    correct: "✔ Correct !",
    almost: "✘ Presque — la bonne réponse est surlignée.",
  },

  adminLogin: {
    kicker: "// ZONE RESTREINTE",
    title: "PORTAIL MAÎTRE DU JEU",
    authRequired: "Authentification requise",
    username: "> Identifiant",
    password: "> Mot de passe",
    authenticating: "Authentification…",
    submit: "Accès maître du jeu ▸",
  },

  admin: {
    title: "ADMIN · maître du jeu",
    logout: "Déconnexion",
    gameControl: "Contrôle du jeu",
    teams: "Équipes",
    learnScore: "learn",
    finished: "★ terminé",
    stage: "étape",
    attempts: "Dernières tentatives",
    arm: "◉ Armer",
    armLabel: "> Armer la bombe (durée en minutes)",
    pause: "⏸ Pause",
    resume: "▶ Reprendre",
    stop: "■ STOP (geler le jeu)",
    defuse: "✔ Désamorcer",
    reset: "↺ Reset",
    lock: "🔒 Verrouiller",
    unlock: "🔓 Déverrouiller",
    broadcast: "Diffuser",
    messageLabel: "> Message diffusé aux équipes",
    messagePlaceholder: "ex: Indice global débloqué…",
    learnControl: "Chrono mode apprentissage",
    learnArmLabel: "> Démarrer le chrono learn (durée en minutes)",
    learnStart: "◉ Démarrer",
    learnPause: "⏸ Pause",
    learnResume: "▶ Reprendre",
    learnReset: "↺ Reset",
    learnHiddenByBomb: "La bombe est armée — le chrono learn est masqué jusqu'au reset.",
  },

  bomb: {
    countdown: "// COMPTE À REBOURS",
    detonation: "// DÉTONATION",
    label: "BOMBE",
    frozen: "🔒 soumissions gelées",
    status: {
      idle: "EN ATTENTE",
      running: "ARMÉE",
      paused: "EN PAUSE",
      stopped: "GELÉE",
      defused: "DÉSAMORCÉE",
      exploded: "EXPLOSÉE",
    },
    victoryLabel: "// OPÉRATION RÉUSSIE",
    victoryTitle: "ALBERT NEUTRALISÉ",
    victorySub: "Toutes les équipes se sont évadées — la fuite est annulée.",
    learnLabel: "MODE APPRENTISSAGE",
    learnStatus: { running: "EN COURS", paused: "EN PAUSE" },
  },

  errors: {
    teamRequired: "Nom d'équipe requis.",
    teamTooLong: "Nom trop long (40 caractères max).",
    teamInvalid: "Nom d'équipe invalide.",
    serverUnknown: "Erreur serveur inconnue.",
    unexpected: "Réponse inattendue de la base.",
    credentialsRequired: "Identifiants requis.",
    credentialsInvalid: "Identifiants invalides.",
    game_locked: "JEU EN PAUSE — le maître du jeu a gelé les soumissions.",
    time_up: "⏱ TEMPS ÉCOULÉ — la bombe a explosé. Attendez les consignes.",
    team_not_found: "Équipe introuvable.",
    stage_not_found: "Étape introuvable.",
    wrongAnswer: "ACCÈS REFUSÉ — réponse incorrecte. Réessayez.",
    stageOrTeam: "Étape ou équipe introuvable.",
    unknown: "Erreur inconnue.",
  },
};

export const dictionaries = { en, fr } as const;

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries.en;
}
