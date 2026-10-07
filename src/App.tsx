import { useState, useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import useSWR from 'swr'

const GOLD = '#A67C3D'
const GOLD_LIGHT = '#6F604C'
const GOLD_DARK = '#765522'
const OBSIDIAN = '#F1E6D5'
const SURFACE = '#E4D2B9'
const SURFACE2 = '#D6BE9E'
const TEXT = '#2B241C'
const DISPLAY = "'Playfair Display', serif"
const BODY = "'Outfit', sans-serif"

const INSTAGRAM = 'https://www.instagram.com/elitestay.lahore'
const WHATSAPP  = 'https://wa.me/message/SCJSKFJNPTPEJ1'
const TIKTOK    = 'https://www.tiktok.com/@elitestaylahore6?is_from_webapp=1&sender_device=pc'

// ─── hooks ────────────────────────────────────────────────────────────────────
function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const h = () => setY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return y
}

// Lower threshold on mobile so elements trigger before fully in view
function useVisible(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const isMob = window.innerWidth < 768
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: isMob ? 0.04 : threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function useIsMobile() {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768)
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return mobile
}

// 3D entrance — same on all screen sizes
function entrance(visible: boolean, _mobile: boolean, delay = 0, deg = 38) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible
      ? 'perspective(900px) rotateX(0deg) translateY(0px)'
      : `perspective(900px) rotateX(${deg}deg) translateY(60px)`,
    transition: `opacity 0.8s ease ${delay}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  }
}

// ─── Spinning 3D Cube (desktop only) ──────────────────────────────────────────
function SpinCube({ top, right, left, size = 120, speed = 1 }: {
  top: string; right?: string; left?: string; size?: number; speed?: number
}) {
  const r = useRef<HTMLDivElement>(null)
  const tick = useRef(Math.random() * 360)
  const raf = useRef(0)
  useEffect(() => {
    const loop = () => {
      tick.current += 0.5 * speed
      if (r.current)
        r.current.style.transform = `rotateX(${tick.current * 0.7}deg) rotateY(${tick.current}deg)`
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [speed])
  const h = size / 2
  const face = (t: string, op: number) => (
    <div style={{ position: 'absolute', inset: 0, background: `rgba(201,168,76,${op})`, border: `1px solid rgba(201,168,76,0.4)`, transform: t, backfaceVisibility: 'hidden' }} />
  )
  return (
    <div style={{ position: 'absolute', top, right, left, width: `${size}px`, height: `${size}px`, perspective: '500px', pointerEvents: 'none', zIndex: 2 }}>
      <div ref={r} style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}>
        {face(`translateZ(${h}px)`, 0.07)}
        {face(`translateZ(-${h}px) rotateY(180deg)`, 0.04)}
        {face(`rotateY(90deg) translateZ(${h}px)`, 0.09)}
        {face(`rotateY(-90deg) translateZ(${h}px)`, 0.05)}
        {face(`rotateX(90deg) translateZ(${h}px)`, 0.11)}
        {face(`rotateX(-90deg) translateZ(${h}px)`, 0.03)}
      </div>
    </div>
  )
}

// ─── navbar ────────────────────────────────────────────────────────────────────
function Navbar({ scrollY }: { scrollY: number }) {
  const scrolled = scrollY > 60
  const mobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const links = [['Rooms','#rooms'],['Amenities','#amenities'],['Gallery','#gallery'],['Reviews','#reviews'],['Contact','#contact']]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled || open ? 'rgba(241,230,213,0.96)' : 'transparent',
        backdropFilter: scrolled || open ? 'blur(24px)' : 'none',
        borderBottom: scrolled || open ? `1px solid rgba(201,168,76,0.18)` : 'none',
        padding: mobile ? '1rem 1.2rem' : '1.1rem 2.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <a href="#" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: DISPLAY, fontSize: mobile ? '1.2rem' : '1.45rem', color: GOLD, fontWeight: 700, letterSpacing: '0.07em', lineHeight: 1 }}>ELITE STAY</div>
          <div style={{ fontSize: '0.52rem', letterSpacing: '0.35em', color: GOLD_LIGHT, fontFamily: BODY, opacity: 0.7, marginTop: '1px' }}>LAHORE</div>
        </a>

        {mobile ? (
          <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: '22px', height: '1.5px', background: GOLD,
                transform: open ? i===0 ? 'translateY(6.5px) rotate(45deg)' : i===2 ? 'translateY(-6.5px) rotate(-45deg)' : 'scaleX(0)' : 'none',
                transition: 'all 0.3s ease', transformOrigin: 'center',
              }} />
            ))}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '2.2rem', alignItems: 'center' }}>
            {links.map(([l,h]) => (
              <a key={l} href={h} style={{ color: GOLD_LIGHT, textDecoration: 'none', fontSize: '0.78rem', letterSpacing: '0.17em', fontFamily: BODY, opacity: 0.75, transition: 'all 0.2s' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.opacity='1'; el.style.color=GOLD }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.opacity='0.75'; el.style.color=GOLD_LIGHT }}
              >{l}</a>
            ))}
            <a href={WHATSAPP} target="_blank" rel="noopener" style={{
              background: `linear-gradient(135deg,${GOLD},${GOLD_DARK})`, color: '#fffaf1',
              padding: '0.55rem 1.6rem', textDecoration: 'none', fontSize: '0.75rem',
              letterSpacing: '0.17em', fontFamily: BODY, fontWeight: 700, borderRadius: '2px',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
              onMouseEnter={e => { const el=e.currentTarget; el.style.transform='translateY(-2px)'; el.style.boxShadow=`0 6px 28px rgba(201,168,76,0.38)` }}
              onMouseLeave={e => { const el=e.currentTarget; el.style.transform=''; el.style.boxShadow='' }}
            >BOOK NOW</a>
          </div>
        )}
      </nav>

      {mobile && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 199,
          background: 'rgba(241,230,213,0.98)', backdropFilter: 'blur(24px)',
          borderBottom: `1px solid rgba(201,168,76,0.18)`,
          padding: open ? '1.5rem 1.5rem 2rem' : '0 1.5rem',
          maxHeight: open ? '400px' : '0',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {links.map(([l,h]) => (
            <a key={l} href={h} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '0.9rem 0',
              borderBottom: `1px solid rgba(201,168,76,0.1)`,
              color: GOLD_LIGHT, textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.2em', fontFamily: BODY,
            }}>{l}</a>
          ))}
          <a href={WHATSAPP} target="_blank" rel="noopener" style={{
            display: 'block', marginTop: '1.2rem', textAlign: 'center',
            background: `linear-gradient(135deg,${GOLD},${GOLD_DARK})`, color: '#fffaf1',
            padding: '0.9rem', textDecoration: 'none', fontSize: '0.8rem',
            letterSpacing: '0.2em', fontFamily: BODY, fontWeight: 700, borderRadius: '2px',
          }}>BOOK NOW</a>
        </div>
      )}
    </>
  )
}

// ─── hero ──────────────────────────────────────────────────────────────────────
function Hero({ scrollY }: { scrollY: number }) {
  const mobile = useIsMobile()
  return (
    <section style={{
      height: '100vh',
      minHeight: mobile ? '520px' : '600px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#CDB28F',
    }}>
      <div style={{
        position: 'absolute', inset: '-3%',
        backgroundImage: `url('https://res.cloudinary.com/ga6pq4fj/image/upload/w_1600,h_1200,c_fill,f_auto,q_auto/IMG_3417_1_1')`,
        backgroundSize: 'cover',
        backgroundPosition: mobile ? 'center center' : 'center center',
        backgroundRepeat: 'no-repeat',
        transform: `translateY(${scrollY * 0.18}px) scale(1.06)`,
        filter: 'brightness(1) saturate(0.9) contrast(1.02)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg,rgba(255,248,239,0.52),rgba(245,235,222,0.38) 48%,rgba(235,219,195,0.42)), radial-gradient(ellipse 80% 60% at 50% 85%,rgba(255,255,255,0.16),transparent 70%)` }} />
      <div style={{ position: 'absolute', inset: mobile ? '8% 5%' : '10% 12%', border: '1px solid rgba(118,85,34,0.2)', pointerEvents: 'none' }} />

      {/* 3D cubes — always visible */}
      <SpinCube top="16%" right={mobile ? '2%' : '8%'} size={mobile ? 80 : 130} speed={1} />
      <SpinCube top="62%" left={mobile ? '2%' : '5%'} size={mobile ? 50 : 70} speed={0.8} />
      <div style={{ position: 'absolute', right: mobile ? '3%' : '5%', bottom: '12%', width: mobile ? '110px' : '180px', height: mobile ? '110px' : '180px', borderRadius: '50%', border: `1px solid rgba(201,168,76,0.2)`, pointerEvents: 'none', animation: 'ringPulse 5s ease-in-out infinite' }} />
      {/* Floating dots always */}
      {[{top:'22%',left:'8%',delay:'0s',size:4},{top:'70%',left:'14%',delay:'1.2s',size:3},{top:'38%',left:'4%',delay:'0.8s',size:3}].map((d,i) => (
        <div key={i} style={{ position:'absolute', top:d.top, left:d.left, width:`${d.size}px`, height:`${d.size}px`, borderRadius:'50%', background:GOLD, opacity:0.45, animation:`floatDot ${3+i*0.7}s ease-in-out infinite`, animationDelay:d.delay, pointerEvents:'none', zIndex:2 }} />
      ))}

      <div style={{ position: 'relative', textAlign: 'center', padding: '0 1.5rem', zIndex: 5, transform: `translateY(${-scrollY * 0.12}px)`, width: '100%' }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.42em', color: '#7A5A2E', fontFamily: BODY, marginBottom: '1.5rem', opacity: 0, animation: 'fadeUp 0.8s 0.2s forwards' }}>
          LAHORE, PAKISTAN &nbsp;·&nbsp; LUXURY STAYS
        </div>
        <h1 style={{
          fontFamily: DISPLAY, fontWeight: 900, color: '#1F1A17',
          fontSize: mobile ? 'clamp(2.5rem,10vw,3.6rem)' : 'clamp(3rem,6vw,5.4rem)',
          lineHeight: 1.06,
          textShadow: `0 2px 35px rgba(255,250,241,0.4)`,
          width: mobile ? '100%' : '660px',
          maxWidth: '100%',
          margin: '0 auto 1.4rem',
          opacity: 0, animation: 'fadeUp 0.9s 0.4s forwards',
        }}>
          Where Luxury<br /><em style={{ color: GOLD }}>Meets</em> Home
        </h1>
        <p style={{
          fontFamily: BODY, fontWeight: 400,
          fontSize: mobile ? '0.92rem' : '1.1rem',
          color: '#4C3B2B', lineHeight: 1.75,
          maxWidth: '440px', margin: '0 auto 2.4rem',
          opacity: 0, animation: 'fadeUp 0.9s 0.6s forwards',
        }}>
          Premium serviced apartments in the heart of Lahore — your sanctuary of elegance.
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', padding: '0 1rem', opacity: 0, animation: 'fadeUp 0.9s 0.8s forwards' }}>
          <a href="#rooms" style={{
            background: `linear-gradient(135deg,${GOLD},${GOLD_DARK})`, color: '#fffaf1',
            padding: mobile ? '0.9rem 1.8rem' : '1rem 2.4rem',
            textDecoration: 'none', fontSize: '0.78rem', letterSpacing: '0.18em',
            fontFamily: BODY, fontWeight: 700, borderRadius: '2px',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}>EXPLORE SUITES</a>
          <a href={WHATSAPP} target="_blank" rel="noopener" style={{
            border: `1px solid rgba(122,90,46,0.45)`, color: '#583F1F',
            padding: mobile ? '0.9rem 1.8rem' : '1rem 2.4rem',
            textDecoration: 'none', fontSize: '0.78rem', letterSpacing: '0.18em',
            fontFamily: BODY, fontWeight: 600, background: 'rgba(255,255,255,0.18)', borderRadius: '2px',
          }}>WHATSAPP</a>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.45 }}>
        <div style={{ fontSize: '0.55rem', letterSpacing: '0.35em', color: GOLD, fontFamily: BODY }}>SCROLL</div>
        <div style={{ width: '1px', height: '48px', background: GOLD, animation: 'scrollPulse 2.2s ease-in-out infinite' }} />
      </div>
    </section>
  )
}

