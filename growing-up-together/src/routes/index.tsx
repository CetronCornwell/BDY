import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, BookOpen, ChevronDown, Flame, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { countdownParts, extinguishCandles, toggleCandle } from "@/lib/birthday";
import { LETTER, THINGS } from "@/lib/birthday-story";
import { playBirthdaySong } from "@/lib/birthday-audio";
import birthdaySong from "@/assets/birthday-song.mp3.asset.json";
import ch1 from "@/assets/ch1-refined-corridor.jpg";
import ch2 from "@/assets/ch2-tuition.jpg";
import ch3 from "@/assets/ch3-message.jpg";
import ch4 from "@/assets/ch4-distance.jpg";
import ch5 from "@/assets/ch5-lantern.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Section A, Section B — Happy Birthday, Shaky" },
    { name: "description", content: "A birthday memory book for you, Shaky: school corridors, tuition evenings, and every good wish for November 19, 2026." },
    { property: "og:title", content: "Section A, Section B — Happy Birthday, Shaky" },
    { property: "og:description", content: "Our childhood friendship told in five chapters, with every good wish for you, Shaky." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Index,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}
function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const parts = now === null ? null : countdownParts(now);
  return <div className="countdown" aria-label="Countdown to Shaky’s birthday">
    {parts?.arrived ? <p className="font-hand text-3xl text-gold">It’s your day. Happy birthday, Shaky.</p> : (["days", "hours", "minutes", "seconds"] as const).map(label => <div key={label}><span className="countdown-number">{parts ? String(parts[label]).padStart(2, "0") : "—"}</span><span className="countdown-label">{label}</span></div>)}
  </div>;
}
function Chapter({ n, era, title, img, alt, flip, children }: { n: string; era: string; title: string; img: string; alt: string; flip?: boolean; children: ReactNode }) {
  return <section id={`chapter-${n}`} className={`chapter ${flip ? "chapter-flip" : ""}`}>
    <figure className="reveal chapter-picture"><img src={img} alt={alt} loading="lazy" width={1098} height={768} /><figcaption><span>Chapter {n}</span></figcaption></figure>
    <div className="reveal chapter-copy"><p className="eyebrow">Chapter {n} · {era}</p><h2>{title}</h2><div className="story-copy">{children}</div></div>
  </section>;
}
function TuitionNotes() {
  const [active, setActive] = useState<number | null>(null);
  const notes = [["The books", "English, Mathematics, Science, Sanskrit. So many subjects; the same familiar company."], ["The masti", "Homework, teasing, leg-pulling—and endless laughter."], ["The evenings", "Ordinary tuition evenings became some of my happiest school memories."]];
  return <div className="tuition-notes"><div className="flex flex-wrap gap-2">{notes.map(([title], i) => <Button key={title} variant="outline" aria-expanded={active === i} onClick={() => setActive(active === i ? null : i)}><BookOpen aria-hidden="true" />{title}</Button>)}</div><div className="memory-note" aria-live="polite">{active === null ? <span className="font-hand">Some afternoons stay with you.</span> : notes[active]?.[1]}</div></div>;
}
function MessageMemory() {
  const [open, setOpen] = useState(false);
  return <div className="message-memory"><div className="cities"><span>Talcher <small>Me</small></span><span className="city-line" /><span>Cuttack <small>You</small></span></div>
    <Button variant="outline" className={`message-button ${open ? "message-lit" : ""}`} aria-expanded={open} onClick={() => setOpen(!open)}><Mail aria-hidden="true" /><span>{open ? "Your unexpected message" : "One unexpected message"}</span><ChevronDown aria-hidden="true" /></Button>
    {open && <p className="message-revealed font-hand" role="status">The happiness on my face that day is mine forever.</p>}
  </div>;
}
function FlipCard({ front, back, index }: { front: string; back: string; index: number }) {
  const [flipped, setFlipped] = useState(false);
  return <Button variant="ghost" className={`memory-card ${flipped ? "is-flipped" : ""}`} aria-label={front} aria-pressed={flipped} onClick={() => setFlipped(!flipped)}>
    <span className="memory-card-inner"><span className="memory-card-front" aria-hidden={flipped}><span className="card-index">0{index + 1}<ArrowUpRight /></span><span className="card-title">{front}</span><span className="card-rule" /></span><span className="memory-card-back" aria-hidden={!flipped}><span className="note-title">{front}</span><span>{back}</span></span></span>
  </Button>;
}
function Letter() {
  const [open, setOpen] = useState(false);
  return open ? <article className="letter-paper"><p className="font-hand text-4xl text-primary">Dear Shaky,</p><div className="letter-copy">{LETTER.split("\n\n").map(p => <p key={p}>{p}</p>)}</div><p className="letter-signature mt-8 text-right font-hand text-primary">With every good wish, Suraj.</p></article> : <Button variant="ghost" onClick={() => setOpen(true)} aria-label="Open the letter for Shaky" className="envelope"><span className="envelope-flap" /><span className="seal">S</span><span className="envelope-address font-hand">For Shaky, from Suraj</span><Mail className="envelope-icon" aria-hidden="true" /></Button>;
}
function Cake({ onWish }: { onWish: () => void }) {
  const [lit, setLit] = useState([true, true, true, true, true]);
  const stopSong = useRef<(() => void) | null>(null);
  useEffect(() => () => { stopSong.current?.(); }, []);
  const blowOut = () => {
    setLit(extinguishCandles);
    onWish();
    stopSong.current?.();
    stopSong.current = playBirthdaySong(birthdaySong.url);
  };
  return <div className="cake-scene"><div className="candles">{lit.map((on, i) => <Button key={i} variant="ghost" className="candle-button" aria-label={`Candle ${i + 1}`} aria-pressed={on} onClick={() => setLit(s => toggleCandle(s, i))}><span className={`candle-flame ${on ? "flame" : "opacity-0"}`} /><span className="candle-stem" /></Button>)}</div><div className="cake-top"><span className="cake-icing" /></div><div className="cake-bottom"><span className="font-hand">for Shaky</span></div><div className="cake-plate" /><p className="cake-wish font-hand" aria-live="polite">{lit.every(l => !l) ? "Wish made. I hope it comes true." : "A little light for every good wish."}</p><Button className="lantern-release" onClick={blowOut}><Flame aria-hidden="true" />Blow out the candles</Button></div>;
}
function BirthdayScene() {
  const [list, setList] = useState<{id: number; x: number; d: number; s: number}[]>([]);
  const [count, setCount] = useState(0);
  const id = useRef(0);
  const release = () => { id.current += 1; setCount(c => c + 1); const lantern = { id: id.current, x: 10 + Math.random() * 80, d: 8 + Math.random() * 6, s: 22 + Math.random() * 16 }; setList(l => [...l.slice(-29), lantern]); };
  return <div><div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">{list.map(l => <span key={l.id} onAnimationEnd={() => setList(s => s.filter(item => item.id !== l.id))} className="lantern" style={{ "--lantern-x": `${l.x}%`, "--lantern-size": `${l.s}px`, "--lantern-duration": `${l.d}s` } as CSSProperties} />)}</div><Cake onWish={release} /><div className="mt-12"><Button className="lantern-release" onClick={release}><Flame aria-hidden="true" />Release a lantern</Button><p className="mt-4 text-sm text-night-foreground/70" role="status">{count === 0 ? "One for every wish I have for you." : `${count} ${count === 1 ? "lantern released" : "lanterns released"}.`}</p></div></div>;
}
function Index() {
  useReveal();
  const [progress, setProgress] = useState(0);
  useEffect(() => { const on = () => { const h = document.documentElement; setProgress(h.scrollTop / (h.scrollHeight - h.clientHeight || 1)); }; window.addEventListener("scroll", on, {passive: true}); return () => window.removeEventListener("scroll", on); }, []);
  return <main className="paper"><div className="reading-progress" style={{transform: `scaleX(${progress})`}} />
    <header className="opening"><img className="opening-art" src={ch5} alt="Watercolor lanterns rising into the evening sky" fetchPriority="high" /><div className="opening-shade" /><div className="opening-top"><span>A birthday memory book</span></div><div className="opening-content"><p className="eyebrow text-gold">19 · November · 2026</p><h1>Section A,<br /><em>Section B</em></h1><p className="opening-description">You and I were two kids who walked the same school corridors without saying a word. This is our story—the friendship, laughter, distance, mistakes, and memories that came after.</p><Countdown /><Button asChild className="begin-button"><a href="#chapter-I">Begin our story<ArrowDown aria-hidden="true" /></a></Button></div><span className="opening-note font-hand">For Shaky, with every good wish.</span></header>
    <nav className="chapter-nav" aria-label="Chapter navigation"><span className="nav-label">OUR STORY</span>{["I", "II", "III", "IV", "V"].map((n, i) => <a key={n} href={`#chapter-${n}`} aria-label={`Chapter ${n}`}><span>{n}</span><small>{["School", "Tuition", "Distance", "College", "Today"][i]}</small></a>)}</nav>
    <Chapter n="I" era="Class 5" title="Two doors down" img={ch1} alt="A boy beside Section B on the left and a girl beside Section A on the right in a sunlit school corridor"><p>We joined the same new school in Class 5. You were in Section A, and I was in Section B.</p><p>We barely spoke. We were just two kids in different sections, sharing the same school corridors without knowing how important our friendship would become.</p><p className="annotation">Two sections. One beginning.</p></Chapter>
    <Chapter n="II" era="Class 9–10" title="The tuition room" img={ch2} alt="You and I laughing over our books in a warm tuition room" flip><p>In Class 9, we started attending tuition at your home. Sir taught us English, History, Geography while Pattnaik Bhai taught us Mathematics and Science. Sanskrit was taught by another teacher (sorry i couldn't recall their name).</p><p>Somewhere between homework, teasing, leg-pulling, and endless masti, you became my best friend. The little moments around studying were often the ones that stayed with me.</p><p>Those tuition evenings became some of my happiest school memories. We laughed, joked around, and made ordinary days feel special.</p><TuitionNotes /></Chapter>
    <div className="story-interlude reveal"><span className="eyebrow">Some memories never grow old</span><p>Somewhere between the homework<br />and the laughter, there was <em>us.</em></p></div>
    <Chapter n="III" era="Class 11 to 12" title="Different cities, an unexpected message" img={ch3} alt="Me as a teenager, happy to see your message at dusk"><p>You moved to Cuttack for +2, while I stayed in Talcher. We were no longer in the same city, and our conversations became less frequent.</p><p>During a difficult period in my life, you tried to support me. I misunderstood things, reacted badly, and eventually blocked you. That was my mistake.</p><p>During that time, I sometimes checked your profile picture.</p><p>Months later, I unblocked you. A little while after that, you sent me a message unexpectedly.</p><p>I still remember how genuinely happy I felt when I saw it. The jokes and teasing began to feel familiar again, and that moment became a memory I will always keep.</p><MessageMemory /></Chapter>
    <Chapter n="IV" era="College" title="The day I walked away" img={ch4} alt="You and I as young adults with a quiet distance between us" flip><p>Later, I moved to another city for college and began a relationship. You were happy for me and became friends with my girlfriend.</p><p>At one point, I was asked to distance myself from you and block you. I let outside opinions and arguments influence me, and I told you I could no longer talk to you. I take responsibility for that choice.</p><p>You told me you only saw me as your best friend.</p><p>I regret not protecting our friendship and not handling the situation with more understanding. I hurt you, and I am sorry. You deserved to be heard and treated with care.</p></Chapter>
    <Chapter n="V" era="Today" title="Your birthday" img={ch5} alt="You as a young adult releasing a glowing birthday lantern"><p>On my birthday, even after everything, you sent me wishes</p><p>Your text made me happy and reminded me of our friendship and childhood memories. I apologized and tried to reach out, knowing that an apology cannot undo everything.</p><p>I understand if you need space or do not want to respond. I do not expect a reply. This birthday wish is simply for you—for your peace, your laughter, and everything good that lies ahead.</p><p className="annotation">Today, all the light is for you.</p></Chapter>
    <section className="memories-section"><div className="section-heading reveal"><p className="eyebrow">Small things. Lasting memories.</p><h2>Six little things,<br />just for you</h2><p className="notes-subtitle">Not another chapter—just six small notes I wanted you to have.</p></div><div className="memory-grid">{THINGS.map(([f, b], i) => <FlipCard key={f} front={f} back={b} index={i} />)}</div></section>
    <section className="letter-section"><div className="section-heading reveal"><p className="eyebrow">A few words, just for you</p><h2>A letter for Shaky</h2></div><div className="reveal"><Letter /></div></section>
    <section className="celebration"><div className="section-heading reveal"><Sparkles className="mx-auto mb-6 text-gold" aria-hidden="true" /><p className="eyebrow text-gold">19 November · Your day</p><h2>Happy Birthday,<br /><em className="text-gold">Shaky.</em></h2></div><div className="reveal"><BirthdayScene /></div><p className="celebration-ending reveal">Happy Birthday, Shaky. May this year bring you peace, laughter, and beautiful beginnings.</p></section>
    <footer><p className="font-hand">With all my good wishes,</p><p className="font-hand">Suraj</p><span>19 November 2026</span></footer>
  </main>;
}
