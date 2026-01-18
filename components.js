/**
 * Interactive Accounting Components
 * Reusable logic for learning interactions
 */

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
    const system = new InteractiveSystem();
    system.init();
});
