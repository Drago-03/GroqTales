// Interactive Comic Dots Animation - Gen-Z Style!
(function () {
    'use strict';

    // Create canvas for background animation
    const canvas = document.createElement('canvas');
    canvas.id = 'comic-dots-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Mouse position
        let mouse = {
            x: width / 2,
            y: height / 2
        };

        // Dots configuration
        const dots = [];
        const dotCount = 150; // More dots for Gen-Z vibes
        const maxDistance = 200; // Distance for interaction
        const colors = ['#FF0000', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']; // Vibrant Gen-Z colors

        // Create dots
        class Dot {
            constructor() {
                this.reset();
                this.y = Math.random() * height;
                this.baseColor = colors[Math.floor(Math.random() * colors.length)];
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 3 + 1;
            }

            update() {
                // Calculate distance from mouse
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Move away from cursor - COMIC STYLE!
                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);
                    this.vx -= Math.cos(angle) * force * 2;
                    this.vy -= Math.sin(angle) * force * 2;
                }

                // Apply velocity with damping
                this.x += this.vx;
                this.y += this.vy;
                this.vx *= 0.95;
                this.vy *= 0.95;

                // Bounce off edges
                if (this.x < 0 || this.x > width) {
                    this.vx *= -1;
                    this.x = Math.max(0, Math.min(width, this.x));
                }
                if (this.y < 0 || this.y > height) {
                    this.vy *= -1;
                    this.y = Math.max(0, Math.min(height, this.y));
                }

                // Slowly drift back to random positions
                this.vx += (Math.random() - 0.5) * 0.1;
                this.vy += (Math.random() - 0.5) * 0.1;
            }

            draw() {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Change size and opacity based on distance from cursor
                const scale = distance < maxDistance ? 1 + (maxDistance - distance) / maxDistance : 1;
                const opacity = distance < maxDistance ? 0.8 : 0.3;

                // Draw dot with comic style
                ctx.fillStyle = this.baseColor;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * scale, 0, Math.PI * 2);
                ctx.fill();

                // Draw connections between nearby dots - COMIC LINES!
                dots.forEach(dot => {
                    if (dot === this) return;
                    const dx2 = dot.x - this.x;
                    const dy2 = dot.y - this.y;
                    const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    if (dist < 100) {
                        ctx.strokeStyle = this.baseColor;
                        ctx.globalAlpha = (1 - dist / 100) * 0.2;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(dot.x, dot.y);
                        ctx.stroke();
                    }
                });

                ctx.globalAlpha = 1;
            }
        }

        // Initialize dots
        for (let i = 0; i < dotCount; i++) {
            dots.push(new Dot());
        }

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Touch support for mobile - Gen-Z loves mobile!
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        });

        // Handle resize
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Animation loop
        function animate() {
            // Clear with slight trail effect for smoothness
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, width, height);

            // Update and draw all dots
            dots.forEach(dot => {
                dot.update();
                dot.draw();
            });

            requestAnimationFrame(animate);
        }

        // Start animation
        animate();
    }
})();
