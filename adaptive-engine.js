const TAMIL_DATA = {
    uyir: [
        { l: 'அ', v: 'Easy', w: 'Easy', p: 'Easy' }, { l: 'ஆ', v: 'Easy', w: 'Easy', p: 'Easy' },
        { l: 'இ', v: 'Easy', w: 'Easy', p: 'Easy' }, { l: 'ஈ', v: 'Easy', w: 'Easy', p: 'Medium' },
        { l: 'உ', v: 'Easy', w: 'Easy', p: 'Easy' }, { l: 'ஊ', v: 'Medium', w: 'Medium', p: 'Medium' },
        { l: 'எ', v: 'Easy', w: 'Easy', p: 'Easy' }, { l: 'ஏ', v: 'Medium', w: 'Medium', p: 'Medium' },
        { l: 'ஐ', v: 'Hard', w: 'Hard', p: 'Hard' }, { l: 'ஒ', v: 'Easy', w: 'Medium', p: 'Easy' },
        { l: 'ஓ', v: 'Medium', w: 'Medium', p: 'Medium' }, { l: 'ஔ', v: 'Hard', w: 'Hard', p: 'Hard' }
    ],
    mei: [
        { l: 'க', v: 'Easy', w: 'Easy', p: 'Medium' }, { l: 'ங', v: 'Hard', w: 'Medium', p: 'Hard' },
        { l: 'ச', v: 'Medium', w: 'Medium', p: 'Medium' }, { l: 'ஞ', v: 'Hard', w: 'Medium', p: 'Hard' },
        { l: 'ட', v: 'Medium', w: 'Medium', p: 'Medium' }, { l: 'ண', v: 'Hard', w: 'Medium', p: 'Hard' },
        { l: 'த', v: 'Easy', w: 'Easy', p: 'Medium' }, { l: 'ந', v: 'Easy', w: 'Easy', p: 'Easy' },
        { l: 'ப', v: 'Easy', w: 'Easy', p: 'Medium' }, { l: 'ம', v: 'Easy', w: 'Easy', p: 'Easy' },
        { l: 'ய', v: 'Medium', w: 'Medium', p: 'Easy' }, { l: 'ர', v: 'Medium', w: 'Medium', p: 'Medium' },
        { l: 'ல', v: 'Medium', w: 'Medium', p: 'Easy' }, { l: 'வ', v: 'Medium', w: 'Medium', p: 'Easy' },
        { l: 'ழ', v: 'Hard', w: 'Hard', p: 'Hard' }, { l: 'ள', v: 'Hard', w: 'Medium', p: 'Hard' },
        { l: 'ற', v: 'Medium', w: 'Hard', p: 'Hard' }, { l: 'ன', v: 'Medium', w: 'Medium', p: 'Medium' }
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
        // Add Mei
        TAMIL_DATA.mei.forEach(l => all.push({ ...l, type: 'mei', id: 'm-' + l.l }));
        // Generate Uyirmei logic (216)
        TAMIL_DATA.mei.forEach(m => {
            TAMIL_DATA.uyir.forEach(u => {
                // Simplified result generation for logic
                all.push({ 
                    l: m.l + u.l, // This is a placeholder for combined character
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
            <div class="stage-selector mb-3 text-center">
                <button class="btn ${stage==='basic'?'btn-primary':'btn-secondary'}" onclick="localStorage.setItem('tm_current_stage','basic'); location.reload()">Basic</button>
                <button class="btn ${stage==='intermediate'?'btn-primary':'btn-secondary'}" onclick="localStorage.setItem('tm_current_stage','intermediate'); location.reload()">Intermediate</button>
                <button class="btn ${stage==='advanced'?'btn-primary':'btn-secondary'}" onclick="localStorage.setItem('tm_current_stage','advanced'); location.reload()">Advanced</button>
            </div>
            <div class="grid-4">
                ${letters.map(item => `
                    <div class="card text-center hover-float" onclick="app.navigate('tracing.html?letter=${item.l}')" style="cursor: pointer; border: 2px solid var(--primary-purple);">
                        <h2 style="font-size: 5rem; color: var(--primary-purple); margin: 0.5rem 0; font-family: var(--font-tamil);">${item.l}</h2>
                        <div class="badge mb-1" style="font-size:0.8rem; background:rgba(0,0,0,0.05);">${item.type}</div>
                        <button class="btn btn-blue btn-small">Practice</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

window.adaptiveEngineSys = new AdaptiveEngine();
window.DOMContentLoaded = () => window.adaptiveEngineSys.renderContent();
