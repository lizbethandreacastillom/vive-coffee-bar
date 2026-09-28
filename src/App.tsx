import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Coffee, Instagram, Mail, Menu, Pause, Play, X } from 'lucide-react';

const whatsapp = (import.meta.env.VITE_WHATSAPP_NUMBER || '524425837669').replace(/\D/g, '');
const instagram = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/vive.coffeebarqro/';
const photos = [
  { src: '/images/galeria-barra.jpg', alt: 'Barista de Vive Coffee Bar preparando bebidas durante una celebración', label: 'En el corazón del evento' },
  { src: '/images/equipo.webp', alt: 'Equipo de Vive Coffee Bar atendiendo una exposición', label: 'Nuestro equipo, tu momento' },
  { src: '/images/cold-brew.webp', alt: 'Bebida fría de café servida por Vive Coffee Bar', label: 'Cada detalle cuenta' },
  { src: '/images/galeria-bebidas.jpg', alt: 'Bebidas de taro y café de Vive Coffee Bar listas para servir', label: 'Sabores para todos' },
];
const occasions = [
  { no: '01', title: 'Bodas', text: 'Una pausa deliciosa entre brindis, conversaciones y nuevos recuerdos.' },
  { no: '02', title: 'Eventos corporativos', text: 'Una barra que invita a conectar y hace más especial cada encuentro.' },
  { no: '03', title: 'Celebraciones privadas', text: 'Café y bebidas preparadas al momento para compartir con tu gente.' },
  { no: '04', title: 'Activaciones de marca', text: 'Una experiencia que se integra con la identidad de tu evento.' },
];
const packages = [
  { name: 'Essential', label: 'Clásicos para compartir', description: 'Ideal para eventos corporativos, congresos, desayunos y celebraciones.', points: ['Espresso, americano, latte y cappuccino', 'Chocolate caliente, flat white y té', 'Preparación en sitio y baristas profesionales'] },
  { name: 'Signature', label: 'La experiencia favorita', description: 'Una barra más completa para quienes quieren ofrecer algo diferente.', points: ['Clásicos de café y bebidas especiales', 'Matcha, taro y chai latte', 'Opciones calientes, frías y frappeadas'] },
  { name: 'Premium', label: 'Coffee & Cocktail', description: 'Del café de la mañana al carajillo de la noche, pensado para bodas y eventos sociales.', points: ['Café y bebidas especiales', 'Carajillo y coffee cocktails', 'Menú adaptable a cada celebración'] },
];
type FormData = { name: string; event: string; date: string; guests: string; city: string; package: string; details: string };
const initial: FormData = { name: '', event: '', date: '', guests: '', city: '', package: '', details: '' };

function DecorativeStar() {
  return <svg className="decorative-star" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d="M16 1v30M1 16h30M5.4 5.4l21.2 21.2M5.4 26.6L26.6 5.4"/></svg>;
}

function CoffeeVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden && !preference.matches && !manuallyPaused.current) {
        void video.play().catch(() => setPlaying(false));
      } else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.25 });
    observer.observe(video);
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      video.pause();
    };
  }, [failed]);
  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      manuallyPaused.current = false;
      void video.play().catch(() => setPlaying(false));
    } else {
      manuallyPaused.current = true;
      video.pause();
    }
  };
  return <div className="coffee-video">
    {failed ? <img src={poster} alt={label} loading="lazy" /> : <>
      <video ref={videoRef} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
      <button className="video-toggle" type="button" onClick={toggle} aria-label={`${playing ? 'Pausar' : 'Reproducir'}: ${label}`}>{playing ? <Pause size={16}/> : <Play size={16}/>}<span>{playing ? 'Pausar' : 'Reproducir'}</span></button>
    </>}
  </div>;
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}
function QuoteForm() {
  const [form, setForm] = useState<FormData>(initial);
  const [status, setStatus] = useState('');
  const [manualMessage, setManualMessage] = useState('');
  const update = (key: keyof FormData, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setManualMessage('');
    const message = `Hola, Vive Coffee Bar. Quiero cotizar una barra de café para mi evento.\n\nNombre: ${form.name}\nEvento: ${form.event}\nFecha: ${form.date || 'Por definir'}\nInvitados: ${form.guests || 'Por definir'}\nCiudad: ${form.city}\nExperiencia: ${form.package || 'Por recomendar'}\nDetalles: ${form.details || 'Sin detalles adicionales'}`;
    if (whatsapp) {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      setStatus('Tu mensaje está listo en WhatsApp. Presiona enviar para compartirlo.');
    } else {
      try { await navigator.clipboard.writeText(message); setStatus('Solicitud copiada. Puedes pegarla y compartirla por tu medio de contacto habitual.'); }
      catch {
        setManualMessage(message);
        setStatus('No se pudo copiar automáticamente. Selecciona y copia tu solicitud en el campo de abajo.');
      }
    }
  };
  return <form className="quote-form" onSubmit={submit}>
    <div className="form-grid">
      <label>Tu nombre <input required autoComplete="name" value={form.name} onChange={e => update('name', e.target.value)} placeholder="¿Cómo te llamas?" /></label>
      <label>Tipo de evento <select required value={form.event} onChange={e => update('event', e.target.value)}><option value="">Selecciona una opción</option><option>Boda</option><option>Evento corporativo</option><option>Celebración privada</option><option>Activación de marca</option><option>Otro</option></select></label>
      <label>Fecha tentativa <input type="date" value={form.date} onChange={e => update('date', e.target.value)} /></label>
      <label>Invitados aproximados <input type="number" min="1" inputMode="numeric" value={form.guests} onChange={e => update('guests', e.target.value)} placeholder="Ej. 80" /></label>
      <label>Ciudad del evento <input required value={form.city} onChange={e => update('city', e.target.value)} placeholder="¿Dónde será?" /></label>
      <label>Experiencia <select value={form.package} onChange={e => update('package', e.target.value)}><option value="">Ayúdame a elegir</option>{packages.map(p => <option key={p.name}>{p.name}</option>)}</select></label>
    </div>
    <label>Cuéntanos un poco más <textarea rows={3} value={form.details} onChange={e => update('details', e.target.value)} placeholder="Horario, bebidas favoritas, alguna idea especial…" /></label>
    <button className="button button-dark form-submit" type="submit">{whatsapp ? 'Enviar por WhatsApp' : 'Copiar solicitud'} <ArrowUpRight size={18} /></button>
    <p className="form-note">{whatsapp ? 'Se abrirá WhatsApp con tus datos. La solicitud se envía cuando confirmes el mensaje.' : 'Puedes copiar los detalles de tu evento para compartirlos. Este formulario no envía la solicitud automáticamente.'}</p>
    {status && <p className="form-status" role="status">{status}</p>}
    {manualMessage && <label>Tu solicitud lista para copiar<textarea readOnly rows={10} value={manualMessage} onFocus={e => e.currentTarget.select()} /></label>}
  </form>;
}
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = lightboxRef.current;
    if (lightbox === null || !dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [lightbox]);
  useEffect(() => { const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setLightbox(null); setMenuOpen(false); } }; window.addEventListener('keydown', esc); return () => window.removeEventListener('keydown', esc); }, []);
  const nav = [['La experiencia', '#experiencia'], ['Eventos', '#eventos'], ['Paquetes', '#paquetes'], ['Carajillos', '#carajillos'], ['Galería', '#galeria']];
  return <>
    <a className="skip-link" href="#main">Ir al contenido</a>
    <header className="header"><div className="header-inner">
      <a className="wordmark" href="#inicio" aria-label="Vive Coffee Bar, inicio"><img src="/images/logo-vive.png" alt="" /></a>
      <nav id="main-navigation" className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navegación principal">{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}<a className="nav-mobile-cta" href="#cotizar" onClick={() => setMenuOpen(false)}>Cotiza tu evento</a></nav>
      <a className="header-cta" href="#cotizar">Cotiza tu evento <ArrowUpRight size={15}/></a>
      <button className="menu-button" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    </div></header>
    <main id="main">
      <section className="hero" id="inicio"><div className="hero-copy"><span className="eyebrow"><span className="eyebrow-line"/> CAFÉ PARA CELEBRAR LA VIDA</span><h1>Hay momentos<br/>que se viven <em>mejor</em><br/>con café.</h1><p>Una barra de café móvil para bodas, eventos y celebraciones que merecen sentirse especiales.</p><div className="hero-actions"><a className="button button-dark" href="#cotizar">Cotiza tu evento <ArrowUpRight size={18}/></a><a className="text-link" href="#experiencia">Descubre la experiencia <ArrowDown size={16}/></a></div><div className="hero-note"><span className="asterisk"><DecorativeStar/></span><span>Hecho con intención.<br/>Servido para compartir.</span></div></div><div className="hero-photo"><img src="/images/barra.webp" alt="Barra móvil de Vive Coffee Bar atendida durante un evento" fetchPriority="high"/><div className="hero-image-label">EL CAFÉ TAMBIÉN ES PARTE DEL MOMENTO <span>01 / 04</span></div></div></section>
      <div className="ribbon" aria-label="Café de especialidad para tus eventos"><span>BODAS</span><i><DecorativeStar/></i><span>EVENTOS CORPORATIVOS</span><i><DecorativeStar/></i><span>CELEBRACIONES</span><i><DecorativeStar/></i><span>EXPERIENCIAS A TU MEDIDA</span></div>
      <section className="intro section-shell" id="experiencia"><div className="intro-side"><span className="eyebrow">01 — LA EXPERIENCIA VIVE</span><span className="small-star"><DecorativeStar/></span></div><div className="intro-main"><h2>No se trata solo de una taza. <em>Se trata de lo que sucede alrededor.</em></h2><p>Llevamos una barra de café a tu evento para crear un espacio de encuentro. Bebidas preparadas al momento, atención cercana y una experiencia que se integra con la celebración.</p><a className="underlined-link" href="#eventos">Encuentra tu ocasión <ArrowUpRight size={17}/></a></div></section>
      <section className="feature" aria-label="Nuestra barra en acción"><div className="feature-image"><img src="/images/evento.webp" alt="Barra de Vive Coffee Bar instalada en un evento" loading="lazy"/></div><div className="feature-content"><span className="eyebrow">CADA DETALLE IMPORTA</span><h2>Una barra que invita a quedarse <em>un ratito más.</em></h2><p>Porque las mejores conversaciones suelen empezar con algo rico entre las manos.</p><a className="button button-outline" href="#galeria">Ver nuestra galería <ArrowRight size={18}/></a></div></section>
      <section className="occasions section-shell" id="eventos"><SectionHeading eyebrow="02 — DONDE NOS ENCONTRAMOS" title="Una experiencia para cada ocasión." text="Adaptamos la barra a la energía de tu evento y a las personas que lo hacen especial."/><div className="occasion-grid">{occasions.map(o => <a className="occasion" key={o.no} href="#cotizar"><span>{o.no} /</span><div><h3>{o.title}</h3><p>{o.text}</p></div><ArrowUpRight size={20}/></a>)}</div></section>
      <section className="drinks"><div className="drinks-copy"><span className="eyebrow">DE NUESTRA BARRA A TU EVENTO</span><h2>Algo para<br/><em>cada antojo.</em></h2><p>Espresso, americano, latte y cappuccino. Y para quienes quieren probar algo distinto: opciones frías, matcha, chai y taro, según la propuesta elegida.</p><a className="underlined-link" href="#paquetes">Explora las experiencias <ArrowUpRight size={17}/></a></div><div className="drink-photos drink-photos-animated"><CoffeeVideo src="/videos/vive-coffee.mp4" poster="/images/coffee-video-poster.jpg" label="Matcha de Vive Coffee Bar"/><CoffeeVideo src="/videos/vive-coffee-2.mp4" poster="/images/coffee-video-2-poster.jpg" label="Segunda bebida de Vive Coffee Bar"/></div></section>
      <section className="carajillos" id="carajillos" aria-labelledby="carajillos-title">
        <div className="carajillos-image"><img src="/images/carajillo.jpg" alt="Carajillo de Vive Coffee Bar con hielo y espuma de café" loading="lazy" width="1024" height="1024"/></div>
        <div className="carajillos-copy"><span className="eyebrow">COFFEE &amp; COCKTAIL</span><h2 id="carajillos-title">Carajillos para<br/><em>brindar a tu manera.</em></h2><p>El café también se brinda. Dale un toque especial a tu celebración con nuestros carajillos, una invitación a disfrutar y alargar la sobremesa.</p><p>Descubre esta opción en la experiencia Premium y cuéntanos cómo te gustaría integrarla a tu evento.</p><a className="button button-outline" href="#cotizar">Cotiza tus carajillos <ArrowUpRight size={18}/></a></div>
      </section>
      <section className="packages section-shell" id="paquetes"><SectionHeading eyebrow="03 — ELIGE TU EXPERIENCIA" title="El café, a tu manera." text="Tres puntos de partida para diseñar el servicio ideal. El alcance final se define en tu cotización."/><div className="package-grid">{packages.map((p,i) => <article className={i === 1 ? 'package-card featured' : 'package-card'} key={p.name}><div className="package-top"><span>0{i+1} / EXPERIENCIA</span>{i === 1 && <span className="pill">UNA FAVORITA</span>}</div><h3>{p.name}</h3><p className="package-label">{p.label}</p><p>{p.description}</p><ul>{p.points.map(point => <li key={point}><Check size={16}/>{point}</li>)}</ul><a href="#cotizar" className="package-link">Solicitar cotización <ArrowUpRight size={18}/></a></article>)}</div><p className="package-disclaimer">La disponibilidad, duración, menú y precio se confirman según los detalles de cada evento.</p></section>
      <section className="gallery section-shell" id="galeria"><div className="gallery-title"><SectionHeading eyebrow="04 — MOMENTOS VIVE" title="Así se vive Vive."/><p>De la barra a las manos de tus invitados. Un vistazo a nuestras bebidas y eventos.</p></div><div className="gallery-grid">{photos.map((photo,i) => <button className={`gallery-item gallery-${i}`} key={photo.src} type="button" onClick={() => setLightbox(i)} aria-label={`Ampliar foto: ${photo.label}`}><img src={photo.src} alt={photo.alt} loading="lazy"/><span>{photo.label} <ArrowUpRight size={17}/></span></button>)}</div></section>
      <section className="quote" id="cotizar"><div className="quote-inner"><div className="quote-copy"><span className="eyebrow">05 — HAGAMOS ALGO ESPECIAL</span><h2>Tu evento merece<br/><em>un gran café.</em></h2><p>Compártenos los detalles y preparemos una propuesta para tu celebración.</p><div className="quote-symbol"><DecorativeStar/></div><span className="quote-caption">VIVE COFFEE BAR · CAFÉ PARA EVENTOS</span></div><div className="quote-panel"><h3>Cuéntanos de tu evento</h3><p>Empecemos por lo esencial.</p><QuoteForm/></div></div></section>
      <section className="faq section-shell"><SectionHeading eyebrow="ANTES DE BRINDAR CON CAFÉ" title="Preguntas frecuentes."/><div className="faq-list"><details><summary>¿Con cuánto tiempo debo reservar?<ChevronDown size={18}/></summary><p>Escríbenos en cuanto tengas la fecha. Confirmaremos disponibilidad al preparar tu propuesta.</p></details><details><summary>¿Pueden adaptar las bebidas al evento?<ChevronDown size={18}/></summary><p>Sí. Cuéntanos tus preferencias y consideraremos las opciones al cotizar.</p></details><details><summary>¿Qué necesitan para instalar la barra?<ChevronDown size={18}/></summary><p>Un espacio adecuado y acceso a corriente eléctrica. Revisaremos juntos los detalles de montaje antes del evento.</p></details></div></section>
    </main>
    <footer className="footer"><div className="footer-top"><div><a className="footer-mark" href="#inicio" aria-label="Vive Coffee Bar, volver al inicio"><img src="/images/logo-vive.png" alt="" /></a><p>El café también puede ser<br/>parte del momento.</p></div><div className="footer-links"><a href="#experiencia">La experiencia</a><a href="#eventos">Eventos</a><a href="#paquetes">Paquetes</a><a href="#carajillos">Carajillos</a><a href="#cotizar">Cotizar</a></div><div className="footer-contact"><span>EMPECEMOS A PLANEAR</span><a href="#cotizar">Hablemos de tu evento <ArrowUpRight size={18}/></a>{instagram && <a className="instagram" href={instagram} target="_blank" rel="noopener noreferrer"><Instagram size={18}/> @vive.coffeebarqro</a>}<a className="contact-email" href="mailto:vivecoffeebar@gmail.com"><Mail size={18}/> vivecoffeebar@gmail.com</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Vive Coffee Bar</span><span>Hecho para los momentos que importan <Coffee size={14}/></span><a href="#inicio">Volver arriba ↑</a></div></footer>
    {lightbox !== null && <dialog ref={lightboxRef} className="lightbox" aria-label="Fotografía ampliada" onCancel={() => setLightbox(null)} onClick={e => { if (e.target === e.currentTarget) setLightbox(null); }}><button className="lightbox-close" type="button" onClick={() => setLightbox(null)} aria-label="Cerrar fotografía"><X/></button><img src={photos[lightbox].src} alt={photos[lightbox].alt} onClick={e => e.stopPropagation()}/><span>{photos[lightbox].label}</span></dialog>}
  </>;
}
