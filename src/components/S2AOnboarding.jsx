"use client";

import { useState } from "react";
import {
  Rocket, Wrench, RefreshCw, Plus, Laptop, Handshake,
  Store, ClipboardList, Smartphone, MonitorSmartphone,
  Target, AlertTriangle, Package, ShoppingCart,
  Palette, Zap, CheckCircle2, ChevronRight,
  MessageCircle, ArrowLeft, RotateCcw, ExternalLink,
  Check, ShieldCheck, Gauge, Puzzle, Building2,
  GitBranch, Sparkles, LifeBuoy
} from "lucide-react";

// ─── PLAN DATA (unchanged) ─────────────────────────────────────────────────
const PLANS = {
  launch: {
    id: "launch", name: "Launch", badge: "MONTHLY", price: 79, unit: "month",
    desc: "The starter plan for those who manage things on their own.",
    features: ["1 build/month", "Unlimited renewals", "On-the-fly updates"],
    color: "#29abe2",
  },
  growth: {
    id: "growth", name: "Growth", badge: "MONTHLY", price: 149, unit: "month",
    desc: "More builds, more freedom to iterate.",
    features: ["3 builds/month", "Unlimited renewals", "On-the-fly updates"],
    color: "#9559ea",
  },
  launchYear: {
    id: "launchYear", name: "Launch Yearly", badge: "ANNUAL", price: 790, unit: "year",
    desc: "Annual plan with 2 extra builds included.",
    features: ["1 build/month", "2 extra builds included", "Unlimited renewals"],
    color: "#29abe2",
  },
  growthYear: {
    id: "growthYear", name: "Growth Yearly", badge: "ANNUAL", price: 1490, unit: "year",
    desc: "The choice of developers who iterate often.",
    features: ["3 builds/month", "4 extra builds included", "Unlimited renewals"],
    color: "#9559ea",
  },
  managedLaunch: {
    id: "managedLaunch", name: "Managed Launch", badge: "MANAGED", price: 449, discounted: 336.75, unit: "month",
    desc: "The MGSQ team handles everything for you, every month.",
    features: ["5 builds/month", "Full setup included", "Priority MGSQ support"],
    color: "#e06bbd",
  },
  managedLaunchYear: {
    id: "managedLaunchYear", name: "Managed Yearly", badge: "MANAGED", price: 4490, discounted: 3367.5, unit: "year",
    desc: "Maximum support for the whole year.",
    features: ["5 builds/month", "5 extra builds included", "App+Play+Firebase setup included"],
    color: "#e06bbd",
  },
};

// ─── FLAG → PLAN MAPPING ────────────────────────────────────────────────────
// DEV + NON  → autonomous developer  → Launch / Growth
// DIY + FIR  → guided developer      → Growth (middle ground)
// MNG + ALL  → fully managed         → Managed
function getPlanByFlags(level) {
  if (level === "DEV") {
    return {
      rec: PLANS.growthYear,
      recReason: "As an experienced developer, you can manage builds, updates and store submissions on your own. Growth Yearly gives you the most flexibility for frequent iterations.",
      alts: [
        { plan: PLANS.launchYear, reason: "If you're shipping a single app without frequent updates, Launch Yearly is more cost-effective." },
        { plan: PLANS.growth,     reason: "Prefer monthly flexibility without an annual commitment? Growth monthly gives you 3 builds/month." },
        { plan: PLANS.launch,     reason: "The most affordable monthly option — great for getting started and evaluating at your own pace." },
      ],
    };
  }
  if (level === "DIY") {
    return {
      rec: PLANS.growthYear,
      recReason: "You're a developer who may need some guidance along the way — Growth Yearly gives you room to iterate while our team provides documentation and support during setup.",
      alts: [
        { plan: PLANS.launchYear,        reason: "Launching a single app? Launch Yearly covers the essentials at a lower cost." },
        { plan: PLANS.growth,            reason: "Want monthly flexibility instead of an annual plan? Growth monthly works the same way." },
        { plan: PLANS.managedLaunchYear, reason: "If you'd rather have the team handle setup end-to-end, Managed Yearly removes the technical overhead entirely." },
      ],
    };
  }
  // MNG
  return {
    rec: PLANS.managedLaunchYear,
    recReason: "You'd like full assistance with store setup, app configuration and build uploads — Managed Yearly gives you complete end-to-end support at the best monthly cost.",
    alts: [
      { plan: PLANS.managedLaunch, reason: "Prefer not to commit annually? Managed Launch offers the same full support on a monthly basis, at a higher monthly cost." },
      { plan: PLANS.growthYear,    reason: "Want more autonomy and a lower price? Growth Yearly works if you're comfortable handling setup yourself." },
    ],
  };
}

