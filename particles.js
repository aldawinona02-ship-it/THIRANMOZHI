const canvas = document.getElementById("particlesCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let letters = ["அ","ஆ","இ","ஈ","உ","ஊ","எ","ஏ","ஐ","ஒ"];
let particles = [];
let animationState = "idle"; 
// idle -> antigravity -> gravity -> end

class LetterParticle{
    constructor(){
        this.x = Math.random()*canvas.width;
        this.y = Math.random()*canvas.height;
        this.vy = 0;
        this.letter = letters[Math.floor(Math.random()*letters.length)];
        this.size = 40 + Math.random()*20;
    }

    update(){

        if(animationState === "antigravity"){
            this.vy -= 0.2;
        }

        if(animationState === "gravity"){
            this.vy += 0.3;
        }

        this.y += this.vy;
    }

    draw(){
        ctx.font = this.size+"px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(this.letter,this.x,this.y);
    }
}

function createParticles(){
    for(let i=0;i<40;i++){
        particles.push(new LetterParticle());
    }
}

function animate(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p=>{
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

createParticles();
animate();