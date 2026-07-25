import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, Clock, ShieldCheck, ArrowRight, FileText, Calendar, Tag, ExternalLink, 
  Cpu, Layers, Search, Lock, Download, Zap, X, User, School, Github, Mail, Key, Sparkles
} from 'lucide-react';

const PHRASES = [
  "Understand, organize, and track",
  "Certifications, resumes, and projects",
  "Skills, internships, and achievements",
  "Your complete academic journey"
];

/* ==========================================
   1. Interactive Particle Background Canvas
========================================== */
function InteractiveBackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000, radius: 160 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const particles = [];
    const colors = ['#2563EB', '#38BDF8', '#818CF8', '#6366F1', '#0284C7'];

    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.35 + 0.15,
        baseAlpha: Math.random() * 0.35 + 0.15
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= Math.cos(angle) * force * 1.8;
          p.y -= Math.sin(angle) * force * 1.8;
          p.alpha = Math.min(0.75, p.baseAlpha + force * 0.45);

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${0.3 * (1 - dist / mouse.radius)})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        } else {
          p.alpha = p.baseAlpha;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}

/* ==========================================
   2. Typewriter Loop Heading Component
========================================== */
function TypewriterHeading() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = PHRASES[phraseIdx];
    let timer;

    if (!isDeleting) {
      if (currentText.length < fullText.length) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, 65);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        }, 35);
      } else {
        setIsDeleting(false);
        setPhraseIdx((prev) => (prev + 1) % PHRASES.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIdx]);

  return (
    <span>
      {currentText}
      <span className="typewriter-cursor" />
    </span>
  );
}

/* ==========================================
   3. Draggable Widget Wrapper Component
========================================== */
function DraggableWidget({ children, initialTop, initialLeft, initialRight, initialBottom, style }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Mouse Drag Handler
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Touch Drag Handler
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };

    const handleTouchMove = (e) => {
      if (!isDragging || !e.touches || !e.touches[0]) return;
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleEnd);
      window.addEventListener('touchcancel', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging, dragStart]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: 'absolute',
        top: initialTop,
        left: initialLeft,
        right: initialRight,
        bottom: initialBottom,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: isDragging ? 'none' : 'auto',
        zIndex: isDragging ? 100 : 10,
        boxShadow: isDragging ? '0 25px 50px rgba(0,0,0,0.18)' : 'none',
        transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
        ...style
      }}
      title="Click or touch & drag me anywhere!"
    >
      {children}
    </div>
  );
}

/* ==========================================
   4. SECTION: Navigation Bar Component
========================================== */
function Navbar({ onOpenAuth, onLogin, scrollToSection }) {
  return (
    <header style={{
      maxWidth: '1140px',
      width: 'calc(100% - 40px)',
      margin: '20px auto 0 auto',
      padding: '12px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '32px',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(226, 232, 240, 0.9)',
      borderRadius: '9999px',
      boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
      position: 'relative',
      zIndex: 20
    }}>
      <div 
        onClick={onOpenAuth}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0, marginRight: '16px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', width: '22px', height: '22px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0F172A' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38BDF8' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0F172A' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0F172A' }} />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', whiteSpace: 'nowrap' }}>
          Digital Identity
        </span>
      </div>

      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '36px',
        fontSize: '0.9rem',
        fontWeight: 500,
        color: '#475569'
      }}>
        <a href="#features" onClick={(e) => scrollToSection(e, 'features')} style={{ color: '#475569', textDecoration: 'none', whiteSpace: 'nowrap' }}>Features</a>
        <a href="#solutions" onClick={(e) => scrollToSection(e, 'solutions')} style={{ color: '#475569', textDecoration: 'none', whiteSpace: 'nowrap' }}>Solutions</a>
        <a href="#resources" onClick={(e) => scrollToSection(e, 'resources')} style={{ color: '#475569', textDecoration: 'none', whiteSpace: 'nowrap' }}>Resources</a>
        <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} style={{ color: '#475569', textDecoration: 'none', whiteSpace: 'nowrap' }}>Pricing</a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0, marginLeft: 'auto' }}>
        <button 
          onClick={onLogin}
          style={{
            border: 'none',
            background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
            color: '#FFFFFF',
            padding: '9px 22px',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(56, 189, 248, 0.38)',
            transition: 'transform 0.15s ease, boxShadow 0.15s ease'
          }}
          title="Open the main student identity dashboard"
        >
          <Sparkles size={15} color="#FFFFFF" />
          <span>Main Page</span>
        </button>
      </div>
    </header>
  );
}

