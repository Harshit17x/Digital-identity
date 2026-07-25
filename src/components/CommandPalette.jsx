import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, CornerDownLeft, Sparkles, X, FileText, Tag, Calendar, ExternalLink } from 'lucide-react';

/**
 * PRODUCTION NOTE FOR REAL VECTOR EMBEDDINGS (SUPABASE PGVECTOR):
 * 
 * In a live production environment with Supabase pgvector, client-side text filtering
 * below is replaced with an RPC call to pgvector similarity match:
 * 
 * async function searchVectorJourney(userQuery) {
 *   const { data, error } = await supabase.rpc('match_journey_documents', {
 *     query_embedding: await generateEmbedding(userQuery),
 *     match_threshold: 0.72,
 *     match_count: 10
 *   });
 *   return data;
 * }
 */

export default function CommandPalette({ isOpen, onClose, documents, onSelectDoc }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K & Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open trigger handled at App level
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter & Group Documents by Category with Match Explanations
  const filteredResults = filterAndGroupDocuments(documents, query);
  const flatResults = filteredResults.flatMap(group => group.items);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatResults.length) % Math.max(1, flatResults.length));
    } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
      e.preventDefault();
      onSelectDoc(flatResults[selectedIndex].doc);
      onClose();
    }
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(14, 17, 22, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        paddingLeft: '16px',
        paddingRight: '16px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '640px',
          background: '#0F172A',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <Search size={20} color="#3B82F6" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-palette-input"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search your journey — certificates, projects, skills..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#F8FAFC',
              fontSize: '1rem',
              fontFamily: 'var(--font-grotesk)'
            }}
          />
          <span className="kbd-badge-dark">ESC</span>
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '12px 16px' }}>
          {filteredResults.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: '#94A3B8' }}>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                {query ? 'No matching documents or skills found.' : 'Type to search your entire journey — certificates, projects, skills, all of it.'}
              </p>
            </div>
          ) : (
            filteredResults.map((group) => (
              <div key={group.category} style={{ marginBottom: '16px' }}>
                {/* Category Header */}
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#60A5FA',
                  marginBottom: '8px',
                  paddingLeft: '8px'
                }}>
                  {group.category} ({group.items.length})
                </div>

                {/* Category Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {group.items.map((item) => {
                    const globalIdx = flatResults.findIndex(r => r.doc.id === item.doc.id);
                    const isSelected = globalIdx === selectedIndex;

                    return (
                      <div
                        key={item.doc.id}
                        onClick={() => { onSelectDoc(item.doc); onClose(); }}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: isSelected ? 'rgba(37, 99, 235, 0.22)' : 'rgba(255, 255, 255, 0.02)',
                          border: isSelected ? '1px solid rgba(59, 130, 246, 0.45)' : '1px solid transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.12s ease'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                          <div style={{
                            fontSize: '0.92rem',
                            fontWeight: 600,
                            color: isSelected ? '#FFFFFF' : '#F1F5F9',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginBottom: '3px'
                          }}>
                            {item.doc.title}
                          </div>
                          
                          {/* Matched Rationale Line */}
                          <div style={{
                            fontSize: '0.76rem',
                            color: isSelected ? '#93C5FD' : '#94A3B8',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                            <span style={{ color: isSelected ? '#93C5FD' : '#64748B' }}>matched because:</span>
                            <span style={{ fontWeight: 500, color: isSelected ? '#FFFFFF' : '#CBD5E1' }}>
                              {item.reason}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 500, color: isSelected ? '#93C5FD' : '#64748B' }}>
                            {item.doc.timeline_year}
                          </span>
                          {isSelected && <CornerDownLeft size={15} color="#60A5FA" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Navigation Tip */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#090D16',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#94A3B8'
        }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span><kbd className="kbd-badge-dark">↑</kbd> <kbd className="kbd-badge-dark">↓</kbd> navigate</span>
            <span><kbd className="kbd-badge-dark">↵</kbd> open document</span>
          </div>
          <span style={{ color: '#64748B', fontWeight: 500 }}>Instant RAG Query</span>
        </div>
      </div>
    </div>
  );
}

// Client-side fuzzy filter matching title, summary, skills, organization, or category
function filterAndGroupDocuments(documents, query) {
  if (!query || query.trim() === '') {
    // Return all grouped
    const categories = Array.from(new Set(documents.map(d => d.category)));
    return categories.map(cat => ({
      category: cat,
      items: documents.filter(d => d.category === cat).map(d => ({
        doc: d,
        reason: `${d.category} entry from ${d.timeline_year}`
      }))
    }));
  }

  const q = query.toLowerCase().trim();
  const matchedDocs = [];

  documents.forEach(doc => {
    let reason = null;

    if (doc.category.toLowerCase().includes(q)) {
      reason = `Category match (${doc.category})`;
    } else if (doc.title.toLowerCase().includes(q)) {
      reason = `Title keyword match ("${doc.title.slice(0, 24)}...")`;
    } else if (doc.skills_mentioned.some(s => s.toLowerCase().includes(q))) {
      const matchedSkill = doc.skills_mentioned.find(s => s.toLowerCase().includes(q));
      reason = `Extracted skill (${matchedSkill})`;
    } else if (doc.issuer_or_organization.toLowerCase().includes(q)) {
      reason = `Issuer match (${doc.issuer_or_organization})`;
    } else if (doc.summary.toLowerCase().includes(q)) {
      reason = `Summary context match`;
    }

    if (reason) {
      matchedDocs.push({ doc, reason });
    }
  });

  // Group matched docs by category
  const groupMap = new Map();
  matchedDocs.forEach(item => {
    const cat = item.doc.category;
    if (!groupMap.has(cat)) groupMap.set(cat, []);
    groupMap.get(cat).push(item);
  });

  return Array.from(groupMap.entries()).map(([category, items]) => ({
    category,
    items
  }));
}
