import React, { useState } from 'react';
import { Clock, Calendar, Tag, ArrowRight, Award, Briefcase, FolderGit2, GraduationCap, Trophy, Sparkles } from 'lucide-react';

export default function TimelineView({ items, onSelectFile }) {
  const [selectedYear, setSelectedYear] = useState('All');

  // Extract unique years sorted descending
  const years = ['All', ...Array.from(new Set(items.map(i => i.year))).sort((a, b) => b - a)];

  // Group items by year
  const sortedItems = [...items].sort((a, b) => new Date(b.date || b.year) - new Date(a.date || a.year));

  const filteredItems = sortedItems.filter(item => {
    return selectedYear === 'All' || item.year === parseInt(selectedYear);
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Projects': return <FolderGit2 size={16} color="var(--cat-projects)" />;
      case 'Certifications': return <Award size={16} color="var(--cat-certifications)" />;
      case 'Internships': return <Briefcase size={16} color="var(--cat-internships)" />;
      case 'Achievements': return <Trophy size={16} color="var(--cat-achievements)" />;
      case 'Academics': return <GraduationCap size={16} color="var(--cat-academics)" />;
      default: return <Sparkles size={16} color="var(--accent-primary)" />;
    }
  };

  const getBadgeClass = (category) => {
    switch (category) {
      case 'Projects': return 'badge-category badge-projects';
      case 'Certifications': return 'badge-category badge-certifications';
      case 'Internships': return 'badge-category badge-internships';
      case 'Achievements': return 'badge-category badge-achievements';
      case 'Academics': return 'badge-category badge-academics';
      default: return 'badge-category badge-academics';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Module Title Header & Year Filter */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: 'rgba(236, 72, 153, 0.15)', borderRadius: 'var(--radius-md)' }}>
            <Clock size={24} color="var(--cat-achievements)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Digital Journey Timeline</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>Visual representation of academic & professional growth over time</p>
          </div>
        </div>

        {/* Year Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Filter Year:</span>
          {years.map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              style={{
                background: selectedYear === yr ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                color: selectedYear === yr ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-glass)',
                padding: '5px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Timeline Container */}
      <div style={{ position: 'relative', paddingLeft: '32px', margin: '10px 0' }}>
        
        {/* Center Vertical Timeline Line */}
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '0',
          bottom: '0',
          width: '3px',
          background: 'linear-gradient(to bottom, var(--accent-primary), var(--cat-certifications), var(--cat-internships), var(--cat-skills))',
          borderRadius: '2px',
          opacity: 0.6
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filteredItems.map((item, idx) => (
            <div key={item.id} className="animate-fade-in" style={{ position: 'relative' }}>
              
              {/* Timeline Connector Node Circle */}
              <div style={{
                position: 'absolute',
                left: '-32px',
                top: '20px',
                transform: 'translateX(-50%)',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'var(--bg-dark)',
                border: '3px solid var(--accent-primary)',
                boxShadow: '0 0 10px var(--accent-primary)',
                zIndex: 2
              }} />

              {/* Milestone Card */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={getBadgeClass(item.category)}>
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                      <Calendar size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {item.year}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Issued by: <strong style={{ color: '#fff' }}>{item.issuer}</strong>
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {item.summary}
                </p>

                {/* Action Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
                  <button
                    onClick={() => onSelectFile(item)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  >
                    View Original File <ArrowRight size={14} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
