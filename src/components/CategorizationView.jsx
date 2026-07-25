import React, { useState } from 'react';
import { FolderGit2, Tag, Calendar, Award, ExternalLink, Eye, Trash2, CheckCircle2, FileText, Briefcase, GraduationCap, Trophy } from 'lucide-react';

export default function CategorizationView({ items, onSelectFile, onDeleteItem }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');

  const categories = ['All', 'Projects', 'Certifications', 'Internships', 'Achievements', 'Academics', 'Resumes'];

  // Count items per category
  const categoryCounts = categories.reduce((acc, cat) => {
    if (cat === 'All') acc[cat] = items.length;
    else acc[cat] = items.filter(item => item.category === cat).length;
    return acc;
  }, {});

  const filteredItems = items.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = !searchFilter || 
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.skills.some(s => s.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Projects': return <FolderGit2 size={16} color="var(--cat-projects)" />;
      case 'Certifications': return <Award size={16} color="var(--cat-certifications)" />;
      case 'Internships': return <Briefcase size={16} color="var(--cat-internships)" />;
      case 'Achievements': return <Trophy size={16} color="var(--cat-achievements)" />;
      case 'Academics': return <GraduationCap size={16} color="var(--cat-academics)" />;
      default: return <FileText size={16} color="var(--accent-primary)" />;
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
      
      {/* Category Stats Top Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px'
      }}>
        {categories.filter(c => c !== 'All').map(cat => (
          <div 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="glass-panel"
            style={{
              padding: '16px',
              cursor: 'pointer',
              borderColor: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--border-glass)',
              background: selectedCategory === cat ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              {getCategoryIcon(cat)}
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{categoryCounts[cat]}</span>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{cat}</span>
          </div>
        ))}
      </div>

      {/* Filter Toolbar & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-glass)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {cat} ({categoryCounts[cat]})
            </button>
          ))}
        </div>

        {/* Local Filter Search Input */}
        <input
          type="text"
          placeholder="Filter by title, skill, or keyword..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          style={{
            padding: '8px 14px',
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid var(--border-glass-bright)',
            borderRadius: 'var(--radius-md)',
            color: '#fff',
            fontSize: '0.85rem',
            width: '240px',
            outline: 'none'
          }}
        />
      </div>

      {/* Item Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '18px'
      }}>
        {filteredItems.map(item => (
          <div 
            key={item.id}
            className="glass-panel animate-fade-in"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              position: 'relative'
            }}
          >
            <div>
              {/* Card Top Row: Category & Confidence */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className={getBadgeClass(item.category)}>
                  {getCategoryIcon(item.category)}
                  {item.category}
                </span>
                
                <span style={{
                  fontSize: '0.72rem',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle2 size={12} /> {(item.confidenceScore * 100).toFixed(0)}% Confidence
                </span>
              </div>

              {/* Title & Organization */}
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px', lineHeight: 1.3 }}>{item.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                {item.issuer} • <Calendar size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {item.year}
              </p>

              {/* AI Executive Summary */}
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '14px' }}>
                {item.summary}
              </p>


            </div>

            {/* Bottom Actions Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-glass)'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Format: <strong style={{ color: '#fff' }}>{item.fileType || 'PDF'}</strong>
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onSelectFile(item)}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  <Eye size={14} /> View Original Document
                </button>

                {onDeleteItem && (
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                    title="Delete item"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
