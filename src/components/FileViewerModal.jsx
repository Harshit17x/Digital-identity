import React from 'react';
import { X, FileText, Download, Tag, Calendar, Building, ExternalLink, Network, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FileViewerModal({ item, onClose }) {
  if (!item) return null;

  const handleDownload = () => {
    // Generate dummy downloadable file blob if needed
    const blob = new Blob([item.rawText || item.contentPreview || item.summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.fileName || `${item.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '1100px',
        height: '85vh',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-glass-bright)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Top Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={20} color="var(--accent-primary)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{item.title}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Original File: {item.fileName} • Preserved Format</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={handleDownload} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              <Download size={14} /> Download Original File
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Side-by-Side Content Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', flex: 1, overflow: 'hidden' }}>
          
          {/* Left Pane: Original Document Preview */}
          <div style={{
            background: 'rgba(5, 8, 15, 0.8)',
            padding: '24px',
            borderRight: '1px solid var(--border-glass)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Format Preserved View ({item.fileType ? item.fileType.toUpperCase() : 'PDF'})
              </span>
              {item.githubUrl && (
                <a href={item.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-secondary)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Open Repository <ExternalLink size={12} />
                </a>
              )}
            </div>

            {/* Simulated Document Canvas / PDF Viewer Container */}
            <div style={{
              flex: 1,
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: 'var(--radius-md)',
              padding: '36px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              fontFamily: 'serif',
              position: 'relative',
              overflowY: 'auto',
              minHeight: '400px'
            }}>
              {/* Document Header Seal / Emblem */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '24px' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.1em', fontWeight: 'bold', color: '#64748b' }}>
                  {item.issuer}
                </div>
                <h2 style={{ fontSize: '1.6rem', color: '#0f172a', fontFamily: 'Outfit, sans-serif', fontWeight: 800, marginTop: '4px' }}>
                  {item.title}
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>Academic & Professional Record • Year {item.year}</span>
              </div>

              {/* Document Text Body */}
              <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#334155', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <p style={{ marginBottom: '16px', fontWeight: 500 }}>
                  {item.contentPreview || item.rawText}
                </p>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #6366f1', marginTop: '24px' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', color: '#1e293b' }}>Official Document Summary</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Signature / Footer */}
              <div style={{ marginTop: '48px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
                <div>Verified Digital Fingerprint: 0x9f8...a21</div>
                <div>Issue Date: {item.date || item.year}</div>
              </div>
            </div>
          </div>

          {/* Right Pane: AI Extracted Metadata & Graph Connections */}
          <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* AI Confidence */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={18} color="#10b981" />
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>AI Parsing Verified</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Category: {item.category} • Score {(item.confidenceScore * 100).toFixed(0)}%</p>
              </div>
            </div>

            {/* Metadata Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ISSUER / INSTITUTION</span>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: '#fff' }}>{item.issuer}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>YEAR / DATE</span>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: '#fff' }}>{item.year}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>EXTRACTED SKILLS & ENTITIES</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {item.skills.map((skill, idx) => (
                    <span key={idx} className="badge-category badge-skills" style={{ fontSize: '0.72rem' }}>
                      <Tag size={12} /> {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Executive Summary */}
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <h4 style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> AI Executive Digest
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                {item.summary}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
