import { useEffect, useRef } from 'react'

type Particle = { x: number; y: number; z: number; vx: number; vy: number; r: number }

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 720px)').matches
    let width = 0, height = 0, raf = 0, last = 0
    let pointer = { x: -1000, y: -1000 }
    const particles: Particle[] = []
    const count = reduceMotion ? 42 : mobile ? 55 : 105
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.7)
      width = canvas.clientWidth; height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles.length = 0
      for (let i = 0; i < count; i++) particles.push({
        x: Math.random() * width, y: Math.random() * height, z: .25 + Math.random() * .9,
        vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18, r: .45 + Math.random() * 1.35,
      })
    }
    const move = (e: PointerEvent) => { const rect = canvas.getBoundingClientRect(); pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top } }
    const leave = () => { pointer = { x: -1000, y: -1000 } }
    const draw = (time: number) => {
      if (document.hidden) { raf = requestAnimationFrame(draw); return }
      if (time - last < (mobile ? 30 : 16)) { raf = requestAnimationFrame(draw); return }
      last = time
      ctx.clearRect(0, 0, width, height)
      const maxDist = mobile ? 88 : 122
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        if (!reduceMotion) {
          p.x += p.vx * p.z; p.y += p.vy * p.z
          if (p.x < -4) p.x = width + 4; if (p.x > width + 4) p.x = -4
          if (p.y < -4) p.y = height + 4; if (p.y > height + 4) p.y = -4
          const dx = p.x - pointer.x, dy = p.y - pointer.y, dist = Math.hypot(dx, dy)
          if (dist < 125 && dist > 0) { const force = (125 - dist) / 125 * .018; p.x += dx / dist * force * 22; p.y += dy / dist * force * 22 }
        }
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy)
          if (d < maxDist) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(151, 128, 255, ${(1 - d / maxDist) * .17 * Math.min(p.z, q.z)})`
            ctx.lineWidth = .65; ctx.stroke()
          }
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.z, 0, Math.PI * 2)
        ctx.fillStyle = p.z > .8 ? 'rgba(181, 166, 255, .8)' : 'rgba(109, 216, 226, .55)'; ctx.fill()
      }
      if (!reduceMotion && pointer.x > 0 && pointer.y > 0) {
        const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 170)
        glow.addColorStop(0, 'rgba(132, 90, 255, .07)'); glow.addColorStop(1, 'rgba(132, 90, 255, 0)')
        ctx.fillStyle = glow; ctx.fillRect(pointer.x - 170, pointer.y - 170, 340, 340)
      }
      raf = requestAnimationFrame(draw)
    }
    resize(); raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave) }
  }, [])
  return <canvas className="particle-canvas" ref={canvasRef} aria-hidden="true" />
}
