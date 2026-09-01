import type { Metadata } from "next";
import styles from "./access.module.css";

export const metadata: Metadata = {
  title: "Accès privé | Métal Portail & Menuiserie",
  robots: { index: false, follow: false },
};

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; unavailable?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className={styles.screen}>
      <section className={styles.card}>
        <div className={styles.intro}>
          <div className={styles.brand} aria-label="Métal Portail et Menuiserie">
            <span className={styles.mark}>M<b>P</b>M</span>
            <span className={styles.line} />
            <span className={styles.name}>Métal Portail<br />&amp; Menuiserie</span>
          </div>
          <div>
            <h1>Espace<br /><em>protégé.</em></h1>
            <p>Conception et aménagement<br />sur mesure dans les Landes.</p>
          </div>
        </div>

        <div className={styles.panel}>
          <p className={styles.eyebrow}>Accès professionnel</p>
          <h2>Bienvenue.</h2>
          <p className={styles.helper}>Saisissez votre identifiant et votre code MPM pour continuer.</p>
          {params.unavailable ? (
            <p className={styles.error} role="alert">Cet accès est momentanément indisponible.</p>
          ) : (
            <form method="post" action="/api/access" className={styles.form}>
              <label htmlFor="username">Nom d’utilisateur</label>
              <input id="username" name="username" type="text" autoComplete="username" placeholder="menuisier" required autoFocus />
              <label htmlFor="code">Code d’accès</label>
              <input id="code" name="code" type="password" autoComplete="current-password" placeholder="Votre code privé" required />
              {params.error && <p className={styles.error} role="alert">Identifiant ou code incorrect. Vérifiez puis réessayez.</p>}
              <button type="submit">Accéder au site <span>↗</span></button>
            </form>
          )}
          <p className={styles.secure}>Session sécurisée pendant 12 heures · Connexion chiffrée</p>
        </div>
      </section>
    </main>
  );
}
