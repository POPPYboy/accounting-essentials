/**
 * Interactive Course Mind Map - Optimized Version
 * Features: Single animation loop, optimized rendering, smooth performance
 */

class CourseMindMap {
    constructor(containerId, data) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.canvas = document.createElement('canvas');
        this.canvas.style.display = 'block';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d', { alpha: false });

        this.nodes = [];
        this.connections = [];
        this.data = data;

        // Particles
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.isMouseOver = false;

        // Dimensions
        this.dpr = window.devicePixelRatio || 1;
        this.resize();

        // Theme
        this.theme = {
            root: { start: '#1a237e', end: '#000051', shadow: 'rgba(26, 35, 126, 0.3)' },
            part: { start: '#c5a059', end: '#94712d', shadow: 'rgba(197, 160, 89, 0.3)' },
            chapter: { start: '#1a237e', end: '#1a237e', shadow: 'rgba(26, 35, 126, 0.2)' },
            section: { start: '#1a237e', end: '#1a237e', shadow: 'rgba(26, 35, 126, 0.1)' },
            interactive: { start: '#c5a059', end: '#c5a059', shadow: 'rgba(197, 160, 89, 0.2)' },
            practice: { start: '#c5a059', end: '#c5a059', shadow: 'rgba(197, 160, 89, 0.2)' },
            line: 'rgba(26, 35, 126, 0.08)',
            text: '#ffffff',
            particle: 'rgba(26, 35, 126, 0.15)'
        };

