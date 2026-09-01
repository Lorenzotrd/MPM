"use client";

import type { FormEvent } from "react";

const services = [
  {
    number: "01",
    title: "Portails",
    copy: "Battants ou coulissants, manuels ou motorisés, conçus selon votre terrain et le style de votre habitation.",
    materials: ["Aluminium", "PVC", "Acier"],
  },
  {
    number: "02",
    title: "Clôtures",
    copy: "Des solutions durables pour sécuriser, délimiter et préserver l’intimité de vos extérieurs.",
    materials: ["Aluminium", "PVC", "Bois"],
  },
  {
    number: "03",
    title: "Menuiseries",
    copy: "Huisseries, volets et aménagements intérieurs pensés pour être aussi fonctionnels qu’élégants.",
    materials: ["Aluminium", "PVC", "Bois"],
  },
  {
    number: "04",
    title: "Terrasses",
    copy: "Des espaces de vie chaleureux, résistants et faciles à entretenir, adaptés à votre quotidien.",
    materials: ["Bois", "Composite", "Sur mesure"],
  },
  {
    number: "05",
    title: "Pergolas",
    copy: "Bois ou aluminium bioclimatique pour profiter de votre extérieur au fil des saisons.",
    materials: ["Bois", "Bioclimatique", "Aluminium"],
  },
  {
    number: "06",
    title: "Bardages",
    copy: "Une nouvelle peau pour protéger, moderniser et valoriser durablement votre façade.",
    materials: ["Protection", "Esthétique", "Durabilité"],
  },
];

const steps = [
  ["01", "Échange", "Vous nous racontez votre besoin, vos envies et votre budget."],
  ["02", "Étude sur place", "Nous observons les contraintes et imaginons la solution adaptée."],
  ["03", "Proposition", "Vous recevez une recommandation claire et votre devis sous 48 h."],
  ["04", "Réalisation", "Nous posons avec soin, nettoyons le chantier et restons disponibles."],
];

function Logo() {
  return (
    <span className="brand" aria-hidden="true">
      <span className="brand-mark">M<span>P</span>M</span>
      <span className="brand-divider" />
      <span className="brand-name">Métal Portail<br />&amp; Menuiserie</span>
    </span>
  );
}

