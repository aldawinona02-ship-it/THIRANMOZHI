const rules = [
    { mei: 'க்', uyir: 'அ', result: 'க', options: ['க', 'கி', 'கு'] },
    { mei: 'ப்', uyir: 'ஆ', result: 'பா', options: ['ப', 'பா', 'பூ'] },
    { mei: 'ச்', uyir: 'இ', result: 'சி', options: ['சு', 'சீ', 'சி'] }
];

let currentRule = 0;

const meiEl = document.getElementById('mei');
const uyirEl = document.getElementById('uyir');
const targetEl = document.getElementById('target');
const choicesEl = document.getElementById('choices');

function loadRule() {
    const r = rules[currentRule];
    meiEl.innerText = r.mei;
    uyirEl.innerText = r.uyir;
    targetEl.innerText = '?';
    targetEl.classList.remove('filled');
    
    choicesEl.innerHTML = '';
    // Shuffle options nicely
    const opts = [...r.options].sort(() => Math.random() - 0.5);
    
    opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = opt;
        btn.onclick = () => validate(opt, btn);
        choicesEl.appendChild(btn);
    });
}

function validate(selected, btn) {
    const r = rules[currentRule];
    if(selected === r.result) {
        targetEl.innerText = selected;
        targetEl.classList.add('filled');
        setTimeout(() => {
            alert('Brilliant! +25 XP');
            let xp = parseInt(localStorage.getItem('tm_xp') || '0');
            localStorage.setItem('tm_xp', xp + 25);
            
            currentRule++;
            if(currentRule >= rules.length) currentRule = 0;
            loadRule();
        }, 800);
    } else {
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
        btn.style.background = '#FF4B4B';
        btn.style.color = 'white';
        btn.style.borderColor = '#D32F2F';
    }
}

loadRule();
