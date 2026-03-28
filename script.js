gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    setTimeout(() => {
        loader.classList.add('loaded');
        mainContent.classList.add('visible');
        setTimeout(() => {
            document.body.style.overflowX = 'hidden';
            initAnimations(); 
            typeEffect(); 
            fetchDynamicRepos();
        }, 500);
    }, 3000); 
});

// --- TYPING EFFECT ---
const typingText = document.querySelector(".typing-text");
const words = ["Chirag", "a Web Developer", "a Freelancer", "Creative"];
let wordIndex = 0; let charIndex = 0; let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    let typeSpeed = isDeleting ? 100 : 200;
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false; wordIndex++;
        if (wordIndex === words.length) { wordIndex = 0; }
        typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
}

// --- GSAP ANIMATIONS ---
function initAnimations() {
    gsap.to("nav", { duration: 1, opacity: 1, y: 0, ease: "power2.out" });
    gsap.to(".sidebar-left", { duration: 1, opacity: 1, y: 0, delay: 0.5, ease: "power2.out" });
    
    // LAG FIXED: Duration from 1.5 -> 0.6, Ease to power2.out, offsetY 70 so header doesn't overlap text
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            gsap.to(window, { duration: 0.6, scrollTo: { y: target, offsetY: 70 }, ease: "power2.out" });
        });
    });

    gsap.utils.toArray('.reveal-up').forEach(elem => {
        gsap.fromTo(elem, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none reverse" } }
        );
    });
}

// --- MAGNETIC BUTTONS ---
if(window.matchMedia("(min-width: 900px)").matches) {
    const magnets = document.querySelectorAll('.magnetic-btn');
    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(magnet, { duration: 0.3, x: x * 0.3, y: y * 0.3, ease: "power2.out" });
        });
        magnet.addEventListener('mouseleave', () => {
            gsap.to(magnet, { duration: 0.5, x: 0, y: 0, ease: "elastic.out(1, 0.3)" });
        });
    });
}

// --- BACK TO TOP BUTTON ---
(function($) { "use strict";
    var progressPath = document.querySelector('.progress-wrap path');
    var pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';		
    var updateProgress = function () {
        var scroll = window.scrollY || window.scrollTop || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var progress = pathLength - (scroll * pathLength / height);
        progressPath.style.strokeDashoffset = progress;
        var scrollElement = document.querySelector('.progress-wrap');
        if (scroll > 150) { scrollElement.classList.add('active-progress'); } else { scrollElement.classList.remove('active-progress'); }
    }
    updateProgress(); window.addEventListener('scroll', updateProgress);
    document.querySelector('.progress-wrap').addEventListener('click', function(event) {
        event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// --- COPY EMAIL TOAST ---
function copyEmail() {
    navigator.clipboard.writeText("kalilinux5488@gmail.com");
    var toast = document.getElementById("toast");
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

// --- SIMPLE CUSTOM CURSOR ---
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');
if(window.matchMedia("(min-width: 900px)").matches) {
    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        gsap.to(cursorOutline, { x: posX, y: posY, duration: 0.15, ease: "power2.out" });
    });
    
    const hoverables = document.querySelectorAll('a, button, .logo, .btn, .tech-icon, .sidebar-icon, .magnetic-btn');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('time-display').innerText = `India, UP • ${timeString}`;
}
setInterval(updateTime, 1000); updateTime();

// --- FETCH GITHUB REPOS ---
async function fetchDynamicRepos() {
    try {
        const response = await fetch('https://api.github.com/users/chiragchoudhary26/repos?sort=created&direction=desc');
        const repos = await response.json();
        const grid = document.getElementById('project-grid');
        const excluded = ['Jarvis', 'royal-1-m-', 'MY-WEBSITE']; 
        let count = 0;

        repos.forEach(repo => {
            if (!excluded.includes(repo.name) && count < 2) {
                const card = document.createElement('div');
                card.className = "project-card glass-panel reveal-up";
                card.setAttribute('data-tilt', '');
                const link = repo.homepage ? repo.homepage : repo.html_url;
                
                card.innerHTML = `
                    <div class="card-top">
                        <div class="folder-icon"><i class="fab fa-github"></i></div>
                        <h3>${repo.name.replace(/-/g, ' ')}</h3>
                        <p>${repo.description || 'A new innovative project by Chirag.'}</p>
                    </div>
                    <div class="card-meta">
                        <div class="tech-stack"><span>${repo.language || 'Code'}</span></div>
                        <a href="${link}" target="_blank" class="project-link magnetic-btn">View Project &rarr;</a>
                    </div>
                `;
                grid.appendChild(card); count++;
            }
        });

        const newCards = document.querySelectorAll('[data-tilt]');
        newCards.forEach(card => applyTilt(card));
        
        gsap.fromTo(".project-card:not([style])", 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2 }
        );
    } catch (error) { console.log("GitHub API Error: ", error); }
}

function applyTilt(card) {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        const centerX = rect.width / 2; const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
    });
}
document.querySelectorAll('[data-tilt]').forEach(card => applyTilt(card));

