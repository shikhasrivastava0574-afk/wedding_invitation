class PetalParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.petals = [];
        this.sparkles = [];
        
        this.maxPetals = 45;
        this.maxSparkles = 50;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Populate initially
        for (let i = 0; i < this.maxPetals; i++) {
            this.petals.push(this.createPetal(true));
        }
        for (let i = 0; i < this.maxSparkles; i++) {
            this.sparkles.push(this.createSparkle(true));
        }
        
        this.animate();
    }
    
    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }
    
    createPetal(randomY = false) {
        return {
            x: Math.random() * this.width,
            y: randomY ? Math.random() * this.height : -20,
            size: Math.random() * 8 + 6, // 6px to 14px
            speedY: Math.random() * 1.2 + 0.8, // Fall speed
            speedX: Math.random() * 0.8 - 0.4, // Drift speed
            angle: Math.random() * Math.PI * 2,
            spinSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
            opacity: Math.random() * 0.4 + 0.5, // 0.5 to 0.9 opacity
            // Color variation: soft pastels, pink/rose tones
            color: `rgba(${240 + Math.floor(Math.random() * 15)}, ${180 + Math.floor(Math.random() * 25)}, ${190 + Math.floor(Math.random() * 25)}, `
        };
    }
    
    createSparkle(randomY = false) {
        return {
            x: Math.random() * this.width,
            y: randomY ? Math.random() * this.height : -10,
            size: Math.random() * 2.5 + 1.2, // 1.2px to 3.7px
            speedY: Math.random() * 0.6 + 0.4,
            speedX: Math.random() * 0.4 - 0.2,
            opacity: Math.random() * 0.8 + 0.2,
            pulseSpeed: Math.random() * 0.03 + 0.01,
            pulseDir: Math.random() > 0.5 ? 1 : -1
        };
    }
    
    drawPetal(p) {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.angle);
        
        // Draw an organic petal path
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        // Draw left curve
        this.ctx.quadraticCurveTo(-p.size * 0.7, -p.size * 0.3, -p.size * 0.4, -p.size);
        // Draw top notch
        this.ctx.quadraticCurveTo(0, -p.size * 1.2, p.size * 0.4, -p.size);
        // Draw right curve
        this.ctx.quadraticCurveTo(p.size * 0.7, -p.size * 0.3, 0, 0);
        
        // Gradient fill for a premium 3D look
        const grad = this.ctx.createLinearGradient(-p.size * 0.4, -p.size, p.size * 0.4, 0);
        grad.addColorStop(0, p.color + p.opacity + ')');
        grad.addColorStop(1, p.color + (p.opacity * 0.7) + ')');
        
        this.ctx.fillStyle = grad;
        this.ctx.fill();
        
        // Subtle gold stroke highlight for wedding luxury
        this.ctx.strokeStyle = `rgba(212, 175, 55, ${p.opacity * 0.35})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawSparkle(s) {
        this.ctx.save();
        
        // Draw a glowing golden sparkle (cross/star shape or glowing circle)
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
        this.ctx.fillStyle = `rgba(255, 235, 170, ${s.opacity})`;
        
        // Draw elegant four-point star
        this.ctx.beginPath();
        const cx = s.x;
        const cy = s.y;
        const r = s.size;
        this.ctx.moveTo(cx, cy - r);
        this.ctx.quadraticCurveTo(cx, cy, cx + r, cy);
        this.ctx.quadraticCurveTo(cx, cy, cx, cy + r);
        this.ctx.quadraticCurveTo(cx, cy, cx - r, cy);
        this.ctx.quadraticCurveTo(cx, cy, cx, cy - r);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    update() {
        // Update petals
        for (let i = 0; i < this.petals.length; i++) {
            let p = this.petals[i];
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.y / 30) * 0.3; // Adds a gentle waving effect
            p.angle += p.spinSpeed;
            
            // If petal moves off screen, reset it at the top
            if (p.y > this.height + 20 || p.x < -20 || p.x > this.width + 20) {
                this.petals[i] = this.createPetal(false);
            }
        }
        
        // Update sparkles
        for (let i = 0; i < this.sparkles.length; i++) {
            let s = this.sparkles[i];
            s.y += s.speedY;
            s.x += s.speedX + Math.sin(s.y / 20) * 0.1;
            
            // Pulse opacity
            s.opacity += s.pulseSpeed * s.pulseDir;
            if (s.opacity > 0.9) {
                s.opacity = 0.9;
                s.pulseDir = -1;
            } else if (s.opacity < 0.15) {
                s.opacity = 0.15;
                s.pulseDir = 1;
            }
            
            // Reset if off-screen
            if (s.y > this.height + 10 || s.x < -10 || s.x > this.width + 10) {
                this.sparkles[i] = this.createSparkle(false);
            }
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw background graphics (light gradient or subtle background if canvas isn't transparent, but we make it transparent to overlay the content)
        this.update();
        
        // Draw elements
        this.sparkles.forEach(s => this.drawSparkle(s));
        this.petals.forEach(p => this.drawPetal(p));
        
        requestAnimationFrame(() => this.animate());
    }
}

// Instantiate particle system when page loads
window.addEventListener('DOMContentLoaded', () => {
    new PetalParticleSystem('petals-canvas');
});
