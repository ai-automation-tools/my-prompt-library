/**
 * The animated backdrop: a slow constellation of nodes tinted with the current
 * accent, plus one soft glow in the top corner. The same device the org landing
 * page uses behind its hero, scaled down to sit behind an app.
 *
 * Cheap by construction — about one node per 28k px² (capped), one canvas,
 * one rAF loop that pauses when the tab is hidden, a static frame under
 * prefers-reduced-motion. Colours are re-read from the CSS tokens whenever the
 * theme or section changes, so the field follows the palette.
 */

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

function parseRgb(color: string): [number, number, number] {
  const m = color.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return [56, 189, 248];
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    let accent: [number, number, number] = [56, 189, 248];
    let section: [number, number, number] = accent;
    const pointer = { x: -1e4, y: -1e4 };

    // Colours come from the tokens; a probe element resolves color-mix() to rgb.
    const probe = document.createElement('span');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    document.body.appendChild(probe);
    const readColors = () => {
      probe.style.color = 'var(--accent)';
      accent = parseRgb(getComputedStyle(probe).color);
      probe.style.color = 'var(--c)';
      section = parseRgb(getComputedStyle(probe).color);
    };
    readColors();

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(70, Math.max(28, Math.round((width * height) / 28000)));
      while (nodes.length < target) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: 0.9 + Math.random() * 1.4,
        });
      }
      nodes = nodes.slice(0, target);
    };

    const LINK = 150;

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);

      const [ar, ag, ab] = accent;
      const [sr, sg, sb] = section;

      for (const n of nodes) {
        // Gentle pull toward the pointer so the field responds to the hand.
        const dx = pointer.x - n.x;
        const dy = pointer.y - n.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 220 * 220 && d2 > 1) {
          const f = 0.0006 * (1 - Math.sqrt(d2) / 220);
          n.vx += dx * f;
          n.vy += dy * f;
        }
        // Damping keeps velocities bounded no matter how long the tab stays open.
        n.vx *= 0.995;
        n.vy *= 0.995;
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < -20) n.x = width + 20;
        else if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        else if (n.y > height + 20) n.y = -20;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.16;
            ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        // Every fifth node carries the section accent so the field hints at where you are.
        const tinted = i % 5 === 0;
        const [r, g, b] = tinted ? [sr, sg, sb] : [ar, ag, ab];
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${tinted ? 0.75 : 0.5})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let last = performance.now();
    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    seed();
    if (reduceMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      seed();
      if (reduceMotion) draw(0);
    };
    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = -1e4;
      pointer.y = -1e4;
    };
    const onVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const observer = new MutationObserver(() => {
      // Tokens transition over 0.5s; sample after they settle.
      setTimeout(() => {
        readColors();
        if (reduceMotion) draw(0);
      }, 550);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-section'],
    });

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      probe.remove();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* One soft glow in the accent, top-right, like the hero glow on the org page. */}
      <div
        className="absolute -top-40 right-[-10%] h-[640px] w-[720px] rounded-full opacity-90 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in srgb, var(--accent) 14%, transparent), transparent 72%)',
          animation: 'drift 28s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[-30%] left-[-10%] h-[520px] w-[620px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in srgb, var(--c) 9%, transparent), transparent 72%)',
          animation: 'drift 36s ease-in-out infinite reverse',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