// ─── INSIGHT PANEL ────────────────────────────────────────────────────────────
function InsightPanel({ insight }) {
  if (!insight) return null;
  return (
    <div className="s2a-insight">
      <p className="s2a-eyebrow s2a-mb-8">{insight.title}</p>
      <p className="s2a-text-sm" style={{ lineHeight: 1.75, margin: 0, whiteSpace: "pre-line" }}>{insight.body}</p>
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
      <p className="s2a-progress__label">Step {current} of {total}</p>
    </div>
  );
}

// ─── OPTION BUTTON ────────────────────────────────────────────────────────────
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

// ─── PLAN CARD ────────────────────────────────────────────────────────────────
function PlanCard({ plan, recommended = false }) {
  const displayPrice = plan.discounted ?? plan.price;
  return (
    <div className={`s2a-card s2a-mb-16${recommended ? " s2a-card--accent" : ""}`}>
      {recommended && <div className="s2a-ribbon">★ RECOMMENDED</div>}
      <div className="s2a-flex s2a-justify-between s2a-flex-wrap s2a-gap-8 s2a-mb-16">
        <div>
          <span className="s2a-badge s2a-mb-8" style={{ color: plan.color, background: `${plan.color}22` }}>{plan.badge}</span>
          <h3 style={{ margin: "8px 0 4px", fontSize: 20, fontWeight: 700 }}>{plan.name}</h3>
          <p className="s2a-text-sm" style={{ margin: 0 }}>{plan.desc}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          {plan.discounted && <p className="s2a-price--striked">€{plan.price.toLocaleString("en-US")}</p>}
          <p className="s2a-price" style={{ color: plan.color }}>€{displayPrice.toLocaleString("en-US")}</p>
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
          Get started with {plan.name} <ChevronRight size={16} strokeWidth={2.5} />
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
          <span style={{ fontWeight: 700, color: "#7a7a8a", fontSize: 14 }}>€{displayPrice.toLocaleString("en-US")}/{plan.unit}</span>
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
            Learn more about {plan.name} <ChevronRight size={14} strokeWidth={2.5} />
          </a>
        </div>
      )}
    </div>
  );
}

// ─── SALES CONTACT (generic "talk to our team") ───────────────────────────────
function SalesContact({ icon: Icon, title, body, extras }) {
  return (
    <div className="s2a-text-center">
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: "rgba(41,171,226,0.1)", marginBottom: 20 }}>
        <Icon size={32} strokeWidth={1.5} style={{ color: "#29abe2" }} />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>{title}</h2>
      <p className="s2a-lead" style={{ maxWidth: 420, margin: "0 auto 28px" }}>{body}</p>
      {extras && (
        <div className="s2a-card s2a-mb-20" style={{ textAlign: "left", maxWidth: 420, margin: "0 auto 20px" }}>
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
        Contact our team <ChevronRight size={16} strokeWidth={2.5} />
      </a>
    </div>
  );
}

// ─── CHAT BUTTON ──────────────────────────────────────────────────────────────
function ChatBtn() {
  return (
    <a href="https://woo2app.unlisted.mgsq.it/#contact" target="_blank" rel="noreferrer" className="s2a-chat-btn">
      <MessageCircle size={18} strokeWidth={1.75} />
      <span className="s2a-chat-label">Chat with us</span>
    </a>
  );
}

