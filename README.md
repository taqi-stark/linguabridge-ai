# LinguaBridge AI

AI-powered multilingual translation and language-learning platform focused on communication between Italian, English, and Urdu.

LinguaBridge AI combines:

- context-aware translation
- OCR document processing
- push-to-talk voice interpretation
- translation memory
- AI-assisted language learning
- glossary locking
- structured document translation

The platform is designed for:

- students
- immigrants
- travelers
- multilingual professionals
- developers managing localization workflows

---

# Overview

LinguaBridge AI was built to solve a real-world problem:
traditional translators often fail when handling:

- technical terminology
- multilingual conversations
- structured localization files
- scanned documents
- language learning workflows

Instead of functioning as a simple text translator, LinguaBridge AI acts as a multilingual communication assistant capable of understanding translation context, preserving document structure, and helping users actively improve language proficiency.

---

# Screenshots

## Dashboard

![Dashboard Screenshot](./screenshots/dashboard.png)

## OCR Translation

![OCR Screenshot](./screenshots/ocr.png)

## Voice Interpreter

![Voice Interpreter Screenshot](./screenshots/interpreter.png)

## Roleplay Language Coach

![Roleplay Screenshot](./screenshots/roleplay.png)

---

# Core Features

| Feature                     | Description                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------- |
| Context-Aware Translation   | Translate between Italian, English, and Urdu using AI providers with tone-aware outputs |
| Translation Memory          | Reuses previous translations to reduce latency and API costs                            |
| OCR Translation             | Extracts and translates text from images and scanned documents                          |
| Push-to-Talk Interpreter    | Real-time bilingual voice translation interface                                         |
| Glossary Locking            | Prevents technical terms and placeholders from being mistranslated                      |
| Structured File Translation | Safely translates JSON, Markdown, TXT, and localization files                           |
| Roleplay Language Coach     | Interactive AI conversation scenarios for language learning                             |
| CEFR Progress Tracking      | Tracks proficiency progression from A1 to C2                                            |
| Offline History Access      | Cached translations and flashcards available offline                                    |
| PWA Support                 | Installable native-like web application experience                                      |

---

# Architecture

`````text
Frontend (TanStack Start + React)
                │
                ▼
        API Gateway Layer
                │
 ┌──────────────┼──────────────┐
 ▼              ▼              ▼
Translation   OCR Service   Speech Service
Service
 │              │              │
 ▼              ▼              ▼
AI Providers   OCR Engine   Whisper/WebSpeech
 │
 ├── Gemini
 ├── OpenAI
 ├── DeepL
 └── LibreTranslate

 ````md
# LinguaBridge AI

AI-powered multilingual translation and language-learning platform focused on communication between Italian, English, and Urdu.

LinguaBridge AI combines:
- context-aware translation
- OCR document processing
- push-to-talk voice interpretation
- translation memory
- AI-assisted language learning
- glossary locking
- structured document translation

The platform is designed for:
- students
- immigrants
- travelers
- multilingual professionals
- developers managing localization workflows

---

# Overview

LinguaBridge AI was built to solve a real-world problem:
traditional translators often fail when handling:
- technical terminology
- multilingual conversations
- structured localization files
- scanned documents
- language learning workflows

Instead of functioning as a simple text translator, LinguaBridge AI acts as a multilingual communication assistant capable of understanding translation context, preserving document structure, and helping users actively improve language proficiency.

---

# Screenshots

## Dashboard
![Dashboard Screenshot](./screenshots/dashboard.png)

## OCR Translation
![OCR Screenshot](./screenshots/ocr.png)

## Voice Interpreter
![Voice Interpreter Screenshot](./screenshots/interpreter.png)

## Roleplay Language Coach
![Roleplay Screenshot](./screenshots/roleplay.png)

---

# Core Features

| Feature | Description |
|---|---|
| Context-Aware Translation | Translate between Italian, English, and Urdu using AI providers with tone-aware outputs |
| Translation Memory | Reuses previous translations to reduce latency and API costs |
| OCR Translation | Extracts and translates text from images and scanned documents |
| Push-to-Talk Interpreter | Real-time bilingual voice translation interface |
| Glossary Locking | Prevents technical terms and placeholders from being mistranslated |
| Structured File Translation | Safely translates JSON, Markdown, TXT, and localization files |
| Roleplay Language Coach | Interactive AI conversation scenarios for language learning |
| CEFR Progress Tracking | Tracks proficiency progression from A1 to C2 |
| Offline History Access | Cached translations and flashcards available offline |
| PWA Support | Installable native-like web application experience |

---

# Architecture

```text
Frontend (TanStack Start + React)
                │
                ▼
        API Gateway Layer
                │
 ┌──────────────┼──────────────┐
 ▼              ▼              ▼
Translation   OCR Service   Speech Service
Service
 │              │              │
 ▼              ▼              ▼
AI Providers   OCR Engine   Whisper/WebSpeech
 │
 ├── Gemini
 ├── OpenAI
 ├── DeepL
 └── LibreTranslate
