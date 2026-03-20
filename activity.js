/**
 * THIRANMOZHI — Activity Engine
 * Renders VAK-specific learning activity for each letter
 */

// Tamil letters for similar-looking distractors
const LOOK_ALIKE_MAP = {
    'அ': ['ஆ', 'ஒ'], 'ஆ': ['அ', 'ஏ'], 'இ': ['ஈ', 'எ'],
    'ஈ': ['இ', 'எ'], 'உ': ['ஊ', 'ஒ'], 'ஊ': ['உ', 'ஓ'],
    'எ': ['ஏ', 'இ'], 'ஏ': ['எ', 'ஐ'], 'ஐ': ['ஏ', 'எ'],
    'ஒ': ['ஓ', 'உ'], 'ஓ': ['ஒ', 'ஊ'], 'ஔ': ['ஓ', 'ஒ'],
    'க': ['ககு', 'ங'], 'ங': ['ண', 'ஞ'], 'ச': ['ர', 'ல'],
    'ஞ': ['ந', 'ண'], 'ட': ['த', 'ண'], 'ண': ['ன', 'ந'],
    'த': ['ந', 'ட'], 'ந': ['ன', 'த'], 'ப': ['ப', 'ம'],
    'ம': ['ப', 'ண'], 'ய': ['ர', 'வ'], 'ர': ['ற', 'ல'],
    'ல': ['ழ', 'ள'], 'வ': ['ய', 'ர'], 'ழ': ['ள', 'ல'],
    'ள': ['ழ', 'ல'], 'ற': ['ர', 'ந'], 'ன': ['ண', 'ந']
};

const AUDITORY_INTRO = [
    "Listen carefully! 👂 Which letter makes this sound?",
    "Can you hear it? 🎵 Find the matching letter!",
    "Your ears are your power! 🔊 Pick the right one!"
];

class ActivityEngine {
    constructor() {
        this.container = document.getElementById('activity-container');
        this.badgeEl = document.getElementById('activity-style-badge');
        this.pawStatusEl = document.getElementById('paw-status');

        // Read URL params
        const params = new URLSearchParams(window.location.search);
        this.letter = params.get('letter') || localStorage.getItem('tm_current_letter') || 'அ';
        this.letterType = params.get('type') || localStorage.getItem('tm_current_letter_type') || 'vowel';
        this.style = (window.app?.state?.dominant_style) || 'visual';

        // Paw tracking
        this.savedPaws = this.getExistingPaws();
        this.currentPaws = this.savedPaws;

        this.updatePawDisplay();
        this.showStyleBadge();
        this.renderActivity();
    }

    getExistingPaws() {
        try {
            const saved = localStorage.getItem('tm_letter_paws');
            const paws = saved ? JSON.parse(saved) : {};
            return paws[this.letter] || 0;
        } catch { return 0; }
    }

    updatePawDisplay() {
        let pawStr = '';
        for (let i = 0; i < 3; i++) {
            pawStr += i < this.currentPaws ? '🐾' : '·';
        }
        this.pawStatusEl.textContent = pawStr;
    }

    showStyleBadge() {
        const labels = {
            visual: '<i class="fa-solid fa-eye"></i> Visual Path',
            auditory: '<i class="fa-solid fa-ear-listen"></i> Auditory Path',
            kinesthetic: '<i class="fa-solid fa-hand"></i> Kinesthetic Path'
        };
        const classes = {
            visual: 'badge-visual',
            auditory: 'badge-auditory',
            kinesthetic: 'badge-kinesthetic'
        };
        this.badgeEl.innerHTML = labels[this.style] || labels.visual;
        this.badgeEl.className = `style-badge ${classes[this.style] || 'badge-visual'}`;
    }

    glowClass() {
        return this.letterType === 'vowel' ? 'vowel-glow' : 'consonant-glow';
    }

    renderActivity() {
        switch (this.style) {
            case 'auditory': this.renderAuditory(); break;
            case 'kinesthetic': this.renderKinesthetic(); break;
            default: this.renderVisual(); break;
        }
    }

