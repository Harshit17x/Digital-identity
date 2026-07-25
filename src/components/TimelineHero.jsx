import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ExternalLink, Calendar, ChevronDown, ChevronUp, Tag, ArrowRight, FileText, CheckCircle2, Network, Download } from 'lucide-react';

export default function TimelineHero({ documents, studentProfile, activeCategory, onOpenGraphModal, onSelectDoc }) {
  const [expandedDocId, setExpandedDocId] = useState(null);
  const pathRef = useRef(null);
  const containerRef = useRef(null);
  const [pathLength, setPathLength] = useState(3000);
  const [scrollProgress, setScrollProgress] = useState(0.25);

  // Sort documents by date / year descending
  const sortedDocs = [...documents].sort((a, b) => new Date(b.doc_date) - new Date(a.doc_date));

  const filteredDocs = sortedDocs.filter(d => activeCategory === 'All' || d.category === activeCategory);

  const toggleExpand = (id) => {
    setExpandedDocId(expandedDocId === id ? null : id);
  };

  useEffect(() => {
    if (pathRef.current) {
      try {
        const total = pathRef.current.getTotalLength();
        if (total > 0) setPathLength(total);
      } catch (e) {
        // Fallback length
      }
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through the timeline container
      const containerTop = rect.top;
      const containerHeight = rect.height || 1;
      
      const scrolledAmount = windowHeight * 0.7 - containerTop;
      let progress = scrolledAmount / containerHeight;
      progress = Math.max(0.15, Math.min(1.0, progress));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredDocs]);

  // Dynamic Real-Time AI Insight Calculation
  const dynamicAIInsight = (() => {
    const docsToAnalyze = filteredDocs.length > 0 ? filteredDocs : documents;
    if (!docsToAnalyze || docsToAnalyze.length === 0) {
      return "No documents indexed yet. Upload certificates or projects to generate live growth insights.";
    }

    const certs = docsToAnalyze.filter(d => d.category === 'Certifications').length;
    const projects = docsToAnalyze.filter(d => d.category === 'Projects').length;
    const internships = docsToAnalyze.filter(d => d.category === 'Internships').length;
    const academics = docsToAnalyze.filter(d => d.category === 'Academics').length;

    // Extract top skill frequency
    const skillCounts = {};
    docsToAnalyze.forEach(d => {
      if (Array.isArray(d.skills_mentioned)) {
        d.skills_mentioned.forEach(s => {
          skillCounts[s] = (skillCounts[s] || 0) + 1;
        });
      }
    });

    const sortedSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .map(e => e[0]);

    const topSkillCluster = sortedSkills.slice(0, 2).join(' & ') || 'Machine Learning';

    const avgConf = Math.round(
      (docsToAnalyze.reduce((acc, d) => acc + (d.confidence || 0.9), 0) / docsToAnalyze.length) * 100
    );

    if (activeCategory === 'Certifications') {
      return `You have ${certs} verified certification${certs === 1 ? '' : 's'} indexed with ${avgConf}% AI confidence.`;
    }
    if (activeCategory === 'Projects') {
      return `You have ${projects} high-impact project${projects === 1 ? '' : 's'} indexed in your repository.`;
    }
    if (activeCategory === 'Internships') {
      return `You have ${internships} verified internship role${internships === 1 ? '' : 's'} recorded in your digital identity timeline.`;
    }
    if (activeCategory === 'Academics') {
      return `You have ${academics} academic credential${academics === 1 ? '' : 's'} verified on record.`;
    }

    const parts = [];
    if (certs > 0) parts.push(`${certs} certification${certs === 1 ? '' : 's'}`);
    if (projects > 0) parts.push(`${projects} project${projects === 1 ? '' : 's'}`);
    if (internships > 0) parts.push(`${internships} internship${internships === 1 ? '' : 's'}`);
    if (academics > 0) parts.push(`${academics} academic record${academics === 1 ? '' : 's'}`);

    const countsString = parts.length > 1
      ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1]
      : parts[0] || `${docsToAnalyze.length} entries`;

    return `You've added ${countsString} to your digital identity repository.`;
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* 1. AI-Native Dynamic Single Line Insight Banner */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '20px',
        padding: '16px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)'
      }}>
        <Sparkles size={20} color="#C9A24B" style={{ flexShrink: 0 }} />
        <p style={{
          fontSize: '0.95rem',
          color: '#0F172A',
          margin: 0,
          fontFamily: 'var(--font-grotesk)',
          lineHeight: 1.5,
          fontWeight: 500
        }}>
          {dynamicAIInsight}
        </p>
      </div>

      {/* 2. Timeline Canvas Spine (Ref for scroll measurement) */}
      <div ref={containerRef} style={{ position: 'relative', paddingLeft: '36px', marginTop: '10px' }}>
        
        {/* Hand-Drawn Wobbly Gold Thread SVG Line (Animated Scroll Drawing) */}
        <svg 
          style={{
            position: 'absolute',
            left: '12px',
            top: '8px',
            bottom: '8px',
            width: '16px',
            height: 'calc(100% - 16px)',
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          <path 
            ref={pathRef}
            d="M 6,0 Q 12,80 4,160 Q 0,240 8,320 Q 12,400 4,480 Q 0,560 8,640 Q 12,720 6,800 Q 2,880 8,960 Q 12,1040 6,1120 Q 0,1200 8,1280 Q 12,1360 6,1440 Q 2,1520 8,1600 Q 12,1680 6,1760 Q 0,1840 8,1920"
            fill="none"
            stroke="#C9A24B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - scrollProgress)}
            style={{
              transition: 'stroke-dashoffset 0.12s linear',
              filter: 'drop-shadow(0px 2px 6px rgba(201, 162, 75, 0.45))'
            }}
          />
        </svg>

        {/* Timeline Entries List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filteredDocs.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
              <p style={{ fontSize: '0.95rem' }}>
                Nothing here yet. Upload your first certificate, resume, or project report to start your journey.
              </p>
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const isExpanded = expandedDocId === doc.id;

              return (
                <div key={doc.id} className="animate-fade-in" style={{ position: 'relative' }}>
                  
                  {/* Ink-Dot Marker on Gold Thread */}
                  <div style={{
                    position: 'absolute',
                    left: '-36px',
                    top: '24px',
                    transform: 'translateX(6px)',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '3px solid #C9A24B',
                    boxShadow: '0 0 10px rgba(201, 162, 75, 0.4)',
                    zIndex: 2
                  }} />

                  {/* Warm-White Paper Notebook Card */}
                  <div className="card-notebook" style={{ padding: '22px 24px' }}>
                    
                    {/* Header Row: Category Tag, Year, Organization */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="tag-category">
                          {doc.category}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', fontFamily: 'var(--font-grotesk)' }}>
                          {doc.timeline_year}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.8rem', color: '#64748B', fontFamily: 'var(--font-grotesk)' }}>
                        {doc.issuer_or_organization}
                      </span>
                    </div>

                    {/* Document Title (Serif Display Font) */}
                    <h3 
                      onClick={() => toggleExpand(doc.id)}
                      className="font-serif"
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        cursor: 'pointer',
                        margin: '0 0 6px 0',
                        lineHeight: 1.3
                      }}
                    >
                      {doc.title}
                    </h3>

                    {/* One-Line Summary */}
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#475569',
                      lineHeight: 1.55,
                      margin: '0 0 12px 0',
                      fontFamily: 'var(--font-grotesk)'
                    }}>
                      {doc.summary}
                    </p>

                    {/* Progressive Disclosure Inline Toggle Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingTop: '10px',
                      borderTop: '1px solid #F1F5F9'
                    }}>
                      {/* Expand / Collapse Trigger */}
                      <button
                        onClick={() => toggleExpand(doc.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563EB',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontFamily: 'var(--font-grotesk)'
                        }}
                      >
                        {isExpanded ? 'Less' : 'Details'}
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>

                    {/* Inline Progressive Disclosure Content */}
                    {isExpanded && (
                      <div className="animate-fade-in" style={{
                        marginTop: '14px',
                        paddingTop: '14px',
                        borderTop: '1px dashed #E2E8F0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        
                        {/* Relationship Chips */}
                        {doc.relationships && doc.relationships.length > 0 && (
                          <div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                              AI Knowledge Connections
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                              {doc.relationships.map((rel, rIdx) => (
                                <span key={rIdx} style={{
                                  fontSize: '0.78rem',
                                  color: '#0F172A',
                                  background: 'rgba(201, 162, 75, 0.12)',
                                  border: '1px solid rgba(201, 162, 75, 0.3)',
                                  padding: '4px 10px',
                                  borderRadius: '8px',
                                  fontWeight: 500
                                }}>
                                  → {rel.relation_type}: <strong>{rel.target_description}</strong>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Student Notes */}
                        {doc.notes && (
                          <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #2563EB' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                              Personal Notes
                            </span>
                            <p style={{ fontSize: '0.85rem', color: '#0F172A', margin: '2px 0 0 0' }}>
                              {doc.notes}
                            </p>
                          </div>
                        )}

                        {/* Direct File URL Link */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                            File: {doc.filename}
                          </span>

                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-moss"
                            style={{ padding: '6px 14px', fontSize: '0.8rem', textDecoration: 'none' }}
                          >
                            <span>Open Original File</span>
                            <ExternalLink size={13} />
                          </a>
                        </div>

                      </div>
                    )}

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
