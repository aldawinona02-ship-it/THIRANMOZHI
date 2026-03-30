/**
 * THIRANMOZHI — Activity Engine (Optimized & Debugged)
 * Fixed: Missing global state referencing, Canvas sizing issues, and logic flow.
 */

const LOOK_ALIKE_MAP = {
    'அ': ['ஆ', 'ஒ'], 'ஆ': ['அ', 'ஏ'], 'இ': ['ஈ', 'எ'],
    'ஈ': ['இ', 'எ'], 'உ': ['ஊ', 'ஒ'], 'ஊ': ['உ', 'ஓ'],
    'எ': ['ஏ', 'இ'], 'ஏ': ['எ', 'ஐ'], 'ஐ': ['ஏ', 'எ'],
    'ஒ': ['ஓ', 'உ'], 'ஓ': ['ஒ', 'ஊ'], 'ஔ': ['ஓ', 'ஒ'],
    'க': ['ங', 'ச'], 'ங': ['ண', 'ஞ'], 'ச': ['ர', 'ல'],
    'ஞ': ['ந', 'ண'], 'ட': ['த', 'ண'], 'ண': ['ன', 'ந'],
    'த': ['ந', 'ட'], 'ந': ['ன', 'த'], 'ப': ['ம', 'வ'],
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

        if (!this.container) return;

        // Initialize State
        const params = new URLSearchParams(window.location.search);
        this.letter = params.get('letter') || localStorage.getItem('tm_current_letter') || 'அ';
        this.letterType = params.get('type') || localStorage.getItem('tm_current_letter_type') || 'vowel';
        
        // Error Fix: Accessing dominant_style safely
        this.style = (localStorage.getItem('userStyle')) || 'Visual'; 
        this.style = this.style.toLowerCase(); 

        this.currentPaws = this.getExistingPaws();

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
        if (!this.pawStatusEl) return;
        let pawStr = '';
        for (let i = 0; i < 3; i++) {
            pawStr += i < this.currentPaws ? '🐾' : '·';
        }
        this.pawStatusEl.textContent = pawStr;
    }

    showStyleBadge() {
        if (!this.badgeEl) return;
        const labels = {
            visual: '<i class="fa-solid fa-eye"></i> Visual Path',
            auditory: '<i class="fa-solid fa-ear-listen"></i> Auditory Path',
            kinesthetic: '<i class="fa-solid fa-hand"></i> Kinesthetic Path'
        };
        this.badgeEl.innerHTML = labels[this.style] || labels.visual;
        this.badgeEl.className = `style-badge badge-${this.style}`;
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

    renderVisual() {
        const distractors = this.getDistractors();
        const options = this.shuffle([this.letter, ...distractors]);

        this.container.innerHTML = `
            <div style="text-align:center; width:100%; max-width:420px;">
                <div class="tiger-speech" id="tiger-speech">Look at this letter! Can you find its twin? 🐅</div>
                <div class="activity-tiger" id="activity-tiger">🐅</div>
                <div class="letter-hero ${this.glowClass()}">${this.letter}</div>
                <div class="choice-grid">
                    ${options.map(opt => `
                        <button class="choice-btn" data-val="${opt}" onclick="window.activityEngine.onVisualChoice(this, '${opt}')">${opt}</button>
                    `).join('')}
                </div>
                <div class="paw-banner" id="paw-banner"></div>
                <button class="btn-back-map" id="back-btn" onclick="window.activityEngine.returnToMap()">Back to Map 🗺️</button>
            </div>
        `;
    }

    onVisualChoice(btn, chosen) {
        if (chosen === this.letter) {
            btn.classList.add('correct');
            this.awardActivity(true);
            this.tigerSay("YES! You've got it! 🐅⭐");
            this.tigerJump();
        } else {
            btn.classList.add('wrong');
            this.tigerSay("