    // =============================================
    // VISUAL: Tiger mascot + letter display + pick
    // =============================================
    renderVisual() {
        const distractors = this.getDistractors();
        const options = this.shuffle([this.letter, ...distractors]);

        this.container.innerHTML = `
            <div style="text-align:center; width:100%; max-width:420px;">
                <!-- Tiger mascot -->
                <div class="tiger-speech" id="tiger-speech">
                    Look at this letter! Can you find its twin? 🐅
                </div>
                <div class="activity-tiger" id="activity-tiger">🐅</div>

                <!-- Floating letter -->
                <div class="letter-hero ${this.glowClass()}">${this.letter}</div>

                <p style="font-weight:700; color:#555; margin-bottom:0.5rem;">Identify this letter:</p>

                <!-- Choice grid -->
                <div class="choice-grid">
                    ${options.map(opt => `
                        <button class="choice-btn" data-val="${opt}"
                            style="font-family:'Baloo Thambi 2',cursive;"
                            onclick="window.activityEngine.onVisualChoice(this, '${opt}')">
                            ${opt}
                        </button>
                    `).join('')}
                </div>

                <!-- Result paw banner -->
                <div class="paw-banner" id="paw-banner"></div>
                <button class="btn-back-map" id="back-btn" onclick="window.activityEngine.returnToMap()">
                    Back to Map 🗺️
                </button>
            </div>
        `;

        this.animateTiger();
    }

    onVisualChoice(btn, chosen) {
        const allBtns = document.querySelectorAll('.choice-btn');
        allBtns.forEach(b => b.disabled = true);

        if (chosen === this.letter) {
            btn.classList.add('correct');
            this.awardActivity(true);
            this.tigerSay("YES! You've got it! ROAR! 🐅⭐");
            this.tigerJump();
        } else {
            btn.classList.add('wrong');
            this.tigerSay("Almost! Look more carefully. 👀");
            setTimeout(() => {
                btn.classList.remove('wrong');
                allBtns.forEach(b => b.disabled = false);
            }, 1200);
        }
    }

    // =============================================
    // AUDITORY: Hear the sound → pick the letter
    // =============================================
    renderAuditory() {
        const distractors = this.getDistractors();
        const options = this.shuffle([this.letter, ...distractors]);
        const intro = AUDITORY_INTRO[Math.floor(Math.random() * AUDITORY_INTRO.length)];

        this.container.innerHTML = `
            <div style="text-align:center; width:100%; max-width:420px;">
                <div class="tiger-speech">${intro}</div>
                <div class="activity-tiger" id="activity-tiger">🐅</div>

                <button class="sound-btn" id="sound-btn" onclick="window.activityEngine.playSound()">
                    <i class="fa-solid fa-play"></i>
                </button>
                <p style="font-weight:700; color:#555; margin-bottom:0.5rem;">
                    Tap 🔊 to hear, then pick the right letter:
                </p>

                <div class="choice-grid">
                    ${options.map(opt => `
                        <button class="choice-btn" data-val="${opt}"
                            style="font-family:'Baloo Thambi 2',cursive;"
                            onclick="window.activityEngine.onAuditoryChoice(this, '${opt}')">
                            ${opt}
                        </button>
                    `).join('')}
                </div>

                <div class="paw-banner" id="paw-banner"></div>
                <button class="btn-back-map" id="back-btn" onclick="window.activityEngine.returnToMap()">
                    Back to Map 🗺️
                </button>
            </div>
        `;

        this.animateTiger();
        // Auto play on load after short delay
        setTimeout(() => this.playSound(), 700);
    }

    playSound() {
        const btn = document.getElementById('sound-btn');
        if (btn) {
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => { if(btn) btn.style.transform = ''; }, 200);
        }

