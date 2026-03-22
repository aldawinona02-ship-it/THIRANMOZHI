/**
 * THIRANMOZHI — Discovery Map Engine
 * Candy Crush-style letter adventure map
 */

const MAP_LETTERS = [
    // === WORLD 1: VOWELS (12) ===
    { char: 'அ', type: 'vowel', difficulty: 1 },
    { char: 'ஆ', type: 'vowel', difficulty: 1 },
    { char: 'இ', type: 'vowel', difficulty: 1 },
    { char: 'ஈ', type: 'vowel', difficulty: 2 },
    { char: 'உ', type: 'vowel', difficulty: 2 },
    // REVIEW 1 at index 5
    { char: 'ஊ', type: 'vowel', difficulty: 2 },
    { char: 'எ', type: 'vowel', difficulty: 2 },
    { char: 'ஏ', type: 'vowel', difficulty: 3 },
    { char: 'ஐ', type: 'vowel', difficulty: 3 },
    { char: 'ஒ', type: 'vowel', difficulty: 3 },
    // REVIEW 2 at index 10
    { char: 'ஓ', type: 'vowel', difficulty: 3 },
    { char: 'ஔ', type: 'vowel', difficulty: 3 },
    // === WORLD 2: CONSONANTS (18) ===
    { char: 'க', type: 'consonant', difficulty: 2 },
    { char: 'ங', type: 'consonant', difficulty: 3 },
    { char: 'ச', type: 'consonant', difficulty: 2 },
    // REVIEW 3 at index 15
    { char: 'ஞ', type: 'consonant', difficulty: 3 },
    { char: 'ட', type: 'consonant', difficulty: 2 },
    { char: 'ண', type: 'consonant', difficulty: 3 },
    { char: 'த', type: 'consonant', difficulty: 2 },
    { char: 'ந', type: 'consonant', difficulty: 3 },
    // REVIEW 4 at index 20
    { char: 'ப', type: 'consonant', difficulty: 1 },
    { char: 'ம', type: 'consonant', difficulty: 1 },
    { char: 'ய', type: 'consonant', difficulty: 2 },
    { char: 'ர', type: 'consonant', difficulty: 3 },
    { char: 'ல', type: 'consonant', difficulty: 2 },
    // REVIEW 5 at index 25
    { char: 'வ', type: 'consonant', difficulty: 2 },
    { char: 'ழ', type: 'consonant', difficulty: 4 },
    { char: 'ள', type: 'consonant', difficulty: 4 },
    { char: 'ற', type: 'consonant', difficulty: 4 },
    { char: 'ன', type: 'consonant', difficulty: 4 },
    // REVIEW 6 (FINAL BOSS) at index 30
];

// Review nodes appear AFTER every 5 letters: idx 5, 10, 15, 20, 25, 30
const REVIEW_POSITIONS = [5, 10, 15, 20, 25, 30];

const TIGER_DIALOGUES = {
    idle: [
        "Tap me! I'm curious 🐅",
        "What letter is next? 🧐",
        "I see you! Come on, learn with me!",
        "Roar! Let's go! 🐾"
    ],
    correct: [
        "ROAR! You nailed it! 🐅⭐",
        "Amazing! I knew you could!",
        "Super! Gold awaits! 🥇",
        "That's my student! 🐾"
    ],
    locked: [
        "Finish the last one first! 🔒",
        "Almost there! Keep going!",
        "One step at a time, champ! 🐅"
    ],
    paw1: ["Letter unlocked! 🐾 1st paw earned!"],
    paw2: ["2nd paw! 🐾🐾 Next letter unlocked!"],
    paw3: ["GOLD MASTERED! 🥇⭐ Brilliant!"],
    review: ["REVIEW TIME! Show me what you've learned! 🏆"]
};

class MapEngine {
    constructor() {
        this.pathEl = document.getElementById('map-path');
        this.tigerBubble = document.getElementById('tiger-bubble');
        this.tigerBody = document.getElementById('tiger-body');
        this.idleTimer = null;
        this.letterPaws = {};
        this.reviewsDone = {};

        this.loadState();
        this.updateHeader();
        this.renderMap();
        this.startIdleTimer();
    }

