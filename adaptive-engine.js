/**
 * THIRANMOZHI — Adaptive Engine (Refined)
 * Fixes: Logic for Stage Filtering, User Style retrieval, and UI consistency.
 */

const TAMIL_DATA = {
    uyir: [
        { l: 'அ', v: 'Easy', w: 'Easy', p: 'Easy', sound: 'a' }, { l: 'ஆ', v: 'Easy', w: 'Easy', p: 'Easy', sound: 'aa' },
        { l: 'இ', v: 'Easy', w: 'Easy', p: 'Easy', sound: 'i' }, { l: 'ஈ', v: 'Easy', w: 'Easy', p: 'Medium', sound: 'ee' },
        { l: 'உ', v: 'Easy', w: 'Easy', p: 'Easy', sound: 'u' }, { l: 'ஊ', v: 'Medium', w: 'Medium', p: 'Medium', sound: 'oo' },
        { l: 'எ', v: 'Easy', w: 'Easy', p: 'Easy', sound: 'e' }, { l: 'ஏ', v: 'Medium', w: 'Medium', p: 'Medium', sound: 'ae' },
        { l: 'ஐ', v: 'Hard', w: 'Hard', p: 'Hard', sound: 'ai' }, { l: 'ஒ', v: 'Easy', w: 'Medium', p: 'Easy', sound: 'o' },
        { l: 'ஓ', v: 'Medium', w: 'Medium', p: 'Medium', sound: 'oh' }, { l: 'ஔ', v: 'Hard', w: 'Hard', p: 'Hard', sound: 'au' }
    ],
    mei: [
        { l: 'க்', v: 'Easy', w: 'Easy', p: 'Medium', base: 'க', sound: 'ik' }, { l: 'ங்', v: 'Hard', w: 'Medium', p: 'Hard', base: 'ங', sound: 'ing' },
        { l: 'ச்', v: 'Medium', w: 'Medium', p: 'Medium', base: 'ச', sound: 'ich' }, { l: 'ஞ்', v: 'Hard', w: 'Medium', p: 'Hard', base: 'ஞ', sound: 'inj' },
        { l: 'ட்', v: 'Medium', w: 'Medium', p: 'Medium', base: 'ட', sound: 'it' }, { l: 'ண்', v: 'Hard', w: 'Medium', p: 'Hard', base: 'ண', sound: 'inn' },
        { l: 'த்', v: 'Easy', w: 'Easy', p: 'Medium', base: 'த', sound: 'ith' }, { l: 'ந்', v: 'Easy', w: 'Easy', p: 'Easy', base: 'ந', sound: 'in' },
        { l: 'ப்', v: 'Easy', w: 'Easy', p: 'Medium', base: 'ப', sound: 'ip' }, { l: 'ம்', v: 'Easy', w: 'Easy', p: 'Easy', base: 'ம', sound: 'im' },
        { l: 'ய்', v: 'Medium', w: 'Medium', p: 'Easy', base: 'ய', sound: 'iy' }, { l: 'ர்', v: 'Medium', w: 'Medium', p: 'Medium', base: 'ர', sound: 'ir' },
        { l: 'ல்', v: 'Medium', w: 'Medium', p: 'Easy', base: 'ல', sound: 'il' }, { l: 'வ்', v: 'Medium', w: 'Medium', p: 'Easy', base: 'வ', sound: 'iv' },
        { l: 'ழ்', v: 'Hard', w: 'Hard', p: 'Hard', base: 'ழ', sound: 'izhl' }, { l: 'ள்', v: 'Hard', w: 'Medium', p: 'Hard', base: 'ள', sound: 'ill' },
        { l: 'ற்', v: 'Medium', w: 'Hard', p: 'Hard', base: 'ற', sound: 'itr' }, { l: 'ன்', v: 'Medium', w: 'Medium', p: 'Medium', base: 'ன', sound: 'in2' }
    ]
};