// ─── stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { target: 500, suffix: '+', label: 'Happy Guests' },
  { target: 4.9, suffix: '/5', label: 'Guest Rating' },
  { target: 3,   suffix: ' Yrs', label: 'Of Excellence' },
  { target: 24,  suffix: '/7', label: 'Concierge' },
]

function Stats() {
  const { ref, visible } = useVisible()
  const mobile = useIsMobile()
  const [vals, setVals] = useState(STATS.map(() => 0))
  useEffect(() => {
    if (!visible) return
    let frame = 0; const total = 70
    const id = setInterval(() => {
      frame++
      const p = 1 - Math.pow(1 - frame / total, 3)
      setVals(STATS.map(s => Math.round(s.target * p * 10) / 10))
      if (frame >= total) clearInterval(id)
    }, 28)
    return () => clearInterval(id)
  }, [visible])

  return (
    <div ref={ref} style={{
      padding: mobile ? '3rem 1.5rem' : '4.5rem 2rem',
      background: `linear-gradient(135deg,${SURFACE},${SURFACE2})`,
      borderTop: `1px solid rgba(201,168,76,0.14)`,
      borderBottom: `1px solid rgba(201,168,76,0.14)`,
      display: 'grid',
      gridTemplateColumns: mobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
      gap: '2rem', textAlign: 'center',
    }}>
      {STATS.map((s, i) => (
        <div key={i} style={entrance(visible, mobile, i * 0.1, 40)}>
          <div style={{ fontFamily: DISPLAY, fontSize: mobile ? '2.6rem' : '3.2rem', fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: '0.4rem' }}>{vals[i]}{s.suffix}</div>
          <div style={{ fontFamily: BODY, fontSize: '0.7rem', letterSpacing: '0.22em', color: GOLD_LIGHT, opacity: 0.6 }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ─── flip card (rooms) ─────────────────────────────────────────────────────────
function FlipCard({ room, delay, visible }: {
  room: { name: string; size: string; price: string; tags: string[]; img: string }
  delay: number; visible: boolean
}) {
  const [flipped, setFlipped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mobile = useIsMobile()

  const onMove = (e: React.MouseEvent) => {
    if (!cardRef.current || flipped || mobile) return
    const b = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - b.left) / b.width - 0.5
    const y = (e.clientY - b.top) / b.height - 0.5
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) translateZ(40px) scale(1.04)`
    cardRef.current.style.transition = 'transform 0.1s ease'
  }
  const onLeave = () => {
    if (!cardRef.current || flipped) return
    cardRef.current.style.transform = ''
    cardRef.current.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)'
  }

  // Same 3D entrance on all screens
  const outerStyle: React.CSSProperties = {
    perspective: '1000px',
    opacity: visible ? 1 : 0,
    transform: visible ? 'rotateX(0deg) translateY(0)' : 'rotateX(50deg) translateY(80px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  }

  return (
    <div style={outerStyle}>
      <div ref={cardRef}
        onMouseMove={onMove} onMouseLeave={onLeave}
        onClick={() => setFlipped(f => !f)}
        style={{
          width: '100%', height: mobile ? '350px' : '420px',
          transformStyle: 'preserve-3d', position: 'relative', cursor: 'pointer',
          transition: 'transform 0.65s cubic-bezier(0.23,1,0.32,1)',
          transform: flipped ? 'rotateY(180deg)' : '',
        }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: `linear-gradient(145deg,${SURFACE2},${SURFACE})`,
          border: `1px solid rgba(201,168,76,0.2)`, borderRadius: '4px', overflow: 'hidden',
        }}>
          <div style={{ height: '250px', overflow: 'hidden', position: 'relative', background: SURFACE }}>
            <img src={room.img.startsWith('http') ? room.img : `https://images.unsplash.com/${room.img}?w=700&h=460&fit=crop&auto=format`}
              alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,11,0.7), transparent 55%)' }} />
            <div style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', background: 'rgba(7,7,11,0.8)', backdropFilter: 'blur(10px)', border: `1px solid rgba(201,168,76,0.3)`, padding: '0.22rem 0.7rem', borderRadius: '2px', fontSize: '0.65rem', color: GOLD, fontFamily: BODY }}>{room.size}</div>
          </div>
          <div style={{ padding: '1rem 1.1rem 1.2rem' }}>
            <h3 style={{ fontFamily: DISPLAY, fontSize: '1.1rem', color: TEXT, marginBottom: '0.2rem' }}>{room.name}</h3>
            <p style={{ color: GOLD, fontSize: '0.8rem', fontFamily: BODY, fontWeight: 600, marginBottom: '0.55rem' }}>{room.price}</p>
            {/* Tap hint on mobile */}
            <div style={{ fontSize: '0.6rem', color: GOLD_LIGHT, fontFamily: BODY, opacity: 0.5, letterSpacing: '0.1em', animation: 'tapHint 2.5s ease-in-out infinite' }}>
              {mobile ? '👆 TAP TO SEE DETAILS' : 'HOVER & CLICK TO FLIP'}
            </div>
          </div>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: `linear-gradient(145deg,#eadcc8,#d8c2a4)`,
          border: `1px solid rgba(201,168,76,0.45)`, borderRadius: '4px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1.8rem',
        }}>
          <div style={{ fontFamily: DISPLAY, fontSize: '0.65rem', letterSpacing: '0.3em', color: GOLD, marginBottom: '1rem' }}>FEATURES</div>
          <h3 style={{ fontFamily: DISPLAY, fontSize: '1.3rem', color: TEXT, marginBottom: '1rem' }}>{room.name}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.6rem' }}>
            {room.tags.map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '4px', height: '4px', background: GOLD, borderRadius: '50%', flexShrink: 0 }} />
                <span style={{ fontFamily: BODY, color: GOLD_LIGHT, fontSize: '0.85rem' }}>{t}</span>
              </div>
            ))}
          </div>
          <a href={WHATSAPP} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} style={{
            display: 'block', textAlign: 'center',
            background: `linear-gradient(135deg,${GOLD},${GOLD_DARK})`,
            color: '#fffaf1', padding: '0.85rem', textDecoration: 'none',
            fontSize: '0.75rem', letterSpacing: '0.2em', fontFamily: BODY, fontWeight: 700, borderRadius: '2px',
          }}>BOOK NOW</a>
        </div>
      </div>
    </div>
  )
}

