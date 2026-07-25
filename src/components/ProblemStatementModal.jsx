import React from 'react';
import { X, Layers, CheckCircle2, ArrowRight, ShieldCheck, Cpu, Database, Award } from 'lucide-react';

export default function ProblemStatementModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const segments = [
    {
      title: "Segment 1: Fragmented Academic & Career Data",
      briefText: "Every student builds a digital footprint throughout their academic and professional journey. Certificates, resumes, project reports, internship letters, and GitHub repositories accumulate over time across folders, emails, cloud drives, and devices.",
      solution: "Multi-Modal AI Ingestion Engine",
      solutionDetail: "Drop any raw PDF, image, or document. System reads text, verifies issuers, extracts skill tags, and organizes entries into standardized categories with 97%+ accuracy.",
      color: "#2563EB",
      bg: "rgba(37, 99, 235, 0.08)",
      icon: Cpu
    },
    {
      title: "Segment 2: Context Loss & Hard-to-Locate Growth",
      briefText: "As years pass, valuable experiences become difficult to locate, connect, and showcase to recruiters or academic institutions.",
      solution: "Wobbly Growth Timeline & Interconnected Thread",
      solutionDetail: "Visualizes progression year-by-year with hand-drawn SVG thread connections. Automatically links early coursework to capstones, internship evaluations, and industry certs.",
      color: "#C9A24B",
      bg: "rgba(201, 162, 75, 0.12)",
      icon: Layers
    },
    {
      title: "Segment 3: Dumb Cloud Storage Limitations",
      briefText: "Traditional storage platforms can save files, but they cannot understand a person's journey.",
      solution: "Vector RAG Instant Context Retrieval (⌘K)",
      solutionDetail: "Powered by Supabase pgvector embeddings. Query your entire history in natural language ('What PyTorch models did I train in 2025?') for instant context-aware results.",
      color: "#16A34A",
      bg: "#DCFCE7",
      icon: Database
    },
    {
      title: "Segment 4: Preserving Original File Fidelity",
      briefText: "Preserving original files and formats while generating a structured, searchable, and intelligent knowledge repository.",
      solution: "AES-256 Fidelity Storage & Direct Access",
      solutionDetail: "All original documents remain fully intact in native formats. Users retain 100% data ownership with 1-click original downloads and JSON/PDF portfolio exports.",
      color: "#9333EA",
      bg: "rgba(147, 51, 234, 0.08)",
      icon: ShieldCheck
    }
  ];

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
        justify: 'center',
        padding: '20px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '85vh',
          background: '#FFFFFF',
          borderRadius: '28px',
          padding: '36px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E2E8F0',
          position: 'relative',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: '#F1F5F9',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: '#64748B',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '28px' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: '#2563EB',
            background: 'rgba(37, 99, 235, 0.08)',
            padding: '4px 14px',
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            SYSTEM ARCHITECTURE & CHALLENGE BRIEF
          </span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>
            Problem Statement Segments & System Solutions
          </h3>
          <p style={{ fontSize: '0.98rem', color: '#64748B', margin: 0, lineHeight: 1.6 }}>
            How our AI-powered Digital Identity System transforms fragmented academic data into a structured knowledge repository.
          </p>
        </div>

        {/* Segments Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {segments.map((seg, idx) => {
            const Icon = seg.icon;
            return (
              <div 
                key={idx}
                style={{
                  background: '#F8FAFC',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                {/* Segment Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: seg.bg,
                    color: seg.color,
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    <Icon size={20} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {seg.title}
                  </h4>
                </div>

                {/* Brief Challenge Text */}
                <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, lineHeight: 1.6, background: '#FFFFFF', padding: '14px 16px', borderRadius: '12px', borderLeft: `4px solid ${seg.color}` }}>
                  <strong>The Challenge:</strong> "{seg.briefText}"
                </p>

                {/* System Solution */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '4px' }}>
                  <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                      {seg.solution}:
                    </span>
                    <span style={{ fontSize: '0.88rem', color: '#64748B', marginLeft: '6px' }}>
                      {seg.solutionDetail}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
