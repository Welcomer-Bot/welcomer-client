/**
 * Dashboard Feature
 *
 * Gestion complète des modules welcome/leave (Welcomer/Leaver) par guild.
 *
 * Sub-features:
 * - Guild: Sélection, affichage des modules
 * - Editor: Édition du message content (text, embeds)
 * - ImageEditor: Édition de la carte image (design, position)
 * - Stats: Affichage des statistiques d'utilisation
 *
 * Architecture:
 * - Client components pour les editors (useTransition, state)
 * - Server components pour les pages (data fetch, auth)
 * - Server actions pour les mutations (revalidatePath)
 */

export * from "./guild";

