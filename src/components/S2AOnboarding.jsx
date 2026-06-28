"use client";

import { useState } from "react";
import {
  Rocket, Wrench, RefreshCw, Plus, Laptop, Handshake,
  Store, ClipboardList, Smartphone, MonitorSmartphone,
  Target, AlertTriangle, Package, ShoppingCart,
  Palette, Zap, CheckCircle2, ChevronRight,
  MessageCircle, ArrowLeft, RotateCcw, ExternalLink,
  Check, ShieldCheck, Gauge, Puzzle
} from "lucide-react";

// ─── DATI PRODOTTI ────────────────────────────────────────────────────────────
const PLANS = {
  launch: {
    id: "launch", name: "Launch", badge: "MENSILE", price: 79, unit: "mese",
    desc: "Il piano d'avvio per chi si gestisce da solo.",
    features: ["1 build/mese", "Rinnovi illimitati", "Aggiornamenti on-the-fly"],
    color: "#29abe2",
  },
  growth: {
    id: "growth", name: "Growth", badge: "MENSILE", price: 149, unit: "mese",
    desc: "Più build, più libertà di iterare.",
    features: ["3 build/mese", "Rinnovi illimitati", "Aggiornamenti on-the-fly"],
    color: "#9559ea",
  },
  launchYear: {
    id: "launchYear", name: "Launch Yearly", badge: "ANNUALE", price: 790, unit: "anno",
    desc: "Piano annuale con 2 build extra incluse.",
    features: ["1 build/mese", "2 build extra incluse", "Rinnovi illimitati"],
    color: "#29abe2",
  },
  growthYear: {
    id: "growthYear", name: "Growth Yearly", badge: "ANNUALE", price: 1490, unit: "anno",
    desc: "La scelta dei developer che iterano spesso.",
    features: ["3 build/mese", "4 build extra incluse", "Rinnovi illimitati"],
    color: "#9559ea",
  },
  managedLaunch: {
    id: "managedLaunch", name: "Managed Launch", badge: "GESTITO", price: 449, discounted: 336.75, unit: "mese",
    desc: "Il team MGSQ gestisce tutto ogni mese.",
    features: ["5 build/mese", "Setup completo incluso", "Supporto prioritario MGSQ"],
    color: "#e06bbd",
  },
  managedLaunchYear: {
    id: "managedLaunchYear", name: "Managed Yearly", badge: "GESTITO", price: 4490, discounted: 3367.5, unit: "anno",
    desc: "Il massimo del supporto per tutto l'anno.",
    features: ["5 build/mese", "5 build extra incluse", "Setup App+Play+Firebase incluso"],
    color: "#e06bbd",
  },
};