const ROOMS = [
  { name: 'Studio Apartment', size: '30 m²', price: 'PKR 6,000 / night', tags: ['Open Plan', 'Smart TV', 'Netflix', 'Kitchenette'], img: 'https://res.cloudinary.com/ga6pq4fj/image/upload/v1791297479/WhatsApp_Image_2026-10-06_at_7.37.12_PM.jpg' },
  { name: 'One Bed Apartment', size: '55 m²', price: 'PKR 9,000 / night', tags: ['King Bed', 'Living Room', 'Full Kitchen', 'City View'], img: 'https://res.cloudinary.com/ga6pq4fj/image/upload/f_auto/q_auto/WhatsApp_Image_2026-10-07_at_4.25.28_PM.jpg' },
  { name: 'Two Bed Apartment', size: '90 m²', price: 'PKR 17,000 / night', tags: ['2 Bedrooms', 'Living & Dining', 'Full Kitchen', 'Smart TVs'], img: 'https://res.cloudinary.com/ga6pq4fj/image/upload/f_auto/q_auto/WhatsApp_Image_2026-10-06_at_7.37.13_PM_1.jpg' },
]

function Rooms() {
  const { ref, visible } = useVisible(0.04)
  const mobile = useIsMobile()
  return (
    <section id="rooms" style={{ padding: mobile ? '5rem 1.2rem' : '7rem 2rem', background: OBSIDIAN }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: mobile ? '3rem' : '4.5rem', ...entrance(visible, mobile, 0, 30) }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.4em', color: GOLD, fontFamily: BODY, marginBottom: '0.8rem', fontWeight: 500 }}>OUR APARTMENTS</div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: mobile ? '2rem' : 'clamp(2rem,5vw,3.4rem)', color: TEXT, fontWeight: 700 }}>
            Premium <em style={{ color: GOLD }}>Apartments</em> for Every Stay
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.2rem' }}>
          {ROOMS.map((room, i) => <FlipCard key={i} room={room} delay={i * 0.1} visible={visible} />)}
        </div>
      </div>
    </section>
  )
}