// ─── INSIGHT CONTENT (shared text blocks) ──────────────────────────────────────
const REQUIREMENTS_INSIGHT = {
  title: "Eligibility requirements",
  body:
    "To publish on the Apple App Store and Google Play Store you'll need:\n\n" +
    "• A valid Apple Developer Program account\n" +
    "• A Google Play Console developer account\n" +
    "• For Apple organizations: a registered legal entity and a D-U-N-S® Number\n" +
    "• A valid business identity (e.g. VAT number or equivalent registration)",
  link: { label: "Apple Developer Program details →", url: "https://developer.apple.com/programs/" },
};

const LEVEL_INSIGHT = {
  title: "Choosing your support level",
  body: "Developer (DEV): full autonomy, you handle everything yourself — tutorials available.\n\nGuided (DIY): you're technical, but we provide documentation and support along the way.\n\nManaged (MNG): we handle store setup, app configuration and build uploads end-to-end.",
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function S2AOnboarding() {
  const [screen, setScreen] = useState("landing");
  // screen values:
  // landing, q_has_app, q_app_action, q_setup_own_existing, q_eligible_new,
  // q_eligible_check, q_level, q_ecommerce, q_platform,
  // result, sales_update_app, sales_not_eligible, sales_platform

  const [history, setHistory] = useState([]); // for back navigation
  const [level, setLevel] = useState(null);   // DEV / DIY / MNG
  const [storeFlag, setStoreFlag] = useState(null); // WOO / LWW (informational)
  const [hasApp, setHasApp] = useState(null);

  const go = (next) => {
    setHistory(h => [...h, screen]);
    setScreen(next);
  };

  const goBack = () => {
    setHistory(h => {
      if (h.length === 0) { setScreen("landing"); return h; }
      const copy = [...h];
      const prev = copy.pop();
      setScreen(prev);
      return copy;
    });
  };

  const restart = () => {
    setHistory([]);
    setLevel(null);
    setStoreFlag(null);
    setHasApp(null);
    setScreen("landing");
  };

  // ── Step config: question screens ────────────────────────────────────────
  const SCREENS = {
    q_has_app: {
      label: "Existing app",
      question: "Do you already have a shopping app published on the app stores you're targeting?",
      insight: {
        title: "Why we ask",
        body: "By \"app stores\" we mean the Apple App Store and Google Play Store. If you've already published on one or both, we can move straight to the next step.",
      },
      opts: [
        { v: "yes", l: "Yes, I already have a published app", icon: CheckCircle2,
          next: () => { setHasApp(true); go("q_app_action"); } },
        { v: "no", l: "No, not yet", icon: Plus,
          next: () => { setHasApp(false); go("q_eligible_check"); } },
      ],
    },

    q_app_action: {
      label: "App setup",
      question: "Would you like to create a new app or update an existing one?",
      insight: REQUIREMENTS_INSIGHT,
      opts: [
        { v: "new", l: "Create a new app", icon: Sparkles,
          next: () => go("q_level") },
        { v: "update", l: "Update an existing app on the stores", icon: RefreshCw,
          next: () => go("q_setup_own_existing") },
        { v: "fresh", l: "I have existing accounts, but want new ones", icon: Plus,
          next: () => go("q_eligible_check") },
      ],
    },

    q_setup_own_existing: {
      label: "Migration support",
      question: "You'll need to contact our support team to manage the transition and manually configure the app IDs — but we can still proceed. Do you think you can handle the rest of the setup on your own?",
      insight: {
        title: "Heads up",
        body: "Updating an existing app requires our support team to configure the app IDs manually before launch. This doesn't block your plan choice — let's find the right support level for you.",
      },
      opts: [
        { v: "DEV", l: "I'm an experienced developer — I'll handle it independently", icon: Laptop,
          next: () => { setLevel("DEV"); go("q_ecommerce"); } },
        { v: "DIY", l: "I'm a developer, but may need some guidance", icon: Handshake,
          next: () => { setLevel("DIY"); go("q_ecommerce"); } },
        { v: "MNG", l: "I need help with stores, apps and build uploads", icon: LifeBuoy,
          next: () => { setLevel("MNG"); go("q_ecommerce"); } },
      ],
    },

    q_eligible_check: {
      label: "Eligibility",
      question: "No problem — we just need to verify you're eligible to publish on the app stores under current policies.",
      insight: REQUIREMENTS_INSIGHT,
      opts: [
        { v: "yes", l: "I meet these requirements", icon: CheckCircle2,
          next: () => go("q_level") },
        { v: "no", l: "I'm not sure / I don't meet these requirements", icon: Building2,
          next: () => go("sales_not_eligible") },
      ],
    },

    q_level: {
      label: "Your profile",
      question: "Do you think you can handle the technical setup on your own?",
      insight: LEVEL_INSIGHT,
      opts: [
        { v: "DEV", l: "I'm an experienced developer — I'll handle it independently", icon: Laptop,
          next: () => { setLevel("DEV"); go("q_ecommerce"); } },
        { v: "DIY", l: "I'm a developer, but may need some guidance along the way", icon: Handshake,
          next: () => { setLevel("DIY"); go("q_ecommerce"); } },
        { v: "MNG", l: "I need help with stores, apps and build uploads", icon: LifeBuoy,
          next: () => { setLevel("MNG"); go("q_ecommerce"); } },
      ],
    },

    q_ecommerce: {
      label: "E-commerce platform",
      question: "Do you already have an e-commerce website?",
      insight: {
        title: "About our plugin",
        body: "Our plugin is designed to work primarily with WooCommerce. If you're using another platform, we can help you migrate, synchronize your catalog, or set up a dedicated WooCommerce backend for your app.",
      },
      opts: [
        { v: "yes", l: "Yes, I have an e-commerce site", icon: ShoppingCart,
          next: () => go("q_platform") },
        { v: "no", l: "No, not yet", icon: Plus,
          next: () => go("q_platform_none") },
      ],
    },

    q_platform: {
      label: "Current platform",
      question: "Which platform are you currently using?",
      insight: {
        title: "Platform compatibility",
        body: "WooCommerce is fully supported out of the box. PrestaShop and Shopify can be integrated. Magento and other platforms require a custom evaluation from our sales team.",
      },
      opts: [
        { v: "woo", l: "WooCommerce", icon: CheckCircle2,
          next: () => { setStoreFlag("WOO"); go("result"); } },
        { v: "presta", l: "PrestaShop", icon: Puzzle,
          next: () => go("q_platform_action_presta") },
        { v: "shopify", l: "Shopify", icon: Puzzle,
          next: () => go("q_platform_action_shopify") },
        { v: "magento", l: "Magento", icon: AlertTriangle,
          next: () => go("sales_platform") },
        { v: "other", l: "Other platform", icon: ClipboardList,
          next: () => go("sales_platform") },
      ],
    },

    q_platform_action_presta: {
      label: "PrestaShop",
      question: "How would you like to proceed with your PrestaShop catalog?",
      insight: {
        title: "Your options",
        body: "We can migrate your catalog to WooCommerce, keep it synchronized, or set up a lightweight WooCommerce backend just for the app — free if used purely as a backend, from €10/month if used as a full storefront.",
      },
      opts: [
        { v: "migrate", l: "Migrate to WooCommerce", icon: RefreshCw, next: () => go("sales_platform") },
        { v: "sync", l: "Synchronize with WooCommerce", icon: GitBranch, next: () => go("sales_platform") },
        { v: "lww", l: "WooCommerce backend just for the app catalog", icon: Store,
          next: () => { setStoreFlag("LWW"); go("result"); } },
        { v: "diy", l: "I'll set up WooCommerce myself", icon: Laptop,
          next: () => { setStoreFlag("WOO"); go("result"); } },
        { v: "unsure", l: "Not sure", icon: ClipboardList, next: () => go("sales_platform") },
      ],
    },

    q_platform_action_shopify: {
      label: "Shopify",
      question: "How would you like to proceed with your Shopify catalog?",
      insight: {
        title: "Your options",
        body: "We can migrate your catalog to WooCommerce, keep it synchronized, or set up a lightweight WooCommerce backend just for the app — free if used purely as a backend, from €10/month if used as a full storefront.",
      },
      opts: [
        { v: "migrate", l: "Migrate to WooCommerce", icon: RefreshCw, next: () => go("sales_platform") },
        { v: "sync", l: "Synchronize with WooCommerce", icon: GitBranch, next: () => go("sales_platform") },
        { v: "lww", l: "WooCommerce backend just for the app catalog", icon: Store,
          next: () => { setStoreFlag("LWW"); go("result"); } },
        { v: "diy", l: "I'll set up WooCommerce myself", icon: Laptop,
          next: () => { setStoreFlag("WOO"); go("result"); } },
        { v: "unsure", l: "Not sure", icon: ClipboardList, next: () => go("sales_platform") },
      ],
    },

    q_platform_none: {
      label: "No website yet",
      question: "Let's see your options for setting up the e-commerce backend.",
      insight: {
        title: "Your options",
        body: "We offer a lightweight WooCommerce solution designed as a complementary service to Store2App — free when used only as a backend catalog, or from €10/month as a full storefront.",
      },
      opts: [
        { v: "lww", l: "WooCommerce backend just for the app catalog", icon: Store,
          next: () => { setStoreFlag("LWW"); go("result"); } },
        { v: "diy", l: "I'll set up WooCommerce myself", icon: Laptop,
          next: () => { setStoreFlag("WOO"); go("result"); } },
        { v: "unsure", l: "Not sure", icon: ClipboardList, next: () => go("sales_platform") },
      ],
    },
  };

  // ── LANDING ──────────────────────────────────────────────────────────────────
  if (screen === "landing") return (
    <div className="s2a-onboarding">
      <div className="s2a-wrap">
        <div className="s2a-tag s2a-mb-20">
          <Rocket size={13} strokeWidth={2} />
          GUIDED ONBOARDING
        </div>

        <h1 className="s2a-title s2a-mb-16">
          Your WooCommerce store,<br /><span>now a native app</span>
        </h1>

        <p className="s2a-lead s2a-mb-28">
          Store2App turns your WooCommerce shop into an iOS and Android app in minutes — no coding required. Real-time updates, push notifications, built-in analytics: everything you need to sell more, right in your customers' pocket.
        </p>

        <div className="s2a-landing-features s2a-mb-28">
          {[
            { icon: Gauge,       title: "Setup in 5 minutes",     desc: "Connect WooCommerce, choose your theme, publish. No developer required." },
            { icon: ShieldCheck, title: "Zero development cost",  desc: "No agency, no freelance dev. You only pay for your monthly or yearly plan." },
            { icon: Puzzle,      title: "100% customizable",      desc: "Fonts, colors, screens: fully adaptable to your brand with the drag & drop builder." },
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
          onClick={() => go("q_has_app")}
        >
          Find the right plan for you
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>

        <p className="s2a-text-sm s2a-mt-16" style={{ textAlign: "center" }}>
          Takes 2 minutes · No commitment
        </p>
      </div>
      <ChatBtn />
    </div>
  );

  // ── SALES CONTACT SCREENS ────────────────────────────────────────────────────
  if (screen === "sales_not_eligible") return (
    <div className="s2a-onboarding">
      <div className="s2a-wrap-wide">
        <button className="s2a-btn s2a-btn--ghost s2a-mb-28" style={{ display: "inline-flex", alignItems: "center", gap: 6 }} onClick={restart}>
          <RotateCcw size={14} strokeWidth={2} /> Start over
        </button>
        <SalesContact
          icon={Building2}
          title="Let's find the best solution together"
          body="No problem — our team can help you understand what's needed to become eligible for app store publishing, including business registration and D-U-N-S® setup if required."
        />
      </div>
      <ChatBtn />
    </div>
  );

  if (screen === "sales_platform") return (
    <div className="s2a-onboarding">
      <div className="s2a-wrap-wide">
        <button className="s2a-btn s2a-btn--ghost s2a-mb-28" style={{ display: "inline-flex", alignItems: "center", gap: 6 }} onClick={restart}>
          <RotateCcw size={14} strokeWidth={2} /> Start over
        </button>
        <SalesContact
          icon={GitBranch}
          title="Let's evaluate the best setup for you"
          body="Your platform or migration request needs a closer look from our team to recommend the best integration path with Store2App."
          extras={[[RefreshCw, "Catalog migration"], [GitBranch, "Catalog synchronization"], [Store, "Custom WooCommerce backend"]]}
        />
      </div>
      <ChatBtn />
    </div>
  );

  // ── RESULT ───────────────────────────────────────────────────────────────────
  if (screen === "result") {
    const { rec, recReason, alts } = getPlanByFlags(level);
    return (
      <div className="s2a-onboarding">
        <div className="s2a-wrap-wide">
          <button className="s2a-btn s2a-btn--ghost s2a-mb-28" style={{ display: "inline-flex", alignItems: "center", gap: 6 }} onClick={restart}>
            <RotateCcw size={14} strokeWidth={2} /> Start over
          </button>

          <div className="s2a-text-center s2a-mb-28">
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: "rgba(41,171,226,0.1)", marginBottom: 16 }}>
              <Target size={32} strokeWidth={1.5} style={{ color: "#29abe2" }} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>Here's the plan built for you</h2>
            <p className="s2a-lead" style={{ maxWidth: 460, margin: "0 auto" }}>{recReason}</p>

            {storeFlag === "LWW" && (
              <div className="s2a-info-box s2a-flex s2a-items-center s2a-gap-8" style={{ justifyContent: "center", marginTop: 14 }}>
                <Store size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
                Your lightweight WooCommerce backend is free as a catalog-only setup, or from €10/month as a full storefront.
              </div>
            )}
            {hasApp && (
              <div className="s2a-info-box s2a-flex s2a-items-center s2a-gap-8" style={{ justifyContent: "center", marginTop: 10 }}>
                <AlertTriangle size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
                Updating an existing app? Our support team will help configure the app IDs after signup.
              </div>
            )}
          </div>

          <PlanCard plan={rec} recommended />

          {alts.length > 0 && (
            <div className="s2a-mt-24">
              <p className="s2a-eyebrow s2a-mb-12">Other options</p>
              {alts.map((a, i) => <AltCard key={i} plan={a.plan} reason={a.reason} />)}
            </div>
          )}

          <div className="s2a-setup-box s2a-flex s2a-gap-12 s2a-mt-24">
            <Package size={18} strokeWidth={1.75} style={{ color: "#29abe2", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 6px" }}>Ready to proceed?</p>
              <p className="s2a-text-sm" style={{ margin: 0 }}>
                You can proceed directly with registration and payment, or get in touch with our sales team for more details before committing.
              </p>
            </div>
          </div>
        </div>
        <ChatBtn />
      </div>
    );
  }

  // ── GENERIC QUESTION SCREEN ────────────────────────────────────────────────────
  const current = SCREENS[screen];
  if (!current) return null;

  return (
    <div className="s2a-onboarding">
      <div className="s2a-wizard-layout">
        <div className="s2a-wizard-main">
          <button className="s2a-btn s2a-btn--ghost s2a-mb-28" style={{ display: "inline-flex", alignItems: "center", gap: 6 }} onClick={goBack}>
            <ArrowLeft size={14} strokeWidth={2} /> Back
          </button>

          <div className="s2a-card s2a-animate-slide">
            <p className="s2a-eyebrow">{current.label}</p>
            <h2 className="s2a-subtitle">{current.question}</h2>

            <div className="s2a-flex-col s2a-gap-10">
              {current.opts.map(opt => (
                <OptionBtn key={opt.v} opt={opt} selected={false} onClick={() => opt.next()} />
              ))}
            </div>
          </div>
        </div>

        <div className="s2a-wizard-aside">
          <InsightPanel insight={current.insight} />
        </div>
      </div>
      <ChatBtn />
    </div>
  );
}