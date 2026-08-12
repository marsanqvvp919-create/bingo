import React, { useEffect, useRef } from 'react';
import { getBallHexColor } from '../utils/colors';

interface BingoMachineProps {
  isDrawing: boolean;
  maxNumber: number;
  drawnNumbers: number[];
  currentNumber: number | null;
  animSpeed: 'short' | 'standard' | 'long';
}

interface MiniBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  num: number;
}

export const BingoMachine: React.FC<BingoMachineProps> = ({
  isDrawing,
  maxNumber,
  drawnNumbers,
  currentNumber,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const ballsRef = useRef<MiniBall[]>([]);
  const rotationAngleRef = useRef<number>(0);

  // Initialize or update balls in cage
  useEffect(() => {
    const drawnSet = new Set(drawnNumbers);
    const availableNums: number[] = [];
    for (let i = 1; i <= maxNumber; i++) {
      if (!drawnSet.has(i)) {
        availableNums.push(i);
      }
    }

    // Keep up to 30 visible mini balls in cage for performance and visual density
    const count = Math.min(30, Math.max(12, availableNums.length));
    const newBalls: MiniBall[] = [];

    for (let i = 0; i < count; i++) {
      const num = availableNums[i % availableNums.length] || i + 1;
      const segment = Math.floor(((num - 1) / Math.max(1, maxNumber)) * 5);
      newBalls.push({
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        radius: 12,
        color: getBallHexColor(segment),
        num,
      });
    }

    ballsRef.current = newBalls;
  }, [maxNumber, drawnNumbers.length]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2 - 10;
      const cageRadius = Math.min(width, height) * 0.35;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Machine Stand & Base
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 15;

      // Base pedestal
      const baseGrad = ctx.createLinearGradient(cx - 90, cy + cageRadius + 20, cx + 90, cy + cageRadius + 20);
      baseGrad.addColorStop(0, '#1e293b');
      baseGrad.addColorStop(0.5, '#475569');
      baseGrad.addColorStop(1, '#0f172a');

      ctx.fillStyle = baseGrad;
      ctx.beginPath();
      ctx.roundRect(cx - 90, cy + cageRadius + 15, 180, 20, 8);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Metal Legs
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy);
      ctx.lineTo(cx - 80, cy + cageRadius + 15);
      ctx.moveTo(cx + 60, cy);
      ctx.lineTo(cx + 80, cy + cageRadius + 15);
      ctx.stroke();

      ctx.restore();

      // 2. Cage Background Shadow
      ctx.save();
      const cageBgGrad = ctx.createRadialGradient(cx - cageRadius * 0.3, cy - cageRadius * 0.3, 10, cx, cy, cageRadius);
      cageBgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      cageBgGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.6)');
      cageBgGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');

      ctx.fillStyle = cageBgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, cageRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Cage Rotating Axis and Metal Spoke Lines
      const speedMult = isDrawing ? 6 : 0.8;
      rotationAngleRef.current += dt * speedMult;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotationAngleRef.current);

      // Draw 8 spokes inside cage
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * (cageRadius - 4), Math.sin(angle) * (cageRadius - 4));
        ctx.stroke();
      }

      ctx.restore();

      // 4. Update and Draw Bouncing Balls Inside Cage
      const balls = ballsRef.current;
      const speedFactor = isDrawing ? 4.5 : 1.0;

      balls.forEach((ball) => {
        // Physics update
        ball.x += ball.vx * speedFactor;
        ball.y += ball.vy * speedFactor;

        // Apply slight gravity & random turmoil when drawing
        if (isDrawing) {
          ball.vy += 0.15;
          ball.vx += (Math.random() - 0.5) * 1.5;
          ball.vy += (Math.random() - 0.5) * 1.5;
        }

        // Cage boundary collision (Circle boundary)
        const dist = Math.sqrt(ball.x * ball.x + ball.y * ball.y);
        const maxDist = cageRadius - ball.radius - 6;

        if (dist > maxDist) {
          const nx = ball.x / dist;
          const ny = ball.y / dist;

          // Reflect velocity
          const dot = ball.vx * nx + ball.vy * ny;
          ball.vx -= 1.9 * dot * nx;
          ball.vy -= 1.9 * dot * ny;

          // Clamp position
          ball.x = nx * maxDist;
          ball.y = ny * maxDist;
        }

        // Draw Ball
        const bx = cx + ball.x;
        const by = cy + ball.y;

        ctx.save();
        // Shadow
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 3;

        // Ball body gradient
        const ballGrad = ctx.createRadialGradient(
          bx - ball.radius * 0.3,
          by - ball.radius * 0.3,
          ball.radius * 0.1,
          bx,
          by,
          ball.radius
        );
        ballGrad.addColorStop(0, '#ffffff');
        ballGrad.addColorStop(0.4, ball.color);
        ballGrad.addColorStop(1, 'rgba(0,0,0,0.8)');

        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(bx, by, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // White center circle with number
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(bx, by, ball.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(ball.num), bx, by);

        ctx.restore();
      });

      // 5. Outer Glass Sphere Glare & Metallic Rim
      ctx.save();
      // Outer Rim
      const rimGrad = ctx.createLinearGradient(cx - cageRadius, cy - cageRadius, cx + cageRadius, cy + cageRadius);
      rimGrad.addColorStop(0, '#e2e8f0');
      rimGrad.addColorStop(0.3, '#334155');
      rimGrad.addColorStop(0.7, '#94a3b8');
      rimGrad.addColorStop(1, '#0f172a');

      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, cageRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Top-left Glass Highlight Glare
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.ellipse(cx - cageRadius * 0.4, cy - cageRadius * 0.4, cageRadius * 0.45, cageRadius * 0.2, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 6. Exit Chute at bottom right
      ctx.save();
      const chuteX = cx + cageRadius * 0.7;
      const chuteY = cy + cageRadius * 0.7;

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx + 15, cy + cageRadius - 5);
      ctx.quadraticCurveTo(chuteX, chuteY + 10, chuteX + 40, chuteY + 30);
      ctx.stroke();

      // Rolling ball animation down chute when drawing ends or active
      if (isDrawing || currentNumber !== null) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(chuteX + 25, chuteY + 20, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isDrawing, currentNumber, maxNumber]);

  return (
    <div className="relative w-full h-full min-h-[300px] flex flex-col items-center justify-center p-2">
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700 text-xs text-amber-400 font-bold shadow-lg">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        BINGO CAGE
      </div>

      <canvas
        ref={canvasRef}
        width={380}
        height={340}
        className="w-full max-w-[400px] h-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
      />

      {isDrawing && (
        <div className="mt-1 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-sm rounded-full shadow-lg shadow-amber-500/30 animate-bounce tracking-widest">
          ガラガラ回転中…
        </div>
      )}
    </div>
  );
};
