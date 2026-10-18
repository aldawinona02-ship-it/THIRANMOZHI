# Thiranmozhi 
> **"Learning that understands every child."**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Thiranmozhi** is a multi-sensory, inclusive web application tailored specifically for neurodivergent children diagnosed with **Autism**, **ADHD**, **Dyslexia**, and **Intellectual & Developmental Disabilities (IDD)**. 

Through gamified assessments, customizable sensory settings, and interactive letter-tracing journeys, it adapts each lesson to the child's unique sensory and learning preferences (**Visual, Auditory, and Kinesthetic — VAK**).

---

## ✨ Features

### 1. 🧩 Tailored Child Onboarding
- **Personalized Profile Creation**: Customize learning paths according to condition:
  - **Autism**: Predictable, calm environment, one instruction at a time.
  - **IDD**: Micro-steps, errorless learning, and gentle repetition.
  - **Dyslexia**: Multi-sensory, phoneme-first approach with high-legibility typography and generous character spacing.
  - **ADHD**: Short bursts of focus with instant positive feedback loops.
- **Bilingual Support**: Full learning experiences in both **English** and **Tamil (தமிழ்)**.

### 2. 🎨 7 Interactive Theme Companions
Children select their favorite theme guide to accompany them across their learning journey:
- 🚀 **Space** (*Astro*)
- 🐶 **Animals** (*Ollie*)
- 🦜 **Birds** (*Kili*)
- 🌸 **Flowers** (*Poo*)
- 🌿 **Plants** (*Ilai*)
- 🚂 **Train** (*Sam*)
- 🎵 **Music** (*Melo*)

### 3. 🛡️ Sensory Regulation Controls
Tailor the user interface to avoid sensory overload:
- Adjustable sensory tiers: **Low**, **Medium**, **High**, and **None**.
- Regulates dynamic animations, contrast levels, and ambient sounds based on sensitivity.

### 4. 🧠 Interactive VAK Assessment Battery
- Features diagnostic mini-games assessing:
  - **Visual (V)**: Spatial tracking, matching, and visual discernment.
  - **Auditory (A)**: Phoneme discrimination and tone-frequency reactions.
  - **Kinesthetic (K)**: Motor accuracy, drag-and-drop mechanics, and tracing responsiveness.
- Automatically computes dominant learning style distributions and tailors curriculum delivery.

### 5. ✍️ Multi-Stage Letter Mastery Engine
Each letter lesson is divided into 5 carefully scaffolded stages:
1. **Intro**: Visual association with thematic illustrations.
2. **Pronounce**: Phonic sound playback accompanied by animated mouth-movement cues.
3. **Trace**: Interactive SVG canvas for finger/stylus tracing with live stroke precision feedback.
4. **Recognize**: Gamified letter identification puzzle.
5. **Celebrate**: Rewarding milestone celebrations with confetti, uplifting speech, and positive reinforcement.

### 6. 🎮 Practice & Games Arena
- Dynamic activities designed to reinforce motor skills, pattern recognition, and phonemic memory without anxiety or failure pressure.

---

## 📁 Repository Structure

```
Thiranmozhi/
├── index.html                   # Entry point for direct browser opening and GitHub Pages
├── server.js                    # Built-in lightweight Node HTTP and encouragement API server
├── start.bat                    # One-click Windows runner script
├── package.json                 # Dependency definitions and scripts
├── vite.config.js               # Vite build configuration with alias mappings
├── tailwind.config.js           # Tailwind CSS design styling rules
├── .github/
│   └── workflows/
│       └── deploy.yml           # Automated GitHub Pages CI/CD workflow
├── dist/
│   ├── index.html               # Production HTML build
│   └── static/
│       └── js/
│           ├── bundle.js        # Bundled application logic
│           └── index.css        # Bundled styles and animations
└── src/
    ├── App.js                   # Application route declarations & guards
    ├── index.js                 # React DOM mount point & QueryClient
    ├── components/
    │   ├── Draggable.jsx        # Touch / pointer physics drag system
    │   ├── Illustrations.jsx    # Thematic vector art
    │   ├── Mascots.jsx          # Animated SVG avatar guides
    │   ├── Shell.jsx            # Layout wrapper, cards, and primary buttons
    │   ├── ThemeAvatar.jsx      # Mascot indicator
    │   ├── ThemeBackground.jsx  # Dynamic atmospheric backgrounds
    │   └── TraceCanvas.jsx      # High-performance SVG letter tracing engine
    ├── context/
    │   └── AppContext.jsx       # State store with localStorage persistence
    ├── lib/
    │   ├── encourage.js         # Adaptive encouraging message system
    │   ├── letters.js           # Letter definitions, Tamil phonemes & SVG paths
    │   ├── screeningTests.jsx   # Assessment tests for each disorder
    │   ├── speech.js            # Web Speech API speech synthesis & sound cues
    │   └── themes.js            # Color schemes, mascots & icons
    └── pages/
        ├── Splash.jsx           # Animated opening splash
        ├── Registration.jsx     # Child profile onboarding
        ├── Language.jsx         # English / Tamil language selector
        ├── Interest.jsx         # Theme & companion selector
        ├── Sensory.jsx          # Sensory sensitivity configuration
        ├── ScreeningIntro.jsx   # Guided screening onboarding
        ├── Screening.jsx        # Diagnostic battery runner
        ├── VakResult.jsx        # VAK profile breakdown
        ├── Dashboard.jsx        # Student home learning dashboard
        ├── LetterLesson.jsx     # 5-step letter learning module
        ├── DoAndPractice.jsx    # Practice activities
        └── Settings.jsx         # Settings and profile management
```

---

## 🚀 Running the Project Locally

### Option 1: Double-Click (Zero Setup Required)
Simply double-click [`index.html`](index.html) or [`start.bat`](start.bat) in the root folder.
- `index.html` runs directly in any modern browser without needing a server.
- `start.bat` boots the built-in local server and opens `http://localhost:3000`.

### Option 2: Running with Node.js
```bash
# Start the local server
node server.js
```
Open your browser and navigate to `http://localhost:3000`.

---

## 📤 Pushing to Your GitHub Repository

If you have already created a repository on GitHub (e.g. `https://github.com/aldawinona02/Thiranmozhi.git`):

```bash
# 1. Link your remote repository (replace with your repo URL)
git remote add origin https://github.com/aldawinona02/Thiranmozhi.git

# 2. Rename branch to main
git branch -M main

# 3. Push to GitHub
git push -u origin main
```

### Enabling GitHub Pages
1. On GitHub, navigate to **Settings** > **Pages** of your repository.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. The included workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) will trigger automatically on push and deploy your live site!

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