/* ==========================================
   5. SECTION: Hero Centerpiece Section
========================================== */
function HeroSection({ onOpenAuth }) {
  return (
    <main style={{
      maxWidth: '1280px',
      width: '100%',
      margin: '0 auto',
      padding: '40px 32px 100px 32px',
      position: 'relative',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* TOP-LEFT DRAGGABLE STICKY NOTE WIDGET */}
      <DraggableWidget initialTop="30px" initialLeft="40px">
        <div style={{ position: 'relative' }} className="animate-fade-in">
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '-10px',
            width: '260px',
            height: '200px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            transform: 'rotate(-8deg)',
            border: '1px solid #F1F5F9'
          }} />

          <div style={{
            position: 'relative',
            width: '275px',
            background: '#FEF08A',
            borderRadius: '10px',
            padding: '24px 22px 32px 22px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
            transform: 'rotate(-4deg)',
            border: '1px solid #FDE047'
          }}>
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#EF4444',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />

            <p style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.38rem',
              lineHeight: 1.3,
              color: '#713F12',
              margin: 0,
              fontWeight: 600
            }}>
              Organize your certificates, resumes, and project reports to track your growth with ease.
            </p>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '-20px',
            right: '16px',
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: '#FFFFFF',
            boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #F1F5F9',
            zIndex: 5
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Check size={20} strokeWidth={3} />
            </div>
          </div>
        </div>
      </DraggableWidget>

      {/* TOP-RIGHT DRAGGABLE REMINDERS WIDGET */}
      <DraggableWidget initialTop="40px" initialRight="40px">
        <div style={{ position: 'relative' }} className="animate-fade-in">
          <div style={{
            position: 'relative',
            width: '260px',
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.07)',
            border: '1px solid #F1F5F9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>Reminders</span>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Milestones</span>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '2px' }}>
                AI Internship Evaluation
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '8px' }}>
                Upload review report from manager
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#E0F2FE',
                color: '#0284C7',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600
              }}>
                <Clock size={12} /> 13:00 - 13:45
              </div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '-25px',
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: '#FFFFFF',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #F1F5F9'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '2px solid #0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ width: '2px', height: '10px', background: '#0F172A', position: 'absolute', top: '6px' }} />
              <div style={{ width: '8px', height: '2px', background: '#0F172A', position: 'absolute', right: '6px' }} />
            </div>
          </div>
        </div>
      </DraggableWidget>

      {/* CENTER HERO CONTENT */}
      <div style={{
        textAlign: 'center',
        maxWidth: '780px',
        marginTop: '60px',
        marginBottom: '40px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: '#FFFFFF',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 28px auto',
          border: '1px solid #F1F5F9'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', width: '28px', height: '28px' }}>
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#38BDF8' }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#0F172A' }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#0F172A' }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#0F172A' }} />
          </div>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1.15,
          color: '#0F172A',
          marginBottom: '20px',
          minHeight: '2.5em'
        }}>
          <TypewriterHeading /> <br />
          <span style={{ color: '#94A3B8', fontWeight: 600 }}>all in one place</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: '#64748B',
          lineHeight: 1.6,
          marginBottom: '36px',
          maxWidth: '560px',
          margin: '0 auto 36px auto'
        }}>
          Effortlessly transform your academic records, certificates, and projects into an intelligent digital identity.
        </p>

        <button
          onClick={onOpenAuth}
          style={{
            background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
            color: '#FFFFFF',
            border: 'none',
            padding: '14px 38px',
            borderRadius: '9999px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 10px 28px rgba(56, 189, 248, 0.42)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.15s ease, boxShadow 0.15s ease'
          }}
        >
          <span>Explore Platform</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </main>
  );
}