// --- CONNECTING PARTICLES ---
const canvas = document.getElementById('particles-js');
const ctx = canvas.getContext('2d');
let particlesArray = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas); resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if(this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if(this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = '#ffcc00'; ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    }
}
function init() { for(let i=0; i<70; i++) particlesArray.push(new Particle()); } init();

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 204, 0, ${1 - distance/150})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}
animate();

// --- ORBIT SCENE ---
const orbitScene = document.getElementById('orbit-scene');
if(orbitScene) {
    const icons = ['fa-html5', 'fa-css3-alt', 'fa-js', 'fa-github'];
    icons.forEach((icon, index) => {
        const el = document.createElement('div'); el.className = 'tech-icon';
        el.innerHTML = `<i class="fab ${icon}"></i>`;
        const angle = (index / icons.length) * (2 * Math.PI); const radius = 140;
        let currentAngle = angle;
        function rotateIcon() {
            currentAngle += 0.005;
            el.style.left = `${Math.cos(currentAngle) * radius + 170}px`;
            el.style.top = `${Math.sin(currentAngle) * radius + 170}px`;
            requestAnimationFrame(rotateIcon);
        }
        orbitScene.appendChild(el); rotateIcon();
    });
}

fetch('https://api.github.com/users/chiragchoudhary26')
    .then(res => res.json())
    .then(data => { if(data.public_repos) document.getElementById('repo-count').innerText = data.public_repos + "+"; });

// ==========================================
// --- 1 FREE-ROAMING DRAGON ANIMATION ---
// ==========================================
const screen = document.getElementById("screen");
const xmlns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

let width = window.innerWidth;
let height = window.innerHeight;

// YAHAN CHECK KAREGA: Phone hai toh 0.2, Laptop hai toh 0.4
let dragonScale = window.innerWidth < 900 ? 0.2 : 0.4;

const autoPointer = { x: width / 2, y: height / 2 };

let rad = 0; let frm = Math.random(); const N = 35; const elems = [];

for (let i = 0; i < N; i++) elems[i] = { use: null, x: width / 2, y: 0 };

window.addEventListener("resize", () => { 
    dragonScale = window.innerWidth < 900 ? 0.2 : 0.4;
}, false);

const prepend = (use, i) => {
    const elem = document.createElementNS(xmlns, "use");
    elems[i].use = elem;
    elem.setAttributeNS(xlinkns, "href", "#" + use);
    screen.prepend(elem);
};

for (let i = 1; i < N; i++) {
    if (i === 1) prepend("Cabeza", i);
    else if (i === 8 || i === 14) prepend("Aletas", i);
    else prepend("Espina", i);
}

const radm = () => Math.min(width, height) / 2 - 20;

const runDragon = () => {
    requestAnimationFrame(runDragon);
    autoPointer.x = width / 2 + Math.cos(frm * 0.7) * (width * 0.4) + Math.sin(frm * 0.3) * (width * 0.1);
    autoPointer.y = height / 2 + Math.sin(frm * 0.5) * (height * 0.4) + Math.cos(frm * 0.2) * (height * 0.1);

    let e = elems[0];
    const ax = (Math.cos(3 * frm) * rad * width) / height;
    const ay = (Math.sin(4 * frm) * rad * height) / width;
    
    e.x += (ax + autoPointer.x - e.x) / 20; 
    e.y += (ay + autoPointer.y - e.y) / 20;

    for (let i = 1; i < N; i++) {
        let curr = elems[i]; let prev = elems[i - 1];
        const a = Math.atan2(curr.y - prev.y, curr.x - prev.x);
        curr.x += (prev.x - curr.x + (Math.cos(a) * (100 - i)) / 5) / 4;
        curr.y += (prev.y - curr.y + (Math.sin(a) * (100 - i)) / 5) / 4;
        
        const s = ((162 + 4 * (1 - i)) / 50) * dragonScale;
        
        curr.use.setAttributeNS(null, "transform", `translate(${(prev.x + curr.x) / 2},${(prev.y + curr.y) / 2}) rotate(${(180 / Math.PI) * a}) scale(${s},${s})`);
    }
    if (rad < radm()) rad++;
    frm += 0.002; 
};
runDragon();