    loadState() {
        try {
            const saved = localStorage.getItem('tm_letter_paws');
            this.letterPaws = saved ? JSON.parse(saved) : {};

            const reviewsSaved = localStorage.getItem('tm_reviews_done');
            this.reviewsDone = reviewsSaved ? JSON.parse(reviewsSaved) : {};
        } catch(e) {
            this.letterPaws = {};
            this.reviewsDone = {};
        }
    }

    savePaws() {
        localStorage.setItem('tm_letter_paws', JSON.stringify(this.letterPaws));
        localStorage.setItem('tm_reviews_done', JSON.stringify(this.reviewsDone));
    }

    getPaws(char) {
        return this.letterPaws[char] || 0;
    }

    /** 
     * A node is unlocked if:
     * - It's the first node (index 0), OR
     * - The previous letter node has >= 2 paws, AND
     * - Any review between them is done
     */
    isNodeUnlocked(globalIndex) {
        if (globalIndex === 0) return true;

        // Find the previous letter index
        // Each "block" of 5 letters is followed by a review
        // So unlock logic: prev letter paws >= 2
        const prev = MAP_LETTERS[globalIndex - 1];
        const prevPaws = this.getPaws(prev.char);
        if (prevPaws < 2) return false;

        // Also check if there's a review gate between them
        // Review gates are at REVIEW_POSITIONS[n] meaning "after letter n"
        const reviewGateIndex = REVIEW_POSITIONS.findIndex(r => r === globalIndex);
        if (reviewGateIndex !== -1) {
            // This is a review node, not a letter — handled separately
            return false;
        }

        // Check if a review gate exists just before this letter index
        // e.g., letter index 6 (after review at 5)
        const prevReview = REVIEW_POSITIONS.find(r => r === globalIndex - 1);
        if (prevReview !== undefined) {
            return !!this.reviewsDone[prevReview];
        }

        return true;
    }

    isReviewUnlocked(reviewPos) {
        // The review at position N requires the Nth letter (index N-1) to have >= 2 paws
        const prevLetter = MAP_LETTERS[reviewPos - 1];
        if (!prevLetter) return false;
        return this.getPaws(prevLetter.char) >= 2;
    }

    renderMap() {
        this.pathEl.innerHTML = '';

        // Build a flat list of "slots": letters + review markers
        const slots = [];
        for (let i = 0; i < MAP_LETTERS.length; i++) {
            slots.push({ kind: 'letter', data: MAP_LETTERS[i], letterIndex: i });
            if (REVIEW_POSITIONS.includes(i + 1)) {
                slots.push({ kind: 'review', pos: i + 1 });
            }
        }

        // Render in rows of 3 (Candy Crush S-curve)
        // Alternate left-to-right and right-to-left rows
        let rowNodes = [];
        const allNodes = [];

        slots.forEach((slot, idx) => {
            allNodes.push(slot);
        });

        // Build rows of 3 nodes each
        let nodeRows = [];
        let row = [];
        allNodes.forEach((slot, i) => {
            row.push(slot);
            if (row.length === 3 || i === allNodes.length - 1) {
                nodeRows.push([...row]);
                row = [];
            }
        });

        nodeRows.forEach((rowData, rowIdx) => {
            const isReversed = rowIdx % 2 !== 0;
            const displayRow = isReversed ? [...rowData].reverse() : rowData;

            const rowEl = document.createElement('div');
            rowEl.className = 'map-row';

            displayRow.forEach(slot => {
                if (slot.kind === 'letter') {
                    rowEl.appendChild(this.createLetterNode(slot.data, slot.letterIndex));
                } else {
                    rowEl.appendChild(this.createReviewNode(slot.pos));
                }
            });
            // Add empties for short rows
            while (rowEl.children.length < 3) {
                const empty = document.createElement('div');
                empty.style.width = '80px';
                rowEl.appendChild(empty);
            }

            this.pathEl.appendChild(rowEl);

            // Connect rows with dashes (not after last)
            if (rowIdx < nodeRows.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'path-connector';
                connector.innerHTML = '<div class="dashes"></div>';
                this.pathEl.appendChild(connector);
            }
        });

        // Place Tiger at current active node
        this.positionTiger();
    }