export default function Home() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const service = String(form.get("service") || "Projet sur mesure");
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const phone = String(form.get("phone") || "");
    const message = String(form.get("message") || "");
    const subject = encodeURIComponent(`Demande de devis — ${service}`);
    const body = encodeURIComponent(
      `Bonjour Métal Portail & Menuiserie,\n\nJe souhaite échanger au sujet de mon projet.\n\nType de projet : ${service}\nNom : ${name}\nE-mail : ${email}\nTéléphone : ${phone}\n\nMon projet :\n${message}\n\nMerci.`
    );
    window.location.href = `mailto:mpmconcept40@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <main>
      <header className="site-header">
        <div className="nav-wrap">
          <a href="#accueil" className="logo-link" aria-label="Métal Portail et Menuiserie — Accueil">
            <Logo />
          </a>
          <nav className="desktop-nav" aria-label="Navigation principale">
            <a href="#services">Nos savoir-faire</a>
            <a href="#methode">Notre méthode</a>
            <a href="#engagements">Nos engagements</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className="button button-small desktop-cta" href="#contact">Parlons de votre projet <span>↗</span></a>
          <details className="mobile-menu">
            <summary aria-label="Ouvrir le menu"><span /><span /></summary>
            <nav aria-label="Navigation mobile">
              <a href="#services">Nos savoir-faire</a>
              <a href="#methode">Notre méthode</a>
              <a href="#engagements">Nos engagements</a>
              <a href="#contact">Demander un devis</a>
            </nav>
          </details>
        </div>
      </header>

      <section className="hero" id="accueil">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Artisan local · Landes</p>
            <h1>Vos espaces,<br /><em>pensés pour durer.</em></h1>
            <p className="hero-intro">
              Portails, clôtures, pergolas, terrasses et menuiseries sur mesure.
              Nous concevons votre projet avec vous, jusque dans les moindres finitions.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact">Obtenir mon devis <span>↗</span></a>
              <a className="text-link" href="tel:+33640648700">06 40 64 87 00 <span>→</span></a>
            </div>
            <div className="hero-proof" aria-label="Nos engagements clés">
              <div><strong>0 €</strong><span>Expertise extérieure</span></div>
              <div><strong>48 h</strong><span>Pour recevoir le devis</span></div>
              <div><strong>1 an</strong><span>Suivi après travaux</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-frame">
              <img
                src="/mpm-brand.jpeg"
                alt="Présentation de Métal Portail & Menuiserie et de ses réalisations extérieures"
              />
            </div>
            <div className="visual-note">
              <span className="note-index">MPM</span>
              <p><strong>Conception &amp; pose</strong><br />Sur mesure, du conseil aux finitions</p>
            </div>
          </div>
        </div>
        <a className="scroll-cue" href="#services"><span>Découvrir</span><i>↓</i></a>
      </section>

      <section className="trust-bar" aria-label="Promesses de service">
        <div className="trust-inner">
          <span>Conseils personnalisés</span><i>◆</i>
          <span>Matériaux durables</span><i>◆</i>
          <span>Finitions soignées</span><i>◆</i>
          <span>Chantier laissé propre</span>
        </div>
      </section>

      <section className="section services" id="services">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> Nos savoir-faire</p>
            <h2>Un seul partenaire.<br /><em>Toutes vos envies.</em></h2>
          </div>
          <p className="section-lead">
            Chaque projet commence par une écoute attentive. Nous vous guidons dans le choix du matériau,
            du modèle et des détails qui feront la différence.
          </p>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <div className="service-top">
                <span className="service-number">{service.number}</span>
                <a href="#contact" aria-label={`Demander un devis pour ${service.title}`}>↗</a>
              </div>
              <div>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <div className="tags">
                  {service.materials.map((material) => <span key={material}>{material}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="project-banner">
        <div className="project-banner-copy">
          <p className="eyebrow"><span /> Le sur-mesure, vraiment</p>
          <h2>Votre habitation est unique.<br /><em>Votre projet aussi.</em></h2>
          <p>
            Nous ne faisons pas uniquement de la pose. Nous prenons le temps de comprendre
            votre usage, votre environnement et votre budget pour vous proposer une solution cohérente.
          </p>
          <a className="button button-light" href="#contact">Étudier mon projet <span>↗</span></a>
        </div>
        <div className="project-banner-quote">
          <span>“</span>
          <p>Le bon choix n’est pas le plus standard. C’est celui qui s’intègre naturellement chez vous.</p>
        </div>
      </section>

      <section className="section method" id="methode">
        <div className="method-title">
          <p className="eyebrow dark"><span /> Notre méthode</p>
          <h2>Simple, clair,<br /><em>sans surprise.</em></h2>
          <p>Un accompagnement humain, depuis la première idée jusqu’au bilan un an après la pose.</p>
        </div>
        <div className="steps">
          {steps.map(([number, title, copy]) => (
            <article className="step" key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section commitments" id="engagements">
        <div className="commitments-intro">
          <p className="eyebrow"><span /> Nos engagements</p>
          <h2>La qualité se voit.<br /><em>La confiance se construit.</em></h2>
        </div>
        <div className="commitment-grid">
          <article>
            <strong>Offerte</strong>
            <h3>Expertise de votre extérieur</h3>
            <p>Nous étudions gratuitement votre espace, vos contraintes et les possibilités.</p>
          </article>
          <article>
            <strong>48 h</strong>
            <h3>Un devis clair et rapide</h3>
            <p>Après étude, vous recevez une proposition lisible pour décider sereinement.</p>
          </article>
          <article>
            <strong>1 an</strong>
            <h3>Un vrai suivi après la pose</h3>
            <p>Nous revenons vers vous pour faire le point sur l’installation et votre satisfaction.</p>
          </article>
        </div>
      </section>

      <section className="faq section" aria-labelledby="faq-title">
        <div className="faq-heading">
          <p className="eyebrow dark"><span /> Questions fréquentes</p>
          <h2 id="faq-title">Avant de<br /><em>se lancer.</em></h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>Quels matériaux proposez-vous ? <span>+</span></summary>
            <p>Selon le projet, nous travaillons l’aluminium, le PVC, l’acier, le bois, le composite, le médium et le stratifié.</p>
          </details>
          <details>
            <summary>Pouvez-vous motoriser un portail ? <span>+</span></summary>
            <p>Oui. La motorisation peut être intégrée à un portail battant ou coulissant selon la configuration du terrain.</p>
          </details>
          <details>
            <summary>Intervenez-vous près de chez moi ? <span>+</span></summary>
            <p>Nous sommes basés à Saint-Vincent-de-Tyrosse. Contactez-nous avec votre commune : nous étudierons votre demande rapidement.</p>
          </details>
          <details>
            <summary>Comment recevoir un devis ? <span>+</span></summary>
            <p>Décrivez-nous votre projet par téléphone ou via le formulaire. Après l’étude du besoin, votre devis vous est transmis sous 48 heures.</p>
          </details>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-grid">
          <div className="contact-copy">
            <p className="eyebrow"><span /> Demande de devis</p>
            <h2>Un projet en tête ?<br /><em>Parlons-en.</em></h2>
            <p className="contact-intro">
              Quelques mots suffisent pour commencer. Nous vous recontactons afin de comprendre votre besoin et organiser l’étude de votre projet.
            </p>
            <div className="contact-list">
              <a href="tel:+33640648700"><small>Téléphone</small><strong>06 40 64 87 00</strong><span>↗</span></a>
              <a href="mailto:mpmconcept40@gmail.com"><small>E-mail</small><strong>mpmconcept40@gmail.com</strong><span>↗</span></a>
              <a href="https://www.google.com/maps/search/?api=1&query=19+Avenue+de+Casteroun+40230+Saint-Vincent-de-Tyrosse" target="_blank" rel="noreferrer"><small>Atelier</small><strong>19 avenue de Casteroun<br />40230 Saint-Vincent-de-Tyrosse</strong><span>↗</span></a>
            </div>
          </div>

          <form className="quote-form" onSubmit={handleSubmit}>
            <div className="field full">
              <label htmlFor="service">Votre projet</label>
              <select id="service" name="service" defaultValue="Portail">
                <option>Portail</option>
                <option>Clôture</option>
                <option>Menuiserie / Aménagement intérieur</option>
                <option>Terrasse</option>
                <option>Pergola</option>
                <option>Bardage</option>
                <option>Autre projet sur mesure</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="name">Nom</label>
              <input id="name" name="name" type="text" placeholder="Votre nom" required />
            </div>
            <div className="field">
              <label htmlFor="phone">Téléphone</label>
              <input id="phone" name="phone" type="tel" placeholder="06 00 00 00 00" required />
            </div>
            <div className="field full">
              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" placeholder="vous@exemple.fr" required />
            </div>
            <div className="field full">
              <label htmlFor="message">Parlez-nous de votre besoin</label>
              <textarea id="message" name="message" rows={4} placeholder="Type de projet, dimensions, commune, délai souhaité…" required />
            </div>
            <button className="button button-primary full" type="submit">Préparer ma demande <span>↗</span></button>
            <p className="form-note full">Le bouton ouvre votre messagerie avec votre demande déjà préparée. Aucune donnée n’est stockée sur ce site.</p>
          </form>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <a href="#accueil" aria-label="Retour à l’accueil"><Logo /></a>
          <p>Conception d’aménagement extérieur<br />et intérieur sur mesure.</p>
          <a className="back-top" href="#accueil">Retour en haut ↑</a>
        </div>
        <div className="footer-bottom">
          <span>© Métal Portail &amp; Menuiserie</span>
          <span>Saint-Vincent-de-Tyrosse · Landes</span>
          <a href="mailto:mpmconcept40@gmail.com">Nous écrire</a>
        </div>
      </footer>

      <div className="mobile-actions" aria-label="Actions rapides">
        <a href="tel:+33640648700">Appeler</a>
        <a href="#contact">Demander un devis</a>
      </div>
    </main>
  );
}