        this.initData();
        this.initParticles();
        this.bindEvents();

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    resize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        // Scale for DPR but don't exceed logical dimensions
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
    }

    initParticles() {
        this.particles = [];
        // Reduced particle count for better performance
        const count = Math.min(60, (this.width * this.height) / 15000);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 1.5 + 0.5,
            });
        }
    }

    initData() {
        this.nodes = [];
        this.connections = [];

        const data = this.data;
        const Y_ROOT = 70;
        const Y_PART = 130;
        const Y_CHAP = 190;
        const Y_SEC_START = 240;
        const Y_SEC_GAP = 40;

        const rootNode = this.createNode('root', 'COURSE START', 'root', this.width / 2, Y_ROOT, 'index.html');

        const totalChapters = data.children.reduce((acc, part) => acc + (part.children ? part.children.length : 0), 0);
        const marginX = this.width * 0.18;
        const usableWidth = this.width - (marginX * 2);
        const chapStep = usableWidth / (totalChapters - 1 || 1);

        let globalChapIndex = 0;

        data.children.forEach((part) => {
            const partChapters = part.children || [];
            const startX = marginX + globalChapIndex * chapStep;
            const endX = marginX + (globalChapIndex + partChapters.length - 1) * chapStep;
            const partX = (startX + endX) / 2;

            const partNode = this.createNode(part.id, part.title, 'part', partX, Y_PART, part.url);
            this.connect(rootNode, partNode);

            partChapters.forEach((chap) => {
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
        this.ctx.font = 'bold 12px Inter, sans-serif';
        const metrics = this.ctx.measureText(label);
        const width = metrics.width + 36;
        const height = 26;

        const node = {
            id, label, type, url,
            tx, ty,
            x: tx,
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
            this.initParticles();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.isMouseOver = (this.mouse.x >= 0 && this.mouse.x <= this.width && this.mouse.y >= 0 && this.mouse.y <= this.height);
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
            this.isMouseOver = false;
        });

        this.canvas.addEventListener('click', () => {
            if (this.hoveredNode && this.hoveredNode.url) {
                window.location.href = this.hoveredNode.url;
            }
        });
    }

    updateParticles() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            // Subtle mouse interaction
            if (this.isMouseOver) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 80) {
                    const force = (80 - dist) / 80;
                    p.vx -= dx * force * 0.002;
                    p.vy -= dy * force * 0.002;
                }
            }
            
            p.vx *= 0.995;
            p.vy *= 0.995;
        });
    }

    updateNodes() {
        let hitNode = null;
        
        this.nodes.forEach(n => {
            const isHover = this.isMouseOver &&
                Math.abs(this.mouse.x - n.x) < (n.width * n.scale) / 2 &&
                Math.abs(this.mouse.y - n.y) < (n.height * n.scale) / 2;

            // Spring to target
            const dx = n.tx - n.x;
            const dy = n.ty - n.y;
            const springTension = isHover ? 0.25 : 0.08;
            n.vx += dx * springTension;
            n.vy += dy * springTension;

            // Mouse repulsion
            if (this.isMouseOver && !isHover) {
                const mdx = this.mouse.x - n.x;
                const mdy = this.mouse.y - n.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                const repulsionRadius = 60;
                if (mdist < repulsionRadius) {
                    const force = (repulsionRadius - mdist) / repulsionRadius;
                    n.vx -= mdx * force * 0.08;
                    n.vy -= mdy * force * 0.08;
                }
            }

            // High damping for smooth settling
            n.vx *= 0.75;
            n.vy *= 0.75;
            n.x += n.vx;
            n.y += n.vy;

            // Scale animation
            n.pulse += 0.03;
            const targetScale = isHover ? 1.12 : 1.0;
            n.scale += (targetScale - n.scale) * 0.15;
            
            if (isHover) hitNode = n;
        });

        this.hoveredNode = hitNode;
        this.canvas.style.cursor = hitNode ? 'pointer' : 'default';
    }

    draw() {
        // Clear with solid color (faster than clearRect)
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw particles
        this.ctx.fillStyle = this.theme.particle;
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw connections
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.theme.line;
        this.ctx.beginPath();
        this.connections.forEach(c => {
            const midY = (c.source.y + c.target.y) / 2;
            this.ctx.moveTo(c.source.x, c.source.y);
            this.ctx.bezierCurveTo(c.source.x, midY, c.target.x, midY, c.target.x, c.target.y);
        });
        this.ctx.stroke();

        // Draw nodes
        this.nodes.forEach(n => {
            const colors = this.theme[n.type] || this.theme.section;
            const w = n.width * n.scale;
            const h = n.height * n.scale;
            const x = n.x - w / 2;
            const y = n.y - h / 2;
            const isHovered = n === this.hoveredNode;

            // Gradient fill
            const grad = this.ctx.createLinearGradient(x, y, x, y + h);
            grad.addColorStop(0, colors.start);
            grad.addColorStop(1, colors.end);
            this.ctx.fillStyle = grad;

            // Draw rounded rect
            const r = 10;
            this.ctx.beginPath();
            this.ctx.moveTo(x + r, y);
            this.ctx.lineTo(x + w - r, y);
            this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            this.ctx.lineTo(x + w, y + h - r);
            this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            this.ctx.lineTo(x + r, y + h);
            this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            this.ctx.lineTo(x, y + r);
            this.ctx.quadraticCurveTo(x, y, x + r, y);
            this.ctx.closePath();
            this.ctx.fill();

            // Border
            this.ctx.strokeStyle = isHovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)';
            this.ctx.lineWidth = isHovered ? 2 : 1;
            this.ctx.stroke();

            // Text
            this.ctx.fillStyle = this.theme.text;
            this.ctx.font = `bold ${11 * n.scale}px Inter, sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(n.label, n.x, n.y);
        });
    }

    animate() {
        this.updateParticles();
        this.updateNodes();
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
                        { id: '1p1', code: 'P1', title: 'Transaction Anal.', url: 'Part1/chapter1/ch01_P1.html' },
                        { id: '1p2', code: 'P2', title: 'Journal Entries', url: 'Part1/chapter1/ch01_P2.html' },
                        { id: '1int', code: 'INT', title: 'Interactive', url: 'Part1/chapter1/ch01_INTERACTIVE.html' }
                    ]
                },
                {
                    id: 'p1c2', title: 'Ch2: Recording Proc.', url: 'Part1/chapter2/ch02.html',
                    children: [
                        { id: '2c1', code: 'C1', title: 'The Account', url: 'Part1/chapter2/ch02_C1.html' },
                        { id: '2c2', code: 'C2', title: 'Debits & Credits', url: 'Part1/chapter2/ch02_C2.html' },
                        { id: '2a1', code: 'A1', title: 'Trial Balance', url: 'Part1/chapter2/ch02_A1.html' },
                        { id: '2a2', code: 'A2', title: 'Error Detection', url: 'Part1/chapter2/ch02_A2.html' },
                        { id: '2p1', code: 'P1', title: 'T-Account Meth.', url: 'Part1/chapter2/ch02_P1.html' },
                        { id: '2int', code: 'INT', title: 'Interactive', url: 'Part1/chapter2/ch02_INTERACTIVE.html' }
                    ]
                },
                {
                    id: 'p1c3', title: 'Ch3: Accrual Basis', url: 'Part1/chapter3/ch03.html',
                    children: [
                        { id: '3c1', code: 'C1', title: 'Accrual vs Cash', url: 'Part1/chapter3/ch03_C1.html' },
                        { id: '3a1', code: 'A1', title: 'Adjusting Entries', url: 'Part1/chapter3/ch03_A1.html' },
                        { id: '3p1', code: 'P1', title: 'Adj. Entries Prac.', url: 'Part1/chapter3/ch03_P1.html' },
                        { id: '3p2', code: 'P2', title: 'Financial Stmt.', url: 'Part1/chapter3/ch03_P2.html' },
                        { id: '3p3', code: 'P3', title: 'Closing Process', url: 'Part1/chapter3/ch03_P3.html' },
                        { id: '3p4', code: 'P4', title: 'Classified BS', url: 'Part1/chapter3/ch03_P4.html' },
                        { id: '3p5', code: 'P5', title: 'Income Statement', url: 'Part1/chapter3/ch03_P5.html' },
                        { id: '3p6', code: 'P6', title: 'Post-Closing', url: 'Part1/chapter3/ch03_P6.html' },
                        { id: '3int', code: 'INT', title: 'Interactive', url: 'Part1/chapter3/ch03_INTERACTIVE.html' }
                    ]
                },
                {
                    id: 'p1c4', title: 'Ch4: Internal Controls', url: 'Part1/chapter4/ch04.html',
                    children: [
                        { id: '4c1', code: 'C1', title: 'Classified BS', url: 'Part1/chapter4/ch04_C1.html' },
                        { id: '4a1', code: 'A1', title: 'Current Ratio', url: 'Part1/chapter4/ch04_A1.html' },
                        { id: '4p1', code: 'P1', title: 'Classified BS', url: 'Part1/chapter4/ch04_P1.html' },
                        { id: '4p2', code: 'P2', title: 'Ratio Analysis', url: 'Part1/chapter4/ch04_P2.html' },
                        { id: '4p3', code: 'P3', title: 'Ratio Practice', url: 'Part1/chapter4/ch04_P3.html' },
                        { id: '4int', code: 'INT', title: 'Interactive', url: 'Part1/chapter4/ch04_INTERACTIVE.html' }
                    ]
                }
            ]
        },
        {
            id: 'p2', title: 'Part 2: Merchandising', url: 'part2/part2.html',
            children: [
                {
                    id: 'p2c5', title: 'Ch5: Merchandising', url: 'part2/chapter5/ch05.html',
                    children: [
                        { id: '5c1', code: 'C1', title: 'Buying & Selling', url: 'part2/chapter5/ch05_C1.html' },
                        { id: '5a1', code: 'A1', title: 'Inventory Ratios', url: 'part2/chapter5/ch05_A1.html' },
                        { id: '5p1', code: 'P1', title: 'Periodic System', url: 'part2/chapter5/ch05_P1.html' },
                        { id: '5p2', code: 'P2', title: 'Perpetual System', url: 'part2/chapter5/ch05_P2.html' },
                        { id: '5p3', code: 'P3', title: 'Work Sheet', url: 'part2/chapter5/ch05_P3.html' },
                        { id: '5p4', code: 'P4', title: 'Compare Systems', url: 'part2/chapter5/ch05_P4.html' },
                        { id: '5p5', code: 'P5', title: 'Adjustments', url: 'part2/chapter5/ch05_P5.html' },
                        { id: '5p6', code: 'P6', title: 'Financial Stmt.', url: 'part2/chapter5/ch05_P6.html' },
                        { id: '5p7', code: 'P7', title: 'Closing Entries', url: 'part2/chapter5/ch05_P7.html' },
                        { id: '5int', code: 'INT', title: 'Interactive', url: 'part2/chapter5/ch05_INTERACTIVE.html' }
                    ]
                },
                {
                    id: 'p2c6', title: 'Ch6: Inventory', url: 'part2/chapter6/ch06.html',
                    children: [
                        { id: '6c1', code: 'C1', title: 'Inventory Mgmt', url: 'part2/chapter6/ch06_C1.html' },
                        { id: '6a1', code: 'A1', title: 'Inventory Turnover', url: 'part2/chapter6/ch06_A1.html' },
                        { id: '6a2', code: 'A2', title: 'Gross Margin', url: 'part2/chapter6/ch06_A2.html' },
                        { id: '6a3', code: 'A3', title: 'Lower of Cost/LCM', url: 'part2/chapter6/ch06_A3.html' },
                        { id: '6p1', code: 'P1', title: 'FIFO Calculations', url: 'part2/chapter6/ch06_P1.html' },
                        { id: '6p2', code: 'P2', title: 'LIFO Calculations', url: 'part2/chapter6/ch06_P2.html' },
                        { id: '6p3', code: 'P3', title: 'Weighted Avg', url: 'part2/chapter6/ch06_P3.html' },
                        { id: '6p4', code: 'P4', title: 'LCM Analysis', url: 'part2/chapter6/ch06_P4.html' },
                        { id: '6int', code: 'INT', title: 'Interactive', url: 'part2/chapter6/ch06_INTERACTIVE.html' }
                    ]
                }
            ]
        },
        {
            id: 'p3', title: 'Part 3: Systems', url: 'part3/part3.html',
            children: [
                {
                    id: 'p3c7', title: 'Ch7: Control', url: 'part3/chapter7/ch07.html',
                    children: [
                        { id: '7c1', code: 'C1', title: 'Internal Control', url: 'part3/chapter7/ch07_C1.html' },
                        { id: '7c2', code: 'C2', title: 'Control Activities', url: 'part3/chapter7/ch07_C2.html' },
                        { id: '7a1', code: 'A1', title: 'Bank Reconcil.', url: 'part3/chapter7/ch07_A1.html' },
                        { id: '7p1', code: 'P1', title: 'Bank Reconcil.', url: 'part3/chapter7/ch07_P1.html' },
                        { id: '7p2', code: 'P2', title: 'Adjusting Entry', url: 'part3/chapter7/ch07_P2.html' },
                        { id: '7p3', code: 'P3', title: 'Control Review', url: 'part3/chapter7/ch07_P3.html' },
                        { id: '7p4', code: 'P4', title: 'Document Flow', url: 'part3/chapter7/ch07_P4.html' },
                        { id: '7int', code: 'INT', title: 'Interactive', url: 'part3/chapter7/ch07_INTERACTIVE.html' }
                    ]
                },
                {
                    id: 'p3c8', title: 'Ch8: Cash Controls', url: 'part3/chapter8/ch08.html',
                    children: [
                        { id: '8c1', code: 'C1', title: 'Control of Cash', url: 'part3/chapter8/ch08_C1.html' },
                        { id: '8c2', code: 'C2', title: 'Bank Rec. Review', url: 'part3/chapter8/ch08_C2.html' },
                        { id: '8a1', code: 'A1', title: 'Days Sales Uncoll.', url: 'part3/chapter8/ch08_A1.html' },
                        { id: '8p1', code: 'P1', title: 'Petty Cash', url: 'part3/chapter8/ch08_P1.html' },
                        { id: '8p2', code: 'P2', title: 'Bank Reconciliation', url: 'part3/chapter8/ch08_P2.html' },
                        { id: '8p3', code: 'P3', title: 'Voucher System', url: 'part3/chapter8/ch08_P3.html' },
                        { id: '8p4', code: 'P4', title: 'Cash Over/Short', url: 'part3/chapter8/ch08_P4.html' },
                        { id: '8int', code: 'INT', title: 'Interactive', url: 'part3/chapter8/ch08_INTERACTIVE.html' }
                    ]
                }
            ]
        }
    ]
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new CourseMindMap('mindmap-canvas-container', courseData);
});