class AdaptiveEngine {
    constructor() {
        // Retrieve learning style from Assessment
        this.style = (localStorage.getItem('userStyle') || 'visual').toLowerCase();
        
        this.dataset = this.generateDataset();
        this.mistakeMatrix = JSON.parse(localStorage.getItem('thiranmozhi_mistakes')) || {};
        
        // Logical Stages Mapping
        this.stages = {
            basic: { uyir: ['அ', 'ஆ', 'இ', 'ஈ', 'உ'], mei: ['க்', 'ங்', 'ச்', 'ஞ்'] },
            intermediate: { uyir: ['ஊ', 'எ', 'ஏ', 'ஐ'], mei: ['ட்', 'ண்', 'த்', 'ந்', 'ப்'] },
            advanced: { uyir: ['ஒ', 'ஓ', 'ஔ'], mei: ['ம்', 'ய்', 'ர்', 'ல்', 'வ்', 'ழ்', 'ள்', 'ற்', 'ன்'] }
        };
    }

    generateDataset() {
        let all = [];
        TAMIL_DATA.uyir.forEach(l => all.push({ ...l, type: 'uyir', id: 'u-' + l.l }));
        TAMIL_DATA.mei.forEach(l => all.push({ ...l, type: 'mei', id: 'm-' + l.l }));

        const uyir_suffix_map = {
            'அ': '', 'ஆ': 'ா', 'இ': 'ி', 'ஈ': 'ீ', 'உ': 'ு', 'ஊ': 'ூ',
            'எ': 'ெ', 'ஏ': 'ே', 'ஐ': 'ை', 'ஒ': 'ொ', 'ஓ': 'ோ', 'ஔ': 'ௌ'
        };

        TAMIL_DATA.mei.forEach(m => {
            const base = m.base;
            TAMIL_DATA.uyir.forEach(u => {
                let char = base + uyir_suffix_map[u.l];
                all.push({ 
                    l: char,
                    type: 'uyirmei', 
                    base_mei: m.l, 
                    uyir: u.l, 
                    v: m.v, w: m.w, p: m.p 
                });
            });
        });
        return all;
    }

    getLettersForStage(stageName) {
        const stage = this.stages[stageName];
        if (!stage) return [];
        
        const filtered = this.dataset.filter(l => 
            (l.type === 'uyir' && stage.uyir.includes(l.l)) ||
            (l.type === 'mei' && stage.mei.includes(l.l))
        );

        // Adaptive Sorting based on Learning Style
        return filtered.sort((a, b) => {
            if (this.style === 'visual') return this.diffScore(a.v) - this.diffScore(b.v);
            if (this.style === 'kinesthetic') return this.diffScore(a.w) - this.diffScore(b.w);
            if (this.style === 'auditory') return this.diffScore(a.p) - this.diffScore(b.p);
            return 0;
        });
    }

    diffScore(val) {
        const map = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return map[val] || 0;
    }

    renderContent() {
        const container = document.getElementById('letter-gallery');
        if (!container) return;

        const stage = localStorage.getItem('tm_current_stage') || 'basic';
        const letters = this.getLettersForStage(stage);

        container.innerHTML = `
            <div class="stage-selector" style="display: flex; justify-content: center; gap: 15px; margin-bottom: 3rem;">
                ${['basic', 'intermediate', 'advanced'].map(s => `
                    <button class="btn ${stage === s ? 'btn-primary' : 'btn-secondary'}" 
                        onclick="localStorage.setItem('tm_current_stage','${s}'); location.reload()" 
                        style="padding: 0.8rem 2rem; border-radius: 100px; text-transform: capitalize;">
                        ${s}
                    </button>
                `).join('')}
            </div>
            <div class="letter-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem;">
                ${letters.map(item => `
                    <div class="card hover-float" onclick="window.location.href='activity.html?letter=${encodeURIComponent(item.l)}&type=${item.type}'" 
                        style="cursor: pointer; border: 3px solid var(--glass-border); padding: 2rem; background: rgba(255,255,255,0.05); border-radius: 24px; text-align:center; backdrop-filter: blur(10px);">
                        <h2 style="font-size: 5rem; color: var(--primary); margin: 0; font-family: 'Baloo Thambi 2';">${item.l}</h2>
                        <div style="font-size: 0.8rem; opacity: 0.6; margin-top: 10px; font-weight: 800; letter-spacing: 1px;">${item.type.toUpperCase()}</div>
                        <div style="margin-top: 20px; font-weight: 900; color: white;">PRACTICE <i class="fa-solid fa-chevron-right" style="font-size:0.8rem"></i></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getLetterData(char) {
        return this.dataset.find(l => l.l === char);
    }
}

// Global initialization
window.adaptiveEngineSys = new AdaptiveEngine();
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('letter-gallery')) {
        window.adaptiveEngineSys.renderContent();
    }
});
