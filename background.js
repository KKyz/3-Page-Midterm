    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    function setCanvasSize() {
        canvas.width = window.outerWidth;
        canvas.height = window.outerHeight;
    }

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    class Particle {
        constructor(x, y, size) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.opacity = 0;
            this.fadeDirection = 1;
            this.fadeTimer = Math.random() * 300 + 500;
            this.shapePoints = this.generateIrregularShape();
            this.floatSpeed = (Math.random() * 0.5) + 0.5;
            this.angle = Math.random() * Math.PI * 2;
        }

        generateIrregularShape() {
            const points = [];
            const segments = Math.floor(Math.random() * 6) + 5;
            for (let i = 0; i < segments; i++) {
                const angle = (Math.PI * 2) / segments * i;
                const radius = this.size + Math.random() * 10;
                const x = this.x + radius * Math.cos(angle);
                const y = this.y + radius * Math.sin(angle);
                points.push({ x, y });
            }
            return points;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 0, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.moveTo(this.shapePoints[0].x, this.shapePoints[0].y);

            for (let i = 1; i < this.shapePoints.length; i++) {
                ctx.lineTo(this.shapePoints[i].x, this.shapePoints[i].y);
            }
            ctx.closePath();
            ctx.fill();
        }

        update() {
            this.x += Math.cos(this.angle) * this.floatSpeed;
            this.y += Math.sin(this.angle) * this.floatSpeed;

            this.angle += 0.01;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            if (this.fadeDirection === 1 && this.opacity < 0.5) {
                this.opacity += 0.01;
            } else if (this.fadeDirection === -1 && this.opacity > 0) {
                this.opacity -= 0.01;
            }

            if (this.fadeDirection === 1 && this.opacity >= 0.5) {
                this.fadeTimer--;
                if (this.fadeTimer <= 0) this.fadeDirection = -1;
            }

            if (this.fadeDirection === -1 && this.opacity <= 0) {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.shapePoints = this.generateIrregularShape();
                this.fadeTimer = Math.random() * 300 + 500;
                this.fadeDirection = 1;
            }

            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < 20; i++) {
            const size = Math.random() * 15 + 15;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            particlesArray.push(new Particle(x, y, size));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(particle => particle.update());
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();