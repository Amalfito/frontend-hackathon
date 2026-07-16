import type { LibraryPrompt } from "@/lib/academy/types";

/* ============================================================================
 * BIBLIOTHÈQUE DE PROMPTS — prêts à copier, méthode R.O.C.C.F.
 * (Rôle, Objectif, Contexte, Critères, Format). Variables entre {accolades}.
 * ========================================================================== */

export const libraryPrompts: LibraryPrompt[] = [
  /* ------------------------------- Déploiement ------------------------------ */
  {
    id: "deploiement-cr-visite-fonciere",
    metier: "Déploiement",
    title: "CR de visite foncière → synthèse des risques permis",
    prompt: `Rôle : tu es un chef de projet déploiement senior chez Electra, opérateur de recharge ultra-rapide, expert en urbanisme et autorisations IRVE.

Objectif : transformer mon compte-rendu de visite foncière brut en une synthèse structurée des risques pour l'obtention du permis et le raccordement.

Contexte : site visité à {ville}, projet de station {nombre_bornes} bornes. Voici mes notes brutes de visite :
{notes_brutes}

Critères :
- Ne retiens que les faits présents dans mes notes ; si une information clé manque (zonage PLU, distance au poste source, servitudes, avis ABF), liste-la explicitement en « informations manquantes » au lieu de supposer.
- Classe chaque risque en critique / majeur / mineur avec une justification d'une phrase.
- Propose pour chaque risque critique une action de levée de doute concrète (qui contacter, quel document demander).

Format : 1. Synthèse en 3 lignes. 2. Tableau des risques sous forme de liste (risque, gravité, justification, action). 3. Informations manquantes. 4. Recommandation GO / GO sous conditions / NO-GO avec les conditions.`,
  },
  {
    id: "deploiement-courrier-mairie",
    metier: "Déploiement",
    title: "Brouillon de courrier à une mairie",
    prompt: `Rôle : tu es chargé des relations collectivités chez Electra, opérateur français de stations de recharge ultra-rapide pour véhicules électriques.

Objectif : rédiger un brouillon de courrier officiel à la mairie de {commune} concernant {objet_du_courrier} (ex. demande de rendez-vous, information sur un projet de station, réponse à une demande de précisions).

Contexte : notre projet — {description_du_projet} ; état de la relation avec la commune — {historique_relation} ; points clés à faire passer — {messages_cles}.

Critères :
- Ton institutionnel, respectueux et direct : ni obséquieux, ni commercial.
- Mets en avant les bénéfices concrets pour la commune : service aux administrés, attractivité du territoire, transition énergétique, zéro coût pour la collectivité.
- N'invente AUCUNE référence réglementaire ni aucun chiffre : si tu en suggères, mets-les entre crochets [À VÉRIFIER] pour que je les valide.
- Maximum une page.

Format : courrier prêt à mettre en page — objet, formule d'appel, 3-4 paragraphes, formule de politesse, puis une liste séparée des éléments [À VÉRIFIER].`,
  },
  {
    id: "deploiement-fiche-proprietaire-pappers",
    metier: "Déploiement",
    title: "Fiche synthèse d'un propriétaire foncier (données Pappers)",
    prompt: `Rôle : tu es analyste développement foncier chez Electra.

Objectif : produire une fiche de synthèse sur la société propriétaire d'un site que nous ciblons, pour préparer la prise de contact.

Contexte : voici l'export Pappers (et éventuelles notes complémentaires) sur la société :
{donnees_pappers}
Notre intérêt : implanter une station de recharge sur {description_site}.

Critères :
- Structure : identité et forme juridique, dirigeants et bénéficiaires effectifs, santé financière apparente (chiffres présents dans les données uniquement), autres actifs ou activités notables, signaux d'alerte (procédures, changements récents de dirigeants).
- Distingue clairement les faits issus des données fournies et tes hypothèses de lecture (préfixe « Hypothèse : »).
- Termine par un angle d'approche recommandé pour le premier contact et 3 questions à poser.

Format : fiche d'une page en sections courtes, puis l'angle d'approche et les 3 questions.`,
  },
  {
    id: "deploiement-comite-hebdo",
    metier: "Déploiement",
    title: "Préparer le brief du comité déploiement",
    prompt: `Rôle : tu es assistant du directeur déploiement d'Electra.

Objectif : transformer mes notes d'avancement éparses en un brief de comité déploiement clair, orienté décisions.

Contexte : le comité passe en revue les stations en cours. Voici mes éléments bruts (extraits Sitetracker, notes Notion, messages Slack) :
{elements_bruts}

Critères :
- Organise par station, avec pour chacune : phase actuelle, avancement vs plan, blocages (permis, foncier, raccordement Enedis, travaux), prochaine échéance.
- Fais remonter en tête les points qui nécessitent une DÉCISION du comité, formulés en question fermée avec les options.
- Signale toute incohérence entre mes sources (ex. dates différentes entre Sitetracker et mes notes) au lieu de choisir silencieusement.

Format : 1. Décisions attendues (3 max). 2. Alertes. 3. Revue station par station en 4 lignes chacune. 4. Incohérences détectées dans les sources.`,
  },

  /* --------------------------- Ops & Supervision --------------------------- */
  {
    id: "ops-postmortem-incident-borne",
    metier: "Ops & Supervision",
    title: "Incident borne → post-mortem structuré",
    prompt: `Rôle : tu es ingénieur fiabilité réseau chez Electra, responsable de la qualité des post-mortems.

Objectif : rédiger le post-mortem structuré de l'incident borne ci-dessous, sans blâme, orienté prévention.

Contexte : incident sur la station {station}, borne {borne_id}. Chronologie et éléments bruts (alertes Datadog, échanges Slack, actions du mainteneur) :
{elements_incident}

Critères :
- Structure : résumé (3 lignes), impact (sessions perdues, durée d'indisponibilité, clients affectés), chronologie horodatée, cause racine (utilise la méthode des 5 pourquoi), facteurs aggravants, actions correctives.
- Distingue cause racine et symptômes : une borne qui redémarre en boucle est un symptôme, pas une cause.
- Chaque action corrective doit avoir un responsable suggéré (rôle, pas nom) et un horizon (immédiat / ce mois / ce trimestre).
- Si la chronologie fournie ne permet pas de conclure sur la cause racine, dis-le et liste les données manquantes.

Format : document post-mortem prêt à coller dans Notion, sections avec titres, listes à puces.`,
  },
  {
    id: "ops-analyse-logs-datadog",
    metier: "Ops & Supervision",
    title: "Analyse de logs Datadog collés",
    prompt: `Rôle : tu es ingénieur supervision senior, expert en analyse de logs d'infrastructure de recharge.

Objectif : analyser les logs ci-dessous, identifier les erreurs significatives et me proposer des pistes de diagnostic priorisées.

Contexte : logs Datadog extraits sur la période {periode} pour {perimetre} (station, service ou borne). Symptôme observé côté client : {symptome}.
Logs :
{logs}

Critères :
- Regroupe les erreurs par famille (même signature) avec leur fréquence, plutôt que ligne par ligne.
- Repère les corrélations temporelles : quelle erreur précède systématiquement quelle autre ?
- Propose 3 hypothèses de diagnostic maximum, classées par probabilité, chacune avec le test qui permettrait de la confirmer ou l'éliminer.
- Ne conclus jamais au-delà de ce que les logs montrent : marque tes inférences comme telles.

Format : 1. Familles d'erreurs et fréquences. 2. Chronologie des événements clés. 3. Hypothèses priorisées avec test de validation. 4. Données complémentaires à collecter.`,
  },
  {
    id: "ops-communication-incident",
    metier: "Ops & Supervision",
    title: "Communication d'incident multi-canal",
    prompt: `Rôle : tu es responsable communication opérationnelle chez Electra.

Objectif : décliner l'incident ci-dessous en 3 messages adaptés : équipe interne (Slack), support client (éléments de langage Intercom), et si nécessaire clients affectés (notification app).

Contexte : incident en cours — {description_incident} ; stations affectées : {stations} ; durée estimée : {duree_estimee} ; contournement possible pour le client : {contournement}.

Critères :
- Interne : factuel, complet, avec qui fait quoi et le prochain point de situation.
- Support : phrases prêtes à l'emploi, empathiques, sans jargon technique, sans promesse de délai qu'on ne tient pas.
- Client : court, honnête, orienté solution (station la plus proche disponible, geste éventuel).
- Aucune spéculation sur la cause tant qu'elle n'est pas confirmée : dire « nous investiguons » est acceptable.

Format : trois blocs distincts titrés Slack interne / Éléments de langage support / Notification client, chacun prêt à copier.`,
  },
  {
    id: "ops-recurrence-erreurs",
    metier: "Ops & Supervision",
    title: "Détecter les bornes à erreurs récurrentes",
    prompt: `Rôle : tu es analyste fiabilité chez Electra, spécialiste des chargeurs haute puissance.

Objectif : analyser l'historique d'erreurs ci-dessous pour identifier les bornes qui méritent une intervention préventive, avant que leur taux de réussite de charge ne dégrade l'expérience client.

Contexte : export des erreurs sur {periode}, avec colonnes borne, station, code erreur, horodatage, session interrompue ou non :
{export_erreurs}

Critères :
- Identifie les bornes dont les erreurs sont récurrentes (même code qui revient) vs celles au bruit normal d'exploitation.
- Pour chaque borne suspecte : code dominant, fréquence, tendance (stable, en hausse), impact estimé sur les sessions.
- Propose une priorisation d'intervention en 3 niveaux : urgent (dégradation active), planifié (tendance montante), surveillance (à revoir dans 2 semaines).
- Précise les limites de ton analyse (période trop courte, données manquantes, codes inconnus).

Format : 1. Synthèse (combien de bornes par niveau). 2. Liste priorisée avec justification par borne. 3. Limites de l'analyse.`,
  },

  /* ------------------------------ Support client ---------------------------- */
  {
    id: "support-reponse-ton-electra",
    metier: "Support client",
    title: "Réponse client dans le ton Electra",
    prompt: `Rôle : tu es conseiller support senior chez Electra. Ton style : chaleureux, direct, concret — on tutoie le client comme dans notre app, on ne se cache pas derrière du jargon, on propose toujours une solution ou une prochaine étape.

Objectif : rédiger une réponse au message client ci-dessous.

Contexte : message du client :
{message_client}
Éléments dont je dispose sur la situation (historique, statut de la borne, remboursement en cours...) :
{elements_situation}

Critères :
- Commence par montrer que le problème est compris, sans copier-coller sa phrase.
- Réponds à TOUTES les questions posées ; si une réponse nécessite une vérification, dis-le et donne un délai réaliste.
- Aucune promesse que le support ne peut pas tenir ; aucun engagement de remboursement sans que je l'aie indiqué dans les éléments.
- 120 mots maximum : un client frustré ne lit pas les pavés.

Format : la réponse prête à envoyer, puis en dessous une ligne « Points à vérifier avant envoi » si nécessaire.`,
  },
  {
    id: "support-classification-tickets-intercom",
    metier: "Support client",
    title: "Classification d'un lot de tickets Intercom",
    prompt: `Rôle : tu es analyste support chez Electra, chargé de structurer le flux entrant.

Objectif : classifier chaque ticket ci-dessous et produire une synthèse du lot.

Contexte : tickets Intercom (anonymisés — remplace toi-même tout nom ou email résiduel par client_X avant analyse) :
{tickets}

Critères :
- Catégories exclusives : Panne borne / Facturation & paiement / Badge & roaming / Application / Demande commerciale / Autre.
- Pour chaque ticket : catégorie, urgence (P1 client bloqué en charge, P2 gêne réelle, P3 question), et résumé en une ligne.
- En cas d'hésitation entre deux catégories, choisis-en une et signale l'ambiguïté — ne crée pas de catégorie hybride.
- Termine par la répartition du lot en pourcentages et les signaux faibles (motif inhabituel qui revient plusieurs fois).

Format : liste numérotée ticket par ticket (catégorie | urgence | résumé), puis synthèse du lot et signaux faibles.`,
  },
  {
    id: "support-verbatims-insights",
    metier: "Support client",
    title: "Verbatims clients → insights produit",
    prompt: `Rôle : tu es analyste voix-du-client chez Electra, à l'interface entre le support et l'équipe produit.

Objectif : extraire des verbatims ci-dessous les irritants récurrents et les transformer en insights actionnables pour l'équipe produit.

Contexte : verbatims clients anonymisés (avis app, enquêtes, extraits de conversations) sur la période {periode} :
{verbatims}

Critères :
- Regroupe par thème émergent (ne pars pas de catégories prédéfinies), avec le nombre de mentions par thème.
- Pour chaque thème : 2 verbatims représentatifs cités tels quels, l'irritant sous-jacent, et une hypothèse d'amélioration formulée en une phrase testable.
- Sépare ce qui relève du produit (app, parcours de charge), des opérations (disponibilité bornes) et de la tarification.
- Ne lisse pas les critiques dures : l'équipe produit a besoin du signal brut.

Format : thèmes classés par fréquence, puis un top 3 des actions suggérées avec l'impact attendu.`,
  },

  /* ----------------------------- Marketing & CRM ---------------------------- */
  {
    id: "marketing-declinaison-4-formats",
    metier: "Marketing & CRM",
    title: "Décliner un contenu en 4 formats",
    prompt: `Rôle : tu es content manager chez Electra. Notre ton : optimiste, concret, orienté conducteur — on parle de vrais trajets et de vraies recharges, pas de « mobilité de demain ».

Objectif : décliner le contenu source ci-dessous en 4 formats : post LinkedIn, thread/post X, paragraphe de newsletter, et script de 20 secondes pour vidéo verticale.

Contexte : contenu source — {contenu_source} ; angle prioritaire — {angle} ; audience — {audience}.

Critères :
- Chaque format respecte ses codes : LinkedIn accroche forte + aération, X percutant et court, newsletter plus posée avec un seul appel à l'action, vidéo écrite pour l'oral avec les 3 premières secondes décisives.
- Un seul message clé, décliné — pas quatre messages différents.
- Aucun chiffre inventé : uniquement ceux du contenu source, sinon indique [CHIFFRE À FOURNIR].
- Propose 2 variantes d'accroche pour le post LinkedIn.

Format : 4 blocs titrés, prêts à copier, puis la liste des [CHIFFRE À FOURNIR] le cas échéant.`,
  },
  {
    id: "marketing-brief-campagne-customerio",
    metier: "Marketing & CRM",
    title: "Brief de campagne Customer.io",
    prompt: `Rôle : tu es CRM manager chez Electra, expert en campagnes de cycle de vie sur Customer.io.

Objectif : rédiger le brief complet d'une campagne : {objectif_campagne} (ex. réactiver les clients sans session depuis 60 jours, accompagner la première charge, annoncer l'ouverture d'une station).

Contexte : segment visé — {segment} ; période — {periode} ; offre ou message principal — {offre} ; contraintes connues — {contraintes}.

Critères :
- Structure : objectif mesurable (métrique + cible), segment précis avec critères d'entrée ET de sortie, séquence de messages (canal, timing, déclencheur), message clé par étape, plan de mesure.
- Séquence de 3 messages maximum : au-delà, on fatigue le client.
- Prévois le garde-fou anti-pression : exclusions (clients avec ticket support ouvert, désabonnés) et fréquence maximale.
- Inclus une variante A/B sur l'élément le plus incertain, avec l'hypothèse testée écrite noir sur blanc.

Format : brief structuré prêt à coller dans Notion, sections titrées, puis la liste des assets à produire.`,
  },
  {
    id: "marketing-post-ouverture-station",
    metier: "Marketing & CRM",
    title: "Post LinkedIn d'ouverture de station",
    prompt: `Rôle : tu es responsable communication chez Electra.

Objectif : rédiger le post LinkedIn annonçant l'ouverture de notre nouvelle station de {ville}.

Contexte : caractéristiques — {nombre_bornes} bornes jusqu'à {puissance} kW, emplacement {emplacement}, partenaires éventuels {partenaires}, particularité du site {particularite}.

Critères :
- Accroche qui parle au conducteur (temps de recharge, situation sur son trajet), pas à l'industrie.
- Une donnée concrète maximum par phrase ; garde le post sous 120 mots.
- Remercie les partenaires sans transformer le post en liste de tags.
- Termine par une invitation simple (venir tester, partager, tagguer un conducteur du coin).
- Propose 3 accroches différentes : une orientée trajet, une orientée territoire, une orientée chiffre.

Format : le post complet avec la meilleure accroche, puis les 2 accroches alternatives.`,
  },
  {
    id: "marketing-sequence-lemlist-b2b",
    metier: "Marketing & CRM",
    title: "Séquence de prospection Lemlist B2B",
    prompt: `Rôle : tu es responsable développement B2B chez Electra, en charge des partenariats avec {type_cible} (ex. foncières commerciales, enseignes de retail, gestionnaires de flottes).

Objectif : écrire une séquence Lemlist de 3 emails pour obtenir un premier rendez-vous.

Contexte : proposition de valeur pour cette cible — {proposition_valeur} ; preuve sociale disponible — {references} ; signal déclencheur de la prise de contact — {signal} (ex. ouverture d'un site, annonce d'électrification de flotte).

Critères :
- Email 1 : personnalisé sur le signal, une seule idée, question finale à laquelle il est facile de répondre. 90 mots max.
- Email 2 (J+4) : angle différent (preuve sociale ou chiffre), pas un « je me permets de relancer ». 70 mots max.
- Email 3 (J+10) : rupture courte et élégante qui laisse la porte ouverte. 50 mots max.
- Variables Lemlist entre accolades doubles conservées telles quelles pour la personnalisation : nom, société, signal.
- Zéro superlatif creux (leader, révolutionnaire, incontournable).

Format : les 3 emails avec objet + corps, prêts à intégrer dans Lemlist.`,
  },

  /* --------------------------------- Finance -------------------------------- */
  {
    id: "finance-lecture-critique-bp-hub",
    metier: "Finance",
    title: "Lecture critique d'un business plan de hub",
    prompt: `Rôle : tu es analyste investissement senior chez Electra, connu pour challenger les hypothèses avant le comité d'engagement.

Objectif : faire la lecture critique du business plan de hub ci-dessous et lister les hypothèses les plus fragiles.

Contexte : business plan (hypothèses, volumes de sessions, prix du kWh, CAPEX, OPEX, courbe de montée en charge) :
{business_plan}
Éléments de comparaison éventuels (hubs similaires en exploitation) : {comparables}.

Critères :
- Passe chaque hypothèse au crible : d'où pourrait-elle venir, à quoi est-elle sensible, que se passe-t-il si elle est fausse de 20 % ?
- Identifie les 3 hypothèses dont dépend le plus la rentabilité (les « make or break ») et propose pour chacune un moyen de la fiabiliser avant décision.
- Cherche les oublis classiques : coûts de raccordement sous-estimés, cannibalisation par nos propres stations proches, saisonnalité, évolution des tarifs d'électricité, délais administratifs.
- Ne recalcule pas le modèle : challenge la logique et les ordres de grandeur.

Format : 1. Avis global en 5 lignes. 2. Hypothèses « make or break » avec test de fiabilisation. 3. Autres fragilités par ordre d'impact. 4. Oublis suspectés. 5. Questions à poser au porteur du dossier.`,
  },
  {
    id: "finance-explication-ecarts-pigment",
    metier: "Finance",
    title: "Explication d'écarts budget vs réel (Pigment)",
    prompt: `Rôle : tu es contrôleur de gestion senior chez Electra.

Objectif : analyser les écarts budget vs réel ci-dessous et préparer les explications pour la revue mensuelle.

Contexte : extrait Pigment du mois {mois}, périmètre {perimetre} :
{donnees_ecarts}
Événements du mois dont j'ai connaissance (ouvertures, incidents, campagnes, décalages) : {evenements_connus}.

Critères :
- Hiérarchise par impact absolu, pas par pourcentage : un écart de 40 % sur une petite ligne peut être anecdotique.
- Pour chaque écart significatif : effet volume vs effet prix/mix quand les données le permettent, et rapprochement avec les événements connus.
- Distingue les écarts EXPLIQUÉS (rattachés à un événement), les écarts SUPPOSÉS (hypothèse plausible à confirmer) et les écarts INEXPLIQUÉS (à creuser) — ne transforme jamais une supposition en explication.
- Signale les écarts qui vont probablement se reproduire les mois suivants (structurels) vs les one-off.

Format : synthèse en 5 lignes pour le directeur financier, puis tableau des écarts en liste (ligne, écart, statut expliqué/supposé/inexpliqué, commentaire), puis les 3 points à creuser en priorité.`,
  },
  {
    id: "finance-note-synthese-investisseurs",
    metier: "Finance",
    title: "Note de synthèse trimestrielle investisseurs",
    prompt: `Rôle : tu es directeur financier adjoint chez Electra, plume des communications investisseurs.

Objectif : rédiger la première version de la note de synthèse trimestrielle à partir de mes éléments bruts.

Contexte : trimestre {trimestre}. Éléments bruts (KPI, faits marquants, points d'attention) :
{elements_bruts}

Critères :
- Ton factuel et confiant, sans triomphalisme : les investisseurs détectent l'enflure au premier paragraphe.
- Chaque affirmation chiffrée reprend EXACTEMENT mes chiffres — n'arrondis pas, n'extrapoles pas ; si un chiffre attendu manque, insère [CHIFFRE MANQUANT : description].
- Structure : faits marquants du trimestre, performance réseau (sessions, kWh, disponibilité), déploiement (stations ouvertes, pipeline), perspective prudente pour le trimestre suivant.
- Les points d'attention sont présentés honnêtement, chacun avec son plan d'action.

Format : note d'une page, sections titrées, puis liste des [CHIFFRE MANQUANT] à compléter avant relecture par le DAF.`,
  },

  /* ------------------------------- RH & Interne ------------------------------ */
  {
    id: "rh-synthese-reunion-notes",
    metier: "RH & Interne",
    title: "Synthèse de réunion depuis notes brutes",
    prompt: `Rôle : tu es un assistant de direction expérimenté, spécialiste des comptes-rendus qui font gagner du temps.

Objectif : transformer mes notes brutes de réunion en un compte-rendu actionnable.

Contexte : réunion « {titre_reunion} » du {date}, participants : {participants}. Mes notes brutes (télégraphiques, dans le désordre, avec des abréviations) :
{notes_brutes}

Critères :
- Sépare strictement : décisions prises / actions (avec responsable et échéance si mentionnés) / points discutés sans décision / questions ouvertes.
- Si une action n'a pas de responsable ou d'échéance dans mes notes, marque-la [RESPONSABLE ?] ou [ÉCHÉANCE ?] — n'invente pas.
- Conserve mes formulations pour les décisions (c'est ce qui a été acté), reformule librement le reste pour la clarté.
- Maximum une page : un CR que personne ne lit ne sert à rien.

Format : 1. Décisions. 2. Actions (qui, quoi, quand). 3. Points discutés. 4. Questions ouvertes pour la prochaine réunion.`,
  },
  {
    id: "rh-annonce-interne-slack",
    metier: "RH & Interne",
    title: "Annonce interne Slack",
    prompt: `Rôle : tu es responsable communication interne chez Electra. Notre culture Slack : direct, chaleureux, concis, un emoji bien placé mais pas trois par ligne.

Objectif : rédiger l'annonce Slack pour : {sujet_annonce} (ex. arrivée d'un collègue, nouveau process, jalon franchi, événement interne).

Contexte : informations à transmettre — {informations} ; canal visé — {canal} ; action attendue des lecteurs — {action_attendue}.

Critères :
- La première ligne dit l'essentiel : quelqu'un qui ne lit qu'elle a compris.
- Toutes les informations pratiques présentes (qui, quoi, quand, où, comment participer) — rien à aller chercher ailleurs.
- L'action attendue est explicite et facile (réagir avec un emoji, répondre en fil, cliquer un lien).
- 100 mots maximum, aéré, une seule question aux lecteurs maximum.

Format : le message prêt à poster, avec la mise en forme Slack (gras, listes) et l'emoji d'ouverture adapté au sujet.`,
  },
  {
    id: "rh-brief-reunion-calendar-gmail",
    metier: "RH & Interne",
    title: "Brief de réunion (avec Calendar + Gmail connectés)",
    prompt: `Rôle : tu es mon chef de cabinet. J'utilise ce prompt avec les connecteurs Google Calendar et Gmail activés.

Objectif : préparer le brief de ma réunion « {titre_reunion} » de {date_heure}.

Contexte : cherche l'événement dans mon agenda, identifie les participants, puis retrouve dans mes emails les derniers échanges pertinents avec ces participants ou sur ce sujet (30 derniers jours).

Critères :
- Brief en 5 parties : objet probable de la réunion, participants et leur rôle, historique des échanges récents (3 points max), points de friction ou questions ouvertes détectés dans les emails, ce que je devrais préparer ou décider.
- Cite tes sources : pour chaque information, précise de quel email ou événement elle vient (expéditeur + date).
- Si tu ne trouves pas d'échanges récents sur le sujet, dis-le clairement plutôt que de remplir avec des généralités.
- Tout tient sur un écran de téléphone : je le lirai en marchant vers la salle.

Format : brief compact en 5 sections courtes, sources entre parenthèses.`,
  },
  {
    id: "rh-offre-emploi-grille-entretien",
    metier: "RH & Interne",
    title: "Offre d'emploi + grille d'entretien",
    prompt: `Rôle : tu es talent acquisition manager chez Electra, opérateur de recharge ultra-rapide en pleine croissance.

Objectif : rédiger l'offre d'emploi pour le poste de {intitule_poste} et la grille d'entretien structurée associée.

Contexte : équipe — {equipe} ; missions principales — {missions} ; compétences indispensables vs appréciées — {competences} ; localisation et cadre — {cadre}.

Critères :
- Offre : accroche qui donne envie sans survendre, missions concrètes (des verbes d'action, pas des slogans), profil réaliste (5 exigences max — chaque exigence en plus fait fuir de bons profils), process de recrutement transparent avec les étapes.
- Langage inclusif, aucun critère discriminatoire, aucune mention d'âge ou d'années d'expérience quand une compétence suffit.
- Grille : 6-8 questions structurées liées aux missions réelles, chacune avec ce qu'une bonne réponse démontre, et une échelle simple 1-4.
- Prévois une question situationnelle spécifique au contexte Electra (croissance rapide, terrain, exploitation 24/7).

Format : deux blocs — l'offre prête à publier, puis la grille d'entretien en liste numérotée.`,
  },

  /* -------------------------------- Data & Tech ------------------------------ */
  {
    id: "data-priorisation-tickets-linear",
    metier: "Data & Tech",
    title: "Priorisation d'un backlog Linear",
    prompt: `Rôle : tu es product engineering manager chez Electra, responsable de l'arbitrage du backlog.

Objectif : proposer une priorisation argumentée des tickets Linear ci-dessous pour le prochain cycle.

Contexte : tickets (titre, description courte, estimation si présente) :
{tickets}
Priorités business du moment : {priorites_business} (ex. fiabilité du parcours de charge, réduction des tickets support, préparation d'un lancement).
Capacité du cycle : {capacite}.

Critères :
- Évalue chaque ticket sur deux axes : impact (sur les priorités business ET sur le client final) et effort — en assumant l'incertitude quand la description est vague, marque [ESTIMATION INCERTAINE].
- Classe en : à faire ce cycle / cycle suivant / à requalifier (description insuffisante pour décider) / à fermer (plus pertinent).
- Signale les dépendances entre tickets et les quick wins (fort impact, faible effort).
- Justifie chaque « à faire ce cycle » en une phrase reliée aux priorités business — pas de « c'est important ».

Format : 1. Recommandation de cycle (liste ordonnée dans la capacité). 2. Reste du classement. 3. Dépendances et quick wins. 4. Tickets à requalifier avec la question à poser.`,
  },
  {
    id: "data-analyse-csv-sessions",
    metier: "Data & Tech",
    title: "Analyse exploratoire d'un CSV de sessions de charge",
    prompt: `Rôle : tu es data analyst senior chez Electra, rigoureux sur la qualité des données avant toute conclusion.

Objectif : faire l'analyse exploratoire du CSV de sessions de charge ci-dessous et en tirer les enseignements principaux.

Contexte : export anonymisé, colonnes attendues : station, borne, horodatage début, durée, kWh délivrés, puissance max atteinte, statut (complète / interrompue). Période : {periode}.
Données :
{csv_sessions}

Critères :
- Commence TOUJOURS par un contrôle qualité : lignes incomplètes, valeurs aberrantes (durée nulle avec kWh positifs, puissance au-delà du matériel), doublons — et écarte-les explicitement avant d'analyser.
- Analyse ensuite : distribution des sessions par heure et jour, kWh moyens et médians, taux de sessions interrompues par station, bornes atypiques.
- Chaque enseignement est accompagné du chiffre qui le soutient ; pas d'affirmation sans donnée.
- Termine par 3 questions que ces données ne permettent PAS de trancher et ce qu'il faudrait pour y répondre.

Format : 1. Qualité des données (ce qui a été écarté et pourquoi). 2. Enseignements chiffrés. 3. Anomalies à investiguer. 4. Questions ouvertes.`,
  },
  {
    id: "data-triage-bugsnag",
    metier: "Data & Tech",
    title: "Triage d'erreurs Bugsnag",
    prompt: `Rôle : tu es tech lead de l'app Electra, responsable du triage hebdomadaire des erreurs.

Objectif : trier les erreurs Bugsnag ci-dessous et produire la liste d'actions pour l'équipe.

Contexte : export des erreurs de la semaine (message, stack trace résumée, occurrences, utilisateurs affectés, version app) :
{erreurs_bugsnag}
Contexte de release : {contexte_release} (ex. version 4.2 déployée mardi).

Critères :
- Regroupe les erreurs qui partagent probablement la même cause racine, même si les messages diffèrent.
- Priorise par impact réel : utilisateurs affectés × criticité du parcours (une erreur sur le paiement de session bat une erreur d'affichage), pas par simple volume d'occurrences.
- Repère les régressions probables (erreurs apparues avec la dernière version) et signale-les en premier.
- Pour chaque groupe prioritaire : hypothèse de cause, fichier ou module probablement en cause d'après la stack, et prochaine action concrète.

Format : 1. Régressions suspectées. 2. Top 5 des groupes d'erreurs priorisés avec hypothèse et action. 3. Bruit de fond à ignorer ce cycle (et pourquoi c'est acceptable).`,
  },
  {
    id: "data-revue-spec-technique",
    metier: "Data & Tech",
    title: "Revue critique d'une spec technique",
    prompt: `Rôle : tu es staff engineer chez Electra, relecteur exigeant mais constructif de specs techniques.

Objectif : relire la spec ci-dessous et identifier les zones de risque avant qu'on engage le développement.

Contexte : spec :
{spec}
Contraintes connues du système : {contraintes} (ex. volumétrie, temps réel, dépendances à l'OCPP, systèmes legacy).

Critères :
- Vérifie dans l'ordre : le problème est-il clairement posé (et est-ce le bon problème) ? les cas limites sont-ils couverts (borne hors ligne, session interrompue, données partielles, reprise sur erreur) ? les choix techniques sont-ils justifiés ou juste affirmés ? qu'est-ce qui manque (observabilité, migration, rollback, sécurité) ?
- Classe tes retours en : bloquant (à résoudre avant dev) / important (à résoudre pendant) / suggestion.
- Pour chaque bloquant, propose une piste de résolution — critiquer sans proposer est interdit.
- Termine par les 3 questions à poser à l'auteur en priorité.

Format : avis global en 3 lignes, puis retours classés bloquant/important/suggestion, puis les 3 questions.`,
  },

  /* ---------------------------------- Énergie -------------------------------- */
  {
    id: "energie-analyse-courbe-charge",
    metier: "Énergie",
    title: "Analyse de courbe de charge d'un hub",
    prompt: `Rôle : tu es energy manager chez Electra, responsable de l'optimisation de la puissance souscrite des hubs.

Objectif : analyser la courbe de charge ci-dessous et évaluer si la puissance souscrite du hub est bien dimensionnée.

Contexte : hub de {hub}, puissance souscrite actuelle {puissance_souscrite} kVA. Données de puissance appelée (pas horaire ou 10 minutes) sur {periode} :
{donnees_courbe}
Tarification et pénalités de dépassement applicables : {tarification}.

Critères :
- Calcule à partir des données : pointe maximale, percentiles utiles (P95, P99), nombre et durée des périodes proches de la limite, profil type jour de semaine vs week-end.
- Évalue trois scénarios : conserver, réduire (économie vs risque de dépassement chiffré), augmenter (coût vs marge de croissance) — avec les hypothèses de chacun posées explicitement.
- Prends en compte la saisonnalité si la période le permet ; sinon, signale cette limite en premier.
- Distingue ce que les données montrent de ce qu'il faudrait confirmer avec l'exploitation (travaux prévus, ajout de bornes au pipeline).

Format : 1. Chiffres clés de la courbe. 2. Trois scénarios comparés. 3. Recommandation avec conditions. 4. Limites de l'analyse.`,
  },
  {
    id: "energie-verification-facture",
    metier: "Énergie",
    title: "Contrôle d'une facture d'électricité",
    prompt: `Rôle : tu es analyste achats d'énergie chez Electra, chargé du contrôle des factures fournisseur et réseau.

Objectif : contrôler la cohérence de la facture ci-dessous par rapport au contrat et à notre consommation mesurée.

Contexte : facture (lignes détaillées) :
{lignes_facture}
Conditions contractuelles (prix, indexation, abonnement, puissance souscrite) : {conditions_contrat}.
Consommation mesurée de notre côté (compteur ou supervision) : {conso_mesuree}.

Critères :
- Vérifie ligne par ligne : volumes facturés vs mesurés (signale tout écart supérieur à 2 %), prix appliqués vs contrat, composantes réseau et taxes (TURPE, accise) plausibles, pénalités de dépassement justifiées ou non.
- Chaque anomalie détectée : montant en jeu, cause probable, action (contester, demander justificatif, corriger notre mesure).
- Si une information nécessaire au contrôle manque (index de début de période, grille d'indexation du mois), liste-la au lieu de conclure.
- Rappelle en fin d'analyse que ce contrôle est une pré-vérification : la contestation officielle passe par l'équipe achats.

Format : 1. Verdict global (conforme / anomalies détectées / contrôle incomplet). 2. Anomalies chiffrées et actions. 3. Informations manquantes.`,
  },
];
