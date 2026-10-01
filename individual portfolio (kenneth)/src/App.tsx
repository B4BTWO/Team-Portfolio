import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Code2, Layers3, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CosmicCanvas } from './components/CosmicCanvas';
import { ConstellationNav } from './components/ConstellationNav';
import { ConstellationProjects } from './components/ConstellationProjects';

gsap.registerPlugin(ScrollTrigger);

const toolkit = [
  { label: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vite', 'Vue.js', 'JSON', 'Shopify', 'WordPress'] },
  { label: 'Motion & 3D', items: ['GSAP', 'Three.js', 'WebGL', 'React Three Fiber', 'Drei', 'Web Audio API', 'SVG animation'] },
  { label: 'Backend & cloud', items: ['Node.js', 'Express', 'Firebase', 'Firestore', 'MongoDB', 'REST APIs', 'Cloud Functions', 'Laravel'] },
  { label: 'Product & tools', items: ['Figma', 'UI / UX', 'Design systems', 'Git / GitHub', 'Canva', 'Webflow', 'Notion', 'Vercel', 'Responsive design', 'Accessibility'] },
];

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeProjectIdx, setActiveProjectIdx] = useState<number | null>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const scrollToRef = useRef<(top: number) => void>(() => undefined);

  useEffect(() => {
    let scrollTarget = window.scrollY;
    let scrollFrame = 0;
    let smoothing = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress((previous) => Math.abs(previous - nextProgress) > 0.002 ? nextProgress : previous);
      if (!smoothing) scrollTarget = window.scrollY;
    };
    const animateScroll = () => {
      const difference = scrollTarget - window.scrollY;
      if (Math.abs(difference) < 0.65) {
        window.scrollTo(0, scrollTarget);
        scrollFrame = 0;
        smoothing = false;
        return;
      }
      window.scrollTo(0, window.scrollY + difference * 0.065);
      scrollFrame = window.requestAnimationFrame(animateScroll);
    };
    const setScrollTarget = (top: number) => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget = Math.max(0, Math.min(top, maximum));
      if (reducedMotion) {
        window.scrollTo(0, scrollTarget);
        return;
      }
      smoothing = true;
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(animateScroll);
    };
    scrollToRef.current = setScrollTarget;

    const onWheel = (event: WheelEvent) => {
      if (reducedMotion || event.ctrlKey || (event.target as HTMLElement).closest('[data-native-scroll]')) return;
      event.preventDefault();
      setScrollTarget(scrollTarget + event.deltaY * 0.82);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || (event.target as HTMLElement).closest('[data-native-scroll]') || /^(BUTTON|INPUT|TEXTAREA|SELECT)$/.test((event.target as HTMLElement).tagName)) return;
      const page = window.innerHeight * 0.84;
      const keyTargets: Record<string, number> = {
        ArrowDown: window.scrollY + 90,
        ArrowUp: window.scrollY - 90,
        PageDown: window.scrollY + page,
        PageUp: window.scrollY - page,
        Home: 0,
        End: document.documentElement.scrollHeight,
        ' ': window.scrollY + page,
      };
      if (keyTargets[event.key] !== undefined) {
        event.preventDefault();
        setScrollTarget(keyTargets[event.key]);
      }
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((item) => {
        gsap.fromTo(item, { y: 42, opacity: 0 }, {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: item, start: 'top 94%', end: 'top 58%', scrub: 1.1 },
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
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      ctx.revert();
    };
  }, []);

  const navigate = useCallback((id: string) => {
    const destination = document.getElementById(id);
    if (destination) scrollToRef.current(destination.getBoundingClientRect().top + window.scrollY);
  }, []);

  return (
    <div ref={appRef} className="universe">
      <CosmicCanvas scrollProgress={scrollProgress} />

      <main>
        <section id="origin" className="hero section-shell">
          <div className="hero-topline"><span className="hero-mark">KCB<span>.</span></span><span>FULL-STACK DEVELOPER&nbsp; / &nbsp;CREATIVE BUILDER</span></div>
          <ConstellationNav onNavigate={navigate} />
          <div className="hero-main">
            <p className="hero-kicker"><span className="kicker-dash" /> KENNETH CYRUS BIANZON</p>
            <h1 className="hero-title">MAKING<br /><span>THE WEB</span><br /><em>FEEL ALIVE.</em></h1>
            <div className="hero-aside">
              <span className="hero-aside-index">SCROLL OR SELECT A STAR</span>
              <p>I’m <strong>Kenneth Cyrus Bianzon</strong> — I bring thoughtful design and dependable engineering together to build digital experiences people want to explore.</p>
              <button type="button" className="text-link" onClick={() => navigate('work')}>EXPLORE MY WORK <ArrowDownRight size={15} /></button>
            </div>
          </div>
          <div className="hero-bottomline"><span>CREATIVE FRONTEND&nbsp; · &nbsp;FULL-STACK SYSTEMS&nbsp; · &nbsp;3D WEB</span><span className="hero-scroll-cue">KEEP GOING <ArrowDown size={13} /></span></div>
        </section>

        <section id="about" className="about section-shell">
          <div className="section-index" data-reveal><span>02</span><span>THE POINT OF VIEW</span></div>
          <div className="about-content" id="experience">
            <p className="about-overline" data-reveal id="approach">DESIGN WITH INTENT. BUILD WITH CARE.</p>
            <h2 className="about-statement" data-reveal>Good code makes it work.<br /><span>Great craft makes it matter.</span></h2>
            <div className="about-bottom" data-reveal>
              <div className="portrait-frame"><img src="/assets/kenneth.png" alt="Kenneth Cyrus Bianzon" /><span className="portrait-frame-label">KENNETH C. BIANZON / 01</span></div>
              <div className="about-copy">
                <p className="quote-mark">“</p>
                <blockquote>I build digital experiences with the care of a craftsperson and the curiosity of an explorer — so your next idea can go further.</blockquote>
                <p className="about-bio">From interface to infrastructure, I enjoy connecting the details: a clear flow, a playful interaction, a fast page, and a system that holds together behind it. I worked as a freelance web developer at Magnify Vision Media from March to April 2026, building responsive interfaces with React, Shopify, MongoDB, Firebase, and API integrations.</p>
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
            <a className="contact-button" href="https://www.linkedin.com/in/kenneth-cyrus-bianzon-344a62428/" target="_blank" rel="noreferrer">START A CONVERSATION <ArrowUpRight size={17} /></a>
            <a className="resume-link" href="/resumes/kenneth.pdf" target="_blank" rel="noreferrer">TAKE A LOOK AT MY RÉSUMÉ <ArrowUpRight size={13} /></a>
          </div>
          <footer className="footer"><a className="footer-mark" href="#origin" onClick={(event) => { event.preventDefault(); navigate('origin'); }}>KCB<span>.</span></a><span>© {new Date().getFullYear()} KENNETH CYRUS BIANZON</span><a href="https://github.com/kcbianzon" target="_blank" rel="noreferrer"><Code2 size={14} /> GITHUB <ArrowUpRight size={12} /></a><span>BUILT WITH CURIOSITY&nbsp; ✳</span></footer>
        </section>
      </main>
    </div>
  );
}

export default App;
