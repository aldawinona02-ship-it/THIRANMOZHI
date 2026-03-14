class AdaptiveEngine {
    constructor() {
        this.currentStyle = app.state.dominant_style || 'visual';
        this.availableLetters = [
            { id: 'uyir-1', letter: 'அ', type: 'uyir' },
            { id: 'uyir-2', letter: 'ஆ', type: 'uyir' },
            { id: 'uyir-3', letter: 'இ', type: 'uyir' },
            { id: 'uyir-4', letter: 'ஈ', type: 'uyir' },
        ];
    }

    getLetterData(id) {
        return this.availableLetters.find(l => l.id === id);
    }

    renderContent() {
        const container = document.getElementById('letter-gallery');
        if(!container) return;

        let html = '';
        this.availableLetters.forEach(item => {
            html += `
                <div class="card text-center hover-float" onclick="app.navigate('tracing.html?letter=${item.id}')" style="cursor: pointer; border: 2px solid var(--primary-purple);">
                    <h2 style="font-size: 4rem; color: var(--primary-purple); margin: 1rem 0;">${item.letter}</h2>
                    <button class="btn btn-blue btn-small">Learn</button>
                </div>
            `;
        });
        container.innerHTML = html;
    }
}

window.adaptiveEngineSys = new AdaptiveEngine();