// ─── STEPS ────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "existing_app",
    label: "App esistente",
    question: "Hai già un'app di vendita?",
    type: "single",
    insight: {
      title: "Perché te lo chiediamo",
      body: "Se hai già un'app pubblicata possiamo valutare insieme la migrazione verso Store2App, mantenendo la continuità per i tuoi clienti e riducendo i tempi di transizione.",
    },
    opts: [
      { v: "yes", l: "Sì, ho già un'app", icon: RefreshCw },
      { v: "no",  l: "No, è la mia prima app", icon: Plus },
    ],
  },
  {
    id: "existing_stores",
    label: "Store attuali",
    question: "In quali store è pubblicata?",
    type: "multi",
    insight: {
      title: "App Store e Google Play",
      body: "Puoi selezionare uno o più store. Tieni presente che Apple richiede un account Apple Developer attivo (€99/anno). Se non ce l'hai, possiamo attivarlo per te.",
      link: {
        label: "Linee guida App Store Review →",
        url: "https://developer.apple.com/app-store/review/guidelines/",
      },
    },
    opts: [
      { v: "appstore",  l: "App Store (Apple)",  icon: Smartphone },
      { v: "playstore", l: "Google Play",         icon: MonitorSmartphone },
      { v: "altro",     l: "Altro",               icon: Plus, hasInput: true },
    ],
  },
  {
    id: "woocommerce",
    label: "WooCommerce",
    question: "Hai già un sito WooCommerce attivo?",
    type: "single",
    insight: {
      title: "Cos'è WooCommerce",
      body: "Store2App si integra nativamente con WooCommerce, il plugin e-commerce più diffuso per WordPress. Se non lo hai ancora, possiamo aiutarti a configurarlo prima di procedere con l'app.",
    },
    opts: [
      { v: "yes", l: "Sì, ho già un negozio WooCommerce attivo", icon: CheckCircle2 },
      { v: "no",  l: "No, devo ancora crearlo",                   icon: Wrench },
    ],
  },
  {
    id: "developer",
    label: "Il tuo profilo",
    question: "Gestisci da solo la parte tecnica?",
    type: "single",
    insight: {
      title: "Developer o no?",
      body: "Se sei uno sviluppatore puoi gestire autonomamente build, aggiornamenti e pubblicazioni. Altrimenti, con il piano Managed, il team MGSQ si occupa di tutto al posto tuo — dalla prima build alla pubblicazione sugli store.",
    },
    opts: [
      { v: "yes", l: "Sì, sono sviluppatore / me la cavo",       icon: Laptop },
      { v: "no",  l: "No, preferisco che qualcuno se ne occupi", icon: Handshake },
    ],
  },
  {
    id: "appstore_account",
    label: "Account store",
    question: "Hai già un account Apple Developer e/o Google Play?",
    type: "single",
    insight: {
      title: "Account developer",
      body: "Per pubblicare sugli store servono account dedicati: Apple Developer (€99/anno) e Google Play (€25 una tantum). Se non li hai, puoi aggiungere il setup al tuo piano — e più il piano è alto, meno costa il setup.",
      link: {
        label: "Linee guida App Store Review →",
        url: "https://developer.apple.com/app-store/review/guidelines/",
      },
    },
    opts: [
      { v: "yes", l: "Sì, ho già i miei account store", icon: Store },
      { v: "no",  l: "No, devo ancora crearli",         icon: ClipboardList },
    ],
  },
  {
    id: "multi_app",
    label: "Numero app",
    question: "Stai gestendo più di un'app WooCommerce?",
    type: "single",
    insight: {
      title: "Una app alla volta",
      body: "Store2App gestisce un progetto per volta per garantire la massima qualità su ogni app. Se hai più app WooCommerce, il nostro team ti contatterà per trovare la soluzione più adatta.",
    },
    opts: [
      { v: "no",  l: "No, gestisco una sola app",  icon: Smartphone },
      { v: "yes", l: "Sì, ho più app WooCommerce", icon: MonitorSmartphone },
    ],
  },
];

// ─── ROUTING ──────────────────────────────────────────────────────────────────
function getRecommendation(answers) {
  const isDev    = answers.developer        === "yes";
  const hasStore = answers.appstore_account === "yes";
  const hasApp   = answers.existing_app     === "yes";

  if (!isDev) {
    return {
      rec: PLANS.managedLaunchYear,
      recReason: "Senza voler gestire la parte tecnica, Managed Yearly ti garantisce supporto completo per tutto l'anno al miglior costo mensile.",
      setupNote: null, hasApp,
      alts: [
        { plan: PLANS.managedLaunch, reason: "Preferisci non impegnarti annualmente? Ottimo, ma il costo mensile è più alto." },
        { plan: PLANS.growthYear,    reason: "Se vuoi gestire da solo con più autonomia — richiede però esperienza tecnica." },
      ],
    };
  }
  if (hasStore) {
    return {
      rec: PLANS.growthYear,
      recReason: "Con i tuoi account store già attivi puoi iniziare subito. Growth Yearly ti dà 3 build/mese + 4 extra al prezzo annuale migliore.",
      setupNote: null, hasApp,
      alts: [
        { plan: PLANS.launchYear, reason: "Se lanci una sola app e non hai bisogno di build multiple, Launch Yearly costa meno." },
        { plan: PLANS.growth,     reason: "Vuoi flessibilità mese per mese senza impegno annuale? Growth mensile: 3 build/mese." },
        { plan: PLANS.launch,     reason: "Il piano mensile più economico — ideale per iniziare e valutare con calma." },
      ],
    };
  }
  return {
    rec: PLANS.launchYear,
    recReason: "Non hai ancora un account store: Launch Yearly + setup premium è il punto d'ingresso più conveniente. Più sali di piano, meno costa il setup.",
    setupNote: "Con il piano annuale: App Store setup €150 + Play Store setup €150 (invece di €400 sul piano mensile). Firebase disponibile a +€50.",
    hasApp,
    alts: [
      { plan: PLANS.growthYear,        reason: "Se hai aggiornamenti frequenti, Growth Yearly vale il costo extra. Setup identico a Launch Yearly." },
      { plan: PLANS.launch,            reason: "Mensile, 1 build. Setup a prezzo pieno (€400). Buono per testare prima di impegnarsi annualmente." },
      { plan: PLANS.managedLaunchYear, reason: "Vuoi zero pensieri tecnici? Managed Yearly include setup e supporto completo MGSQ." },
    ],
  };
}

