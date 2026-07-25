import React, { useState } from 'react';
import { Filter, ChevronRight, ChevronDown } from 'lucide-react';

export default function CategoryRail({ documents, activeCategory, onSelectCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = ["All", "Projects", "Skills", "Certifications", "Internships", "Achievements", "Academics", "Other"];

  const counts = categories.reduce((acc, cat) => {
    if (cat === "All") acc[cat] = documents.length;
    else acc[cat] = documents.filter(d => d.category === cat).length;
    return acc;
  }, {});

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Collapsed Rail Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '9999px',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
          cursor: 'pointer',
          color: '#334155',
          fontSize: '0.85rem',
          fontWeight: 600,
          transition: 'all 0.15s ease'
        }}
      >
        <Filter size={15} color="#2563EB" />
        <span>Categories ({documents.length} entries)</span>
        {activeCategory !== 'All' && (
          <span style={{ color: '#2563EB', fontWeight: 700, background: 'rgba(37, 99, 235, 0.08)', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.78rem' }}>
            Filtered: {activeCategory}
          </span>
        )}
        {isExpanded ? <ChevronDown size={15} color="#64748B" /> : <ChevronRight size={15} color="#64748B" />}
      </div>

      {/* Expanded Filter Chips */}
      {isExpanded && (
        <div className="animate-fade-in" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '12px',
          padding: '16px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
        }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                style={{
                  background: isActive ? '#2563EB' : '#F8FAFC',
                  color: isActive ? '#FFFFFF' : '#334155',
                  border: isActive ? '1px solid #2563EB' : '1px solid #E2E8F0',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-grotesk)',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 14px rgba(37, 99, 235, 0.25)' : 'none'
                }}
              >
                <span>{cat}</span>
                <span style={{ opacity: isActive ? 0.9 : 0.6, fontSize: '0.74rem' }}>({counts[cat]})</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
