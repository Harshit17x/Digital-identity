import React from 'react';
import { Search, Plus, UploadCloud, Clock, Network } from 'lucide-react';

export default function Header({ 
  studentProfile, 
  onOpenSearch, 
  onOpenUpload,
  activePage,
  onNavigate
}) {
  return (
    <header style={{
      width: '100%',
      margin: '0 0 24px 0',
      padding: '10px 28px',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid #E2E8F0',
      borderRadius: '9999px',
      boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
      position: 'relative'
    }}>
      
      {/* 1. LEFT: Brand Logo (Click to Return to Landing Page) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <div 
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          title="Return to Landing Page"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', width: '22px', height: '22px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0F172A' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38BDF8' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0F172A' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0F172A' }} />
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
            Digital Identity
          </span>
        </div>
      </div>

      {/* 2. CENTER: Main Page Switcher Navigation Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#F1F5F9', 
          padding: '4px', 
          borderRadius: '9999px', 
          border: '1px solid #CBD5E1' 
        }}>
          {/* Upload Hub Tab */}
          <button
            onClick={() => onNavigate('upload')}
            style={{
              background: activePage === 'upload' ? '#FFFFFF' : 'transparent',
              color: activePage === 'upload' ? '#0F172A' : '#64748B',
              border: 'none',
              padding: '7px 18px',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: activePage === 'upload' ? 800 : 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activePage === 'upload' ? '0 2px 10px rgba(15, 23, 42, 0.08)' : 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <UploadCloud size={15} color={activePage === 'upload' ? '#0F172A' : '#64748B'} />
            <span>Upload Hub</span>
          </button>

          {/* Timeline Page Tab */}
          <button
            onClick={() => onNavigate('timeline')}
            style={{
              background: activePage === 'timeline' ? '#FFFFFF' : 'transparent',
              color: activePage === 'timeline' ? '#0F172A' : '#64748B',
              border: 'none',
              padding: '7px 18px',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: activePage === 'timeline' ? 800 : 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activePage === 'timeline' ? '0 2px 10px rgba(15, 23, 42, 0.08)' : 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <Clock size={15} color={activePage === 'timeline' ? '#0F172A' : '#64748B'} />
            <span>Timeline Page</span>
          </button>

          {/* Relationship Engine Tab */}
          <button
            onClick={() => onNavigate('relationship')}
            style={{
              background: activePage === 'relationship' ? '#FFFFFF' : 'transparent',
              color: activePage === 'relationship' ? '#0F172A' : '#64748B',
              border: 'none',
              padding: '7px 18px',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: activePage === 'relationship' ? 800 : 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activePage === 'relationship' ? '0 2px 10px rgba(15, 23, 42, 0.08)' : 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <Network size={15} color={activePage === 'relationship' ? '#0F172A' : '#64748B'} />
            <span>Relationship Engine</span>
          </button>
        </div>
      </div>

      {/* 3. RIGHT: Search & Action Buttons */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
        <button
          onClick={onOpenSearch}
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '9999px',
            padding: '7px 16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748B',
            cursor: 'pointer',
            fontSize: '0.84rem',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap'
          }}
        >
          <Search size={14} color="#0F172A" />
          <span>Search</span>
          <kbd style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '4px',
            padding: '1px 5px',
            fontSize: '0.72rem',
            color: '#475569',
            fontWeight: 600
          }}>⌘K</kbd>
        </button>

        <button
          onClick={onOpenUpload}
          style={{
            background: '#0F172A',
            color: '#FFFFFF',
            border: '1px solid #1E293B',
            padding: '8px 20px',
            borderRadius: '9999px',
            fontSize: '0.86rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.16)',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap'
          }}
        >
          <Plus size={16} />
          <span>Upload File</span>
        </button>
      </div>

    </header>
  );
}