// ─── INSIGHT PANEL ────────────────────────────────────────────────────────────
function InsightPanel({ insight }) {
  if (!insight) return null;
  return (
    <div className="s2a-insight">
      <p className="s2a-eyebrow s2a-mb-8">{insight.title}</p>
      <p className="s2a-text-sm" style={{ lineHeight: 1.75, margin: 0 }}>{insight.body}</p>
      {insight.link && (
        <a href={insight.link.url} target="_blank" rel="noreferrer" className="s2a-insight__link">
          {insight.link.label}
          <ExternalLink size={12} strokeWidth={2} />
        </a>
      )}
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }) {
  return (
    <div className="s2a-mb-28">
      <div className="s2a-progress">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`s2a-progress__seg${i < current ? " s2a-progress__seg--active" : ""}`} />
        ))}
      </div>
      <p className="s2a-progress__label">Step {current} di {total}</p>
    </div>
  );
}

// ─── OPTION BTN (singola) ──────────────────────────────────────────────────────
function OptionBtn({ opt, selected, onClick }) {
  const Icon = opt.icon;
  return (
    <button className={`s2a-opt${selected ? " s2a-opt--selected" : ""}`} onClick={() => onClick(opt.v)}>
      <span className="s2a-opt__dot">
        {selected && (
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <Icon size={18} strokeWidth={1.75} style={{ flexShrink: 0, color: selected ? "#29abe2" : "#7a7a8a" }} />
      <span>{opt.l}</span>
    </button>
  );
}

// ─── OPTION BTN (multipla) ────────────────────────────────────────────────────
function MultiOptionBtn({ opt, selected, onToggle, altroValue, onAltroChange }) {
  const Icon = opt.icon;
  return (
    <div>
      <button className={`s2a-opt s2a-opt--multi${selected ? " s2a-opt--selected" : ""}`} onClick={() => onToggle(opt.v)}>
        <span className="s2a-opt__checkbox">
          {selected && <Check size={11} strokeWidth={3} color="#fff" />}
        </span>
        <Icon size={18} strokeWidth={1.75} style={{ flexShrink: 0, color: selected ? "#29abe2" : "#7a7a8a" }} />
        <span>{opt.l}</span>
      </button>
      {opt.hasInput && selected && (
        <div className="s2a-altro-input">
          <input
            type="text"
            placeholder="Es. Huawei AppGallery, Samsung Galaxy Store..."
            value={altroValue}
            onChange={e => onAltroChange(e.target.value)}
            className="s2a-input"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

// ─── PLAN CARD ────────────────────────────────────────────────────────────────
function PlanCard({ plan, recommended = false }) {
  const displayPrice = plan.discounted ?? plan.price;
  return (
    <div className={`s2a-card s2a-mb-16${recommended ? " s2a-card--accent" : ""}`}>
      {recommended && <div className="s2a-ribbon">★ CONSIGLIATO</div>}
      <div className="s2a-flex s2a-justify-between s2a-flex-wrap s2a-gap-8 s2a-mb-16">
        <div>
          <span className="s2a-badge s2a-mb-8" style={{ color: plan.color, background: `${plan.color}22` }}>{plan.badge}</span>
          <h3 style={{ margin: "8px 0 4px", fontSize: 20, fontWeight: 700 }}>{plan.name}</h3>
          <p className="s2a-text-sm" style={{ margin: 0 }}>{plan.desc}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          {plan.discounted && <p className="s2a-price--striked">€{plan.price.toLocaleString("it-IT")}</p>}
          <p className="s2a-price" style={{ color: plan.color }}>€{displayPrice.toLocaleString("it-IT")}</p>
          <p className="s2a-price__unit">/{plan.unit}</p>
        </div>
      </div>
      <ul className="s2a-features s2a-mb-20">
        {plan.features.map((f, i) => (
          <li key={i}>
            <CheckCircle2 size={15} strokeWidth={2} style={{ color: plan.color, flexShrink: 0 }} />
            {f}
          </li>
        ))}
      </ul>
      {recommended && (
        <a href="https://woo2app.unlisted.mgsq.it" target="_blank" rel="noreferrer"
          className="s2a-btn s2a-btn--primary s2a-btn--full"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          Inizia con {plan.name} <ChevronRight size={16} strokeWidth={2.5} />
        </a>
      )}
    </div>
  );
}

// ─── ALT CARD ─────────────────────────────────────────────────────────────────
function AltCard({ plan, reason }) {
  const [open, setOpen] = useState(false);
  const displayPrice = plan.discounted ?? plan.price;
  return (
    <div className="s2a-alt-card" onClick={() => setOpen(o => !o)}>
      <div className="s2a-alt-card__header">
        <div>
          <span className="s2a-badge s2a-mb-4" style={{ color: plan.color }}>{plan.badge}</span>
          <p style={{ fontWeight: 600, fontSize: 15, margin: "2px 0 0" }}>{plan.name}</p>
        </div>
        <div className="s2a-flex s2a-items-center s2a-gap-12">
          <span style={{ fontWeight: 700, color: "#7a7a8a", fontSize: 14 }}>€{displayPrice.toLocaleString("it-IT")}/{plan.unit}</span>
          <Plus size={18} strokeWidth={2} style={{ color: "#29abe2", transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
        </div>
      </div>
      {open && (
        <div className="s2a-alt-card__body">
          <p className="s2a-text-sm s2a-mb-8" style={{ fontStyle: "italic" }}>{reason}</p>
          <p className="s2a-text-sm s2a-mb-8">{plan.desc}</p>
          <ul className="s2a-features">
            {plan.features.map((f, i) => (
              <li key={i}>
                <CheckCircle2 size={14} strokeWidth={2} style={{ color: plan.color, flexShrink: 0 }} />{f}
              </li>
            ))}
          </ul>
          <a href="https://woo2app.unlisted.mgsq.it" target="_blank" rel="noreferrer"
            className="s2a-btn s2a-btn--ghost s2a-mt-16"
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
            onClick={e => e.stopPropagation()}>
            Scopri {plan.name} <ChevronRight size={14} strokeWidth={2.5} />
          </a>
        </div>
      )}
    </div>
  );
}

// ─── TEAM CONTACT ─────────────────────────────────────────────────────────────
function TeamContact({ icon: Icon, title, body, extras }) {
  return (
    <div className="s2a-text-center">
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: "rgba(41,171,226,0.1)", marginBottom: 20 }}>
        <Icon size={32} strokeWidth={1.5} style={{ color: "#29abe2" }} />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>{title}</h2>
      <p className="s2a-lead" style={{ maxWidth: 380, margin: "0 auto 28px" }}>{body}</p>
      {extras && (
        <div className="s2a-card s2a-mb-20" style={{ textAlign: "left", maxWidth: 400, margin: "0 auto 20px" }}>
          {extras.map(([I, t]) => (
            <div key={t} className="s2a-flex s2a-items-center s2a-gap-12 s2a-mb-12">
              <I size={18} strokeWidth={1.75} style={{ color: "#29abe2", flexShrink: 0 }} />
              <span style={{ fontSize: 14 }}>{t}</span>
            </div>
          ))}
        </div>
      )}
      <a href="https://woo2app.unlisted.mgsq.it/#contact" target="_blank" rel="noreferrer"
        className="s2a-btn s2a-btn--primary"
        style={{ padding: "16px 40px", display: "inline-flex", alignItems: "center", gap: 8 }}>
        Contatta il team <ChevronRight size={16} strokeWidth={2.5} />
      </a>
    </div>
  );
}

// ─── CHAT BTN ─────────────────────────────────────────────────────────────────
function ChatBtn() {
  return (
    <a href="https://woo2app.unlisted.mgsq.it/#contact" target="_blank" rel="noreferrer" className="s2a-chat-btn">
      <MessageCircle size={18} strokeWidth={1.75} />
      <span className="s2a-chat-label">Chat con noi</span>
    </a>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function S2AOnboarding() {
  const [stepIdx, setStepIdx]   = useState(0);
  const [answers, setAnswers]   = useState({});
  const [selected, setSelected] = useState(null);
  const [multiSel, setMultiSel] = useState([]);
  const [altroText, setAltroText] = useState("");
  const [result, setResult]     = useState(null);

  const getActiveSteps = () => {
    let steps = [...STEPS];
    if (answers.existing_app !== "yes") steps = steps.filter(s => s.id !== "existing_stores");
    if (answers.developer    === "no")  steps = steps.filter(s => s.id !== "appstore_account");
    return steps;
  };

  const activeSteps = getActiveSteps();
  const currentStep = activeSteps[stepIdx - 1];
  const totalSteps  = activeSteps.length;
  const isMulti     = currentStep?.type === "multi";

  const toggleMulti = (v) => {
    setMultiSel(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  };

  const canContinue = isMulti ? multiSel.length > 0 : selected !== null;

  const goNext = () => {
    if (!canContinue) return;
    const value = isMulti
      ? { stores: multiSel, altro: multiSel.includes("altro") ? altroText : "" }
      : selected;
    const newAnswers = { ...answers, [currentStep.id]: value };
    setAnswers(newAnswers);
    setSelected(null);
    setMultiSel([]);
    setAltroText("");

    if (currentStep.id === "woocommerce"    && selected === "no")  { setResult("team_woo");   return; }
    if (currentStep.id === "multi_app"      && selected === "yes") { setResult("team_multi"); return; }
    if (currentStep.id === "multi_app"      && selected === "no")  { setResult("recommend");  return; }
    if (currentStep.id === "developer"      && selected === "no")  {
      setAnswers({ ...newAnswers, appstore_account: "no" });
      setStepIdx(s => s + 1);
      return;
    }
    if (stepIdx >= activeSteps.length) { setResult("recommend"); return; }
    setStepIdx(s => s + 1);
  };

  const goBack = () => {
    if (result)       { setResult(null); setStepIdx(activeSteps.length); setSelected(null); setMultiSel([]); return; }
    if (stepIdx <= 1) { setStepIdx(0); setSelected(null); setMultiSel([]); return; }
    setStepIdx(s => s - 1);
    setSelected(null);
    setMultiSel([]);
  };

  const restart = () => { setStepIdx(0); setAnswers({}); setSelected(null); setMultiSel([]); setAltroText(""); setResult(null); };

  // ── LANDING ──────────────────────────────────────────────────────────────────
  if (stepIdx === 0) return (
    <div className="s2a-onboarding">
      <div className="s2a-wrap">
        <div className="s2a-tag s2a-mb-20">
          <Rocket size={13} strokeWidth={2} />
          CONFIGURATORE GUIDATO
        </div>

        <h1 className="s2a-title s2a-mb-16">
          Il tuo negozio WooCommerce<br />
          <span>diventa un'app nativa</span>
        </h1>

        <p className="s2a-lead s2a-mb-28">
          Store2App trasforma il tuo shop WooCommerce in un'app iOS e Android in pochi minuti — senza scrivere una riga di codice. Aggiornamenti in tempo reale, notifiche push, analytics integrati: tutto quello che serve per vendere di più, direttamente in tasca ai tuoi clienti.
        </p>

        <div className="s2a-landing-features s2a-mb-28">
          {[
            { icon: Gauge,      title: "Setup in 5 minuti",     desc: "Colleghi WooCommerce, scegli il tema, pubblichi. Nessun developer richiesto." },
            { icon: ShieldCheck, title: "Zero costi di sviluppo", desc: "Niente agenzia, niente dev freelance. Paghi solo il piano mensile o annuale." },
            { icon: Puzzle,      title: "100% personalizzabile",  desc: "Font, colori, schermate: tutto adattabile al tuo brand con il builder drag & drop." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="s2a-landing-feature">
              <div className="s2a-landing-feature__icon">
                <Icon size={20} strokeWidth={1.75} style={{ color: "#29abe2" }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 4px", color: "#333" }}>{title}</p>
                <p className="s2a-text-sm" style={{ margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="s2a-btn s2a-btn--primary s2a-btn--full"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          onClick={() => setStepIdx(1)}
        >
          Trova il piano giusto per te
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>

        <p className="s2a-text-sm s2a-mt-16" style={{ textAlign: "center" }}>
          Bastano 2 minuti · Nessun impegno
        </p>
      </div>
      <ChatBtn />
    </div>
  );

  // ── RESULT ───────────────────────────────────────────────────────────────────
  if (result) {
    const rec = result === "recommend" ? getRecommendation(answers) : null;
    return (
      <div className="s2a-onboarding">
        <div className="s2a-wrap-wide">
          <button className="s2a-btn s2a-btn--ghost s2a-mb-28" style={{ display: "inline-flex", alignItems: "center", gap: 6 }} onClick={restart}>
            <RotateCcw size={14} strokeWidth={2} /> Ricomincia
          </button>

          {result === "team_woo" && (
            <TeamContact icon={Wrench} title="Partiamo dalle basi"
              body="Store2App funziona con WooCommerce. Se non hai ancora un negozio, il team MGSQ può aiutarti a configurare tutto: dal sito all'app pubblicata."
              extras={[[ShoppingCart,"Setup WooCommerce"],[Palette,"Design del tema"],[Smartphone,"Pubblicazione app"],[Zap,"Supporto post-lancio"]]} />
          )}

          {result === "team_multi" && (
            <TeamContact icon={MonitorSmartphone} title="Parliamone insieme"
              body="Gestiamo un'app alla volta per garantire il massimo della qualità. Contattaci: troviamo insieme la soluzione per le tue app multiple." />
          )}

          {result === "recommend" && rec && (
            <div>
              <div className="s2a-text-center s2a-mb-28">
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: "rgba(41,171,226,0.1)", marginBottom: 16 }}>
                  <Target size={32} strokeWidth={1.5} style={{ color: "#29abe2" }} />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>Ecco il piano su misura per te</h2>
                <p className="s2a-lead" style={{ maxWidth: 440, margin: "0 auto" }}>{rec.recReason}</p>
                {rec.hasApp && (
                  <div className="s2a-info-box s2a-flex s2a-items-center s2a-gap-8" style={{ justifyContent: "center", marginTop: 14 }}>
                    <AlertTriangle size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
                    Hai un'app esistente? Il team MGSQ ti seguirà nella migrazione — contattaci dopo l'acquisto.
                  </div>
                )}
              </div>
              <PlanCard plan={rec.rec} recommended />
              {rec.alts.length > 0 && (
                <div className="s2a-mt-24">
                  <p className="s2a-eyebrow s2a-mb-12">Altre opzioni</p>
                  {rec.alts.map((a, i) => <AltCard key={i} plan={a.plan} reason={a.reason} />)}
                </div>
              )}
              {rec.setupNote && (
                <div className="s2a-setup-box s2a-flex s2a-gap-12">
                  <Package size={18} strokeWidth={1.75} style={{ color: "#29abe2", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 6px" }}>Setup account store</p>
                    <p className="s2a-text-sm" style={{ margin: 0 }}>{rec.setupNote}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <ChatBtn />
      </div>
    );
  }

  // ── WIZARD STEP ───────────────────────────────────────────────────────────────
  return (
    <div className="s2a-onboarding">
      <div className="s2a-wizard-layout">

        {/* Colonna sinistra */}
        <div className="s2a-wizard-main">
          <button className="s2a-btn s2a-btn--ghost s2a-mb-28" style={{ display: "inline-flex", alignItems: "center", gap: 6 }} onClick={goBack}>
            <ArrowLeft size={14} strokeWidth={2} /> Indietro
          </button>

          <ProgressBar current={stepIdx} total={totalSteps} />

          <div className="s2a-card s2a-animate-slide">
            <p className="s2a-eyebrow">{currentStep.label}</p>
            <h2 className="s2a-subtitle">{currentStep.question}</h2>

            {isMulti && (
              <p className="s2a-multi-hint">Puoi selezionare più opzioni</p>
            )}

            <div className="s2a-flex-col s2a-gap-10 s2a-mb-24">
              {currentStep.opts.map(opt =>
                isMulti ? (
                  <MultiOptionBtn
                    key={opt.v}
                    opt={opt}
                    selected={multiSel.includes(opt.v)}
                    onToggle={toggleMulti}
                    altroValue={altroText}
                    onAltroChange={setAltroText}
                  />
                ) : (
                  <OptionBtn key={opt.v} opt={opt} selected={selected === opt.v} onClick={setSelected} />
                )
              )}
            </div>

            <button
              className={`s2a-btn s2a-btn--primary s2a-btn--full${!canContinue ? " s2a-btn--disabled" : ""}`}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              onClick={goNext}
              disabled={!canContinue}
            >
              {stepIdx === totalSteps ? "Scopri il tuo piano" : "Continua"}
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Colonna destra — allineata alla card */}
        <div className="s2a-wizard-aside">
          <InsightPanel insight={currentStep.insight} />
        </div>

      </div>
      <ChatBtn />
    </div>
  );
}