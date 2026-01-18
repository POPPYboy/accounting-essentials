/**
 * Interactive Accounting Components
 * Reusable logic for learning interactions
 */

/**
 * Background Particle System
 * Floating particles with mouse-responsive constellation effects
 */
class BackgroundParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.isMouseOver = false;

        this.theme = {
            particle: 'rgba(26, 35, 126, 0.12)', // Light navy particles
            line: 'rgba(26, 35, 126, 0.05)'   // Faint constellation lines
        };

        this.resize();
        this.initParticles();
        this.bindEvents();

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // Handle high-DPI displays (Retina) for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        
        // Scale the context to match the device pixel ratio
        this.ctx.scale(dpr, dpr);
    }

    initParticles() {
        this.particles = [];
        const count = Math.min(150, (this.width * this.height) / 10000);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 1,
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.initParticles();
        });

        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.isMouseOver = true;
        });
    }

    update() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (this.isMouseOver) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    p.vx -= dx * force * 0.005;
                    p.vy -= dy * force * 0.005;
                }
            }

            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            p.vx *= 0.99;
            p.vy *= 0.99;
        });
    }

    draw() {
        // Clear using actual pixel dimensions
        const dpr = window.devicePixelRatio || 1;
        this.ctx.clearRect(0, 0, this.width * dpr, this.height * dpr);
        this.ctx.fillStyle = this.theme.particle;

        this.particles.forEach((p, i) => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
                if (dist < 80) {
                    this.ctx.strokeStyle = `rgba(26, 35, 126, ${0.1 * (1 - dist / 80)})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

class InteractiveSystem {
    init() {
        this.bindFlipCards();
        this.bindQuizzes();
        this.bindCalculators();
        this.bindFormValidators();
        console.log("Accounting Interactive System Initialized");
    }

    // Flip Cards Logic
    bindFlipCards() {
        document.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });
    }

    // Quiz Component Logic
    bindQuizzes() {
        document.querySelectorAll('.quiz-container').forEach(container => {
            const submitBtn = container.querySelector('.quiz-submit');
            if (submitBtn) {
                submitBtn.addEventListener('click', () => {
                    this.checkQuiz(container);
                });
            }
        });
    }

    checkQuiz(container) {
        const selected = container.querySelector('input[type="radio"]:checked');
        const feedback = container.querySelector('.feedback');
        
        if (!selected) {
            this.showFeedback(feedback, "Please select an answer first.", "incorrect");
            return;
        }

        const isCorrect = selected.dataset.correct === "true";
        if (isCorrect) {
            this.showFeedback(feedback, "Correct! Great job.", "correct");
        } else {
            const explanation = container.dataset.explanation || "That's not quite right. Try again.";
            this.showFeedback(feedback, explanation, "incorrect");
        }
    }

    // Form Validation for Exercises
    bindFormValidators() {
        document.querySelectorAll('.exercise-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateExercise(form);
            });
        });
    }

    validateExercise(form) {
        const inputs = form.querySelectorAll('input[data-answer]');
        const feedback = form.querySelector('.feedback');
        let allCorrect = true;
        let incorrectCount = 0;

        inputs.forEach(input => {
            const expected = input.dataset.answer.toLowerCase().trim();
            const actual = input.value.toLowerCase().trim();
            
            if (actual === expected) {
                input.style.borderColor = "var(--success)";
            } else {
                input.style.borderColor = "var(--error)";
                allCorrect = false;
                incorrectCount++;
            }
        });

        if (allCorrect) {
            this.showFeedback(feedback, form.dataset.successText || "Excellent! You've mastered this concept.", "correct");
        } else {
            this.showFeedback(feedback, `You have ${incorrectCount} incorrect answers. Check the red fields and try again.`, "incorrect");
        }
    }

    // Calculator Tools
    bindCalculators() {
        // ROA Calculator
        const roaCalc = document.getElementById('roa-calculator');
        if (roaCalc) {
            const inputs = roaCalc.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.calculateROA());
            });
        }

        // Accounting Equation Calculator
        const eqCalc = document.getElementById('equation-calculator');
        if (eqCalc) {
            const inputs = eqCalc.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.calculateEquation());
            });
        }
    }

    showFeedback(element, message, type) {
        if (!element) return;
        element.textContent = message;
        element.className = `feedback ${type}`;
        element.style.display = 'block';
        
        // Scroll to feedback if on mobile
        if (window.innerWidth < 768) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Formula: Net Income / Average Total Assets
    calculateROA() {
        const income = parseFloat(document.getElementById('roa-income').value) || 0;
        const assets = parseFloat(document.getElementById('roa-assets').value) || 0;
        const result = document.getElementById('roa-result');
        
        if (assets > 0) {
            const roa = (income / assets) * 100;
            result.textContent = roa.toFixed(2) + "%";
        } else {
            result.textContent = "0.00%";
        }
    }

    // Formula: Assets = Liabilities + Equity
    calculateEquation() {
        const assets = parseFloat(document.getElementById('eq-assets').value) || 0;
        const liabilities = parseFloat(document.getElementById('eq-liabilities').value) || 0;
        const equity = parseFloat(document.getElementById('eq-equity').value) || 0;
        const status = document.getElementById('eq-status');

        if (assets === (liabilities + equity) && assets !== 0) {
            status.textContent = "BALANCED";
            status.style.color = "var(--success)";
        } else {
            status.textContent = "UNBALANCED";
            status.style.color = "var(--error)";
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize background particles
    new BackgroundParticles('global-bg-canvas');

    // Initialize interactive system
    const system = new InteractiveSystem();
    system.init();
});
