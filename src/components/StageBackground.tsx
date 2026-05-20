import { useEffect, useRef } from 'react';

export default function StageBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      glowBaseUrl: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = Math.random() > 0.5 ? 'rgba(0, 212, 255, 0.8)' : 'rgba(255, 170, 0, 0.6)';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
      }
    };

    const drawStageLights = () => {
       const cw = canvas.width;
       const ch = canvas.height;

       const cx = cw / 2;
       const cy = ch / 2;

       // Central golden glow
       const centralGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(cw, ch) * 0.4);
       centralGlow.addColorStop(0, 'rgba(255, 170, 0, 0.2)');
       centralGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
       ctx.fillStyle = centralGlow;
       ctx.fillRect(0, 0, cw, ch);

       // Teal arches blur
       const archGlow1 = ctx.createRadialGradient(cw * 0.2, cy, 0, cw * 0.2, cy, cw * 0.4);
       archGlow1.addColorStop(0, 'rgba(0, 212, 255, 0.1)');
       archGlow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
       ctx.fillStyle = archGlow1;
       ctx.fillRect(0, 0, cw, ch);

       const archGlow2 = ctx.createRadialGradient(cw * 0.8, cy, 0, cw * 0.8, cy, cw * 0.4);
       archGlow2.addColorStop(0, 'rgba(0, 212, 255, 0.1)');
       archGlow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
       ctx.fillStyle = archGlow2;
       ctx.fillRect(0, 0, cw, ch);

       // Draw structured lines/beams like the stage
       ctx.lineWidth = 1;
       ctx.shadowBlur = 15;
       
       // Vertical light bars (golden in center)
       ctx.strokeStyle = 'rgba(255, 180, 50, 0.1)';
       ctx.shadowColor = 'rgba(255, 180, 50, 0.5)';
       for (let i = -10; i <= 10; i++) {
         const x = cx + i * 20;
         ctx.beginPath();
         // Randomize height a bit based on time or just static
         ctx.moveTo(x, cy - 150 + Math.abs(i) * 10);
         ctx.lineTo(x, cy + 150 - Math.abs(i) * 10);
         ctx.stroke();
       }

       // Teal rings
       ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
       ctx.shadowColor = 'rgba(0, 212, 255, 0.6)';
       
       ctx.beginPath();
       ctx.ellipse(cx, cy - 200, 300, 50, 0, 0, Math.PI * 2);
       ctx.stroke();

       ctx.beginPath();
       ctx.ellipse(cx, cy - 220, 200, 30, 0, 0, Math.PI * 2);
       ctx.stroke();

       // Giant sweeping curve
       ctx.beginPath();
       ctx.ellipse(cx, cy + 100, 500, 150, Math.PI * 0.05, 0, Math.PI);
       ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawStageLights();

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ background: '#050112' }}
    />
  );
}