`````

---

# Translation Engine

LinguaBridge AI uses a multi-provider translation routing system.

The backend dynamically selects providers depending on:

- translation complexity
- latency
- API availability
- estimated cost
- document type

### Supported Providers

- Gemini
- OpenAI
- DeepL
- LibreTranslate

### Translation Modes

- Formal
- Casual
- Academic
- Neutral

### Additional Features

- translation confidence scores
- alternate phrasing suggestions
- transliteration support
- protected term locking

---

# Translation Memory System

To improve speed and consistency, LinguaBridge AI includes a Translation Memory (TM) layer.

The system:

- caches previous translations
- reduces repeated API calls
- improves response times
- lowers token usage costs
- maintains terminology consistency

Example:

```json
{
  "Submit Application": "Invia domanda"
}
```

Previously translated phrases can be reused automatically.

---

# Structured Document Translation

LinguaBridge AI safely translates:

- JSON files
- Markdown files
- TXT documents
- localization files

without breaking formatting or placeholders.

### Placeholder Protection

The system automatically protects:

- `{username}`
- `{{variables}}`
- `%s`
- markdown links
- XML tags
- code blocks

before translation processing begins.

Example:

```json
{
  "welcome": "Hello {username}"
}
```

The placeholder remains structurally preserved after translation.

---

# OCR Translation

The OCR pipeline supports:

- PNG
- JPG
- PDF
- scanned documents

### OCR Workflow

1. Image preprocessing
2. Noise reduction
3. Skew correction
4. OCR extraction
5. Language detection
6. Translation
7. Confidence analysis

### OCR Features

- editable extracted text
- confidence scoring
- uncertain region highlighting
- handwritten vs printed detection

---

# Push-to-Talk Voice Interpreter

LinguaBridge AI includes a bilingual Push-to-Talk (PTT) interpreter mode.

### Workflow

1. User holds microphone button
2. Speech is recorded
3. Audio is transcribed
4. Translation is generated
5. Translated speech is played back

### Features

- live subtitles
- speech confidence meter
- bilingual transcript history
- text-to-speech playback
- reconnect handling

---

# Roleplay Language Coach

The Roleplay Coach provides interactive language-learning scenarios.

### Example Scenarios

- ordering food
- airport conversations
- university admissions
- immigration interviews
- train stations
- hospital visits

### Learning Features

- CEFR level tracking
- pronunciation scoring
- grammar correction hints
- vocabulary difficulty analysis
- spaced repetition integration

The AI remains primarily in the target language while subtly guiding the learner.

---

# Offline Support

LinguaBridge AI supports offline access for:

- saved translations
- flashcards
- cached history
- downloaded documents

Offline functionality is powered by:

- IndexedDB
- service workers
- PWA caching

> Note: AI translation itself still requires an internet connection.

---

# Tech Stack

| Category           | Technology                  |
| ------------------ | --------------------------- |
| Frontend           | TanStack Start + React      |
| Styling            | TailwindCSS                 |
| Animations         | Framer Motion               |
| Backend            | Edge Server Functions       |
| Authentication     | Supabase Auth               |
| Database           | Supabase PostgreSQL         |
| AI Providers       | Gemini, OpenAI, DeepL       |
| Speech Recognition | Whisper / WebSpeech API     |
| OCR                | EasyOCR / Tesseract         |
| Storage            | Supabase Storage            |
| Offline Support    | Service Workers + IndexedDB |

---

# Security Features

LinguaBridge AI includes:

- JWT authentication
- protected API routes
- upload validation
- prompt sanitization
- glossary sanitization
- placeholder protection
- rate limiting
- secure edge middleware

---

# API Endpoints

## Translate Text

```http
POST /api/translate
```

## OCR Translation

```http
POST /api/ocr
```

## Voice Transcription

```http
POST /api/voice/transcribe
```

## Save Translation

```http
POST /api/history/save
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/linguabridge-ai.git
cd linguabridge-ai
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
DEEPL_API_KEY=your_deepl_key
```

---

## Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Deployment

Recommended platforms:

| Service    | Usage                 |
| ---------- | --------------------- |
| Vercel     | Frontend deployment   |
| Railway    | Backend deployment    |
| Supabase   | Database/Auth/Storage |
| Cloudflare | CDN and edge caching  |

---

# Current Limitations

- OCR accuracy depends heavily on image quality
- Voice translation may experience latency on slow networks
- Offline mode only supports cached content
- Translation quality varies between providers
- Realtime interpreter mode is optimized for short conversations

---

# Roadmap

## Phase 1

- [x] Context-aware translation
- [x] Translation memory
- [x] Glossary locking
- [x] OCR translation

## Phase 2

- [x] Push-to-talk voice interpreter
- [x] Roleplay language coach
- [x] CEFR tracking

## Phase 3

- [ ] Realtime streaming interpreter
- [ ] Subtitle generation
- [ ] Collaborative translation workspace
- [ ] Mobile application

## Phase 4

- [ ] AI pronunciation analysis
- [ ] Advanced analytics dashboard
- [ ] Team translation memory sharing

---

# Why This Project Exists

LinguaBridge AI was inspired by the communication barriers faced by:

- students moving abroad
- immigrants handling foreign-language documents
- travelers
- multilingual professionals
- developers localizing software products

The goal is to create a practical multilingual assistant that combines AI translation, education, and accessibility into a single platform.

---

# Contributing

Pull requests, suggestions, and improvements are welcome.

If you would like to contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

# License

MIT License

---

# Author

Built by Ali Taqi.

Focused on AI-powered multilingual communication, translation systems, and language accessibility.

```

```
