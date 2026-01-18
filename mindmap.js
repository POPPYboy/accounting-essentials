/**
 * Interactive Course Mind Map V6: Premium Experience
 * Features: Complete 8-Chapter Structure, Mouse-Responsive Particles, 
 * Constellation Effects, and Gradient UI Nodes.
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
        this.canvas.width = this.width;
        this.canvas.height = this.height;
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
        this.ctx.clearRect(0, 0, this.width, this.height);
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

class CourseMindMap {
    constructor(containerId, data) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.nodes = [];
        this.connections = [];
        this.data = data;

        // Dimensions
        this.resize();

        // Interaction
        this.mouse = { x: -1000, y: -1000 };
        this.isMouseOver = false;

        // Theme Configuration (Matching styles.css)
        this.theme = {
            root: { start: '#1a237e', end: '#000051', shadow: 'rgba(26, 35, 126, 0.3)' }, // Navy
            part: { start: '#c5a059', end: '#94712d', shadow: 'rgba(197, 160, 89, 0.3)' }, // Gold
            chapter: { start: '#1a237e', end: '#1a237e', shadow: 'rgba(26, 35, 126, 0.2)' }, // Navy
            section: { start: '#1a237e', end: '#1a237e', shadow: 'rgba(26, 35, 126, 0.1)' }, // Navy
            interactive: { start: '#c5a059', end: '#c5a059', shadow: 'rgba(197, 160, 89, 0.2)' }, // Gold
            practice: { start: '#c5a059', end: '#c5a059', shadow: 'rgba(197, 160, 89, 0.2)' }, // Gold
            line: 'rgba(26, 35, 126, 0.1)',
            text: '#ffffff'
        };

        this.initData();
        this.bindEvents();

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    resize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        // Handle high-DPI displays (Retina) for crisp text
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        
        // Scale the context to match the device pixel ratio
        this.ctx.scale(dpr, dpr);
    }

    initData() {
        this.nodes = [];
        this.connections = [];

        const data = this.data;

        // Layout Constants (Optimized for Full Page - compact layout)
        const Y_ROOT = 100;
        const Y_PART = 180;
        const Y_CHAP = 260;
        const Y_SEC_START = 320;
        const Y_SEC_GAP = 26;

        // Create Root Node
        const rootNode = this.createNode('root', 'COURSE START', 'root', this.width / 2, Y_ROOT, 'index.html');

        // Dynamic Calculation for Balanced Distribution using percentage-based spacing
        // This ensures nodes always fit within screen bounds
        const totalChapters = data.children.reduce((acc, part) => acc + (part.children ? part.children.length : 0), 0);
        const marginX = this.width * 0.12; // 12% margin on each side
        const usableWidth = this.width - (marginX * 2);
        const chapStep = usableWidth / (totalChapters - 1 || 1);

        let globalChapIndex = 0;

        data.children.forEach((part, i) => {
            const partChapters = part.children || [];

            // Calculate part center based on its chapters' horizontal range
            const startX = marginX + globalChapIndex * chapStep;
            const endX = marginX + (globalChapIndex + partChapters.length - 1) * chapStep;
            const partX = (startX + endX) / 2;

            const partNode = this.createNode(part.id, part.title, 'part', partX, Y_PART, part.url);
            this.connect(rootNode, partNode);

            partChapters.forEach((chap, j) => {
                const chapX = marginX + globalChapIndex * chapStep;
                const chapNode = this.createNode(chap.id, chap.title, 'chapter', chapX, Y_CHAP, chap.url);
                this.connect(partNode, chapNode);

                if (chap.children) {
                    chap.children.forEach((sec, k) => {
                        const type = sec.type || (sec.code && sec.code.includes('INT') ? 'interactive' :
                            (sec.code && (sec.code.includes('PRAC') || sec.code.includes('PRACTICE')) ? 'practice' : 'section'));
                        const secNode = this.createNode(sec.id, sec.code + ': ' + sec.title, type, chapX, Y_SEC_START + (k * Y_SEC_GAP), sec.url);
                        this.connect(chapNode, secNode);
                    });
                }
                globalChapIndex++;
            });
        });
    }

    createNode(id, label, type, tx, ty, url = null) {
        this.ctx.font = 'bold 11px "Inter", sans-serif';
        const metrics = this.ctx.measureText(label);
        const width = metrics.width + 24;
        const height = 24;

        const node = {
            id, label, type, url,
            tx, ty, // Home target
            x: tx, // No random offset to prevent overflow
            y: ty,
            vx: 0, vy: 0,
            width, height,
            scale: 1,
            pulse: Math.random() * Math.PI * 2
        };
        this.nodes.push(node);
        return node;
    }

    connect(n1, n2) {
        this.connections.push({ source: n1, target: n2 });
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.initData();
        });

        window.addEventListener('mousemove', e => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.isMouseOver = (
                this.mouse.x >= 0 && this.mouse.x <= this.width &&
                this.mouse.y >= 0 && this.mouse.y <= this.height
            );
        });

        this.canvas.addEventListener('click', () => {
            if (this.hoveredNode && this.hoveredNode.url) {
                window.location.href = this.hoveredNode.url;
            }
        });
    }

    update() {
        // Update Nodes
        let hitNode = null;
        this.nodes.forEach(n => {
            // Spring to target
            const dx = n.tx - n.x;
            const dy = n.ty - n.y;
            n.vx += dx * 0.1;
            n.vy += dy * 0.1;

            // Mouse Repulsion (only if mouse is in canvas area)
            if (this.isMouseOver) {
                const mdx = this.mouse.x - n.x;
                const mdy = this.mouse.y - n.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < 100) {
                    const force = (100 - mdist) * 0.05;
                    n.vx -= mdx * force * 0.02;
                    n.vy -= mdy * force * 0.02;
                }
            }

            n.vx *= 0.7; // High damping
            n.vy *= 0.7;
            n.x += n.vx;
            n.y += n.vy;

            // Scale & Pulse
            n.pulse += 0.05;
            const isHover = this.isMouseOver &&
                Math.abs(this.mouse.x - n.x) < n.width / 2 &&
                Math.abs(this.mouse.y - n.y) < n.height / 2;

            n.scale += (isHover ? 1.15 - n.scale : 1.0 - n.scale) * 0.2;
            if (isHover) hitNode = n;
        });

        this.hoveredNode = hitNode;
        this.canvas.style.cursor = hitNode ? 'pointer' : 'default';
    }

    draw() {
        // Clear using actual pixel dimensions
        const dpr = window.devicePixelRatio || 1;
        this.ctx.clearRect(0, 0, this.width * dpr, this.height * dpr);

        // Draw Connections
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeStyle = this.theme.line;
        this.connections.forEach(c => {
            this.ctx.beginPath();
            const midY = (c.source.y + c.target.y) / 2;
            this.ctx.moveTo(c.source.x, c.source.y);
            this.ctx.bezierCurveTo(c.source.x, midY, c.target.x, midY, c.target.x, c.target.y);
            this.ctx.stroke();
        });

        // Draw Nodes
        this.nodes.forEach(n => {
            const colors = this.theme[n.type] || this.theme.section;
            const w = n.width * n.scale;
            const h = n.height * n.scale;
            const x = n.x - w / 2;
            const y = n.y - h / 2;

            this.ctx.save();

            // Pulse Effect (Shadow/Glow)
            const pulse = (n === this.hoveredNode) ? 10 : 4 + Math.sin(n.pulse) * 2;
            this.ctx.shadowBlur = pulse;
            this.ctx.shadowColor = colors.shadow;

            // Gradient Fill
            const grad = this.ctx.createLinearGradient(x, y, x, y + h);
            grad.addColorStop(0, colors.start);
            grad.addColorStop(1, colors.end);

            this.ctx.fillStyle = grad;
            this.ctx.beginPath();
            this.ctx.roundRect(x, y, w, h, 12);
            this.ctx.fill();

            // Border
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.stroke();

            // Text
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = this.theme.text;
            this.ctx.font = `bold ${10 * n.scale}px "Inter", sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // Improve text rendering quality
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';
            
            this.ctx.fillText(n.label, n.x, n.y);

            this.ctx.restore();
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

// Full Course Data
const courseData = {
    children: [
        {
            id: 'p1', title: 'Part 1: Foundations', url: 'Part1/part1.html',
            children: [
                {
                    id: 'p1c1', title: 'Ch1: Accounting Basics', url: 'Part1/chapter1/ch01.html',
                    children: [
                        { id: '1c1', code: 'C1', title: 'Purpose & Users', url: 'Part1/chapter1/ch01_C1.html' },
                        { id: '1c2', code: 'C2', title: 'Ethics & GAAP', url: 'Part1/chapter1/ch01_C2.html' },
                        { id: '1a1', code: 'A1', title: 'Accounting Eq.', url: 'Part1/chapter1/ch01_A1.html' },
                        { id: '1a2', code: 'A2', title: 'ROA Analysis', url: 'Part1/chapter1/ch01_A2.html' },
                        { id: '1p1', code: 'P1', title: 'Trans. Analysis', url: 'Part1/chapter1/ch01_P1.html' },
                        { id: '1p2', code: 'P2', title: 'Financial Stmts', url: 'Part1/chapter1/ch01_P2.html' },
                        { id: '1int', code: 'INT', title: 'Visualizer', url: 'Part1/chapter1/ch01_INTERACTIVE.html' },
                        { id: '1prac', code: 'PRAC', title: 'Practice Case', url: 'Part1/chapter1/ch01_PRACTICE.html' }
                    ]
                },
                {
                    id: 'p1c2', title: 'Ch2: Record Keeping', url: 'Part1/chapter2/ch02.html',
                    children: [
                        { id: '2c1', code: 'C1', title: 'Accounts & Jrnl', url: 'Part1/chapter2/ch02_C1.html' },
                        { id: '2c2', code: 'C2', title: 'Double-Entry', url: 'Part1/chapter2/ch02_C2.html' },
                        { id: '2a1', code: 'A1', title: 'Recording & Anal.', url: 'Part1/chapter2/ch02_A1.html' },
                        { id: '2a2', code: 'A2', title: 'Debt Ratio', url: 'Part1/chapter2/ch02_A2.html' },
                        { id: '2p1', code: 'P1', title: 'Trial Balance', url: 'Part1/chapter2/ch02_P1.html' },
                        { id: '2int', code: 'INT', title: 'Cycle Flow', url: 'Part1/chapter2/ch02_INTERACTIVE.html' },
                        { id: '2prac', code: 'PRAC', title: 'Practice Case', url: 'Part1/chapter2/ch02_PRACTICE.html' }
                    ]
                },
                {
                    id: 'p1c3', title: 'Ch3: Adjustments', url: 'Part1/chapter3/ch03.html',
                    children: [
                        { id: '3c1', code: 'C1', title: 'Accrual Basis', url: 'Part1/chapter3/ch03_C1.html' },
                        { id: '3a1', code: 'A1', title: 'Profit Margin', url: 'Part1/chapter3/ch03_A1.html' },
                        { id: '3p1', code: 'P1', title: 'Prepays', url: 'Part1/chapter3/ch03_P1.html' },
                        { id: '3p2', code: 'P2', title: 'Unearned', url: 'Part1/chapter3/ch03_P2.html' },
                        { id: '3p3', code: 'P3', title: 'Accr. Exp.', url: 'Part1/chapter3/ch03_P3.html' },
                        { id: '3p4', code: 'P4', title: 'Accr. Rev.', url: 'Part1/chapter3/ch03_P4.html' },
                        { id: '3p5', code: 'P5', title: 'Stmts from TB', url: 'Part1/chapter3/ch03_P5.html' },
                        { id: '3p6', code: 'P6', title: 'Alternatives', url: 'Part1/chapter3/ch03_P6.html' },
                        { id: '3int', code: 'INT', title: 'Matching game', url: 'Part1/chapter3/ch03_INTERACTIVE.html' },
                        { id: '3prac', code: 'PRAC', title: 'Practice Case', url: 'Part1/chapter3/ch03_PRACTICE.html' }
                    ]
                },
                {
                    id: 'p1c4', title: 'Ch4: Cycle Finish', url: 'Part1/chapter4/ch04.html',
                    children: [
                        { id: '4c1', code: 'C1', title: 'Classified BS', url: 'Part1/chapter4/ch04_C1.html' },
                        { id: '4a1', code: 'A1', title: 'Current Ratio', url: 'Part1/chapter4/ch04_A1.html' },
                        { id: '4p1', code: 'P1', title: 'Work Sheet', url: 'Part1/chapter4/ch04_P1.html' },
                        { id: '4p2', code: 'P2', title: 'Closing Proc.', url: 'Part1/chapter4/ch04_P2.html' },
                        { id: '4p3', code: 'P3', title: 'Rev. Entries', url: 'Part1/chapter4/ch04_P3.html' },
                        { id: '4int', code: 'INT', title: 'Stmt Builder', url: 'Part1/chapter4/ch04_INTERACTIVE.html' },
                        { id: '4prac', code: 'PRAC', title: 'Practice Case', url: 'Part1/chapter4/ch04_PRACTICE.html' }
                    ]
                }
            ]
        },
        {
            id: 'p2', title: 'Part 2: Merchandising', url: 'part2/part2.html',
            children: [
                {
                    id: 'p2c5', title: 'Ch5: Operations', url: 'part2/chapter5/ch05.html',
                    children: [
                        { id: '5c1', code: 'C1', title: 'Activities', url: 'part2/chapter5/ch05_C1.html' },
                        { id: '5a1', code: 'A1', title: 'Ratios', url: 'part2/chapter5/ch05_A1.html' },
                        { id: '5p1', code: 'P1', title: 'Purchases Perp.', url: 'part2/chapter5/ch05_P1.html' },
                        { id: '5p2', code: 'P2', title: 'Sales Perp.', url: 'part2/chapter5/ch05_P2.html' },
                        { id: '5p3', code: 'P3', title: 'Closing', url: 'part2/chapter5/ch05_P3.html' },
                        { id: '5p4', code: 'P4', title: 'Periodic Inv.', url: 'part2/chapter5/ch05_P4.html' },
                        { id: '5p5', code: 'P5', title: 'Periodic Pur.', url: 'part2/chapter5/ch05_P5.html' },
                        { id: '5p6', code: 'P6', title: 'Periodic Sales', url: 'part2/chapter5/ch05_P6.html' },
                        { id: '5p7', code: 'P7', title: 'Periodic Wksht', url: 'part2/chapter5/ch05_P7.html' },
                        { id: '5prac', code: 'PRAC', title: 'Practice Case', url: 'part2/chapter5/ch05_PRACTICE.html' }
                    ]
                },
                {
                    id: 'p2c6', title: 'Ch6: Inventory', url: 'part2/chapter6/ch06.html',
                    children: [
                        { id: '6c1', code: 'C1', title: 'Warehousing', url: 'part2/chapter6/ch06_C1.html' },
                        { id: '6p1', code: 'P1', title: 'FIFO Method', url: 'part2/chapter6/ch06_P1.html' },
                        { id: '6p2', code: 'P2', title: 'LIFO Method', url: 'part2/chapter6/ch06_P2.html' },
                        { id: '6p3', code: 'P3', title: 'Weighted Ave.', url: 'part2/chapter6/ch06_P3.html' },
                        { id: '6p4', code: 'P4', title: 'Specific ID', url: 'part2/chapter6/ch06_P4.html' },
                        { id: '6a1', code: 'A1', title: 'Turnover', url: 'part2/chapter6/ch06_A1.html' },
                        { id: '6a2', code: 'A2', title: 'Days Sales', url: 'part2/chapter6/ch06_A2.html' },
                        { id: '6a3', code: 'A3', title: 'LCM & IFRS', url: 'part2/chapter6/ch06_A3.html' },
                        { id: '6int', code: 'INT', title: 'Val. Tool', url: 'part2/chapter6/ch06_INTERACTIVE.html' },
                        { id: '6prac', code: 'PRAC', title: 'Practice Case', url: 'part2/chapter6/ch06_PRACTICE.html' }
                    ]
                }
            ]
        },
        {
            id: 'p3', title: 'Part 3: Controls', url: 'part3/part3.html',
            children: [
                {
                    id: 'p3c7', title: 'Ch7: Info Systems', url: 'part3/chapter7/ch07.html',
                    children: [
                        { id: '7c1', code: 'C1', title: 'AIS Princ.', url: 'part3/chapter7/ch07_C1.html' },
                        { id: '7c2', code: 'C2', title: 'Sys. Modules', url: 'part3/chapter7/ch07_C2.html' },
                        { id: '7p1', code: 'P1', title: 'Spl. Jrnls', url: 'part3/chapter7/ch07_P1.html' },
                        { id: '7p2', code: 'P2', title: 'Ledgers', url: 'part3/chapter7/ch07_P2.html' },
                        { id: '7p3', code: 'P3', title: 'Sales Jrnl', url: 'part3/chapter7/ch07_P3.html' },
                        { id: '7p4', code: 'P4', title: 'Cash Jrnl', url: 'part3/chapter7/ch07_P4.html' },
                        { id: '7a1', code: 'A1', title: 'Days Payable', url: 'part3/chapter7/ch07_A1.html' },
                        { id: '7int', code: 'INT', title: 'Jrnl Simulator', url: 'part3/chapter7/ch07_INTERACTIVE.html' },
                        { id: '7prac', code: 'PRAC', title: 'Practice Case', url: 'part3/chapter7/ch07_PRACTICE.html' }
                    ]
                },
                {
                    id: 'p3c8', title: 'Ch8: Cash & Fraud', url: 'part3/chapter8/ch08.html',
                    children: [
                        { id: '8c1', code: 'C1', title: 'Internal Ctrl', url: 'part3/chapter8/ch08_C1.html' },
                        { id: '8c2', code: 'C2', title: 'Cash Princ.', url: 'part3/chapter8/ch08_C2.html' },
                        { id: '8p1', code: 'P1', title: 'Petty Cash', url: 'part3/chapter8/ch08_P1.html' },
                        { id: '8p2', code: 'P2', title: 'Bank Rec', url: 'part3/chapter8/ch08_P2.html' },
                        { id: '8p3', code: 'P3', title: 'Voucher Sys.', url: 'part3/chapter8/ch08_P3.html' },
                        { id: '8p4', code: 'P4', title: 'Over/Short', url: 'part3/chapter8/ch08_P4.html' },
                        { id: '8a1', code: 'A1', title: 'Uncollected', url: 'part3/chapter8/ch08_A1.html' },
                        { id: '8int', code: 'INT', title: 'Roleplay', url: 'part3/chapter8/ch08_INTERACTIVE.html' },
                        { id: '8prac', code: 'PRAC', title: 'Practice Case', url: 'part3/chapter8/ch08_PRACTICE.html' }
                    ]
                }
            ]
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    new BackgroundParticles('global-bg-canvas');
    new CourseMindMap('mindmap-canvas-container', courseData);
});
