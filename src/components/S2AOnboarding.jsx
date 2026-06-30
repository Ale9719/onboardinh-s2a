"use client";

import { useState } from "react";
import {
  Rocket, Wrench, RefreshCw, Plus, Laptop, Handshake,
  Store, ClipboardList, Smartphone, MonitorSmartphone,
  Target, AlertTriangle, Package, ShoppingCart,
  Palette, Zap, CheckCircle2, ChevronRight,
  MessageCircle, ArrowLeft, RotateCcw, ExternalLink,
  Building2, GitBranch, Sparkles, LifeBuoy, HelpCircle,
  ShieldCheck, Gauge, Puzzle
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

// ─── FLAG LEVEL → PLAN MAPPING ──────────────────────────────────────────────
function getLevelPlan(level) {
  if (level === "DEV") {
    return {
      rec: PLANS.growthYear,
      recReason: "Developer level (DEV): autonomous setup, full control. Best for experienced developers.",
      alts: [
        { plan: PLANS.launchYear, reason: "Shipping a single app without frequent updates? Launch Yearly is more cost-effective." },
        { plan: PLANS.growth,     reason: "Prefer monthly billing without an annual commitment? Growth monthly gives you 3 builds/month." },
        { plan: PLANS.launch,     reason: "The most affordable monthly option — great for getting started." },
      ],
    };
  }
  if (level === "DIY") {
    return {
      rec: PLANS.growthYear,
      recReason: "DIY level: guided setup with documentation and support during the process.",
      alts: [
        { plan: PLANS.launchYear,        reason: "Launching a single app? Launch Yearly covers the essentials at a lower cost." },
        { plan: PLANS.growth,            reason: "Want monthly flexibility instead of an annual plan? Growth monthly works the same way." },
        { plan: PLANS.managedLaunchYear, reason: "Would rather have the team handle setup end-to-end? Managed Yearly removes the technical overhead entirely." },
      ],
    };
  }
  // MNG
  return {
    rec: PLANS.managedLaunchYear,
    recReason: "Managed level: full assistance with store setup, app configuration, and build uploads.",
    alts: [
      { plan: PLANS.managedLaunch, reason: "Prefer not to commit annually? Managed Launch offers the same full support on a monthly basis." },
      { plan: PLANS.growthYear,    reason: "Want more autonomy and a lower price? Growth Yearly works if you're comfortable handling setup yourself." },
    ],
  };
}

const SETUP_COPY = {
  NON: { title: "Setup: fully independent", body: "You proceed independently with full control over the technical setup." },
  FIR: { title: "Setup: Firebase included",  body: "We can set up Firebase for you, so you can focus on the rest of the configuration." },
  ALL: { title: "Setup: fully managed",       body: "We can help you set up everything — stores, app configuration, and build uploads." },
};

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

// ─── OPTION BUTTON (direct-navigation style) ───────────────────────────────────
function OptionBtn({ opt, onClick }) {
  const Icon = opt.icon;
  return (
    <button className="s2a-opt" onClick={() => onClick(opt)}>
      <span className="s2a-opt__dot" />
      <Icon size={18} strokeWidth={1.75} style={{ flexShrink: 0, color: "#7a7a8a" }} />
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
          <p style={{ fontWeight: 600, fontSize: 16, margin: "2px 0 0" }}>{plan.name}</p>
        </div>
        <div className="s2a-flex s2a-items-center s2a-gap-12">
          <span style={{ fontWeight: 700, color: "#5a5a66", fontSize: 16 }}>€{displayPrice.toLocaleString("en-US")}/{plan.unit}</span>
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

// ─── SALES CONTACT ────────────────────────────────────────────────────────────
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
              <span style={{ fontSize: 16 }}>{t}</span>
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

function ChatBtn() {
  return (
    <a href="https://woo2app.unlisted.mgsq.it/#contact" target="_blank" rel="noreferrer" className="s2a-chat-btn">
      <MessageCircle size={18} strokeWidth={1.75} />
      <span className="s2a-chat-label">Chat with us</span>
    </a>
  );
}

// ─── SHARED INSIGHT TEXT ────────────────────────────────────────────────────────
const DEV_ACCOUNTS_INSIGHT = {
  title: "Developer accounts checklist",
  body:
    "Apple App Store: you'll need an active Apple Developer Program membership. If publishing as a company, Apple requires a valid D-U-N-S® Number and a registered legal entity.\n\n" +
    "Google Play Store: you'll need an active Google Play Console developer account.",
  link: { label: "Apple Developer Program details →", url: "https://developer.apple.com/programs/" },
};

const ELIGIBILITY_INSIGHT = {
  title: "Eligibility requirements",
  body:
    "To publish on the Apple App Store and Google Play Store you'll need:\n\n" +
    "• A valid Apple Developer Program account\n" +
    "• A Google Play Console developer account\n" +
    "• For Apple organizations: a registered legal entity and a D-U-N-S® Number\n" +
    "• A valid business identity (e.g. VAT number or equivalent registration)",
};

const LEVEL_INSIGHT = {
  title: "Choosing your support level",
  body: "Developer (DEV): full autonomy, you handle everything yourself — tutorials available.\n\nGuided (DIY): you're technical, but we provide documentation and support along the way.\n\nManaged (MNG): we handle store setup, app configuration and build uploads end-to-end.",
};

// Reusable "level" options — used in 1.1.1, 1.1.2, 1.2.1, 1.3.1
function levelOptions(setFlags, goNext) {
  return [
    { v: "DEV", l: "I'm an experienced developer — I can proceed with the setup independently", icon: Laptop,
      action: () => { setFlags({ level: "DEV", setup: "NON" }); goNext("q2_ecommerce"); } },
    { v: "DIY", l: "I'm a developer, but I may need some guidance along the way", icon: Handshake,
      action: () => { setFlags({ level: "DIY", setup: "FIR" }); goNext("q2_ecommerce"); } },
    { v: "MNG", l: "I need help setting up the stores and apps and uploading the builds", icon: LifeBuoy,
      action: () => { setFlags({ level: "MNG", setup: "ALL" }); goNext("q2_ecommerce"); } },
  ];
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function S2AOnboarding() {
  const [screen, setScreen] = useState("landing");
  const [history, setHistory] = useState([]);
  const [flags, setFlagsState] = useState({ level: null, setup: null, store: null });

  const setFlags = (partial) => setFlagsState(f => ({ ...f, ...partial }));

  const goNext = (next) => {
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
    setFlagsState({ level: null, setup: null, store: null });
    setScreen("landing");
  };

  // ── SCREEN DEFINITIONS, following document numbering ──────────────────────

  const SCREENS = {

    // 1. Root question
    q1_has_app: {
      label: "1 · Existing app",
      question: "Do you already have a shopping app published on the app stores you're targeting?",
      insight: {
        title: "Why we ask",
        body: "By \"app stores\" we mean the Google Play Store for Android and the Apple App Store for iPhone and iPad. If you've already published on one or both, select Yes.",
      },
      opts: [
        { v: "yes", l: "Yes, my app is already published", icon: CheckCircle2,
          action: () => goNext("q1_1_app_action") },
        { v: "new_accounts", l: "I want to create new developer accounts", icon: Plus,
          action: () => { setFlags({ setup: "ALL" }); goNext("q1_2_eligible"); } },
        { v: "no", l: "No, not yet", icon: HelpCircle,
          action: () => { setFlags({ setup: "ALL" }); goNext("q1_3_eligible"); } },
      ],
    },

    // 1.1 → Yes: dev accounts reminder, then new vs update vs fresh accounts
    q1_1_app_action: {
      label: "1.1 · App setup",
      question: "Great! Since you already have an app published, make sure your developer accounts are fully configured. Would you like to create a new app or update an existing one?",
      insight: DEV_ACCOUNTS_INSIGHT,
      opts: [
        { v: "create", l: "Create a new app — this is my first one with Store2App", icon: Sparkles,
          action: () => goNext("q1_1_1_level") },
        { v: "update", l: "Update an existing app to replace it with a Store2App version", icon: RefreshCw,
          action: () => goNext("q1_1_2_level") },
        { v: "fresh", l: "I have existing accounts, but want to create new ones instead", icon: Plus,
          action: () => { setFlags({ setup: "ALL" }); goNext("q1_2_eligible"); } },
      ],
    },

    // 1.1.1 Create new app → level questions
    q1_1_1_level: {
      label: "1.1.1 · Your profile",
      question: "Perfect, let's move to the next step. Do you think you can handle the setup on your own?",
      insight: LEVEL_INSIGHT,
      opts: levelOptions(setFlags, goNext),
    },

    // 1.1.2 Update existing app → support note + level questions
    q1_1_2_level: {
      label: "1.1.2 · Migration support",
      question: "You will need to contact our support team to manage the transition and manually configure the app IDs, but we can still proceed. Do you think you can handle the setup on your own?",
      insight: {
        title: "Heads up",
        body: "Updating an existing app requires our support team to configure the app IDs manually before launch. This doesn't block your plan choice.",
      },
      opts: levelOptions(setFlags, goNext),
    },

    // 1.2 → "I want new accounts": eligibility check
    q1_2_eligible: {
      label: "1.2 · Eligibility",
      question: "No problem. We just need to verify that you are eligible to publish on the app stores according to current policies.",
      insight: ELIGIBILITY_INSIGHT,
      opts: [
        { v: "yes", l: "I fall into this category — I meet these requirements", icon: CheckCircle2,
          action: () => goNext("q1_2_1_level") },
        { v: "no", l: "Not applicable — I don't meet these requirements", icon: Building2,
          action: () => goNext("sales_not_eligible") },
      ],
    },

    // 1.2.1 Eligible (from 1.2) → level questions
    q1_2_1_level: {
      label: "1.2.1 · Your profile",
      question: "You're almost there — configuring the app itself is simple, but setting up app store accounts and submissions can be more complex. Do you think you can handle the setup on your own?",
      insight: LEVEL_INSIGHT,
      opts: levelOptions(setFlags, goNext),
    },

    // 1.3 → "No": eligibility check
    q1_3_eligible: {
      label: "1.3 · Eligibility",
      question: "No problem — we just need to verify that you are eligible to publish on the app stores according to current policies.",
      insight: ELIGIBILITY_INSIGHT,
      opts: [
        { v: "yes", l: "I fall into this category — I meet these requirements", icon: CheckCircle2,
          action: () => goNext("q1_3_1_level") },
        { v: "no", l: "Not applicable — I don't meet these requirements", icon: Building2,
          action: () => goNext("sales_not_eligible") },
      ],
    },

    // 1.3.1 Eligible (from 1.3) → level questions
    q1_3_1_level: {
      label: "1.3.1 · Your profile",
      question: "You're almost there — configuring the app itself is simple, but setting up app store accounts and submissions can be more complex. Do you think you can handle the setup on your own?",
      insight: LEVEL_INSIGHT,
      opts: levelOptions(setFlags, goNext),
    },

    // 2. E-commerce question (always reached after FLAG_LEVEL is set)
    q2_ecommerce: {
      label: "2 · E-commerce platform",
      question: "Do you already have an e-commerce website?",
      insight: {
        title: "About our plugin",
        body: "Our plugin is designed to work primarily with WooCommerce. If you're using another platform, we can help you migrate, synchronize your catalog, or set up a dedicated WooCommerce backend for your app.",
      },
      opts: [
        { v: "yes", l: "Yes, I have an e-commerce site", icon: ShoppingCart,
          action: () => goNext("q2_1_platform") },
        { v: "no", l: "No, not yet", icon: Plus,
          action: () => goNext("q2_2_none") },
      ],
    },

    // 2.1 Yes → which platform
    q2_1_platform: {
      label: "2.1 · Current platform",
      question: "Great — our plugin is designed to work primarily with WooCommerce. Which platform are you currently using?",
      insight: {
        title: "Platform compatibility",
        body: "WooCommerce is fully supported out of the box (2.1.1). PrestaShop (2.1.2) and Shopify (2.1.3) can be integrated. Magento (2.1.4) and other platforms (2.1.5) require a custom evaluation from our sales team.",
      },
      opts: [
        { v: "woo", l: "WooCommerce", icon: CheckCircle2,
          action: () => { setFlags({ store: "WOO" }); goNext("result"); } },
        { v: "presta", l: "PrestaShop", icon: Puzzle,
          action: () => goNext("q2_1_2_presta") },
        { v: "shopify", l: "Shopify", icon: Puzzle,
          action: () => goNext("q2_1_3_shopify") },
        { v: "magento", l: "Magento", icon: AlertTriangle,
          action: () => goNext("sales_magento") },
        { v: "other", l: "Other platform", icon: ClipboardList,
          action: () => goNext("sales_other") },
      ],
    },

    // 2.1.2 PrestaShop sub-options
    q2_1_2_presta: {
      label: "2.1.2 · PrestaShop",
      question: "Ok, we can work with it. How would you like to proceed?",
      insight: {
        title: "Your options",
        body: "We can migrate your catalog to WooCommerce, keep it synchronized, or set up a lightweight WooCommerce backend just for the app — free as a backend, from €10/month as a full storefront.",
      },
      opts: [
        { v: "migrate", l: "Interested in migrating to WooCommerce", icon: RefreshCw, action: () => goNext("sales_presta_migrate") },
        { v: "sync", l: "Interested in synchronizing with WooCommerce", icon: GitBranch, action: () => goNext("sales_presta_sync") },
        { v: "lww", l: "I'd like a WooCommerce backend just for the app catalog", icon: Store,
          action: () => { setFlags({ store: "LWW" }); goNext("result"); } },
        { v: "diy", l: "I will create a WooCommerce site myself", icon: Laptop,
          action: () => { setFlags({ store: "WOO" }); goNext("result"); } },
        { v: "unsure", l: "Not sure", icon: ClipboardList, action: () => goNext("sales_presta_unsure") },
      ],
    },

    // 2.1.3 Shopify sub-options
    q2_1_3_shopify: {
      label: "2.1.3 · Shopify",
      question: "Ok, we can work with it. How would you like to proceed?",
      insight: {
        title: "Your options",
        body: "We can migrate your catalog to WooCommerce, keep it synchronized, or set up a lightweight WooCommerce backend just for the app — free as a backend, from €10/month as a full storefront.",
      },
      opts: [
        { v: "migrate", l: "Interested in migrating to WooCommerce", icon: RefreshCw, action: () => goNext("sales_shopify_migrate") },
        { v: "sync", l: "Interested in synchronizing with WooCommerce", icon: GitBranch, action: () => goNext("sales_shopify_sync") },
        { v: "lww", l: "I'd like a WooCommerce backend just for the app catalog", icon: Store,
          action: () => { setFlags({ store: "LWW" }); goNext("result"); } },
        { v: "diy", l: "I will create a WooCommerce site myself", icon: Laptop,
          action: () => { setFlags({ store: "WOO" }); goNext("result"); } },
        { v: "unsure", l: "Not sure", icon: ClipboardList, action: () => goNext("sales_shopify_unsure") },
      ],
    },

    // 2.2 No e-commerce yet
    q2_2_none: {
      label: "2.2 · No website yet",
      question: "Ok — let's explore your options.",
      insight: {
        title: "Your options",
        body: "We offer a lightweight WooCommerce solution designed as a complementary service to Store2App — free when used only as a backend catalog, or from €10/month as a full storefront.",
      },
      opts: [
        { v: "lww", l: "I'd like a WooCommerce backend just for the app catalog", icon: Store,
          action: () => { setFlags({ store: "LWW" }); goNext("result"); } },
        { v: "diy", l: "I will create a WooCommerce site myself", icon: Laptop,
          action: () => { setFlags({ store: "WOO" }); goNext("result"); } },
        { v: "unsure", l: "Not sure", icon: ClipboardList, action: () => goNext("sales_none_unsure") },
      ],
    },
  };

  // ── SALES SCREENS (all "contact our team" branches) ───────────────────────
  const SALES_SCREENS = {
    sales_not_eligible: {
      icon: Building2,
      title: "Let's find the best solution together",
      body: "In this case, please contact our team — we'll help you understand what's needed to become eligible for app store publishing, including business registration and D-U-N-S® setup if required.",
    },
    sales_magento: {
      icon: AlertTriangle,
      title: "Let's evaluate your Magento setup",
      body: "Please contact our sales team so we can evaluate the best solution for your Magento setup.",
    },
    sales_other: {
      icon: ClipboardList,
      title: "Tell us more about your platform",
      body: "Please contact our sales team and share more details about your current platform so we can find the best integration path.",
    },
    sales_presta_migrate: {
      icon: RefreshCw,
      title: "Let's plan your migration",
      body: "Please contact our sales team to plan migrating your PrestaShop catalog to WooCommerce.",
    },
    sales_presta_sync: {
      icon: GitBranch,
      title: "Let's plan your synchronization",
      body: "Please contact our sales team to set up catalog synchronization between PrestaShop and WooCommerce.",
    },
    sales_presta_unsure: {
      icon: ClipboardList,
      title: "Let's figure it out together",
      body: "No problem — contact our sales team and we'll help you choose the best path for your PrestaShop store.",
    },
    sales_shopify_migrate: {
      icon: RefreshCw,
      title: "Let's plan your migration",
      body: "Please contact our sales team to plan migrating your Shopify catalog to WooCommerce.",
    },
    sales_shopify_sync: {
      icon: GitBranch,
      title: "Let's plan your synchronization",
      body: "Please contact our sales team to set up catalog synchronization between Shopify and WooCommerce.",
    },
    sales_shopify_unsure: {
      icon: ClipboardList,
      title: "Let's figure it out together",
      body: "No problem — contact our sales team and we'll help you choose the best path for your Shopify store.",
    },
    sales_none_unsure: {
      icon: HelpCircle,
      title: "Let's figure it out together",
      body: "No problem — contact our sales team and we'll help you choose the best e-commerce setup for your app.",
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
                <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 4px", color: "#333" }}>{title}</p>
                <p className="s2a-text-sm" style={{ margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="s2a-btn s2a-btn--primary s2a-btn--full"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          onClick={() => goNext("q1_has_app")}
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
  if (SALES_SCREENS[screen]) {
    const s = SALES_SCREENS[screen];
    return (
      <div className="s2a-onboarding">
        <div className="s2a-wrap-wide">
          <button className="s2a-btn s2a-btn--ghost s2a-mb-28" style={{ display: "inline-flex", alignItems: "center", gap: 6 }} onClick={restart}>
            <RotateCcw size={14} strokeWidth={2} /> Start over
          </button>
          <SalesContact icon={s.icon} title={s.title} body={s.body} />
        </div>
        <ChatBtn />
      </div>
    );
  }

  // ── RESULT (section 3 + section 4 combined) ──────────────────────────────────
  if (screen === "result") {
    const { rec, recReason, alts } = getLevelPlan(flags.level);
    const setupInfo = SETUP_COPY[flags.setup] || SETUP_COPY.NON;

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
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>
              Perfect — let's get started. We've identified this option for you:
            </h2>
            <p className="s2a-lead" style={{ maxWidth: 460, margin: "0 auto" }}>{recReason}</p>

            {flags.store === "LWW" && (
              <div className="s2a-info-box s2a-flex s2a-items-center s2a-gap-8" style={{ justifyContent: "center", marginTop: 14 }}>
                <Store size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
                Your lightweight WooCommerce backend is free as a catalog-only setup, or from €10/month as a full storefront.
              </div>
            )}
          </div>

          <PlanCard plan={rec} recommended />

          {alts.length > 0 && (
            <div className="s2a-mt-24 s2a-mb-24">
              <p className="s2a-eyebrow s2a-mb-12">Would you like to see other available options?</p>
              {alts.map((a, i) => <AltCard key={i} plan={a.plan} reason={a.reason} />)}
            </div>
          )}

          {/* Section 4 — FLAG SETUP upsell, shown together with the plan */}
          <div className="s2a-setup-box s2a-flex s2a-gap-12">
            <Package size={18} strokeWidth={1.75} style={{ color: "#29abe2", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 6px" }}>{setupInfo.title}</p>
              <p className="s2a-text-sm" style={{ margin: 0 }}>{setupInfo.body}</p>
            </div>
          </div>

          {/* Section 5 — final CTA */}
          <div className="s2a-card s2a-mt-24" style={{ textAlign: "center" }}>
            <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 18px" }}>
              Would you like to proceed with registration and payment, or be contacted by our sales team for more details?
            </p>
            <div className="s2a-flex s2a-gap-10 s2a-flex-wrap" style={{ justifyContent: "center" }}>
              <a href="https://woo2app.unlisted.mgsq.it" target="_blank" rel="noreferrer"
                className="s2a-btn s2a-btn--primary"
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                Proceed with registration <ChevronRight size={16} strokeWidth={2.5} />
              </a>
              <a href="https://woo2app.unlisted.mgsq.it/#contact" target="_blank" rel="noreferrer"
                className="s2a-btn"
                style={{ border: "1.5px solid rgba(41,171,226,0.3)", color: "#29abe2", display: "inline-flex", alignItems: "center", gap: 6 }}>
                Contact sales team
              </a>
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
                <OptionBtn key={opt.v} opt={opt} onClick={() => opt.action()} />
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