/**
 * Enhanced Interactive Accounting Components
 * Includes SVG animations, interactive calculators, and advanced learning tools
 */

class EnhancedInteractiveSystem {
    constructor() {
        this.animationQueue = [];
        this.svgAnimations = {};
    }

    init() {
        this.bindFlipCards();
        this.bindQuizzes();
        this.bindCalculators();
        this.bindFormValidators();
        this.bindDragDrop();
        this.initSVGAnimations();
        this.bindStepByStep();
        this.bindFlashcards();
        this.bindTimelineAnimations();
        console.log("Enhanced Accounting Interactive System Initialized");
    }

    // =====================
    // SVG ANIMATION SYSTEM
    // =====================
    initSVGAnimations() {
        this.svgAnimations = {
            // Accounting Equation Balance Animation
            equationBalance: {
                id: 'equation-animation',
                frame: 0,
                totalFrames: 60,
                elements: {
                    assets: { x: 100, y: 150, targetX: 100, color: '#1a237e' },
                    liabilities: { x: 350, y: 150, targetX: 350, color: '#e74c3c' },
                    equity: { x: 500, y: 150, targetX: 500, color: '#27ae60' }
                },
                animate: (progress, elements) => {
                    const bounce = Math.sin(progress * Math.PI * 2) * 10;
                    return {
                        assets: { x: 100 + bounce },
                        liabilities: { x: 350 - bounce * 0.5 },
                        equity: { x: 500 + bounce * 0.5 }
                    };
                }
            },

            // Transaction Flow Animation
            transactionFlow: {
                id: 'transaction-animation',
                particles: [],
                animate: (canvas, ctx, progress) => {
                    const width = canvas.width;
                    const height = canvas.height;

                    // Clear canvas
                    ctx.clearRect(0, 0, width, height);

                    // Draw flow paths
                    ctx.strokeStyle = '#c5a059';
                    ctx.lineWidth = 3;

                    // Draw curved paths from source to destination
                    for (let i = 0; i < 3; i++) {
                        const startX = 100 + (i * 200);
                        const startY = 100;
                        const endX = 100 + (i * 200) + 50;
                        const endY = 200;

                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.quadraticCurveTo(
                            startX + 25,
                            startY + 50,
                            endX,
                            endY
                        );
                        ctx.stroke();

                        // Animate particle
                        const particleProgress = (progress + i * 0.33) % 1;
                        const px = startX + (endX - startX) * particleProgress;
                        const py = startY + (endY - startY) * particleProgress;

                        ctx.fillStyle = '#1a237e';
                        ctx.beginPath();
                        ctx.arc(px, py, 8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            },

            // T-Account Balance Animation
            tAccountBalance: {
                id: 'taccount-animation',
                debitBalance: 0,
                creditBalance: 0,
                animate: (canvas, ctx, progress) => {
                    const width = canvas.width;
                    const height = canvas.height;

                    ctx.clearRect(0, 0, width, height);

                    // Draw T-Account
                    ctx.strokeStyle = '#1a237e';
                    ctx.lineWidth = 2;
                    ctx.lineWidth = 2;

                    // Top bar
                    ctx.beginPath();
                    ctx.moveTo(80, 60);
                    ctx.lineTo(320, 60);
                    ctx.stroke();

                    // Vertical line
                    ctx.beginPath();
                    ctx.moveTo(200, 60);
                    ctx.lineTo(200, 200);
                    ctx.stroke();

                    // Animate balances
                    const debitAmount = Math.sin(progress * Math.PI) * 50 + 50;
                    const creditAmount = Math.cos(progress * Math.PI) * 50 + 50;

                    ctx.fillStyle = '#27ae60';
                    ctx.font = 'bold 24px Arial';
                    ctx.textAlign = 'center';

                    // Debit side
                    ctx.fillText('DEBIT', 140, 90);
                    ctx.fillStyle = '#1a237e';
                    ctx.font = '20px Arial';
                    ctx.fillText('$' + Math.abs(debitAmount).toFixed(0), 140, 140);

                    // Credit side
                    ctx.fillStyle = '#e74c3c';
                    ctx.font = 'bold 24px Arial';
                    ctx.fillText('CREDIT', 260, 90);
                    ctx.fillStyle = '#1a237e';
                    ctx.font = '20px Arial';
                    ctx.fillText('$' + Math.abs(creditAmount).toFixed(0), 260, 140);
                }
            },

            // Journal Entry Step Animation
            journalEntrySteps: {
                id: 'journal-steps-animation',
                currentStep: 0,
                steps: [
                    { title: 'Identify Transaction', description: 'What happened?' },
                    { title: 'Determine Accounts', description: 'Which accounts change?' },
                    { title: 'Apply Debits/Credits', description: 'Left or Right?' },
                    { title: 'Verify Balance', description: 'Debits = Credits?' }
                ],
                animate: (canvas, ctx, progress) => {
                    const width = canvas.width;
                    const height = canvas.height;
                    const stepIndex = Math.floor(progress * 4) % 4;
                    const stepProgress = (progress * 4) % 1;

                    ctx.clearRect(0, 0, width, height);

                    // Draw step indicator
                    for (let i = 0; i < 4; i++) {
                        const x = 60 + i * 130;
                        const y = 50;
                        const isActive = i === stepIndex;
                        const isPast = i < stepIndex;

                        ctx.beginPath();
                        ctx.arc(x, y, 30, 0, Math.PI * 2);
                        ctx.fillStyle = isActive ? '#c5a059' : (isPast ? '#27ae60' : '#e0e0e0');
                        ctx.fill();

                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 18px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillText((i + 1), x, y + 7);
                    }

                    // Draw connecting lines
                    ctx.strokeStyle = '#c0c0c0';
                    ctx.lineWidth = 2;
                    for (let i = 0; i < 3; i++) {
                        ctx.beginPath();
                        ctx.moveTo(60 + i * 130 + 30, 50);
                        ctx.lineTo(60 + (i + 1) * 130 - 30, 50);
                        ctx.stroke();
                    }

                    // Draw current step content
                    const currentStep = this.steps[stepIndex];
                    const boxWidth = 400;
                    const boxHeight = 120;
                    const boxX = (width - boxWidth) / 2;
                    const boxY = 100;

                    ctx.fillStyle = 'rgba(26, 35, 126, 0.05)';
                    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

                    ctx.strokeStyle = '#1a237e';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

                    ctx.fillStyle = '#1a237e';
                    ctx.font = 'bold 24px Arial';
                    ctx.textAlign = 'left';
                    ctx.fillText(currentStep.title, boxX + 20, boxY + 40);

                    ctx.font = '18px Arial';
                    ctx.fillStyle = '#2c3e50';
                    ctx.fillText(currentStep.description, boxX + 20, boxY + 80);
                }
            },

            // Income Statement Flow Animation
            incomeStatementFlow: {
                id: 'income-statement-animation',
                animate: (canvas, ctx, progress) => {
                    const width = canvas.width;
                    const height = canvas.height;

                    ctx.clearRect(0, 0, width, height);

                    const elements = [
                        { name: 'Revenue', y: 60, color: '#27ae60' },
                        { name: '- Cost of Goods Sold', y: 110, color: '#e74c3c' },
                        { name: '= Gross Profit', y: 160, color: '#c5a059' },
                        { name: '- Operating Expenses', y: 210, color: '#e74c3c' },
                        { name: '= Net Income', y: 260, color: '#1a237e' }
                    ];

                    elements.forEach((el, index) => {
                        const alpha = 0.3 + 0.7 * Math.min(1, (progress * 5 - index * 0.8));
                        const yOffset = Math.max(0, (progress * 5 - index * 0.8) * 20);

                        ctx.fillStyle = el.color;
                        ctx.globalAlpha = alpha;
                        ctx.font = 'bold 20px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillText(el.name, width / 2, el.y + yOffset);
                    });

                    // Draw arrow
                    if (progress > 0.2) {
                        ctx.strokeStyle = '#c0c0c0';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(width / 2, 270);
                        ctx.lineTo(width / 2, 310);
                        ctx.stroke();

                        ctx.fillStyle = '#1a237e';
                        ctx.font = '16px Arial';
                        ctx.fillText('To Balance Sheet', width / 2, 340);
                    }
                }
            }
        };

        // Start animations for all SVG canvases
        Object.keys(this.svgAnimations).forEach(key => {
            this.startAnimation(key);
        });
    }

    startAnimation(animationKey) {
        const anim = this.svgAnimations[animationKey];
        if (!anim) return;

        const canvas = document.getElementById(anim.id);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let startTime = null;
        let duration = 3000; // 3 seconds per loop

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = (elapsed % duration) / duration;

            if (anim.animate) {
                anim.animate(canvas, ctx, progress);
            }

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    // =====================
    // ENHANCED QUIZ SYSTEM
    // =====================
    bindQuizzes() {
        document.querySelectorAll('.quiz-container').forEach(container => {
            const submitBtn = container.querySelector('.quiz-submit');
            const retryBtn = container.querySelector('.quiz-retry');

            if (submitBtn) {
                submitBtn.addEventListener('click', () => this.checkQuiz(container));
            }

            if (retryBtn) {
                retryBtn.addEventListener('click', () => this.retryQuiz(container));
            }
        });
    }

    checkQuiz(container) {
        const selected = container.querySelector('input[type="radio"]:checked');
        const feedback = container.querySelector('.feedback');
        const explanation = container.querySelector('.quiz-explanation');
        const retryBtn = container.querySelector('.quiz-retry');
        const submitBtn = container.querySelector('.quiz-submit');

        if (!selected) {
            this.showFeedback(feedback, "Please select an answer first.", "incorrect");
            return;
        }

        const isCorrect = selected.dataset.correct === "true";

        if (isCorrect) {
            this.showFeedback(feedback, container.dataset.successText || "Correct! Excellent work.", "correct");
            if (explanation) explanation.style.display = 'block';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Completed ✓';
        } else {
            const hints = container.dataset.hints || "";
            const explanationText = container.dataset.explanation || "That's not quite right. Try again.";
            this.showFeedback(feedback, explanationText + "\n" + hints, "incorrect");
        }
    }

    retryQuiz(container) {
        const feedback = container.querySelector('.feedback');
        const explanation = container.querySelector('.quiz-explanation');
        const retryBtn = container.querySelector('.quiz-retry');
        const submitBtn = container.querySelector('.quiz-submit');
        const selected = container.querySelector('input[type="radio"]:checked');

        if (selected) selected.checked = false;
        if (feedback) feedback.style.display = 'none';
        if (explanation) explanation.style.display = 'none';
        if (retryBtn) retryBtn.style.display = 'none';
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Check Answer';
        }
    }

    // =====================
    // DRAG AND DROP
    // =====================
    bindDragDrop() {
        document.querySelectorAll('.drag-drop-container').forEach(container => {
            const draggables = container.querySelectorAll('.draggable');
            const dropZones = container.querySelectorAll('.drop-zone');
            const checkBtn = container.querySelector('.drag-check');
            const feedback = container.querySelector('.feedback');

            draggables.forEach(item => {
                item.draggable = true;
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', item.dataset.value);
                    item.classList.add('dragging');
                });

                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                });
            });

            dropZones.forEach(zone => {
                zone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    zone.classList.add('drag-over');
                });

                zone.addEventListener('dragleave', () => {
                    zone.classList.remove('drag-over');
                });

                zone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    zone.classList.remove('drag-over');
                    const value = e.dataTransfer.getData('text/plain');
                    const item = container.querySelector(`[data-value="${value}"]`);
                    zone.innerHTML = '';
                    zone.appendChild(item);
                });
            });

            if (checkBtn) {
                checkBtn.addEventListener('click', () => {
                    this.checkDragDrop(container);
                });
            }
        });
    }

    checkDragDrop(container) {
        const dropZones = container.querySelectorAll('.drop-zone');
        const feedback = container.querySelector('.feedback');
        let allCorrect = true;
        let incorrectCount = 0;

        dropZones.forEach(zone => {
            const expected = zone.dataset.answer;
            const item = zone.querySelector('.draggable');
            const actual = item ? item.dataset.value : '';

            if (actual === expected) {
                zone.style.borderColor = 'var(--success)';
                zone.style.backgroundColor = '#d4edda';
            } else {
                zone.style.borderColor = 'var(--error)';
                zone.style.backgroundColor = '#f8d7da';
                allCorrect = false;
                incorrectCount++;
            }
        });

        if (allCorrect) {
            this.showFeedback(feedback, container.dataset.successText || "Perfect! All items correctly matched.", "correct");
        } else {
            this.showFeedback(feedback, `You have ${incorrectCount} incorrect matches. Try again.`, "incorrect");
        }
    }

    // =====================
    // STEP-BY-STEP GUIDANCE
    // =====================
    bindStepByStep() {
        document.querySelectorAll('.step-by-step').forEach(container => {
            const nextBtn = container.querySelector('.step-next');
            const prevBtn = container.querySelector('.step-prev');
            const steps = container.querySelectorAll('.step-content');
            const progressIndicator = container.querySelector('.step-progress');
            let currentStep = 0;

            const showStep = (index) => {
                currentStep = index;
                steps.forEach((step, i) => {
                    step.style.display = i === index ? 'block' : 'none';
                });

                // Update progress
                if (progressIndicator) {
                    progressIndicator.innerHTML = `Step ${index + 1} of ${steps.length}`;
                }

                // Update buttons
                if (prevBtn) prevBtn.disabled = index === 0;
                if (nextBtn) nextBtn.textContent = index === steps.length - 1 ? 'Finish' : 'Next →';
            };

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    if (currentStep < steps.length - 1) {
                        showStep(currentStep + 1);
                    }
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (currentStep > 0) {
                        showStep(currentStep - 1);
                    }
                });
            }

            // Initialize first step
            showStep(0);
        });
    }

    // =====================
    // FLASHCARDS
    // =====================
    bindFlashcards() {
        document.querySelectorAll('.flashcard-deck').forEach(deck => {
            const cards = deck.querySelectorAll('.flashcard');
            const nextBtn = deck.querySelector('.flashcard-next');
            const prevBtn = deck.querySelector('.flashcard-prev');
            const flipBtn = deck.querySelector('.flashcard-flip');
            let currentIndex = 0;
            let isFlipped = false;

            const showCard = (index) => {
                currentIndex = index;
                isFlipped = false;
                cards.forEach((card, i) => {
                    card.style.display = i === index ? 'block' : 'none';
                    card.classList.remove('flipped');
                });
            };

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    if (currentIndex < cards.length - 1) {
                        showCard(currentIndex + 1);
                    }
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (currentIndex > 0) {
                        showCard(currentIndex - 1);
                    }
                });
            }

            if (flipBtn) {
                flipBtn.addEventListener('click', () => {
                    const card = cards[currentIndex];
                    isFlipped = !isFlipped;
                    if (isFlipped) {
                        card.classList.add('flipped');
                    } else {
                        card.classList.remove('flipped');
                    }
                });
            }

            // Initialize
            showCard(0);
        });
    }

    // =====================
    // TIMELINE ANIMATIONS
    // =====================
    bindTimelineAnimations() {
        document.querySelectorAll('.interactive-timeline').forEach(timeline => {
            const items = timeline.querySelectorAll('.timeline-item');
            const nextBtn = timeline.querySelector('.timeline-next');
            const prevBtn = timeline.querySelector('.timeline-prev');
            let currentIndex = 0;

            const showItem = (index) => {
                currentIndex = index;
                items.forEach((item, i) => {
                    if (i === index) {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                        item.classList.add('active');
                    } else if (i < index) {
                        item.style.opacity = '0.3';
                        item.style.transform = 'translateX(-50px)';
                        item.classList.remove('active');
                    } else {
                        item.style.opacity = '0.3';
                        item.style.transform = 'translateX(50px)';
                        item.classList.remove('active');
                    }
                });

                if (prevBtn) prevBtn.disabled = index === 0;
                if (nextBtn) nextBtn.disabled = index === items.length - 1;
            };

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    if (currentIndex < items.length - 1) {
                        showItem(currentIndex + 1);
                    }
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (currentIndex > 0) {
                        showItem(currentIndex - 1);
                    }
                });
            }

            // Initialize
            showItem(0);
        });
    }

    // =====================
    // ENHANCED CALCULATORS
    // =====================
    bindCalculators() {
        // Accounting Equation Calculator
        const eqCalc = document.getElementById('equation-calculator');
        if (eqCalc) {
            const inputs = eqCalc.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.calculateEquation());
            });
        }

        // ROA Calculator
        const roaCalc = document.getElementById('roa-calculator');
        if (roaCalc) {
            const inputs = roaCalc.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.calculateROA());
            });
        }

        // Journal Entry Simulator
        const journalSim = document.getElementById('journal-simulator');
        if (journalSim) {
            const addEntryBtn = journalSim.querySelector('.add-journal-entry');
            if (addEntryBtn) {
                addEntryBtn.addEventListener('click', () => this.addJournalEntry(journalSim));
            }
        }

        // T-Account Balance Calculator
        const tAccountCalc = document.getElementById('taccount-calculator');
        if (tAccountCalc) {
            const inputs = tAccountCalc.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.calculateTAccount());
            });
        }
    }

    calculateEquation() {
        const assets = parseFloat(document.getElementById('eq-assets')?.value) || 0;
        const liabilities = parseFloat(document.getElementById('eq-liabilities')?.value) || 0;
        const equity = parseFloat(document.getElementById('eq-equity')?.value) || 0;
        const status = document.getElementById('eq-status');
        const diff = document.getElementById('eq-diff');

        if (status) {
            const isBalanced = Math.abs(assets - (liabilities + equity)) < 0.01;
            if (isBalanced && assets !== 0) {
                status.textContent = "✓ BALANCED";
                status.style.color = "var(--success)";
            } else {
                status.textContent = "✗ UNBALANCED";
                status.style.color = "var(--error)";
            }
        }

        if (diff) {
            const difference = assets - (liabilities + equity);
            diff.textContent = difference.toFixed(2);
        }
    }

    calculateROA() {
        const income = parseFloat(document.getElementById('roa-income')?.value) || 0;
        const assets = parseFloat(document.getElementById('roa-assets')?.value) || 0;
        const result = document.getElementById('roa-result');

        if (result) {
            if (assets > 0) {
                const roa = (income / assets) * 100;
                result.textContent = roa.toFixed(2) + "%";
                result.style.color = roa > 5 ? "var(--success)" : "var(--warning)";
            } else {
                result.textContent = "0.00%";
                result.style.color = "var(--text-muted)";
            }
        }
    }

    calculateTAccount() {
        const debits = document.querySelectorAll('.taccount-debit');
        const credits = document.querySelectorAll('.taccount-credit');
        const balanceEl = document.getElementById('taccount-balance');
        const balanceTypeEl = document.getElementById('taccount-balance-type');

        let totalDebit = 0;
        let totalCredit = 0;

        debits.forEach(input => {
            totalDebit += parseFloat(input.value) || 0;
        });

        credits.forEach(input => {
            totalCredit += parseFloat(input.value) || 0;
        });

        const difference = totalDebit - totalCredit;

        if (balanceEl) {
            balanceEl.textContent = Math.abs(difference).toFixed(2);
        }

        if (balanceTypeEl) {
            if (difference > 0) {
                balanceTypeEl.textContent = "Debit Balance";
                balanceTypeEl.style.color = "var(--success)";
            } else if (difference < 0) {
                balanceTypeEl.textContent = "Credit Balance";
                balanceTypeEl.style.color = "var(--error)";
            } else {
                balanceTypeEl.textContent = "Zero Balance";
                balanceTypeEl.style.color = "var(--text-muted)";
            }
        }
    }

    addJournalEntry(simulator) {
        const container = simulator.querySelector('.journal-entries');
        const template = simulator.querySelector('.journal-entry-template');

        if (template) {
            const clone = template.content.cloneNode(true);
            container.appendChild(clone);
        }
    }

    // =====================
    // FORM VALIDATORS
    // =====================
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
                input.style.backgroundColor = "#d4edda";
            } else {
                input.style.borderColor = "var(--error)";
                input.style.backgroundColor = "#f8d7da";
                allCorrect = false;
                incorrectCount++;
            }
        });

        if (allCorrect) {
            this.showFeedback(feedback, form.dataset.successText || "Excellent! You've mastered this concept.", "correct");
            feedback.classList.add('correct-animation');
        } else {
            this.showFeedback(feedback, `You have ${incorrectCount} incorrect answers. Check red fields and try again.`, "incorrect");
        }
    }

    // =====================
    // FLIP CARDS
    // =====================
    bindFlipCards() {
        document.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });
    }

    // =====================
    // FEEDBACK SYSTEM
    // =====================
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
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const system = new EnhancedInteractiveSystem();
    system.init();
});
