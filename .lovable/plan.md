# LinguaBridge AI — Build Plan

A production-feel multilingual SaaS for translating text, documents/images, and voice between **Italian, English, and Urdu**, powered by real AI where possible.

## Visual direction

- **Palette (Neon Mint):** deep navy `#0d1b2a`, forest `#1b4332`, mint `#2dd4a8`, neon `#73ffb8`. Light mode uses soft off-whites with the same mint accents.
- Glassmorphism cards, soft gradient backgrounds, neon glow accents, rounded-2xl corners, elegant shadows.
- Modern sans-serif (Inter / Space Grotesk pairing), generous spacing, accessibility-first contrast.
- Framer Motion: fade/slide/scale page transitions, animated globe, floating language badges, particle background, waveforms, voice orb.
- Full **dark/light mode toggle** (default dark to showcase neon).
- Mobile-first responsive across all routes.

## Information architecture (TanStack routes)

Public:

- `/` — Landing (hero, features, how-it-works, languages, pricing teaser, footer)
- `/pricing` — Free / Pro / Enterprise comparison
- `/about`, `/api-docs`, `/docs`, `/features`
- `/login`, `/signup`, `/forgot-password`, `/reset-password`

Authenticated app (`/_authenticated/app/*`) with sidebar + topbar shell:

- `/app` — Home dashboard (recent activity, quick actions, usage widgets)
- `/app/text` — Text translator
- `/app/voice` — Voice translator
- `/app/conversation` — Live conversation mode (split screen)
- `/app/image` — Image / OCR translator
- `/app/document` — Document translator
- `/app/assistant` — AI assistant chat
- `/app/history` — Translation history timeline
- `/app/saved` — Saved files
- `/app/settings` — Profile, languages, voice, theme, notifications

Admin (role-gated):

- `/_authenticated/admin` — Analytics, usage charts, flagged content, subscriptions

## Functionality (real AI via Lovable AI Gateway)

All AI calls go through TanStack server functions (`createServerFn`) using the Lovable AI Gateway — no client-side keys.

- **Text translation + tone/grammar enhancement:** `google/gemini-3-flash-preview` with structured tool-calling output (translation, detected_lang, transliteration, suggestions).
- **AI assistant chat:** streaming SSE endpoint, markdown rendering, attachments (text only v1).
- **Image / document OCR + translation:** vision-capable model (`google/gemini-2.5-pro`) — image upload → extract text → translate → side-by-side preview with confidence score. PDFs parsed page-1 client-side preview, full text via server function.
- **Voice translation:** browser **Web Speech API** for speech recognition (it/en/ur) + **SpeechSynthesis** for playback. Translation step uses the text endpoint. Animated waveform from `MediaRecorder` analyser. Push-to-talk + auto-listen modes.
- **Live conversation mode:** two-speaker split UI, alternating recognize→translate→speak loop with live transcript bubbles.
- **History/saved/settings:** persisted per user in Lovable Cloud.

Graceful 429 / 402 toasts surfaced from the gateway.

## Authentication & data (Lovable Cloud)

- Email/password + Google sign-in (default Cloud providers). Note: GitHub/Microsoft shown in UI but disabled with tooltip ("connect Supabase to enable") — only Google is natively supported.
- `profiles` table (display name, avatar, preferred languages, theme, voice speed).
- `user_roles` table + `has_role()` security-definer function (admin gate).
- `translations` (history), `saved_items`, `conversations`, `messages` tables with RLS so each user only sees their own rows.
- Storage bucket `uploads` (private) for image/PDF uploads, signed URLs for preview.
- `_authenticated` layout route guards the app; `/admin` additionally checks `has_role(uid, 'admin')`.

## Module-by-module UX

**Landing** — animated globe (CSS/SVG), floating IT/EN/UR badges, particle bg, hero CTAs (Try Demo / Upload Document / Start Voice), feature grid with glass cards, "How it works" 3-step, languages section, pricing teaser, FAQ, footer with tech-stack visualization (animated connection diagram: React → Server Fns → AI Gateway → DB → Storage).

