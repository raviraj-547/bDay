// ===== CONFETTI ANIMATION =====
class Confetti {
    constructor() {
        this.canvas = document.getElementById('confetti-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'];
        this.isRunning = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || -20,
            size: Math.random() * 10 + 5,
            speedX: Math.random() * 6 - 3,
            speedY: Math.random() * 3 + 2,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            shape: Math.random() > 0.5 ? 'square' : 'circle',
            opacity: 1
        };
    }

    burst(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            const particle = this.createParticle(x, y);
            particle.speedX = Math.random() * 15 - 7.5;
            particle.speedY = Math.random() * -15 - 5;
            this.particles.push(particle);
        }
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    rain(duration = 5000) {
        const startTime = Date.now();
        const addParticles = () => {
            if (Date.now() - startTime < duration) {
                for (let i = 0; i < 5; i++) {
                    this.particles.push(this.createParticle());
                }
                setTimeout(addParticles, 50);
            }
        };
        addParticles();
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, index) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += 0.1; // gravity
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.005;

            if (p.y > this.canvas.height || p.opacity <= 0) {
                this.particles.splice(index, 1);
                return;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;

            if (p.shape === 'square') {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        });

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isRunning = false;
        }
    }
}

// ===== INITIALIZE =====
const confetti = new Confetti();

// ===== CELEBRATION BUTTON =====
const celebrateBtn = document.getElementById('celebrate-btn');
let celebrationCount = 0;

celebrateBtn.addEventListener('click', function (e) {
    celebrationCount++;

    // Burst confetti at button location
    const rect = e.target.getBoundingClientRect();
    confetti.burst(rect.left + rect.width / 2, rect.top);

    // Full screen confetti rain
    confetti.rain(3000);

    // Add celebrating class to body
    document.body.classList.add('celebrating');
    setTimeout(() => {
        document.body.classList.remove('celebrating');
    }, 3000);

    // Change button text based on clicks
    const messages = [
        '🎊 Click for More! 🎊',
        '🎉 Keep Going! 🎉',
        '🥳 You Rock! 🥳',
        '🎈 Party Time! 🎈',
        '🎁 So Fun! 🎁',
        '✨ Amazing! ✨',
        '🌟 Woohoo! 🌟',
        '💖 Love It! 💖'
    ];
    celebrateBtn.innerHTML = messages[celebrationCount % messages.length];

    // Try to play audio (if exists)
    const audio = document.getElementById('birthday-audio');
    if (audio && audio.paused) {
        audio.play().catch(() => { }); // Ignore errors if no audio file
    }

    // Add burst effect
    celebrateBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        celebrateBtn.style.transform = '';
    }, 200);
});

// ===== INITIAL CONFETTI ON PAGE LOAD =====
window.addEventListener('load', () => {
    setTimeout(() => {
        confetti.rain(2000);
    }, 1000);

    // Try to play audio automatically (if exists)
    const audio = document.getElementById('birthday-audio');
    if (audio) {
        audio.play().catch(() => { }); // Ignore errors if no audio file or autoplay blocked
    }
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ===== FACT CARDS INTERACTION =====
document.querySelectorAll('.fact-card').forEach(card => {
    card.addEventListener('click', function () {
        // Add a small confetti burst
        const rect = this.getBoundingClientRect();
        confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);

        // Add wobble animation
        this.style.animation = 'none';
        this.offsetHeight; // Trigger reflow
        this.style.animation = 'wobble 0.5s ease-in-out';
    });
});

// Add wobble keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes wobble {
        0%, 100% { transform: translateY(-10px) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(-5deg); }
        75% { transform: translateY(-10px) rotate(5deg); }
    }
`;
document.head.appendChild(style);

// ===== PHOTO FRAME INTERACTION =====
const photoFrame = document.querySelector('.photo-frame');
if (photoFrame) {
    photoFrame.addEventListener('click', function () {
        const rect = this.getBoundingClientRect();
        confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
    });
}

// ===== DYNAMIC NAME AND AGE (Customization) =====
// Interactive age input with modal
const ageModal = document.getElementById('age-modal');
const ageInput = document.getElementById('age-input');
const ageSubmitBtn = document.getElementById('age-submit');
const ageValueDisplay = document.getElementById('age-value');

// Check if age is already saved
const savedAge = sessionStorage.getItem('birthdayAge');
if (savedAge) {
    ageValueDisplay.textContent = savedAge;
    ageModal.classList.add('hidden');
}

// Handle age submission
function submitAge() {
    const age = ageInput.value;
    if (age && !isNaN(age) && age > 0 && age <= 150) {
        sessionStorage.setItem('birthdayAge', age);
        ageValueDisplay.textContent = age;
        ageModal.classList.add('hidden');

        // Celebrate the age entry!
        confetti.rain(3000);
        document.body.classList.add('celebrating');
        setTimeout(() => {
            document.body.classList.remove('celebrating');
        }, 3000);
    } else {
        ageInput.style.animation = 'wobble 0.5s ease-in-out';
        setTimeout(() => {
            ageInput.style.animation = '';
        }, 500);
    }
}

ageSubmitBtn.addEventListener('click', submitAge);
ageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitAge();
    }
});

const birthdayConfig = {
    name: "Little Bro",
    age: savedAge || "?",
    customMessage: null
};

// ===== MUSIC TOGGLE (Optional) =====
let musicPlaying = false;
document.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
        const audio = document.getElementById('birthday-audio');
        if (audio) {
            if (musicPlaying) {
                audio.pause();
            } else {
                audio.play().catch(() => { });
            }
            musicPlaying = !musicPlaying;
        }
    }
});

// ===== EASTER EGG: Double-click for mega confetti =====
document.body.addEventListener('dblclick', (e) => {
    confetti.burst(e.clientX, e.clientY, 100);
});

// ===== TYPING EFFECT FOR NAME (Optional) =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Uncomment to enable typing effect for name:
// setTimeout(() => {
//     const nameElement = document.getElementById('birthday-name');
//     typeWriter(nameElement, birthdayConfig.name, 150);
// }, 1500);

console.log('🎂 Happy Birthday Website Loaded! 🎉');
console.log('💡 Tip: Press "M" to toggle music (if you add a birthday-song.mp3 file)');
console.log('💡 Tip: Double-click anywhere for mega confetti!');