        // Use SpeechSynthesis as the audio system
        if ('speechSynthesis' in window) {
            const utt = new SpeechSynthesisUtterance(this.letter);
            utt.lang = 'ta-IN';
            utt.rate = 0.7;
            utt.pitch = 1.1;
            speechSynthesis.cancel();
            speechSynthesis.speak(utt);
        } else if (window.audioSys) {
            window.audioSys.play(this.letter);
        }
    }

    onAuditoryChoice(btn, chosen) {
        const allBtns = document.querySelectorAll('.choice-btn');
        allBtns.forEach(b => b.disabled = true);

        if (chosen === this.letter) {
            btn.classList.add('correct');
            // Highlight the correct answer
            this.awardActivity(true);
            this.tigerSay("Fantastic ears! 👂🐅 ROAR!");
            this.tigerJump();
        } else {
            btn.classList.add('wrong');
            // Show correct answer after wrong
            allBtns.forEach(b => {
                if (b.dataset.val === this.letter) b.classList.add('correct');
            });
            this.tigerSay("Listen again! Tap 🔊 to replay!");
            setTimeout(() => {
                btn.classList.remove('wrong');
                allBtns.forEach(b => {
                    b.classList.remove('correct');
                    b.disabled = false;
                });
            }, 1800);
        }
    }

    // =============================================
    // KINESTHETIC: Tracing + live accuracy bar
    // =============================================
    renderKinesthetic() {
        this.container.innerHTML = `
            <div class="tracing-section" style="text-align:center;">
                <div class="tiger-speech">Trace the letter with your finger! 🐾</div>
                <div class="activity-tiger" id="activity-tiger">🐅</div>

                <div class="letter-hero ${this.glowClass()} mb-1" style="font-size:4rem;">${this.letter}</div>

                <div class="accuracy-label" id="acc-label">Accuracy: 0%</div>
                <div class="accuracy-bar-container">
                    <div class="accuracy-bar" id="acc-bar"></div>
                </div>

                <div class="trace-canvas-wrapper mb-1" style="width:100%; max-width:360px; margin:0 auto;">
                    <canvas id="guide-canvas-a" width="360" height="360"></canvas>
                    <canvas id="trace-canvas-a" width="360" height="360"></canvas>
                </div>

                <button class="btn btn-secondary" id="clear-trace-btn" onclick="window.activityEngine.clearTrace()"
                    style="width:100%; max-width:360px; border-radius:50px; margin-bottom:1rem;">
                    <i class="fa-solid fa-eraser"></i> Clear & Retry
                </button>

                <div class="paw-banner" id="paw-banner"></div>
                <button class="btn-back-map" id="back-btn" onclick="window.activityEngine.returnToMap()">
                    Back to Map 🗺️
                </button>
            </div>
        `;

        this.animateTiger();
        this.initTracing();
    }

    initTracing() {
        const traceCanvas = document.getElementById('trace-canvas-a');
        const guideCanvas = document.getElementById('guide-canvas-a');
        if (!traceCanvas || !guideCanvas) return;

        const ctx = traceCanvas.getContext('2d');
        const gCtx = guideCanvas.getContext('2d');
        const W = 360, H = 360;

        // Draw faint guide letter
        gCtx.clearRect(0, 0, W, H);
        gCtx.font = "bold 280px 'Baloo Thambi 2', cursive";
        gCtx.textAlign = 'center';
        gCtx.textBaseline = 'middle';
        gCtx.fillStyle = 'rgba(0,0,0,0.07)';
        gCtx.fillText(this.letter, W / 2, H / 2);

        // Capture guide pixel count for accuracy
        const guideData = gCtx.getImageData(0, 0, W, H).data;
        let guidePixels = 0;
        for (let i = 3; i < guideData.length; i += 4) {
            if (guideData[i] > 5) guidePixels++;
        }
        this.guidePixels = guidePixels;

        let drawing = false;
        let drawnPts = 0;
        this.traceCtx = ctx;
        this.guideCtx_ref = gCtx;
        this.traceDone = false;

        ctx.lineWidth = 22;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = this.letterType === 'vowel' ? '#4caf50' : '#ff9800';

        const getPos = (e) => {
            const rect = traceCanvas.getBoundingClientRect();
            const cl = e.touches ? e.touches[0].clientX : e.clientX;
            const ct = e.touches ? e.touches[0].clientY : e.clientY;
            const scaleX = W / rect.width;
            const scaleY = H / rect.height;
            return { x: (cl - rect.left) * scaleX, y: (ct - rect.top) * scaleY };
        };

        const start = (e) => {
            if (this.traceDone) return;
            if (e.cancelable) e.preventDefault();
            drawing = true;
            ctx.beginPath();
            const p = getPos(e);
            ctx.moveTo(p.x, p.y);
        };

        const move = (e) => {
            if (!drawing || this.traceDone) return;
            if (e.cancelable) e.preventDefault();
            const p = getPos(e);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            drawnPts++;

            // Update accuracy bar every 10 strokes
            if (drawnPts % 10 === 0) this.updateAccuracyBar(ctx, W, H);
        };

        const stop = () => {
            if (!drawing) return;
            drawing = false;
            this.updateAccuracyBar(ctx, W, H);
        };

        traceCanvas.addEventListener('mousedown', start);
        traceCanvas.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
        traceCanvas.addEventListener('touchstart', start, { passive: false });
        traceCanvas.addEventListener('touchmove', move, { passive: false });
        traceCanvas.addEventListener('touchend', stop);
    }

    updateAccuracyBar(ctx, W, H) {
        const userData = ctx.getImageData(0, 0, W, H).data;
        let drawnPixels = 0;
        for (let i = 3; i < userData.length; i += 4) {
            if (userData[i] > 5) drawnPixels++;
        }

        // Accuracy = how much of guide area is covered, capped at 100
        const rawAccuracy = Math.min(100, (drawnPixels / (this.guidePixels || 1)) * 100);
        // Apply a more lenient formula for kids
        const displayAccuracy = Math.min(100, rawAccuracy * 2.5);
        const rounded = Math.round(displayAccuracy);

        const bar = document.getElementById('acc-bar');
        const label = document.getElementById('acc-label');
        if (bar) bar.style.width = `${rounded}%`;
        if (label) label.textContent = `Accuracy: ${rounded}%`;

        // Award if > 60%
        if (rounded >= 60 && !this.traceDone) {
            this.traceDone = true;
            this.awardActivity(true);
            this.tigerSay("Beautiful tracing! ROAR! 🐅🐾");
            this.tigerJump();
        }
    }

    clearTrace() {
        const canvas = document.getElementById('trace-canvas-a');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 360, 360);
        this.traceDone = false;
        const bar = document.getElementById('acc-bar');
        const label = document.getElementById('acc-label');
        if (bar) bar.style.width = '0%';
        if (label) label.textContent = 'Accuracy: 0%';
        this.tigerSay("Try again! You can do it! 🐅");
    }

    // =============================================
    // Shared helpers
    // =============================================
    awardActivity(success) {
        if (!success) return;

        const newPaws = Math.min(3, this.currentPaws + 1);
        this.currentPaws = newPaws;
        this.updatePawDisplay();

        // Show paw banner
        const banner = document.getElementById('paw-banner');
        const backBtn = document.getElementById('back-btn');
        if (banner) {
            let pawStr = '';
            for (let i = 0; i < 3; i++) pawStr += i < newPaws ? '🐾' : '·';
            const messages = {
                1: 'First paw earned! Keep going! 🐾',
                2: 'Second paw! Next letter unlocked! 🐾🐾',
                3: 'GOLD MASTERED! Amazing work! ⭐🥇'
            };
            banner.innerHTML = `
                <h2>${newPaws === 3 ? '⭐ GOLD MASTER! ⭐' : '🐾 Paw Earned!'}</h2>
                <div class="paw-icons">${pawStr}</div>
                <p style="font-weight:700; color:#5d4037;">${messages[newPaws]}</p>
            `;
            banner.classList.add('show');
            if (newPaws === 3) {
                banner.style.background = 'linear-gradient(135deg, #fff176, #ffd54f, #ffca28)';
            }
        }
        if (backBtn) backBtn.classList.add('show');

        // Save result so map.html can pick it up
        localStorage.setItem('tm_activity_result', JSON.stringify({
            char: this.letter,
            paws: newPaws
        }));
    }

    returnToMap() {
        window.location.href = 'map.html';
    }

    animateTiger() {
        const tiger = document.getElementById('activity-tiger');
        if (!tiger) return;
        // Randomly wag tail or blink every 3-5 seconds
        setInterval(() => {
            tiger.style.animationDuration = (2 + Math.random() * 3) + 's';
        }, 3000);
    }

    tigerSay(msg) {
        const speech = document.querySelector('.tiger-speech');
        if (!speech) return;
        speech.textContent = msg;
        speech.style.animation = 'none';
        void speech.offsetWidth;
        speech.style.animation = 'bubble-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    }

    tigerJump() {
        const tiger = document.getElementById('activity-tiger');
        if (!tiger) return;
        tiger.style.animation = 'none';
        void tiger.offsetWidth;
        tiger.style.animation = 'tiger-jump-act 0.6s ease forwards';
        setTimeout(() => {
            tiger.style.animation = 'tiger-idle 4s ease-in-out infinite';
        }, 700);
    }

    getDistractors() {
        const custom = LOOK_ALIKE_MAP[this.letter];
        if (custom && custom.length >= 2) {
            return custom.slice(0, 2);
        }
        // Fallback: random letters from same category
        const pool = this.letterType === 'vowel'
            ? ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ']
            : ['க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன'];
        return pool.filter(c => c !== this.letter).sort(() => Math.random() - 0.5).slice(0, 2);
    }

    shuffle(arr) {
        return [...arr].sort(() => Math.random() - 0.5);
    }
}

// CSS for tiger jump in activity
const style = document.createElement('style');
style.textContent = `
@keyframes tiger-jump-act {
    0% { transform: translateY(0) rotate(-3deg) scale(1); }
    40% { transform: translateY(-25px) rotate(5deg) scale(1.2); }
    100% { transform: translateY(0) rotate(-3deg) scale(1); }
}
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    window.activityEngine = new ActivityEngine();
});
