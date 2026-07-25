import React, { useState, useEffect } from 'react';
import { Search, Sparkles, FileText, ArrowRight, CheckCircle2, Zap, Tag, Eye } from 'lucide-react';
import { semanticRAGSearch } from '../services/aiEngine';

export default function SmartRetrievalView({ items, initialQuery = '', onSelectFile }) {
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [aiSummaryAnswer, setAiSummaryAnswer] = useState('');

  const PRESET_QUERIES = [
    "Show all my certificates",
    "Show my AI projects",
    "Show internship documents",
    "Show my latest resume",
    "Show PyTorch achievements"
  ];

  useEffect(() => {
    executeSearch(query);
  }, [query, items]);

  const executeSearch = (searchQuery) => {
    const results = semanticRAGSearch(searchQuery, items);
    setSearchResults(results);

    // Generate AI RAG synthesized answer
    if (!searchQuery || searchQuery.trim() === '') {
      setAiSummaryAnswer("Showing all indexed documents in your Digital Identity repository. Enter a query or select a quick shortcut above for instant natural language RAG retrieval.");
    } else {
      const count = results.length;
      const topCategories = Array.from(new Set(results.slice(0, 3).map(r => r.item.category))).join(', ');
      setAiSummaryAnswer(`Found ${count} matching document${count === 1 ? '' : 's'} across ${topCategories || 'your repository'} with High RAG Confidence score. Original formats are ready for direct preview.`);
    }
  };

  const handlePresetClick = (preset) => {
    setQuery(preset);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Search Header Banner */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: 'var(--radius-md)' }}>
            <Search size={24} color="var(--accent-primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Smart Retrieval Bot</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              "I never have to search through folders again." Natural language vector search across all your original documents.
            </p>
          </div>
        </div>

        {/* Large Natural Language Search Bar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything (e.g. 'Show all my certificates', 'Show my AI projects', 'Internship documents')..."
            style={{
              width: '100%',
              padding: '16px 20px 16px 52px',
              fontSize: '1.05rem',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1.5px solid var(--border-glass-bright)',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff',
              outline: 'none',
              boxShadow: 'var(--shadow-card)'
            }}
          />
          <Search size={22} color="var(--accent-primary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              Clear ✕
            </button>
          )}
        </div>

        {/* Quick Shortcut Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={14} color="#f59e0b" /> Quick RAG Shortcuts:
          </span>
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(preset)}
              style={{
                background: query === preset ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                color: query === preset ? '#ffffff' : 'var(--text-secondary)',
                border: query === preset ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>

      {/* AI RAG Synthesized Response Banner */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        background: 'rgba(99, 102, 241, 0.08)',
        borderColor: 'rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <Sparkles size={20} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 700, margin: '0 0 2px 0' }}>AI RAG Synthesis</h4>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', margin: 0 }}>{aiSummaryAnswer}</p>
        </div>
      </div>

      {/* Search Results Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '18px'
      }}>
        {searchResults.map(({ item, score, matchReason }) => (
          <div
            key={item.id}
            className="glass-panel animate-fade-in"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              borderLeft: '4px solid var(--accent-primary)'
            }}
          >
            <div>
              {/* Header Match Meta */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="badge-category badge-academics" style={{ fontSize: '0.72rem' }}>
                  {item.category}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.12)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600
                }}>
                  RAG Match: {(score * 100).toFixed(0)}%
                </span>
              </div>

              {/* Title & Match Rationale */}
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', marginBottom: '10px', fontStyle: 'italic' }}>
                🔍 {matchReason}
              </p>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '12px' }}>
                {item.summary}
              </p>


            </div>

            {/* Direct Original Document Action */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-glass)'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                File: {item.fileName}
              </span>
              <button
                onClick={() => onSelectFile(item)}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              >
                <Eye size={14} /> Open Document
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
