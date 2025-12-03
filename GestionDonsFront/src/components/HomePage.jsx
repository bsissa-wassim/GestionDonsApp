import React, { useEffect, useState } from "react";
import "./HomePage.css";

const HomePage = ({ onSignIn, onSignUp, user, onLogout }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [counters, setCounters] = useState({ donations: 0, families: 0, volunteers: 0 });
  const [countersStarted, setCountersStarted] = useState(false);
  
  const slideCount = 3;

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setHeaderScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.id === "stats" && !countersStarted) {
            setCountersStarted(true);
            animateCounters();
          }
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll(".animate-on-scroll").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [countersStarted]);

  const animateCounters = () => {
    const targets = { donations: 1500, families: 320, volunteers: 85 };
    const duration = 2000;
    const steps = 50;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = 1 - Math.pow(1 - step / steps, 3);
      setCounters({
        donations: Math.round(targets.donations * progress),
        families: Math.round(targets.families * progress),
        volunteers: Math.round(targets.volunteers * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slides = [
    { image: "/enfant.webp", title: "Offrir un avenir aux enfants", desc: "Soutien éducatif pour 30 enfants." },
    { image: "/catastrohe.jpg", title: "Aide d'urgence", desc: "Assistance aux victimes de catastrophes." },
    { image: "/pauvre.jpg", title: "Un foyer pour chaque famille", desc: "Équipements pour les familles." }
  ];

  return (
    <div className="app">
      <header className={`header ${headerScrolled ? "scrolled" : ""}`}>
        <a href="#" className="logo"><img src="/logo - Copy.png" alt="Donarise" /></a>
        <nav className="nav-center">
          <a href="#about">À propos</a>
          <a href="#values">Valeurs</a>
          <a href="#impact">Impact</a>
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-name">Bonjour, {user.user_metadata?.first_name || user.email.split('@')[0]}</span>
              <button className="btn-outline" onClick={onLogout}>Déconnexion</button>
            </>
          ) : (
            <>
              {onSignIn && <button className="btn-outline" onClick={onSignIn}>Connexion</button>}
              {onSignUp && <button className="btn-primary" onClick={onSignUp}>S'inscrire</button>}
            </>
          )}
        </div>
      </header>

      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: "url(/heroo.jpg)" }}></div>
        <div className="hero-content">
          <h1>Ensemble, donnons de l'espoir</h1>
          <p>Chaque don transforme une vie. Rejoignez notre mission.</p>
          <a href="#about" className="btn-hero">Découvrir</a>
        </div>
        <div className="scroll-hint"><div className="mouse"></div></div>
      </section>

      <section className="stats animate-on-scroll" id="stats">
        <div className="stat"><span className="stat-num">{counters.donations}+</span><span className="stat-label">Dons</span></div>
        <div className="stat"><span className="stat-num">{counters.families}+</span><span className="stat-label">Familles</span></div>
        <div className="stat"><span className="stat-num">{counters.volunteers}+</span><span className="stat-label">Bénévoles</span></div>
      </section>

      <section className="about animate-on-scroll" id="about">
        <div className="about-img" style={{ backgroundImage: "url(/ALDA-Staff.jpg)" }}></div>
        <div className="about-text">
          <span className="label">Notre histoire</span>
          <h2>Qui sommes-nous ?</h2>
          <p>Fondée en 2020, Donarise transforme chaque don en action solidaire. Nous croyons en la force du collectif.</p>
          <a href="#values" className="link-arrow">Nos valeurs</a>
        </div>
      </section>

      <section className="values animate-on-scroll" id="values">
        <div className="values-header"><span className="label">Ce qui nous guide</span><h2>Nos valeurs</h2></div>
        <div className="values-grid">
          <div className="value-card"><div className="value-icon"></div><h3>Solidarité</h3><p>S'unir pour aider.</p></div>
          <div className="value-card"><div className="value-icon"></div><h3>Transparence</h3><p>Chaque don est tracé.</p></div>
          <div className="value-card"><div className="value-icon"></div><h3>Engagement</h3><p>Actions durables.</p></div>
        </div>
      </section>

      <section className="impact animate-on-scroll" id="impact">
        <div className="impact-content">
          <span className="label">Histoires vraies</span>
          <h2>Notre impact</h2>
          <div className="slider">
            {slides.map((slide, i) => (
              <div key={i} className={`slide ${currentSlide === i ? "active" : ""}`}>
                <div className="slide-img" style={{ backgroundImage: "url(" + slide.image + ")" }}></div>
                <div className="slide-text"><h3>{slide.title}</h3><p>{slide.desc}</p></div>
              </div>
            ))}
          </div>
          <div className="slider-nav">
            {slides.map((_, i) => (<button key={i} className={`dot ${currentSlide === i ? "active" : ""}`} onClick={() => setCurrentSlide(i)} />))}
          </div>
        </div>
      </section>

      <section className="cta animate-on-scroll">
        <h2>Prêt à faire la différence ?</h2>
        <p>Chaque geste compte.</p>
        <button className="btn-cta" onClick={onSignUp}>Commencer</button>
      </section>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand"><img src="/logo - Copy.png" alt="Donarise" /><p>Solidarité, transparence, impact.</p></div>
          <div className="footer-links"><h4>Navigation</h4><a href="#about">À propos</a><a href="#values">Valeurs</a><a href="#impact">Impact</a></div>
          <div className="footer-contact"><h4>Contact</h4><p>Campus El Manar, Tunis</p><p>donarise@gmail.com</p>
            <div className="social"><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a></div>
          </div>
        </div>
        <div className="footer-bottom"><p>© 2025 Donarise. Tous droits réservés.</p></div>
      </footer>
    </div>
  );
};

export default HomePage;