    createLetterNode(letterData, idx) {
        const paws = this.getPaws(letterData.char);
        const unlocked = this.isNodeUnlocked(idx);
        const mastered = paws >= 3;

        const node = document.createElement('div');
        node.className = 'map-node';
        node.dataset.char = letterData.char;
        node.dataset.idx = idx;

        if (!unlocked) {
            node.classList.add('locked');
        } else if (mastered) {
            node.classList.add('mastered');
        } else if (letterData.type === 'vowel') {
            node.classList.add('unlocked-vowel');
        } else {
            node.classList.add('unlocked-consonant');
        }

        // Paw display
        let pawStr = '';
        for (let p = 0; p < 3; p++) {
            pawStr += p < paws ? '🐾' : '·';
        }

        node.innerHTML = `
            <span class="node-char">${letterData.char}</span>
            <span class="node-paws">${pawStr}</span>
        `;

        if (unlocked) {
            node.addEventListener('click', () => this.onLetterClick(letterData, idx));
        } else {
            node.addEventListener('click', () => this.tigerSay(this.randFrom(TIGER_DIALOGUES.locked)));
        }

        return node;
    }

    createReviewNode(pos) {
        const unlocked = this.isReviewUnlocked(pos);
        const done = !!this.reviewsDone[pos];

        const node = document.createElement('div');
        node.className = `map-node review-node ${unlocked ? '' : 'locked'}`;
        node.dataset.review = pos;

        node.innerHTML = `
            <span class="node-char">${done ? '✅' : '🏆'}</span>
            <span class="node-paws" style="color:white; font-size:0.6rem;">REVIEW</span>
        `;

        if (unlocked && !done) {
            node.addEventListener('click', () => this.onReviewClick(pos));
        } else if (done) {
            node.style.background = 'linear-gradient(135deg, #a5d6a7, #66bb6a)';
            node.style.borderColor = '#2e7d32';
        } else {
            node.addEventListener('click', () => this.tigerSay(this.randFrom(TIGER_DIALOGUES.locked)));
        }

        return node;
    }

    onLetterClick(letterData, idx) {
        this.resetIdleTimer();

        const paws = this.getPaws(letterData.char);
        if (paws === 0) {
            // First time seeing: award paw 1, then go to activity
            this.letterPaws[letterData.char] = 1;
            this.savePaws();
            this.tigerSay(TIGER_DIALOGUES.paw1[0]);
        }

        // Navigate to activity
        localStorage.setItem('tm_current_letter', letterData.char);
        localStorage.setItem('tm_current_letter_type', letterData.type);
        setTimeout(() => {
            window.location.href = `activity.html?letter=${encodeURIComponent(letterData.char)}&type=${letterData.type}`;
        }, 800);
    }

    onReviewClick(pos) {
        this.resetIdleTimer();
        this.tigerSay(TIGER_DIALOGUES.review[0]);
        localStorage.setItem('tm_review_pos', pos);
        setTimeout(() => {
            window.location.href = `review.html?pos=${pos}`;
        }, 1000);
    }

    /**
     * Called from activity.html/review.html when returning to map.
     * Updates paws based on performance.
     */
    awardPaw(char, pawsToSet) {
        const current = this.getPaws(char);
        if (pawsToSet > current) {
            this.letterPaws[char] = pawsToSet;
            this.savePaws();

            const dialogue = pawsToSet === 3
                ? TIGER_DIALOGUES.paw3[0]
                : pawsToSet === 2
                    ? TIGER_DIALOGUES.paw2[0]
                    : TIGER_DIALOGUES.paw1[0];

            this.tigerSay(dialogue);
            if (pawsToSet >= 2) this.tigerHappy();
        }
        this.renderMap();
    }

    markReviewDone(pos) {
        this.reviewsDone[pos] = true;
        this.savePaws();
        this.renderMap();

        if (pos === 30) {
            this.tigerSay("AMAZING! You completed the entire map! 🎓🏆");
            setTimeout(() => {
                window.location.href = 'certificate.html';
            }, 3000);
        }
    }

