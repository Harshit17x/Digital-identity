import React, { useState } from 'react';
import { 
  Sliders, Calendar, ShieldCheck, FolderGit2, Award, Briefcase, 
  Trophy, GraduationCap, FileText, Tag, ChevronLeft, ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  { name: "All", icon: Sliders },
  { name: "Projects", icon: FolderGit2 },
  { name: "Skills", icon: Tag },
  { name: "Certifications", icon: Award },
  { name: "Internships", icon: Briefcase },
  { name: "Achievements", icon: Trophy },
  { name: "Academics", icon: GraduationCap },
  { name: "Other", icon: FileText }
];

export default function Sidepanel({ 
  documents, 
  activeCategory, 
  onSelectCategory,
  yearFilter,
  onYearFilterChange,
  minConfidence,
  onConfidenceChange
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const counts = CATEGORIES.reduce((acc, cat) => {
    if (cat.name === "All") acc[cat.name] = documents.length;
    else acc[cat.name] = documents.filter(d => d.category === cat.name).length;
    return acc;
  }, {});

  if (isCollapsed) {
    return (
      <aside style={{
        width: '60px',
        flexShrink: 0,
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '24px',
        padding: '16px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
        height: 'fit-content',
        transition: 'all 0.2s ease'
      }}>
        <button 
          onClick={() => setIsCollapsed(false)}
          style={{ background: '#F1F5F9', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: '#0F172A' }}
          title="Expand Filter Sidepanel"
        >
          <ChevronRight size={18} />
        </button>

        <div style={{ width: '100%', height: '1px', background: '#E2E8F0' }} />

        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: isActive ? '#2563EB' : 'transparent',
                color: isActive ? '#FFFFFF' : '#64748B',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title={`${cat.name} (${counts[cat.name]})`}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </aside>
    );
  }

  return (
    <aside style={{
      width: '280px',
      flexShrink: 0,
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '24px',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
      height: 'fit-content',
      position: 'sticky',
      top: '24px'
    }} className="animate-fade-in">
      
      {/* Sidepanel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} color="#2563EB" />
          <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            Sidepanel Controls
          </span>
        </div>
        <button 
          onClick={() => setIsCollapsed(true)}
          style={{ background: '#F1F5F9', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: '#64748B' }}
          title="Collapse Sidepanel"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* 1. SLIDER OPTION 1: Year Filter Slider */}
      <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="#2563EB" /> Timeline Year
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563EB', background: 'rgba(37, 99, 235, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
            {yearFilter === 'All' ? '2023 - 2026' : `Year ${yearFilter}`}
          </span>
        </div>

        <input 
          type="range" 
          min="2022" 
          max="2026" 
          step="1"
          value={yearFilter === 'All' ? 2022 : parseInt(yearFilter)} 
          onChange={(e) => {
            const val = parseInt(e.target.value);
            onYearFilterChange(val === 2022 ? 'All' : val.toString());
          }}
          style={{
            width: '100%',
            accentColor: '#2563EB',
            cursor: 'pointer'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94A3B8', marginTop: '6px', fontWeight: 600 }}>
          <span>All</span>
          <span>2023</span>
          <span>2024</span>
          <span>2025</span>
          <span>2026</span>
        </div>
      </div>

      {/* 2. SLIDER OPTION 2: AI Parsing Confidence Slider */}
      <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#16A34A" /> AI Confidence
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: '6px' }}>
            ≥ {minConfidence}%
          </span>
        </div>

        <input 
          type="range" 
          min="80" 
          max="99" 
          step="1"
          value={minConfidence} 
          onChange={(e) => onConfidenceChange(parseInt(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#16A34A',
            cursor: 'pointer'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94A3B8', marginTop: '6px', fontWeight: 600 }}>
          <span>80% (Broad)</span>
          <span>90% (High)</span>
          <span>99% (Strict)</span>
        </div>
      </div>

      {/* 3. REFINED VERTICAL SEGMENTS RAIL */}
      <div>
        <span style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.06em', color: '#64748B', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>
          Refined Category Segments
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  background: isActive ? '#2563EB' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#334155',
                  border: isActive ? 'none' : '1px solid transparent',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 14px rgba(37, 99, 235, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} color={isActive ? '#FFFFFF' : '#64748B'} />
                  <span>{cat.name}</span>
                </div>
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : '#64748B'
                }}>
                  {counts[cat.name]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