// ─── amenities ─────────────────────────────────────────────────────────────────
const AMENITIES = [
  { icon: '⚡', title: 'High-Speed WiFi', desc: 'Seamless connectivity throughout' },
  { icon: '🔐', title: '24/7 Security', desc: 'Round-the-clock security for your safety' },
  { icon: '📺', title: 'Smart TV & Netflix', desc: 'Premium 4K entertainment' },
  { icon: '❄️', title: 'Climate Control', desc: 'Individual AC, precise temperature' },
  { icon: '🚿', title: 'Luxury Bathroom', desc: 'Rain shower & premium toiletries' },
  { icon: '✨', title: 'Daily Housekeeping', desc: 'Immaculate cleanliness guaranteed' },
  { icon: '🔒', title: 'Secure Parking', desc: 'CCTV-monitored underground parking' },
  { icon: '🌆', title: 'Lahore City Views', desc: 'Stunning panoramic vistas' },
]

function AmenityCard({ a, i, visible }: { a: typeof AMENITIES[0]; i: number; visible: boolean }) {
  const r = useRef<HTMLDivElement>(null)
  const mobile = useIsMobile()

  const move = (e: React.MouseEvent) => {
    if (!r.current || mobile) return
    const b = r.current.getBoundingClientRect()
    const x = (e.clientX - b.left) / b.width - 0.5
    const y = (e.clientY - b.top) / b.height - 0.5
    r.current.style.transform = `perspective(600px) rotateY(${x * 22}deg) rotateX(${-y * 22}deg) translateZ(50px) scale(1.05)`
    r.current.style.transition = 'transform 0.1s ease'
    r.current.style.boxShadow = `0 30px 80px rgba(76,55,31,0.2), 0 0 40px rgba(166,124,61,0.18)`
    r.current.style.borderColor = 'rgba(201,168,76,0.55)'
  }
  const leave = () => {
    if (!r.current) return
    r.current.style.transform = ''
    r.current.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s, border-color 0.3s'
    r.current.style.boxShadow = ''
    r.current.style.borderColor = 'rgba(201,168,76,0.1)'
  }

  return (
    <div ref={r} onMouseMove={move} onMouseLeave={leave}
      style={{
        padding: '1.6rem',
        background: `linear-gradient(145deg,${SURFACE2},${SURFACE})`,
        border: '1px solid rgba(201,168,76,0.1)', borderRadius: '4px',
        cursor: 'default', transformStyle: 'preserve-3d',
        ...entrance(visible, mobile, i * 0.07, 35),
      }}>
      <div style={{ fontSize: '1.8rem', marginBottom: '0.9rem', filter: 'drop-shadow(0 0 10px rgba(201,168,76,0.5))' }}>{a.icon}</div>
      <h3 style={{ fontFamily: DISPLAY, color: TEXT, fontSize: '0.98rem', marginBottom: '0.4rem', fontWeight: 600 }}>{a.title}</h3>
      <p style={{ fontFamily: BODY, color: GOLD_LIGHT, opacity: 0.55, fontSize: '0.81rem', lineHeight: 1.6 }}>{a.desc}</p>
    </div>
  )
}

