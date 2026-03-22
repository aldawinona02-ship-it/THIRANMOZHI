const typingLevels = [
    { target: 'அப்பா', letters: ['அ', 'ப்', 'பா', 'மா', 'ண்'] },
    { target: 'படம்', letters: ['ப', 'ட', 'ம்', 'க', 'ல்'] },
    { target: 'மரம்', letters: ['ம', 'ர', 'ம்', 'ச', 'த'] }
];

let currentLevel = 0;
let currentInput = "";
let targetLetters = [];

const targetEl = document.getElementById('target');
const inputArea = document.getElementById('input-area');
const keyboardEl = document.getElementById('keyboard');

function loadLevel() {
    const level = typingLevels[currentLevel];
    targetEl.innerText = level.target;
    currentInput = "";
    
    // Split target into logical tamil letters (rudimentary split for basic words)
    // We are ensuring the target array matches the required keys perfectly for simplicity in V1
    if(level.target === 'அப்பா') targetLetters = ['அ', 'ப்', 'பா'];
    if(level.target === 'படம்') targetLetters = ['ப', 'ட', 'ம்'];
    if(level.target === 'மரம்') targetLetters = ['ம', 'ர', 'ம்'];

    renderInputArea();
    renderKeyboard(level.letters);
}

function renderInputArea() {
    inputArea.innerHTML = '';
    for(let i=0; i<targetLetters.length; i++) {
        const div = document.createElement('div');
        div.className = 'typed-char';
        // If currentInput is 'அப்', length is 2. i=0 is 'அ', i=1 is 'ப்'.
        // Wait, currentInput should be an array of typed keys
        window.typedArray = window.typedArray || [];
        div.innerText = window.typedArray[i] || "";
        inputArea.appendChild(div);
    }
}

function renderKeyboard(letters) {
    keyboardEl.innerHTML = '';
    
    // Shuffle keys
    const shuffled = [...letters].sort(() => Math.random() - 0.5);

    shuffled.forEach(char => {
        const btn = document.createElement('button');
        btn.className = 'key';
        btn.innerText = char;
        btn.onclick = () => handleKeyPress(char);
        keyboardEl.appendChild(btn);
    });

    const clearBtn = document.createElement('button');
    clearBtn.className = 'key action';
    clearBtn.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
    clearBtn.onclick = clearInput;
    keyboardEl.appendChild(clearBtn);
}

function handleKeyPress(char) {
    if (!window.typedArray) window.typedArray = [];
    if (window.typedArray.length < targetLetters.length) {
        window.typedArray.push(char);
        renderInputArea();
        checkWinCondition();
    }
}

function clearInput() {
    if(window.typedArray && window.typedArray.length > 0) {
        window.typedArray.pop();
        renderInputArea();
    }
}

function checkWinCondition() {
    const typedStr = window.typedArray.join('');
    if (typedStr === typingLevels[currentLevel].target) {
        setTimeout(() => {
            alert('Perfect Typing! +10 XP');
            let xp = parseInt(localStorage.getItem('tm_xp') || '0');
            localStorage.setItem('tm_xp', xp + 10);
            
            window.typedArray = [];
            currentLevel++;
            if(currentLevel >= typingLevels.length) currentLevel = 0;
            loadLevel();
        }, 300);
    } else if (window.typedArray.length === targetLetters.length) {
        setTimeout(() => {
            alert('Incorrect. Try again.');
            window.typedArray = [];
            renderInputArea();
        }, 300);
    }
}

// Init
window.typedArray = [];
loadLevel();
