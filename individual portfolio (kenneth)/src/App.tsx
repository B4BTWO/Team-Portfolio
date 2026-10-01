import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Code2, Layers3, Orbit, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CosmicCanvas } from './components/CosmicCanvas';
import { CosmicSound } from './components/CosmicSound';
import { ConstellationProjects } from './components/ConstellationProjects';

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: 'origin', label: 'Origin', number: '01' },
  { id: 'about', label: 'Approach', number: '02' },
  { id: 'work', label: 'Work', number: '03' },
  { id: 'stack', label: 'Toolkit', number: '04' },
  { id: 'contact', label: 'Contact', number: '05' },
];

const toolkit = [
  { label: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vite', 'Vue.js'] },
  { label: 'Motion & 3D', items: ['GSAP', 'Three.js', 'WebGL', 'React Three Fiber', 'Drei', 'Web Audio API', 'SVG animation'] },
  { label: 'Backend & cloud', items: ['Node.js', 'Express', 'Firebase', 'Firestore', 'MongoDB', 'REST APIs', 'Cloud Functions', 'Laravel'] },
  { label: 'Product & tools', items: ['Figma', 'UI / UX', 'Design systems', 'Git / GitHub', 'Webflow', 'Responsive design', 'Accessibility'] },
];

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [activeProjectIdx, setActiveProjectIdx] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    const observers = sections.map(({ id }, index) => {
      const element = document.getElementById(id);
      if (!element) return null;
      return new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setCurrentSection(index);
      }, { rootMargin: '-38% 0px -48% 0px' });
    });
    observers.forEach((observer, index) => {
      const element = document.getElementById(sections[index].id);
      if (element) observer?.observe(element);
    });

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((item) => {
        gsap.fromTo(item, { y: 42, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 88%', once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((item) => {
        gsap.to(item, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        });
      });
    }, appRef);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      observers.forEach((observer) => observer?.disconnect());
      ctx.revert();
    };
  }, []);

  const navigate = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div ref={appRef} className="universe">
      <CosmicCanvas scrollProgress={scrollProgress} activeProjectIndex={activeProjectIdx} onSelectProject={setActiveProjectIdx} />
      <div className="grain" aria-hidden="true" />
      <header className="masthead">
        <a className="wordmark" href="#origin" onClick={(event) => { event.preventDefault(); navigate('origin'); }} aria-label="Kenneth Bianzon, back to top">
          <span className="wordmark-mark"><Orbit size={15} strokeWidth={1.5} /></span>
          <span>KCB<span className="wordmark-period">.</span></span>
        </a>
        <div className="masthead-center"><span className="status-light" /> AVAILABLE FOR SELECT PROJECTS</div>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation">
          <span>{menuOpen ? 'CLOSE' : 'EXPLORE'}</span><span className={`menu-icon ${menuOpen ? 'open' : ''}`} />
        </button>
      </header>

      <aside className={`orbit-nav ${menuOpen ? 'orbit-nav-open' : ''}`} aria-label="Page sections">
        <span className="orbit-nav-caption">FLIGHT PATH</span>
        <div className="orbit-nav-line" aria-hidden="true"><span style={{ height: `${Math.max(8, scrollProgress * 100)}%` }} /></div>
        {sections.map((section, index) => (
          <button key={section.id} type="button" className={`orbit-nav-point ${currentSection === index ? 'active' : ''}`} onClick={() => navigate(section.id)} aria-label={`Go to ${section.label}`}>
            <span className="nav-point-dot" /><span className="nav-point-label"><small>{section.number}</small>{section.label}</span>
          </button>
        ))}
      </aside>
      <div className="audio-dock"><CosmicSound /></div>

      <main>
        <section id="origin" className="hero section-shell">
          <div className="hero-topline"><span>INDEPENDENT DEVELOPER&nbsp; / &nbsp;MANILA, PH</span><span>SCROLL TO TRAVEL <ArrowDown size={13} /></span></div>
          <div className="hero-main">
            <p className="hero-kicker"><span className="kicker-dash" /> FULL-STACK DEVELOPER &amp; CREATIVE BUILDER</p>
            <h1 className="hero-title">MAKING<br /><span>THE WEB</span><br /><em>FEEL ALIVE.</em></h1>
            <div className="hero-aside">
              <span className="hero-aside-index">01 — A LITTLE INTRO</span>
              <p>I’m <strong>Kenneth Cyrus Bianzon</strong> — I bring thoughtful design and dependable engineering together to build digital experiences people want to explore.</p>
              <button type="button" className="text-link" onClick={() => navigate('work')}>EXPLORE MY WORK <ArrowDownRight size={15} /></button>
            </div>
          </div>
          <div className="hero-bottomline"><span>CREATIVE FRONTEND&nbsp; · &nbsp;FULL-STACK SYSTEMS&nbsp; · &nbsp;3D WEB</span><span className="hero-scroll-cue"><span className="scroll-cue-line" /> KEEP GOING</span></div>
          <div className="hero-caption" data-parallax aria-hidden="true">A DIGITAL<br />UNIVERSE, IN<br />THE MAKING.</div>
        </section>

        <section id="about" className="about section-shell">
          <div className="section-index" data-reveal><span>02</span><span>THE POINT OF VIEW</span></div>
          <div className="about-content">
            <p className="about-overline" data-reveal>DESIGN WITH INTENT. BUILD WITH CARE.</p>
            <h2 className="about-statement" data-reveal>Good code makes it work.<br /><span>Great craft makes it matter.</span></h2>
            <div className="about-bottom" data-reveal>
              <div className="portrait-frame"><img src="/assets/kenneth.png" alt="Kenneth Cyrus Bianzon" /><span className="portrait-frame-label">KENNETH C. BIANZON / 01</span></div>
              <div className="about-copy">
                <p className="quote-mark">“</p>
                <blockquote>I build digital experiences with the care of a craftsperson and the curiosity of an explorer — so your next idea can go further.</blockquote>
                <p className="about-bio">From interface to infrastructure, I enjoy connecting the details: a clear flow, a playful interaction, a fast page, and a system that holds together behind it.</p>
                <button type="button" className="text-link" onClick={() => navigate('stack')}>SEE HOW I BUILD <ArrowDownRight size={15} /></button>
              </div>
            </div>
          </div>
          <div className="about-orbit" aria-hidden="true"><span /><span /><span /></div>
        </section>

        <section id="work" className="work section-shell">
          <div className="work-heading" data-reveal>
            <div><div className="section-index"><span>03</span><span>SELECTED TRANSMISSIONS</span></div><h2>Small worlds.<br /><em>Big ideas.</em></h2></div>
            <p>Each point of light leads to a project. Pick one to bring its story into focus.</p>
          </div>
          <ConstellationProjects activeProjectIndex={activeProjectIdx} onSelectProject={setActiveProjectIdx} />
        </section>

        <section id="stack" className="toolkit section-shell">
          <div className="section-index" data-reveal><span>04</span><span>TOOLS FOR THE JOURNEY</span></div>
          <div className="toolkit-heading" data-reveal><h2>Curiosity,<br /><em>made tangible.</em></h2><p>From first sketch to a live product, I reach for the right tools to make each idea clear, useful, and a little unexpected.</p></div>
          <div className="toolkit-grid">
            {toolkit.map((group, index) => <article key={group.label} className="toolkit-card" data-reveal>
              <div className="toolkit-card-top"><span>0{index + 1}</span><Layers3 size={17} strokeWidth={1.5} /></div>
              <h3>{group.label}</h3><div className="toolkit-tags">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
            </article>)}
          </div>
          <div className="toolkit-marquee" aria-hidden="true"><span>IDEATE&nbsp; / &nbsp;DESIGN&nbsp; / &nbsp;ENGINEER&nbsp; / &nbsp;REFINE&nbsp; / &nbsp;SHIP&nbsp; / &nbsp;</span><span>IDEATE&nbsp; / &nbsp;DESIGN&nbsp; / &nbsp;ENGINEER&nbsp; / &nbsp;REFINE&nbsp; / &nbsp;SHIP&nbsp; / &nbsp;</span></div>
        </section>

        <section id="contact" className="contact section-shell">
          <div className="section-index" data-reveal><span>05</span><span>THE NEXT CHAPTER</span></div>
          <div className="contact-orbit" aria-hidden="true"><span /><span /><span /><span /></div>
          <div className="contact-content" data-reveal><p className="contact-overline"><Sparkles size={14} /> HAVE A GOOD ONE IN MIND?</p><h2>Let’s make<br /><em>it mean something.</em></h2><p className="contact-copy">Tell me what you’re imagining. I’d love to help bring it down to earth.</p>
            <a className="contact-button" href="https://github.com/kcbianzon" target="_blank" rel="noreferrer">START A CONVERSATION <ArrowUpRight size={17} /></a>
            <a className="resume-link" href="/resumes/kenneth.pdf" target="_blank" rel="noreferrer">TAKE A LOOK AT MY RÉSUMÉ <ArrowUpRight size={13} /></a>
          </div>
          <footer className="footer"><a className="footer-mark" href="#origin" onClick={(event) => { event.preventDefault(); navigate('origin'); }}>KCB<span>.</span></a><span>© {new Date().getFullYear()} KENNETH CYRUS BIANZON</span><a href="https://github.com/kcbianzon" target="_blank" rel="noreferrer"><Code2 size={14} /> GITHUB <ArrowUpRight size={12} /></a><span>BUILT WITH CURIOSITY&nbsp; ✳</span></footer>
        </section>
      </main>
    </div>
  );
}

export default App;
