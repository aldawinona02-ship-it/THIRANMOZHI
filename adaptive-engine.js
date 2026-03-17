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
        this.style = app.state.dominant_style || 'visual';
        this.letters = this.generateDataset();
        this.stages = {
            basic: { uyir: ['அ', 'இ', 'உ', 'எ', 'ஒ'], mei: ['க', 'த', 'ப', 'ந', 'ம'] },
            intermediate: { uyir: ['ஆ', 'ஈ', 'ஊ', 'ஏ', 'ஓ'], mei: ['ச', 'ய', 'ல', 'வ', 'ர'] },
            advanced: { uyir: ['ஐ', 'ஔ'], mei: ['ங', 'ஞ', 'ண', 'ழ', 'ள', 'ற'] }
        };
    }

    generateDataset() {
        let all = [];
        // Add Uyir
        TAMIL_DATA.uyir.forEach(l => all.push({ ...l, type: 'uyir', id: 'u-' + l.l }));
        // Add Mei (with pulli)
        TAMIL_DATA.mei.forEach(l => all.push({ ...l, type: 'mei', id: 'm-' + l.l }));
        
        // Proper Uyirmei generation logic
        const uyir_suffix_map = {
            'அ': '', 'ஆ': 'ா', 'இ': 'ி', 'ஈ': 'ீ', 'உ': 'ு', 'ஊ': 'ூ',
            'எ': 'ெ', 'ஏ': 'ே', 'ஐ': 'ை', 'ஒ': 'ொ', 'ஓ': 'ோ', 'ஔ': 'ௌ'
        };

        TAMIL_DATA.mei.forEach(m => {
            const base = m.base;
            TAMIL_DATA.uyir.forEach(u => {
                let char;
                // Special cases for U and UU vowel markers are complex in Tamil, 
                // but standard unicode handles most via combining marks.
                char = base + uyir_suffix_map[u.l];
                
                all.push({ 
                    l: char,
                    type: 'uyirmei', 
                    base_mei: m.l, 
                    uyir: u.l, 
                    v: m.v, w: m.w, p: m.p // inheriting difficulty
                });
            });
        });
        return all;
    }

    getLettersForStage(stageName) {
        const stage = this.stages[stageName];
        if(!stage) return [];
        
        const filtered = this.letters.filter(l => 
            (l.type === 'uyir' && stage.uyir.includes(l.l)) ||
            (l.type === 'mei' && stage.mei.includes(l.l))
        );

        // Sort based on learning style
        return filtered.sort((a, b) => {
            if(this.style === 'visual') return this.diffScore(a.v) - this.diffScore(b.v);
            if(this.style === 'kinesthetic') return this.diffScore(a.w) - this.diffScore(b.w);
            if(this.style === 'auditory') return this.diffScore(a.p) - this.diffScore(b.p);
            return 0;
        });
    }

    diffScore(val) {
        if(val === 'Easy') return 1;
        if(val === 'Medium') return 2;
        if(val === 'Hard') return 3;
        return 0;
    }

    renderContent() {
        const container = document.getElementById('letter-gallery');
        if(!container) return;

        const stage = localStorage.getItem('tm_current_stage') || 'basic';
        const letters = this.getLettersForStage(stage);

        container.innerHTML = `
            <div class="stage-selector mb-3 text-center" style="display: flex; justify-content: center; gap: 15px; margin-bottom: 3rem;">
                <button class="btn ${stage==='basic'?'btn-primary':'btn-secondary'}" onclick="localStorage.setItem('tm_current_stage','basic'); location.reload()" style="padding: 0.8rem 2rem; border-radius: 100px;">Basic</button>
                <button class="btn ${stage==='intermediate'?'btn-primary':'btn-secondary'}" onclick="localStorage.setItem('tm_current_stage','intermediate'); location.reload()" style="padding: 0.8rem 2rem; border-radius: 100px;">Intermediate</button>
                <button class="btn ${stage==='advanced'?'btn-primary':'btn-secondary'}" onclick="localStorage.setItem('tm_current_stage','advanced'); location.reload()" style="padding: 0.8rem 2rem; border-radius: 100px;">Advanced</button>
            </div>
            <div class="grid-4" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
                ${letters.map(item => `
                    <div class="card text-center hover-float" onclick="window.location.href='tracing.html?letter=${encodeURIComponent(item.l)}'" style="cursor: pointer; border: 4px solid var(--primary); padding: 2rem; background: var(--glass-bg); border-radius: var(--radius-lg);">
                        <h2 style="font-size: 6rem; color: var(--text-main); margin: 0.5rem 0; font-family: var(--font-tamil); line-height: 1;">${item.l}</h2>
                        <div style="font-size: 0.9rem; background: rgba(0,0,0,0.03); padding: 4px 12px; border-radius: 20px; display: inline-block; margin-bottom: 1.5rem; color: var(--text-muted); font-weight: 700;">${item.type.toUpperCase()}</div>
                        <button class="btn btn-primary" style="width: 100%; font-weight: 800;">Practice Now</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    getLetterData(char) {
        return this.letters.find(l => l.l === char);
    }
}

window.adaptiveEngineSys = new AdaptiveEngine();
window.DOMContentLoaded = () => window.adaptiveEngineSys.renderContent();
