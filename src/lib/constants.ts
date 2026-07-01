/** Cookie httpOnly qui identifie l'équipe (contient l'UUID de la team). */
export const TEAM_COOKIE = "albert_team_id";

/** Cookie httpOnly qui identifie une session admin (contient l'UUID admin). */
export const ADMIN_COOKIE = "albert_admin_id";

/** Durée de vie du cookie : ~12h, la durée d'un hackathon. */
export const COOKIE_MAX_AGE = 60 * 60 * 12;