/* ==========================================
   6. SECTION: Features Component (Full-Width Blended Scroll)
========================================== */
function FeaturesSection() {
  return (
    <section id="features" style={{
      width: '100%',
      padding: '100px 32px',
      background: 'transparent',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 60px auto' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#0F172A',
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #CBD5E1',
            padding: '5px 16px',
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '18px',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
          }}>
            INTELLIGENT FEATURES
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', margin: '0 0 16px 0', lineHeight: 1.2 }}>
            Everything you build, automatically connected
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Stop digging through folders, cloud drives, and emails. Multi-modal AI extracts skills, dates, and relationships from every document you upload.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '36px 32px',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            transition: 'all 0.25s ease'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              marginBottom: '24px'
            }}>
              <Cpu size={26} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
              Automated AI Parsing
            </h3>
            <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Drop any PDF, image, or certificate. Gemini 2.5 reads text, verifies issuing institutions, extracts verified skill tags, and categorizes entries into Projects, Skills, Certifications, or Internships.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '36px 32px',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            transition: 'all 0.25s ease'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              marginBottom: '24px'
            }}>
              <Layers size={26} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
              Wobbly Growth Timeline
            </h3>
            <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Watch your academic progression unfold year-by-year with hand-drawn SVG thread connections. See how early course projects evolve into capstones and industry internships.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '36px 32px',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            transition: 'all 0.25s ease'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              marginBottom: '24px'
            }}>
              <Search size={26} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
              Instant Vector RAG Search (<kbd style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '2px 7px', borderRadius: '4px', fontSize: '0.78rem' }}>⌘K</kbd>)
            </h3>
            <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Query your entire history in plain English. Ask <em>"What PyTorch models did I train in 2025?"</em> or <em>"Find my AWS Cloud practitioner certificate"</em> for instant context matches.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ==========================================
   7. SECTION: Solutions Component (Full-Width Blended Scroll)