function Amenities() {
  const { ref, visible } = useVisible()
  const mobile = useIsMobile()
  return (
    <section id="amenities" style={{ padding: mobile ? '5rem 1.2rem' : '7rem 2rem', background: SURFACE }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: mobile ? '3rem' : '4.5rem' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.4em', color: GOLD, fontFamily: BODY, marginBottom: '0.8rem', fontWeight: 500 }}>PREMIUM FACILITIES</div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: mobile ? '2rem' : 'clamp(2rem,5vw,3.4rem)', color: TEXT, fontWeight: 700 }}>
            Every <em style={{ color: GOLD }}>Detail</em> Considered
          </h2>
        </div>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2,1fr)' : 'repeat(auto-fit,minmax(220px,1fr))', gap: '0.9rem' }}>
          {AMENITIES.map((a, i) => <AmenityCard key={i} a={a} i={i} visible={visible} />)}
        </div>
      </div>
    </section>
  )
}

// ─── depth strip (3D tunnel) ───────────────────────────────────────────────────
function DepthStrip({ scrollY }: { scrollY: number }) {
  const sRef = useRef<HTMLDivElement>(null)
  const [top, setTop] = useState(9999)
  const mobile = useIsMobile()
  useEffect(() => { if (sRef.current) setTop(sRef.current.offsetTop) }, [])
  const rel = scrollY - top

  return (
    <div ref={sRef} style={{
      height: mobile ? '200px' : '300px', background: OBSIDIAN,
      position: 'relative', overflow: 'hidden',
      borderTop: `1px solid rgba(201,168,76,0.1)`,
      borderBottom: `1px solid rgba(201,168,76,0.1)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {[240, 200, 160, 120, 80, 40].map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${s + i * 50}px`, height: `${s + i * 50}px`,
          border: `1px solid rgba(201,168,76,${0.4 - i * 0.06})`,
          borderRadius: '50%',
          transform: `perspective(800px) translateZ(${-i * 40 + rel * (0.06 + i * 0.03)}px) rotateX(72deg)`,
        }} />
      ))}
      <div style={{ position: 'relative', textAlign: 'center', zIndex: 5, padding: '0 1.5rem' }}>
        <div style={{ fontFamily: DISPLAY, fontSize: mobile ? '1.2rem' : 'clamp(1.4rem,4vw,2.6rem)', color: TEXT, fontWeight: 700, textShadow: `0 0 60px rgba(201,168,76,0.4)` }}>
          An <em style={{ color: GOLD }}>Experience</em> Unlike Any Other
        </div>
        <div style={{ fontFamily: BODY, color: GOLD_LIGHT, opacity: 0.4, fontSize: '0.68rem', letterSpacing: '0.22em', marginTop: '0.5rem' }}>
          LAHORE'S PREMIER LUXURY STAY
        </div>
      </div>
    </div>
  )
}

// ─── gallery ───────────────────────────────────────────────────────────────────
const GALLERY_IMGS = [
  'https://res.cloudinary.com/ga6pq4fj/image/upload/v1791299545/WhatsApp_Image_2026-10-06_at_8.11.14_PM.jpg',
  'https://res.cloudinary.com/ga6pq4fj/image/upload/v1791290052/WhatsApp_Image_2026-10-06_at_2.24.29_PM.jpg',
  'https://res.cloudinary.com/ga6pq4fj/image/upload/v1791297479/WhatsApp_Image_2026-10-06_at_7.37.13_PM_1.jpg',
  'https://res.cloudinary.com/ga6pq4fj/image/upload/v1791299544/WhatsApp_Image_2026-10-06_at_8.11.12_PM.jpg',
  'https://res.cloudinary.com/ga6pq4fj/image/upload/v1791299544/WhatsApp_Image_2026-10-06_at_8.11.13_PM.jpg',
  'https://res.cloudinary.com/ga6pq4fj/image/upload/v1791299544/WhatsApp_Image_2026-10-06_at_8.11.13_PM_1.jpg',
  'https://res.cloudinary.com/ga6pq4fj/image/upload/f_auto/q_auto/WhatsApp_Image_2026-10-07_at_4.25.28_PM.jpg',
  'https://res.cloudinary.com/ga6pq4fj/image/upload/f_auto/q_auto/WhatsApp_Image_2026-10-07_at_4.24.46_PM.jpg',
]

