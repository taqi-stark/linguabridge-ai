import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Globe2 } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/pricing")({ component: Pricing });

const tiers = [
  {
    name: "Free",
    price: "€0",
    desc: "For trying it out",
    features: ["100 translations/mo", "Text + Voice", "Italian · English · Urdu"],
  },
  {
    name: "Pro",
    price: "€12",
    desc: "For everyday use",
    featured: true,
    features: ["Unlimited text", "OCR + Documents", "AI Assistant", "History & saved items"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For teams & API",
    features: ["API access", "SSO", "Dedicated support", "Volume pricing"],
  },
];

function Pricing() {
  return (
    <div className="min-h-screen">
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Globe2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold">LinguaBridge AI</span>
        </Link>
        <Link
          to="/signup"
          className="text-sm rounded-full bg-primary text-primary-foreground text-primary-foreground px-4 py-2 shadow-sm"
        >
          Get started
        </Link>
      </header>
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-4xl sm:text-6xl">Simple, transparent pricing</h1>
        <p className="text-muted-foreground mt-3">Start free. Upgrade when you need more.</p>
        <div className="grid md:grid-cols-3 gap-5 mt-12 text-left">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl p-7 ${t.featured ? "bg-card shadow-sm ring-1 ring-primary/40" : "bg-card"}`}
            >
              {t.featured && (
                <div className="text-xs bg-primary text-primary-foreground text-primary-foreground rounded-full px-2 py-0.5 inline-block mb-3">
                  Most popular
                </div>
              )}
              <h3 className="font-display text-2xl">{t.name}</h3>
              <div className="mt-2 text-4xl font-display">
                {t.price}
                <span className="text-base text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`mt-6 block text-center rounded-full px-4 py-2.5 ${t.featured ? "bg-primary text-primary-foreground text-primary-foreground shadow-sm" : "bg-card"}`}
              >
                Get started
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