========================================== */
function SolutionsSection() {
  return (
    <section id="solutions" style={{
      width: '100%',
      padding: '100px 32px',
      background: 'transparent',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 60px auto' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#16A34A',
            background: '#DCFCE7',
            border: '1px solid #BBF7D0',
            padding: '5px 16px',
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '18px',
            boxShadow: '0 2px 10px rgba(22, 163, 74, 0.06)'
          }}>
            TAILORED SOLUTIONS
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', margin: '0 0 16px 0', lineHeight: 1.2 }}>
            Built for every stage of your career
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Whether you're an undergrad compiling coursework or a researcher managing multi-year lab papers.
          </p>
        </div>

        {/* Solutions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '36px 32px',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            transition: 'all 0.25s ease'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0' }}>
              🎓 For Students & Undergrads
            </h3>
            <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              Consolidate course reports, hackathon trophies, and certifications into a single interactive profile that impresses hiring managers.
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155', fontSize: '0.9rem', lineHeight: 2 }}>
              <li>Automatic course project grouping</li>
              <li>Verified skill badges & credentials</li>
              <li>Shareable public portfolio links</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '36px 32px',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            transition: 'all 0.25s ease'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0' }}>
              🔬 For Researchers & PhDs
            </h3>
            <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              Connect published papers, lab reports, grant submissions, and citation networks with interlinked visual knowledge graphs.
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155', fontSize: '0.9rem', lineHeight: 2 }}>
              <li>Vis.js visual knowledge network</li>
              <li>Co-author & lab relationship tracking</li>
              <li>BibTeX & DOI document metadata</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '36px 32px',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            transition: 'all 0.25s ease'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0' }}>
              💼 For Job Applicants & Alumni
            </h3>
            <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              Never lose track of past accomplishments. Instantly generate tailored skill summaries and proof of work for recruiters.
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155', fontSize: '0.9rem', lineHeight: 2 }}>
              <li>Instant ATS-ready skill summaries</li>
              <li>Verified manager recommendation letters</li>
              <li>Direct original document access</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ==========================================
   8. SECTION: Resources Component (Full-Width Blended Scroll)
========================================== */
function ResourcesSection() {
  return (
    <section id="resources" style={{
      width: '100%',
      padding: '100px 32px',
      background: 'transparent',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 60px auto' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#7C3AED',
            background: '#F3E8FF',
            border: '1px solid #DDD6FE',
            padding: '5px 16px',
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '18px',
            boxShadow: '0 2px 10px rgba(124, 58, 237, 0.06)'
          }}>
            SECURITY & RESOURCES
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', margin: '0 0 16px 0', lineHeight: 1.2 }}>
            Built on privacy, open standards, and high security
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Your academic identity belongs to you. Zero-knowledge document encryption with instant data portability.
          </p>
        </div>

        {/* Resources Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '36px 32px',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              marginBottom: '20px'
            }}>
              <Lock size={24} color="#0F172A" />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>
              AES-256 File Fidelity
            </h4>
            <p style={{ fontSize: '0.92rem', color: '#64748B', margin: 0, lineHeight: 1.6 }}>
              Original documents remain completely intact in their native PDF, PNG, or DOCX formats with end-to-end encryption.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '36px 32px',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              marginBottom: '20px'
            }}>
              <Download size={24} color="#16A34A" />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>
              One-Click Data Portability
            </h4>
            <p style={{ fontSize: '0.92rem', color: '#64748B', margin: 0, lineHeight: 1.6 }}>
              Export your entire journey knowledge graph anytime as JSON, PDF portfolio, or Markdown for complete ownership.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '36px 32px',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              marginBottom: '20px'
            }}>
              <Zap size={24} color="#7C3AED" />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>
              100+ App Integrations
            </h4>
            <p style={{ fontSize: '0.92rem', color: '#64748B', margin: 0, lineHeight: 1.6 }}>
              Connect Google Drive, GitHub repositories, Canvas LMS, and LinkedIn in one click for automated sync.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ==========================================
   9. SECTION: Pricing Component (Full-Width Blended Scroll)
========================================== */
function PricingSection({ onOpenAuth }) {
  return (
    <section id="pricing" style={{
      width: '100%',
      padding: '100px 32px 120px 32px',
      background: 'transparent',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 60px auto' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#0F172A',
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #CBD5E1',
            padding: '5px 16px',
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '18px',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
          }}>
            TRANSPARENT PRICING
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', margin: '0 0 16px 0', lineHeight: 1.2 }}>
            Invest in your digital footprint
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Start free with full core features, or unlock advanced visual knowledge maps for academic teams.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'stretch' }}>
          
          {/* Plan 1 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '40px 36px',
            borderRadius: '28px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>Student Starter</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '0 0 28px 0' }}>For individual undergrads building their career portfolio.</p>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0F172A', marginBottom: '28px' }}>
                $0 <span style={{ fontSize: '1.05rem', color: '#64748B', fontWeight: 500 }}>/ forever</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px 0', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: '#334155' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="#0F172A" /> Up to 100 Documents</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="#0F172A" /> AI Auto-Categorization</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="#0F172A" /> Interactive Timeline View</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="#0F172A" /> Vector RAG Search (⌘K)</li>
              </ul>
            </div>
            <button onClick={onOpenAuth} style={{ width: '100%', background: '#FFFFFF', color: '#0F172A', border: '1px solid #0F172A', padding: '14px', borderRadius: '9999px', fontSize: '0.94rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease' }}>
              Get Started Free
            </button>
          </div>

          {/* Plan 2: Featured Pro Obsidian Card */}
          <div style={{
            background: '#FFFFFF',
            padding: '40px 36px',
            borderRadius: '28px',
            border: '2px solid #0F172A',
            boxShadow: '0 25px 50px rgba(15, 23, 42, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-16px',
              right: '28px',
              background: '#0F172A',
              color: '#FFFFFF',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              padding: '5px 14px',
              borderRadius: '9999px',
              textTransform: 'uppercase'
            }}>
              MOST POPULAR
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>Pro Researcher</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '0 0 28px 0' }}>For PhD candidates, researchers, and active job applicants.</p>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0F172A', marginBottom: '28px' }}>
                $9 <span style={{ fontSize: '1.05rem', color: '#64748B', fontWeight: 500 }}>/ month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px 0', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: '#334155' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="#0F172A" /> Unlimited Documents & Files</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="#0F172A" /> Vis.js Visual Knowledge Graph</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="#0F172A" /> Advanced Supabase pgvector RAG</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="#0F172A" /> Custom Skill Taxonomy Tags</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="#0F172A" /> Export to Verified PDF Portfolio</li>
              </ul>
            </div>

            <button onClick={onOpenAuth} style={{ width: '100%', background: '#0F172A', color: '#FFFFFF', border: '1px solid #1E293B', padding: '14px', borderRadius: '9999px', fontSize: '0.94rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 20px rgba(15, 23, 42, 0.25)', transition: 'all 0.15s ease' }}>
              Upgrade to Pro
            </button>
          </div>

          {/* Plan 3 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '40px 36px',
            borderRadius: '28px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>University Campus</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '0 0 28px 0' }}>For department chairs, academic advisors, and career centers.</p>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0F172A', marginBottom: '28px' }}>
                Custom <span style={{ fontSize: '1.05rem', color: '#64748B', fontWeight: 500 }}>/ campus</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px 0', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: '#334155' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="#0F172A" /> Institutional Single Sign-On (SSO)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="#0F172A" /> Bulk Student Roster Import</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="#0F172A" /> Advisor Progress Analytics</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="#0F172A" /> Verified University Credential Badges</li>
              </ul>
            </div>
            <button onClick={onOpenAuth} style={{ width: '100%', background: '#FFFFFF', color: '#0F172A', border: '1px solid #0F172A', padding: '14px', borderRadius: '9999px', fontSize: '0.94rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease' }}>
              Contact Campus Team
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ==========================================
   10. SECTION: Footer Component
========================================== */
function FooterSection({ scrollToSection }) {
  return (
    <footer style={{
      background: '#0F172A',
      color: '#94A3B8',
      padding: '60px 32px 40px 32px',
      borderTop: '1px solid #1E293B',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        maxWidth: '1140px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', width: '22px', height: '22px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38BDF8' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }} />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Digital Identity System
          </span>
        </div>

        <div style={{ display: 'flex', gap: '28px', fontSize: '0.88rem' }}>
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} style={{ color: '#94A3B8', textDecoration: 'none' }}>Features</a>
          <a href="#solutions" onClick={(e) => scrollToSection(e, 'solutions')} style={{ color: '#94A3B8', textDecoration: 'none' }}>Solutions</a>
          <a href="#resources" onClick={(e) => scrollToSection(e, 'resources')} style={{ color: '#94A3B8', textDecoration: 'none' }}>Resources</a>
          <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} style={{ color: '#94A3B8', textDecoration: 'none' }}>Pricing</a>
        </div>

        <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
          © 2026 Digital Identity. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ==========================================
   11. DEDICATED LOGIN / AUTH MODAL OVERLAY
========================================== */
function AuthModal({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('demo');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#FFFFFF',
          borderRadius: '28px',
          padding: '36px 32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E2E8F0',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F1F5F9',
            border: 'none',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Brand Icon Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: '#EFF6FF',
            color: '#2563EB',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <User size={26} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Welcome to Digital Identity
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
            Sign in to access your intelligent academic journey dashboard.
          </p>
        </div>

        {/* Login Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          
          {/* Option 1: Demo Quick Access (Recommended) */}
          <button
            onClick={onLogin}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              padding: '14px 18px',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.28)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={18} />
              <span>Continue as Alex Chen (Stanford '26)</span>
            </div>
            <ArrowRight size={16} />
          </button>

          {/* Option 2: University SSO / SAML Login */}
          <button
            onClick={onLogin}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 18px',
              background: '#F8FAFC',
              color: '#1E293B',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <School size={18} color="#2563EB" />
            <span>Sign in with University SSO (.edu)</span>
          </button>

          {/* Option 3: GitHub Sign-in */}
          <button
            onClick={onLogin}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 18px',
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <Github size={18} />
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0', color: '#94A3B8', fontSize: '0.78rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          <span>or sign in with email</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        </div>

        {/* Custom Email Sign In Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              placeholder="student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '14px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '14px',
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Send Magic Link
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8', marginTop: '20px', margin: '20px 0 0 0' }}>
          By continuing, you agree to our Terms of Service & Privacy Policy.
        </p>

      </div>
    </div>
  );
}

/* ==========================================
   12. MAIN LANDING PAGE COMPONENT
========================================== */
export default function LandingPage({ onLogin, onEnterDashboard }) {
  const handleEnter = onEnterDashboard || onLogin;
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAFAFA',
      backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      color: '#0F172A',
      fontFamily: "'Inter', -apple-system, sans-serif",
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Interactive Background Canvas Layer */}
      <InteractiveBackgroundCanvas />

      {/* 1. Header Navigation Component */}
      <Navbar onOpenAuth={handleEnter} onLogin={handleEnter} scrollToSection={scrollToSection} />

      {/* 2. Hero Centerpiece Section Component */}
      <HeroSection onOpenAuth={handleEnter} />

      {/* 3. Features Section Component */}
      <FeaturesSection />

      {/* 4. Solutions Section Component */}
      <SolutionsSection />

      {/* 5. Resources & Security Section Component */}
      <ResourcesSection />

      {/* 6. Pricing Section Component */}
      <PricingSection onOpenAuth={handleEnter} />

      {/* 7. Footer Section Component */}
      <FooterSection scrollToSection={scrollToSection} />

      {/* 8. Dedicated Auth / Login Screen Overlay */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={handleEnter} 
      />

    </div>
  );
}