function Gallery({ scrollY }: { scrollY: number }) {
  const sRef = useRef<HTMLDivElement>(null)
  const [secTop, setSecTop] = useState(9999)
  const { ref, visible } = useVisible(0.04)
  const mobile = useIsMobile()
  useEffect(() => { if (sRef.current) setSecTop(sRef.current.offsetTop) }, [])
  const rel = scrollY - secTop + (typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400)

  return (
    <section id="gallery" ref={sRef} style={{ padding: mobile ? '5rem 1.2rem' : '7rem 2rem', background: OBSIDIAN, overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: mobile ? '3rem' : '4.5rem' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.4em', color: GOLD, fontFamily: BODY, marginBottom: '0.8rem', fontWeight: 500 }}>VISUAL JOURNEY</div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: mobile ? '2rem' : 'clamp(2rem,5vw,3.4rem)', color: TEXT, fontWeight: 700 }}>
            A Glimpse of <em style={{ color: GOLD }}>Luxury</em>
          </h2>
        </div>

        {/* Same 3D entrance animation on all screens, layout adapts */}
        <div ref={ref} style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(3,1fr)',
          gap: '1rem',
          alignItems: 'start',
        }}>
          {GALLERY_IMGS.map((img, i) => (
            <div key={i} style={{
              gridColumn: (!mobile && i === 0) ? 'span 2' : 'span 1',
              overflow: 'hidden', borderRadius: '4px', position: 'relative',
              border: '1px solid rgba(201,168,76,0.1)', background: SURFACE,
              opacity: visible ? 1 : 0,
              transform: visible
                ? 'perspective(600px) rotateX(0) translateY(0) scale(1)'
                : `perspective(600px) rotateX(${30 + i * 5}deg) translateY(70px) scale(0.92)`,
              transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
            }}>
              <img src={img}
                alt="Gallery"
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

type Review = { id: string; name: string; rating: number; text: string; date: string }
const REVIEWS_API = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/api/reviews`

async function fetchReviews(url: string): Promise<{ reviews: Review[] }> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Could not load reviews.')
  return res.json()
}

function Reviews() {
  const { data, mutate, isLoading } = useSWR<{ reviews: Review[] }>(REVIEWS_API, fetchReviews)
  const reviews = data?.reviews ?? []
  const [submitting, setSubmitting] = useState(false)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const { ref, visible } = useVisible()
  const mobile = useIsMobile()

  useEffect(() => {
    if (!visible || paused || reviews.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setTimeout(() => setCurrent(index => (index + 1) % reviews.length), 6000)
    return () => window.clearTimeout(timer)
  }, [current, paused, reviews.length, visible])

  function changeReview(direction: number) {
    setCurrent(index => (index + direction + reviews.length) % reviews.length)
  }

  function tiltReview(event: React.MouseEvent<HTMLElement>) {
    if (mobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    card.style.setProperty('--review-rotate-x', `${-y * 9}deg`)
    card.style.setProperty('--review-rotate-y', `${x * 9}deg`)
    card.style.setProperty('--review-glow-x', `${(x + 0.5) * 100}%`)
    card.style.setProperty('--review-glow-y', `${(y + 0.5) * 100}%`)
  }

  function resetReview(event: React.MouseEvent<HTMLElement>) {
    event.currentTarget.style.setProperty('--review-rotate-x', '0deg')
    event.currentTarget.style.setProperty('--review-rotate-y', '0deg')
  }

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanName = name.trim()
    const cleanText = text.trim()
    if (!cleanName || !cleanText || submitting) return
    setSubmitting(true)
    setMessage('')
    try {
      const res = await fetch(REVIEWS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, rating, text: cleanText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Your review could not be saved.')
      await mutate(prev => ({ reviews: [data.review, ...(prev?.reviews ?? [])] }), { revalidate: false })
      setCurrent(0)
      setName('')
      setText('')
      setRating(5)
      setMessage('Thank you! Your review is now live for all guests.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Your review could not be saved. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '0.9rem 1rem', background: OBSIDIAN,
    border: '1px solid rgba(201,168,76,0.3)', borderRadius: '3px',
    color: TEXT, fontFamily: BODY, fontSize: '0.95rem', outlineColor: GOLD,
  }

  return (
    <section id="reviews" className="reviews-section" style={{ padding: mobile ? '5rem 1.2rem' : '7rem 2rem' }}>
      <div ref={ref} style={{ width: '100%', margin: '0 auto', position: 'relative' }}>
        <div className={`reviews-reveal ${visible ? 'is-visible' : ''}`} style={{ textAlign: 'center', marginBottom: mobile ? '2.8rem' : '4rem' }}>
          <div style={{ fontFamily: BODY, fontSize: '0.62rem', letterSpacing: '0.36em', color: GOLD, marginBottom: '1rem' }}>THE GUEST EXPERIENCE <span style={{ margin: '0 0.7rem', opacity: 0.45 }}>◆</span> ELITE STAY LAHORE</div>
          <h2 style={{ fontFamily: DISPLAY, color: TEXT, fontSize: 'clamp(2.7rem,6vw,4.5rem)', lineHeight: 1.12, margin: 0 }}>Every stay has <em style={{ color: GOLD }}>a story.</em></h2>
          <p style={{ fontFamily: BODY, color: GOLD_LIGHT, opacity: 0.7, marginTop: '1.2rem', fontWeight: 300 }}>The little moments that make a stay unforgettable.</p>
          <div style={{ width: '80px', height: '1px', background: `linear-gradient(90deg,transparent,${GOLD},transparent)`, margin: '1.8rem auto 0' }} />
        </div>
        <div className="reviews-layout">
          <form className={`review-form reviews-reveal ${visible ? 'is-visible' : ''}`} onSubmit={submitReview} style={{ padding: mobile ? '1.6rem' : '2.4rem', transitionDelay: '0.25s' }}>
            <div className="review-form-ornament" aria-hidden="true">✦</div>
            <div style={{ fontFamily: BODY, color: GOLD, fontSize: '0.62rem', letterSpacing: '0.32em', marginBottom: '0.6rem' }}>A NOTE FROM YOU</div>
            <h3 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem,3vw,2rem)', color: TEXT, margin: '0 0 0.6rem' }}>Leave your impression</h3>
            <p style={{ fontFamily: BODY, color: GOLD_LIGHT, opacity: 0.6, fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 2rem' }}>Your experience deserves to be heard.</p>
            <div className="review-form-fields">
              <div>
                <label htmlFor="review-name" style={{ display: 'block', fontFamily: BODY, color: GOLD_LIGHT, fontSize: '0.8rem', marginBottom: '0.5rem' }}>YOUR NAME</label>
                <input id="review-name" required maxLength={60} value={name} onChange={e => setName(e.target.value)} style={fieldStyle} placeholder="Your name" />
              </div>
              <div>
                <div style={{ fontFamily: BODY, color: GOLD_LIGHT, fontSize: '0.8rem', marginBottom: '0.5rem' }}>YOUR RATING</div>
                <div role="group" aria-label="Your rating" style={{ display: 'flex', gap: '0.35rem' }}>
                  {[1, 2, 3, 4, 5].map(value => (
                    <button className="review-rating-star" key={value} type="button" aria-label={`${value} star${value === 1 ? '' : 's'}`} aria-pressed={rating === value} onClick={() => setRating(value)} style={{ background: 'none', border: 0, padding: '0.1rem', color: value <= rating ? GOLD : 'rgba(201,168,76,0.3)', fontSize: '1.8rem', cursor: 'pointer' }}>★</button>
                  ))}
                </div>
              </div>
            </div>
            <label htmlFor="review-text" style={{ display: 'block', fontFamily: BODY, color: GOLD_LIGHT, fontSize: '0.8rem', marginBottom: '0.5rem' }}>YOUR EXPERIENCE</label>
            <textarea id="review-text" required maxLength={1000} rows={5} value={text} onChange={e => setText(e.target.value)} style={{ ...fieldStyle, resize: 'vertical', marginBottom: '1.3rem' }} placeholder="Tell us about your stay..." />
            <button className="review-submit" type="submit" style={{ width: '100%', maxWidth: '340px', padding: '0.95rem', background: `linear-gradient(135deg,${GOLD},${GOLD_DARK})`, color: '#fffaf1', border: 0, borderRadius: '2px', fontFamily: BODY, fontWeight: 700, letterSpacing: '0.15em', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }} disabled={submitting}>{submitting ? 'POSTING...' : <>POST REVIEW <span aria-hidden="true">↗</span></>}</button>
            {message && <p role="status" style={{ color: GOLD_LIGHT, fontFamily: BODY, fontSize: '0.82rem', lineHeight: 1.5 }}>{message}</p>}
            <p style={{ color: GOLD_LIGHT, opacity: 0.6, fontFamily: BODY, fontSize: '0.75rem', lineHeight: 1.5, marginBottom: 0 }}>Your review will be visible to every guest who visits Elite Stay.</p>
          </form>
          <div className={`review-carousel-panel reviews-reveal ${visible ? 'is-visible' : ''}`} role="region" aria-roledescription="carousel" aria-label="Guest reviews" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false) }} onTouchStart={e => { touchStartX.current = e.touches[0].clientX; setPaused(true) }} onTouchEnd={e => { if (touchStartX.current !== null && reviews.length > 1) { const delta = e.changedTouches[0].clientX - touchStartX.current; if (Math.abs(delta) > 45) changeReview(delta < 0 ? 1 : -1) } touchStartX.current = null; setPaused(false) }} onTouchCancel={() => { touchStartX.current = null; setPaused(false) }} style={{ transitionDelay: '0.12s' }}>
            <div className="review-panel-label"><span>THE GUEST JOURNAL</span><span>{reviews.length ? `${String(current + 1).padStart(2, '0')} / ${String(reviews.length).padStart(2, '0')}` : 'ELITE STAY · LAHORE'}</span></div>
            {reviews.length === 0 ? (
              <div className="review-empty">
                <div className="review-orbit" aria-hidden="true"><div className="review-orbit-inner">“</div></div>
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 1rem' }}>
                  <div style={{ fontFamily: BODY, fontSize: '0.62rem', letterSpacing: '0.32em', color: GOLD, marginBottom: '0.9rem' }}>THE FIRST CHAPTER</div>
                  <p style={{ color: TEXT, fontFamily: DISPLAY, fontSize: 'clamp(1.45rem,3vw,2rem)', lineHeight: 1.4, maxWidth: '360px', margin: '0 auto 0.7rem' }}>A beautiful stay deserves a story.</p>
                  <p style={{ color: GOLD_LIGHT, opacity: 0.65, fontFamily: BODY, fontSize: '0.85rem' }}>{isLoading ? 'Loading guest stories...' : 'Be the first to share yours.'}</p>
                </div>
              </div>
            ) : (
              <div key={reviews[current].id} className="review-slide">
              <article className="review-card" onMouseMove={tiltReview} onMouseLeave={resetReview} style={{ padding: mobile ? '1.7rem' : 'clamp(2.4rem,4vw,4.2rem)', overflowWrap: 'anywhere', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="review-card-quote" aria-hidden="true">“</div>
                <div aria-label={`${reviews[current].rating} out of 5 stars`} style={{ color: GOLD, letterSpacing: '0.15em', marginBottom: '0.8rem' }}>{'★'.repeat(reviews[current].rating)}<span style={{ color: 'rgba(201,168,76,0.3)' }}>{'★'.repeat(5 - reviews[current].rating)}</span></div>
                <p style={{ fontFamily: DISPLAY, color: TEXT, whiteSpace: 'pre-wrap', margin: '0 0 1.3rem' }}>“{reviews[current].text}”</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontFamily: BODY, fontSize: '0.8rem' }}>
                  <strong style={{ color: GOLD_LIGHT }}>{reviews[current].name}</strong>
                  <time dateTime={reviews[current].date} style={{ color: GOLD_LIGHT, opacity: 0.55 }}>{new Date(reviews[current].date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
                </div>
              </article>
              </div>
            )}
            {reviews.length > 1 && (
              <div className="review-carousel-controls">
                <button className="review-carousel-arrow" type="button" aria-label="Previous review" onClick={() => changeReview(-1)}>←</button>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: BODY, color: GOLD_LIGHT, fontSize: '0.67rem', letterSpacing: '0.22em', marginBottom: '0.65rem' }}>{String(current + 1).padStart(2, '0')} <span style={{ opacity: 0.4 }}> / </span> {String(reviews.length).padStart(2, '0')}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.45rem' }}>
                    {Array.from({ length: Math.min(reviews.length, 5) }, (_, i) => reviews.length <= 5 ? i : Math.max(0, Math.min(current - 2, reviews.length - 5)) + i).map(index => (
                      <button key={index} className={`review-carousel-dot ${index === current ? 'is-active' : ''}`} type="button" aria-label={`Show review ${index + 1}`} aria-current={index === current ? 'true' : undefined} onClick={() => setCurrent(index)} />
                    ))}
                  </div>
                </div>
                <button className="review-carousel-arrow" type="button" aria-label="Next review" onClick={() => changeReview(1)}>→</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const { ref, visible } = useVisible()
  const mobile = useIsMobile()
  return (
    <section id="contact" style={{ padding: mobile ? '5rem 1.5rem' : '9rem 2rem', background: OBSIDIAN, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: `radial-gradient(circle,rgba(201,168,76,0.07) 0%,transparent 70%)`, pointerEvents: 'none' }} />
      <div ref={ref} style={{ maxWidth: '660px', margin: '0 auto', textAlign: 'center', position: 'relative', ...entrance(visible, mobile, 0, 28) }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.4em', color: GOLD, fontFamily: BODY, marginBottom: '0.9rem', fontWeight: 500 }}>RESERVE YOUR STAY</div>
        <h2 style={{ fontFamily: DISPLAY, fontSize: mobile ? '1.9rem' : 'clamp(2rem,5vw,3.4rem)', color: TEXT, fontWeight: 700, marginBottom: '1.2rem' }}>
          Begin Your <em style={{ color: GOLD }}>Elite</em> Experience
        </h2>
        <p style={{ fontFamily: BODY, color: GOLD_LIGHT, opacity: 0.6, lineHeight: 1.78, fontSize: mobile ? '0.9rem' : '1rem', marginBottom: '2.5rem' }}>
          Reach out instantly via WhatsApp for same-day booking confirmation. Our concierge team is available around the clock.
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={WHATSAPP} target="_blank" rel="noopener" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: `linear-gradient(135deg,${GOLD},${GOLD_DARK})`, color: '#fffaf1',
            padding: mobile ? '0.95rem 1.8rem' : '1.1rem 2.6rem',
            textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.18em',
            fontFamily: BODY, fontWeight: 700, borderRadius: '2px',
            boxShadow: `0 0 50px rgba(201,168,76,0.18)`,
          }}>💬 BOOK VIA WHATSAPP</a>
          <a href={INSTAGRAM} target="_blank" rel="noopener" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            border: `1px solid rgba(201,168,76,0.4)`, color: GOLD,
            padding: mobile ? '0.95rem 1.8rem' : '1.1rem 2.6rem',
            textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.18em',
            fontFamily: BODY, fontWeight: 500, background: 'transparent', borderRadius: '2px',
          }}>📸 INSTAGRAM</a>
        </div>
      </div>
    </section>
  )
}

// ─── footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const mobile = useIsMobile()
  const socials = [
    { label: 'Instagram', href: INSTAGRAM, icon: '📸' },
    { label: 'WhatsApp',  href: WHATSAPP,  icon: '💬' },
    { label: 'TikTok',    href: TIKTOK,    icon: '🎵' },
  ]
  return (
    <footer style={{ background: '#D8C3A6', borderTop: `1px solid rgba(166,124,61,0.28)`, padding: mobile ? '3rem 1.5rem 1.5rem' : '4.5rem 2.5rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3,1fr)', gap: mobile ? '2rem' : '3rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontFamily: DISPLAY, fontSize: '1.6rem', color: GOLD, fontWeight: 700, lineHeight: 1 }}>ELITE STAY</div>
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.35em', color: GOLD_LIGHT, fontFamily: BODY, opacity: 0.65, marginBottom: '1rem', marginTop: '2px' }}>LAHORE</div>
            <p style={{ fontFamily: BODY, color: GOLD_LIGHT, opacity: 0.72, fontSize: '0.82rem', lineHeight: 1.7 }}>Premium luxury apartments in the heart of Lahore, Pakistan.</p>
          </div>
          {!mobile && (
            <div>
              <h4 style={{ fontFamily: BODY, fontSize: '0.62rem', letterSpacing: '0.3em', color: GOLD, marginBottom: '1.2rem', fontWeight: 600 }}>QUICK LINKS</h4>
              {['Rooms & Suites','Amenities','Gallery','Book Now'].map(l => (
                <div key={l} style={{ marginBottom: '0.7rem' }}>
                  <a href="#" style={{ fontFamily: BODY, color: GOLD_LIGHT, opacity: 0.72, textDecoration: 'none', fontSize: '0.86rem', transition: 'all 0.2s' }}
                    onMouseEnter={e => { const el=e.target as HTMLElement; el.style.opacity='1'; el.style.color=GOLD }}
                    onMouseLeave={e => { const el=e.target as HTMLElement; el.style.opacity='0.72'; el.style.color=GOLD_LIGHT }}
                  >{l}</a>
                </div>
              ))}
            </div>
          )}
          <div>
            <h4 style={{ fontFamily: BODY, fontSize: '0.62rem', letterSpacing: '0.3em', color: GOLD, marginBottom: '1.2rem', fontWeight: 600 }}>FIND US ON</h4>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  textDecoration: 'none', fontFamily: BODY, color: GOLD_LIGHT, opacity: 0.78,
                  fontSize: '0.84rem', transition: 'all 0.2s',
                  border: `1px solid rgba(201,168,76,0.22)`,
                  padding: '0.55rem 1rem', borderRadius: '2px',
                }}
                  onMouseEnter={e => { const el=e.currentTarget; el.style.opacity='1'; el.style.color=GOLD; el.style.borderColor='rgba(201,168,76,0.5)' }}
                  onMouseLeave={e => { const el=e.currentTarget; el.style.opacity='0.78'; el.style.color=GOLD_LIGHT; el.style.borderColor='rgba(201,168,76,0.22)' }}
                ><span>{s.icon}</span> {s.label}</a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, paddingTop: '1.5rem', textAlign: mobile ? 'center' : 'left' }}>
          <p style={{ fontFamily: BODY, color: GOLD_LIGHT, opacity: 0.58, fontSize: '0.76rem' }}>© 2024 Elite Stay Lahore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// ─── app ───────────────────────────────────────────────────────────────────────
export default function App() {
  const scrollY = useScrollY()
  return (
    <div style={{ background: OBSIDIAN, minHeight: '100vh' }}>
      <Navbar scrollY={scrollY} />
      <Hero scrollY={scrollY} />
      <Stats />
      <Rooms />
      <Amenities />
      <DepthStrip scrollY={scrollY} />
      <Gallery scrollY={scrollY} />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  )
}
