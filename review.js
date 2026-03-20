/**
 * THIRANMOZHI — Stop & Review Engine
 * 3-question quick quiz using mastered letters
 */

const REVIEW_MESSAGES = {
    start: [
        "Let's see what you've learned! 3 quick questions! 🐅",
        "Review time! Can you still remember? 🧐",
        "ROAR! Show me you remember these letters! 🐅"
    ],
    correct: [
        "YES! You remembered! ROAR! 🐅⭐",
        "Brilliant! Amazing memory! 🌟",
        "That's my student! 🐾"
    ],
    wrong: [
        "Not quite! Look carefully. 👀",
        "Oops! Try again! You've got this! 🐅",
        "Almost! Look at the shape. 👀"
    ],
    pass: [
        "ROAR! Perfect review! You're unstoppable! 🏆🐅",
        "Outstanding! Next world unlocked! ⭐🗺️",
        "You've mastered these letters! Incredible! 🥇"
    ],
    partial: [
        "Good effort! Keep practicing! 🐅🐾",
        "Almost there! You'll master them soon! 🌟"
    ]
};

class ReviewEngine {
    constructor() {
        this.pos = parseInt(new URLSearchParams(window.location.search).get('pos')) || 5;
        this.questions = [];
        this.currentQ = 0;
        this.correctCount = 0;
        this.done = false;

        this.buildQuestions();
        this.renderDots();
        this.renderQuestion();
        this.tigerSay(this.rand(REVIEW_MESSAGES.start));
    }

    buildQuestions() {
        // Get letters from before this review (the previous "world" of 5 letters)
        // Review at pos N = we test letters [N-5 ... N-1]
        const start = Math.max(0, this.pos - 5);
        const end = this.pos;

        const MAP_LETTERS = [
            { char: 'அ', type: 'vowel' }, { char: 'ஆ', type: 'vowel' },
            { char: 'இ', type: 'vowel' }, { char: 'ஈ', type: 'vowel' },
            { char: 'உ', type: 'vowel' }, { char: 'ஊ', type: 'vowel' },
            { char: 'எ', type: 'vowel' }, { char: 'ஏ', type: 'vowel' },
            { char: 'ஐ', type: 'vowel' }, { char: 'ஒ', type: 'vowel' },
            { char: 'ஓ', type: 'vowel' }, { char: 'ஔ', type: 'vowel' },
            { char: 'க', type: 'consonant' }, { char: 'ங', type: 'consonant' },
            { char: 'ச', type: 'consonant' }, { char: 'ஞ', type: 'consonant' },
            { char: 'ட', type: 'consonant' }, { char: 'ண', type: 'consonant' },
            { char: 'த', type: 'consonant' }, { char: 'ந', type: 'consonant' },
            { char: 'ப', type: 'consonant' }, { char: 'ம', type: 'consonant' },
            { char: 'ய', type: 'consonant' }, { char: 'ர', type: 'consonant' },
            { char: 'ல', type: 'consonant' }, { char: 'வ', type: 'consonant' },
            { char: 'ழ', type: 'consonant' }, { char: 'ள', type: 'consonant' },
            { char: 'ற', type: 'consonant' }, { char: 'ன', type: 'consonant' }
        ];

        const segment = MAP_LETTERS.slice(start, end);
        // Pick 3 random from segment
        const picked = segment.sort(() => Math.random() - 0.5).slice(0, Math.min(3, segment.length));

        this.questions = picked.map(letter => {
            // Build 3 options: correct + 2 similar
            const pool = MAP_LETTERS.filter(l => l.char !== letter.char);
            const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 2).map(l => l.char);
            const options = [letter.char, ...distractors].sort(() => Math.random() - 0.5);
            return { correct: letter.char, options };
        });
    }

    renderDots() {
        const el = document.getElementById('progress-dots');
        if (!el) return;
        el.innerHTML = this.questions.map((_, i) => `
            <div class="dot ${i === 0 ? 'active' : ''}" id="dot-${i}"></div>
        `).join('');
    }

    updateDots(idx, result) {
        const dot = document.getElementById(`dot-${idx}`);
        if (!dot) return;
        dot.className = `dot ${result === 'correct' ? 'done' : 'wrong-dot'}`;

        const next = document.getElementById(`dot-${idx + 1}`);
        if (next) next.className = 'dot active';
    }

    renderQuestion() {
        if (this.currentQ >= this.questions.length) {
            this.showResult();
            return;
        }

        const q = this.questions[this.currentQ];
        const letterEl = document.getElementById('question-letter');
        const optionsEl = document.getElementById('review-options');

        if (!letterEl || !optionsEl) return;

        letterEl.textContent = q.correct;
        letterEl.style.animation = 'none';
        void letterEl.offsetWidth;
        letterEl.style.animation = 'letter-float 2s ease-in-out infinite';

        optionsEl.innerHTML = q.options.map(opt => `
            <button class="review-btn" data-val="${opt}"
                onclick="window.reviewEngine.onAnswer(this, '${opt}', '${q.correct}')">
                ${opt}
            </button>
        `).join('');
    }

    onAnswer(btn, chosen, correct) {
        const allBtns = document.querySelectorAll('.review-btn');
        allBtns.forEach(b => b.disabled = true);

        if (chosen === correct) {
            btn.classList.add('correct');
            this.correctCount++;
            this.tigerSay(this.rand(REVIEW_MESSAGES.correct));
            this.updateDots(this.currentQ, 'correct');
            setTimeout(() => this.nextQuestion(), 1200);
        } else {
            btn.classList.add('wrong');
            allBtns.forEach(b => { if (b.dataset.val === correct) b.classList.add('correct'); });
            this.tigerSay(this.rand(REVIEW_MESSAGES.wrong));
            this.updateDots(this.currentQ, 'wrong');
            setTimeout(() => this.nextQuestion(), 1800);
        }
    }

    nextQuestion() {
        this.currentQ++;
        this.renderQuestion();
    }

    showResult() {
        const quizSection = document.getElementById('quiz-section');
        const wellDoneSection = document.getElementById('well-done-section');
        const resultMsg = document.getElementById('result-msg');

        if (!quizSection || !wellDoneSection) return;

        quizSection.style.display = 'none';
        wellDoneSection.style.display = 'block';

        const allCorrect = this.correctCount === this.questions.length;
        const msg = allCorrect
            ? this.rand(REVIEW_MESSAGES.pass)
            : this.rand(REVIEW_MESSAGES.partial);

        if (resultMsg) resultMsg.textContent = `${this.correctCount}/${this.questions.length} correct! ${allCorrect ? '🏆' : '🐾'}`;

        // Tiger
        const tiger = document.querySelector('.tiger-review');
        if (tiger) tiger.style.fontSize = '6rem';

        // If passed (at least 2/3), we mark review done
        if (this.correctCount >= 2) {
            localStorage.setItem('tm_review_result', JSON.stringify({ pos: this.pos }));
        }
    }

    finish() {
        window.location.href = 'map.html';
    }

    tigerSay(msg) {
        const el = document.getElementById('tiger-review-msg');
        if (!el) return;
        el.textContent = msg;
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = 'bubble-pop-r 0.4s ease';
    }

    rand(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}

const styleR = document.createElement('style');
styleR.textContent = `
@keyframes bubble-pop-r {
    from { transform: scale(0.8); opacity: 0.5; }
    to { transform: scale(1); opacity: 1; }
}`;
document.head.appendChild(styleR);

document.addEventListener('DOMContentLoaded', () => {
    window.reviewEngine = new ReviewEngine();
});