    positionTiger() {
        // Find the highest unlocked, non-mastered node — that's the "current" one
        // If all mastered, place at last
        let currentIdx = 0;
        for (let i = 0; i < MAP_LETTERS.length; i++) {
            const paws = this.getPaws(MAP_LETTERS[i].char);
            const unlocked = this.isNodeUnlocked(i);
            if (unlocked) currentIdx = i;
            if (unlocked && paws < 3) break;
        }

        // Highlight active node
        document.querySelectorAll('.map-node.active-node').forEach(n => n.classList.remove('active-node'));
        const activeNode = document.querySelector(`.map-node[data-idx="${currentIdx}"]`);
        if (activeNode) {
            activeNode.classList.add('active-node');
            // Scroll into view
            setTimeout(() => activeNode.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
        }
    }

    tigerSay(msg, duration = 3000) {
        this.tigerBubble.textContent = msg;
        this.tigerBubble.style.display = 'block';
        this.tigerBubble.style.animation = 'none';
        void this.tigerBubble.offsetWidth;
        this.tigerBubble.style.animation = 'bubble-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        clearTimeout(this._bubbleTimer);
        this._bubbleTimer = setTimeout(() => {
            this.tigerBubble.style.display = 'none';
        }, duration);
    }

    tigerTalk() {
        this.tigerSay(this.randFrom(TIGER_DIALOGUES.idle));
        this.resetIdleTimer();
    }

    tigerHappy() {
        this.tigerBody.classList.remove('tiger-curious');
        this.tigerBody.style.animation = 'none';
        this.tigerBody.classList.add('tiger-happy');
        setTimeout(() => {
            this.tigerBody.classList.remove('tiger-happy');
            this.tigerBody.style.animation = '';
        }, 700);
    }

    tigerCurious() {
        this.tigerBody.classList.add('tiger-curious');
        setTimeout(() => this.tigerBody.classList.remove('tiger-curious'), 1000);
    }

    startIdleTimer() {
        this.resetIdleTimer();
        ['click', 'touchstart', 'mousemove', 'keydown'].forEach(ev => {
            window.addEventListener(ev, () => this.resetIdleTimer(), { passive: true });
        });
    }

    resetIdleTimer() {
        clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(() => {
            this.tigerCurious();
            this.tigerSay(this.randFrom(TIGER_DIALOGUES.idle));
        }, 5000);
    }

    updateHeader() {
        const name = window.app?.state?.student?.name || 'Explorer';
        const nameEl = document.getElementById('header-name');
        if (nameEl) nameEl.textContent = name;

        const totalPaws = Object.values(this.letterPaws).reduce((a, b) => a + b, 0);
        const goldCount = Object.values(this.letterPaws).filter(p => p >= 3).length;

        const pawEl = document.getElementById('paw-total');
        const goldEl = document.getElementById('gold-total');
        if (pawEl) pawEl.textContent = `🐾 ${totalPaws}`;
        if (goldEl) goldEl.textContent = `⭐ ${goldCount}`;
    }

    randFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if returning from activity with a result
    const result = localStorage.getItem('tm_activity_result');
    if (result) {
        try {
            const { char, paws } = JSON.parse(result);
            localStorage.removeItem('tm_activity_result');
            window.mapEngine = new MapEngine();
            setTimeout(() => window.mapEngine.awardPaw(char, paws), 800);
        } catch(e) {
            window.mapEngine = new MapEngine();
        }
    } else {
        // Check for review result
        const reviewResult = localStorage.getItem('tm_review_result');
        if (reviewResult) {
            try {
                const { pos } = JSON.parse(reviewResult);
                localStorage.removeItem('tm_review_result');
                window.mapEngine = new MapEngine();
                setTimeout(() => window.mapEngine.markReviewDone(pos), 500);
            } catch(e) {
                window.mapEngine = new MapEngine();
            }
        } else {
            window.mapEngine = new MapEngine();
        }
    }

    // Tiger intro message
    setTimeout(() => {
        if (window.mapEngine) {
            const name = window.app?.state?.student?.name || 'Explorer';
            window.mapEngine.tigerSay(`Welcome back, ${name}! 🐅 Tap a letter!`);
        }
    }, 800);
});