**Dashboard shell** — collapsible shadcn sidebar with icons + labels, sticky topbar (search, notifications, language selector, theme toggle, profile dropdown). Recent activity panel + quick-action tiles on `/app`.

**Text translator** — dual-panel, animated swap button, source/target language pickers, live char counter, auto-detect, tone selector chips (formal / casual / academic), copy/download/TTS/save actions, typing animation on output, transliteration toggle for Urdu.

**Image/OCR** — drag-and-drop with preview, scan-line animation overlay during OCR, side-by-side original vs translated, zoom/rotate controls, highlighted detected boxes (mocked overlay coords), confidence badge, export PDF (jsPDF).

**Document** — same flow tuned for PDFs, page list, per-page translation, downloadable translated copy.

**Voice** — animated voice orb (pulsing mint glow), live waveform, transcript stream, latency + confidence meters, mode toggle (live / push-to-talk / auto), language switch, speaker avatars.

**Conversation** — split screen with two language panels, alternating chat bubbles with translations underneath, live "speaking" indicator, conversation export.

**AI Assistant** — chat UI with streaming, suggested prompts ("Explain this Italian university letter", etc.), attachment chip, markdown + code block rendering.

**History** — timeline grouped by date, filters (language pair, type, starred), search, click to re-open in the matching translator.

**Settings** — tabbed: Profile, Languages, Voice (rate/pitch/voice picker), Appearance (theme), Notifications, API keys (mock generator).

**Pricing** — 3 animated tier cards (Free / Pro / Enterprise) with feature comparison table and CTA → signup.

**Admin** — recharts widgets: DAU, translations/day, AI spend estimate, top language pairs, storage usage, flagged items table, subscriptions list. Mock data seeded.

## Technical details

```text
src/
  routes/
    __root.tsx, index.tsx, pricing.tsx, about.tsx, features.tsx, api-docs.tsx, docs.tsx
    login.tsx, signup.tsx, forgot-password.tsx, reset-password.tsx
    _authenticated.tsx                  (auth gate via Supabase session)
    _authenticated/app.tsx              (sidebar + topbar layout)
    _authenticated/app/index.tsx, text.tsx, voice.tsx, conversation.tsx,
      image.tsx, document.tsx, assistant.tsx, history.tsx, saved.tsx, settings.tsx
    _authenticated/admin.tsx            (role-gated layout)
    _authenticated/admin/index.tsx
    api/public/...                      (none required v1)
  server/
    ai.functions.ts                     (translateText, ocrTranslate, assistantChat-stream, enhanceTone)
    history.functions.ts                (list/save/delete/star)
    uploads.functions.ts                (signed URL issue)
  components/
    layout/ (Sidebar, Topbar, ThemeToggle, AuthShell)
    landing/ (Hero, Globe, Features, HowItWorks, TechStack, PricingTeaser, Footer)
    translator/ (DualPanel, LangSelect, SwapButton, ToneChips, VoiceOrb, Waveform, OcrCanvas)
    chat/ (Bubble, Composer, Markdown)
    ui/ (existing shadcn)
  integrations/supabase/ (generated)
  hooks/ (useTheme, useSpeechRecognition, useSpeechSynthesis, useMediaWaveform)
```

- Lovable Cloud enabled; migrations create tables, RLS, `app_role` enum, `user_roles`, `has_role()`, storage bucket + policies, profile auto-creation trigger.
- Lovable AI Gateway used server-side; streaming SSE for assistant; tool-calling for structured translation output.
- Web Speech API behind a hook with feature detection + graceful fallback message on unsupported browsers.
- Framer Motion for transitions; recharts for admin charts; jsPDF for export; react-markdown for chat.

## Out of scope for v1 (mock-only UI surfaces)

These appear in the UI as polished mock screens / "coming soon" badges to stay honest about scope: pronunciation coach, offline mode, subtitle generator, browser extension, mobile sync, API marketplace, GitHub/Microsoft social login.

## Build approach

This is a large scope — I'll build it in one pass but expect iteration on the heavier modules (voice, OCR) after you try them. The first build will favor breadth and visual polish; we can deepen any module afterward.
