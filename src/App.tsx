import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import ParticleField from './components/ParticleField'
import { journey, projects, site, skills, type Project } from './data/site'

const navItems = [ ['Home', 'home'], ['About', 'about'], ['Projects', 'projects'], ['Journey', 'journey'], ['Contact', 'contact'] ] as const

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d={diagonal ? 'M5 15 15 5M6 5h9v9' : 'M3 10h13m-5-5 5 5-5 5'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function Mark() { return <a className="brand" href="#home" aria-label="Edwin Darko, home"><span className="brand-mark">E<span>.</span></span><span className="brand-name">EDWIN DARKO</span></a> }

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [copied, setCopied] = useState(false)
  const [formStatus, setFormStatus] = useState<{ type: 'idle' | 'sending' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' })
  const projectDialogRef = useRef<HTMLElement | null>(null)
  const modalCloseRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, .2, .5, .8] })
    document.querySelectorAll<HTMLElement>('main section[id]').forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!selectedProject) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProject(null)
        return
      }
      if (event.key !== 'Tab') return

      const dialog = projectDialogRef.current
      if (!dialog) return
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) {
        event.preventDefault()
      } else if (!dialog.contains(document.activeElement)) {
        event.preventDefault()
        const target = event.shiftKey ? last : first
        target.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    modalCloseRef.current?.focus()
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [selectedProject])

  const emailConfigured = site.email && !site.email.includes('YOUR_EMAIL')
  const copyEmail = async () => {
    if (!emailConfigured) { setCopied(false); return }
    try { await navigator.clipboard.writeText(site.email); setCopied(true); window.setTimeout(() => setCopied(false), 2200) }
    catch { setCopied(false) }
  }

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    if (data.get('website')) { setFormStatus({ type: 'success', message: 'Thanks — your message has been received.' }); form.reset(); return }
    setFormStatus({ type: 'sending', message: 'Sending your message…' })
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(data.entries())) })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Message delivery is not configured yet.')
      setFormStatus({ type: 'success', message: 'Message delivered. Thanks for reaching out.' }); form.reset()
    } catch (error) {
      setFormStatus({ type: 'error', message: error instanceof Error ? error.message : 'Could not send your message. Please use the email option instead.' })
    }
  }

  return <>
    <div className="site-noise" aria-hidden="true" />
    <header className="site-header">
      <Mark />
      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        {navItems.map(([label, id]) => <a key={id} className={activeSection === id ? 'active' : ''} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <a className="header-cta" href="#contact">Let’s talk <Arrow diagonal /></a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
    </header>

    <main>
      <section id="home" className="hero section-shell">
        <ParticleField />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow"><span className="status-dot" /> COMPUTER SCIENCE · GHANA</p>
          <h1>EDWIN<br /><span className="hero-last">DARKO<span className="period">.</span></span></h1>
          <div className="hero-bottom">
            <div className="hero-manifesto"><span className="manifesto-line" /> <p>Exploring technology.<br /><strong>Building what’s next.</strong></p></div>
            <div className="hero-intro"><p>Computer Science student, aspiring software engineer, and curious mind drawn to the things we can make with code.</p><div className="hero-actions"><a className="button button-primary" href="#projects">Explore my work <Arrow /></a><a className="button button-quiet" href="#contact">Get in touch <Arrow diagonal /></a></div></div>
          </div>
        </div>
        <div className="hero-meta"><span>01 / A DIGITAL INTRODUCTION</span><a href="#about" className="scroll-cue"><span className="scroll-line" /> SCROLL TO EXPLORE</a><span className="meta-coordinate">05°36′N · 00°11′W</span></div>
        <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" />
      </section>

      <section id="about" className="section section-about section-shell">
        <div className="section-heading"><span className="section-index">01 — THE PERSON</span><span className="section-note">A little context, a lot of curiosity</span></div>
        <div className="about-layout">
          <div className="about-visual"><div className="portrait-placeholder"><div className="portrait-ring ring-a" /><div className="portrait-ring ring-b" /><div className="portrait-core"><span className="portrait-initials">ED</span><span className="portrait-caption">YOUR PORTRAIT<br />GOES HERE</span></div><span className="portrait-cross cross-a">+</span><span className="portrait-cross cross-b">+</span><span className="portrait-label">FIG. 01 / IDENTITY</span></div><div className="visual-footnote"><span className="tiny-square" /> ALWAYS IN PROGRESS</div></div>
          <div className="about-copy"><p className="eyebrow">HELLO, WORLD</p><h2>Learning the craft.<br /><span className="muted-heading">Building with purpose.</span></h2><p className="body-large">I’m Edwin — a Computer Science student at Ghana Communication Technology University, interested in how thoughtful software can make everyday things work better.</p><p className="body-copy">I learn by exploring ideas, writing code, experimenting, and paying attention to what works (and what doesn’t). I’m still growing my toolkit, and that’s part of the point: stay curious, keep practising, and turn what I learn into useful things.</p><p className="body-copy">This is a living record of that process — the projects, questions, and small steps that shape the engineer I’m working towards becoming.</p><div className="about-signoff"><span className="signature">Edwin<span>.</span></span><span className="signoff-note">STUDENT · BUILDER · ALWAYS LEARNING</span></div></div>
        </div>
      </section>

      <section id="projects" className="section section-projects section-shell">
        <div className="section-heading"><span className="section-index">02 — SELECTED EXPERIMENTS</span><span className="section-note">Ideas become real one iteration at a time</span></div>
        <div className="section-title-row"><h2>Things I’m <span className="accent-text">working on.</span></h2><p>A few project starting points. Details and statuses are editable — only add verified features, stacks, and links before sharing.</p></div>
        <div className="project-grid">{projects.map((project, index) => <button className={`project-card accent-${project.accent}`} key={project.name} onClick={() => setSelectedProject(project)} aria-label={`View details for ${project.name}`}>
          <div className="project-art"><div className="art-grid" /><span className="art-number">0{index + 1} / PROJECT</span><div className={`project-symbol symbol-${index + 1}`} aria-hidden="true">{index === 0 ? <><span className="symbol-orbit" /><span className="symbol-core">N</span><span className="symbol-node" /></> : index === 1 ? <><span className="bakery-arch" /><span className="bakery-dot" /><span className="bakery-dot dot-two" /></> : <><span className="church-roof" /><span className="church-cross">+</span><span className="church-base" /></>}</div><span className="art-open"><Arrow diagonal /></span></div>
          <div className="project-card-content"><div className="project-meta"><span>{project.type}</span><span className="project-status"><i />{project.status}</span></div><h3>{project.name}<span className="title-arrow"><Arrow diagonal /></span></h3><p>{project.short}</p><div className="project-tags">{project.stack.slice(0, 2).map(tag => <span key={tag}>{tag}</span>)}</div></div>
        </button>)}</div>
        <p className="project-footnote"><span className="tiny-square" /> PROJECT DETAILS ARE A WORK IN PROGRESS <span className="footnote-line" /></p>
      </section>

      <section id="skills" className="section section-skills section-shell">
        <div className="section-heading"><span className="section-index">03 — THE TOOLKIT</span><span className="section-note">Growing through practice, not percentages</span></div>
        <div className="section-title-row"><h2>Curiosity is the<br /><span className="accent-text">starting point.</span></h2><p>No made-up proficiency scores. Replace these prompts with the languages, tools, and technologies you have genuinely used or are actively learning.</p></div>
        <div className="skills-grid">{skills.map((group, i) => <article className="skill-card" key={group.category}><div className="skill-card-top"><span className="skill-index">0{i + 1}</span><span className="skill-cross">↗</span></div><h3>{group.category}</h3><div className="skill-list">{group.items.map(item => <span key={item}><i />{item}</span>)}</div></article>)}</div>
        <div className="skills-bottom"><span className="signal-bars"><i /><i /><i /><i /><i /></span><span>SKILLS ARE A PRACTICE, NOT A FINISH LINE</span><span className="skills-bottom-line" /></div>
      </section>

      <section id="journey" className="section section-journey section-shell">
        <div className="section-heading"><span className="section-index">04 — THE JOURNEY</span><span className="section-note">No shortcuts, just the next step</span></div>
        <div className="journey-intro"><h2>Still becoming.<br /><span className="muted-heading">That’s the exciting part.</span></h2><p>A work-in-progress timeline of learning, making, and figuring things out. Add real dates and milestones as they happen.</p></div>
        <div className="timeline">{journey.map((item, i) => <article className="timeline-item" key={item.title}><div className="timeline-marker"><span>{String(i + 1).padStart(2, '0')}</span><i /></div><div className="timeline-content"><div className="timeline-meta"><span>{item.label}</span><span>{item.kind}</span></div><h3>{item.title}</h3><p>{item.detail}</p></div><span className="timeline-symbol">{i === 0 ? '⌘' : i === 1 ? '↗' : '◎'}</span></article>)}</div>
      </section>

      <section className="section section-command section-shell" aria-labelledby="command-title">
        <div className="section-heading"><span className="section-index">05 — RIGHT NOW</span><span className="section-note">A small live-in-spirit snapshot</span></div>
        <div className="command-panel"><div className="command-header"><div className="command-leds"><i /><i /><i /></div><span>EDWIN://CURRENT-STATE</span><span className="command-header-right">LOCAL CONFIG</span></div><h2 id="command-title">The command <span className="accent-text">centre.</span></h2><div className="command-grid"><div className="command-item"><span className="command-label"><i /> CURRENTLY BUILDING</span><p>{site.currentlyBuilding}</p></div><div className="command-item"><span className="command-label"><i /> CURRENTLY LEARNING</span><p>{site.currentlyLearning}</p></div><div className="command-item"><span className="command-label"><i /> TECH INTERESTS</span><div className="interest-tags">{site.currentInterests.map(interest => <span key={interest}>{interest}</span>)}</div></div><div className="command-item"><span className="command-label"><i /> NEXT GOAL</span><p>{site.nextGoal}</p></div></div><div className="command-footer"><span><span className="status-dot" /> MANUALLY MAINTAINED</span><span>NO TRACKING · JUST INTENTION</span></div></div>
      </section>

      <section id="contact" className="section section-contact section-shell">
        <div className="section-heading"><span className="section-index">06 — OPEN CHANNEL</span><span className="section-note">Good things start with a conversation</span></div>
        <div className="contact-headline"><p className="eyebrow"><span className="status-dot" /> AVAILABLE FOR THE RIGHT CONVERSATION</p><h2>Have an opportunity?<br /><span className="accent-text">Let’s build something.</span></h2><p className="contact-subtitle">Jobs, internships, collaborations, freelance ideas, or simply talking tech — I’m open to hearing from you.</p></div>
        <div className="contact-layout"><div className="contact-direct"><span className="contact-overline">THE DIRECT ROUTE</span><h3>Say hello<span className="accent-text">.</span></h3><p>Email is the most reliable way to reach me. Add your real address in the site configuration to activate these controls.</p><div className="email-display"><span className="email-icon">@</span><span>{emailConfigured ? site.email : 'YOUR_EMAIL@example.com'}</span></div><div className="contact-buttons"><a className={`button button-primary ${!emailConfigured ? 'button-disabled' : ''}`} href={emailConfigured ? `mailto:${site.email}` : undefined} onClick={e => { if (!emailConfigured) e.preventDefault() }} aria-disabled={!emailConfigured}>Write an email <Arrow diagonal /></a><button className="button button-outline" onClick={copyEmail} disabled={!emailConfigured}>{copied ? 'Copied to clipboard ✓' : 'Copy email'} <span className="copy-glyph">▣</span></button></div>{!emailConfigured && <p className="config-hint">Email link activates when you update <code>src/data/site.ts</code>.</p>}<div className="social-links">{site.github && <a href={site.github} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a>}{site.linkedin && <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal /></a>}{site.cvPath && <a href={site.cvPath} download>Download CV <Arrow diagonal /></a>}</div><div className="contact-availability"><span className="tiny-square" /> OPEN TO LEARNING, BUILDING & CONNECTING</div></div>
          <form className="contact-form" onSubmit={submitContact}>
            <div className="form-heading"><h3>Send a message</h3><span>FIELDS MARKED * ARE REQUIRED</span></div>
            <div className="form-row"><label>Your name *<input name="name" autoComplete="name" placeholder="How should I address you?" required minLength={2} maxLength={100} /></label><label>Your email *<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label></div>
            <label>What’s this about? *<select name="type" required defaultValue=""><option value="" disabled>Select an enquiry type</option><option>Job or internship</option><option>Freelance project</option><option>Collaboration</option><option>Professional networking</option><option>General enquiry</option></select></label>
            <label>Subject *<input name="subject" placeholder="A short subject line" required minLength={3} maxLength={160} /></label>
            <label>Message *<textarea name="message" placeholder="Tell me a little about it…" required minLength={10} maxLength={5000} rows={4} /></label>
            <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <div className="form-submit-row"><button className="button button-primary form-submit" type="submit" disabled={formStatus.type === 'sending'}>{formStatus.type === 'sending' ? 'Sending…' : 'Send message'} <Arrow /></button><span className="form-privacy">Your details are only used to reply.</span></div>
            {formStatus.message && <p className={`form-feedback feedback-${formStatus.type}`} role="status" aria-live="polite">{formStatus.message}{formStatus.type === 'error' && emailConfigured && <> <a href={`mailto:${site.email}`}>Email me instead.</a></>}</p>}
            <p className="form-delivery-note">Delivery requires the server-side email setup described in the README. This form will show an honest error until it is configured.</p>
          </form></div>
      </section>
    </main>

    <footer className="site-footer section-shell"><a className="footer-brand" href="#home">ED<span>.</span></a><p>Exploring technology. Building what’s next.</p><div className="footer-right"><span>DESIGNED TO EVOLVE</span><a href="#home">BACK TO TOP ↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} EDWIN DARKO</span><span>MADE WITH CURIOSITY IN GHANA <i>✳</i></span></div></footer>

    {selectedProject && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setSelectedProject(null) }}><section ref={projectDialogRef} className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-top"><span>PROJECT FILE / {selectedProject.status.toUpperCase()}</span><button ref={modalCloseRef} className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close project details">×</button></div><p className="eyebrow">{selectedProject.type}</p><h2 id="modal-title">{selectedProject.name}<span className="accent-text">.</span></h2><p className="modal-description">{selectedProject.short}</p><div className="modal-section"><span className="modal-label">CURRENT STATUS</span><p>{selectedProject.status} — update this status once the project stage is confirmed.</p></div><div className="modal-section"><span className="modal-label">FEATURES / AREAS OF FOCUS</span><ul>{selectedProject.features.map(feature => <li key={feature}>{feature}</li>)}</ul></div><div className="modal-section"><span className="modal-label">TECHNOLOGY</span><div className="interest-tags">{selectedProject.stack.map(item => <span key={item}>{item}</span>)}</div></div><div className="modal-section"><span className="modal-label">NOTES & LEARNINGS</span><p>{selectedProject.learning}</p></div><div className="modal-links">{selectedProject.repo ? <a href={selectedProject.repo} target="_blank" rel="noreferrer">View repository <Arrow diagonal /></a> : <span>Repository link not added</span>}{selectedProject.demo ? <a href={selectedProject.demo} target="_blank" rel="noreferrer">Live demo <Arrow diagonal /></a> : <span>Demo link not added</span>}</div></section></div>}
  </>
}
