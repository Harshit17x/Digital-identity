import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import TimelineHero from './components/TimelineHero';
import Sidepanel from './components/Sidepanel';
import UploadHeroSection from './components/UploadHeroSection';
import CommandPalette from './components/CommandPalette';
import UploadModal from './components/UploadModal';
import KnowledgeGraphModal from './components/KnowledgeGraphModal';
import SmartRetrievalChatbot from './components/SmartRetrievalChatbot';
import RelationshipGraph from './components/RelationshipGraph';
import { ArrowRight, Network } from 'lucide-react';

import { STUDENT_PROFILE, INITIAL_DOCUMENTS } from './data/mockProfile';
import { fetchDocumentsFromSupabase, insertDocumentToSupabase } from './services/supabaseClient';
import { normalizeDocumentClassification } from './services/aiEngine';

export default function App() {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS.map(normalizeDocumentClassification));
  const [studentProfile] = useState(STUDENT_PROFILE);
  const [activeCategory, setActiveCategory] = useState('All');

  // Page Routing State ('landing' | 'upload' | 'timeline')
  const [activePage, setActivePage] = useState('upload');

  // Slider Control States
  const [yearFilter, setYearFilter] = useState('All');
  const [minConfidence, setMinConfidence] = useState(80);

  // Modal Visibility States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);

  // Selected document from search
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Load documents from Supabase PostgreSQL if configured
  useEffect(() => {
    async function loadSupabaseDocs() {
      const dbDocs = await fetchDocumentsFromSupabase();
      if (dbDocs && dbDocs.length > 0) {
        setDocuments(dbDocs.map(normalizeDocumentClassification));
      }
    }
    loadSupabaseDocs();
  }, []);

  // Global Cmd+K Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDocUploaded = async (rawDoc) => {
    const newDoc = normalizeDocumentClassification(rawDoc);
    setDocuments((prev) => [newDoc, ...prev]);
    // Persist to Supabase if credentials present
    await insertDocumentToSupabase(newDoc);
  };

  const handleSelectDocFromSearch = (doc) => {
    setSelectedDoc(doc);
  };

  // Filter documents dynamically using category + year slider + confidence slider
  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    const matchesYear = yearFilter === 'All' || doc.timeline_year.toString() === yearFilter;
    const matchesConfidence = (doc.confidence * 100) >= minConfidence;
    return matchesCategory && matchesYear && matchesConfidence;
  });

  // If on Landing Page, render standalone LandingPage presentation
  if (activePage === 'landing') {
    return (
      <div className="app-viewport">
        <LandingPage
          studentProfile={studentProfile}
          documents={documents}
          onEnterDashboard={() => setActivePage('upload')}
        />
      </div>
    );
  }

  // Otherwise, render main Application layout with Header Bar
  return (
    <div className="app-viewport">
      
      {/* Navigation Header Bar */}
      <Header
        studentProfile={studentProfile}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        activePage={activePage}
        onNavigate={setActivePage}
      />

      {/* PAGE 1: UPLOAD HUB PAGE */}
      {activePage === 'upload' && (
        <div style={{ width: '100%' }} className="animate-fade-in">
          
          {/* Primary Upload Hero Section */}
          <UploadHeroSection onDocUploaded={handleDocUploaded} />

          {/* Quick Summary & Growth Timeline Access Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '28px',
            padding: '32px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <div>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#0F172A',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                padding: '3px 10px',
                borderRadius: '9999px',
                display: 'inline-block',
                marginBottom: '8px'
              }}>
                JOURNEY STATS ({documents.length} ENTRIES INDEXED)
              </span>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                Your growth timeline is ready to explore
              </h3>

              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, maxWidth: '520px', lineHeight: 1.5 }}>
                {studentProfile.aiHeroSummary} View your interconnected achievements, certifications, and skills in the dedicated Timeline Page.
              </p>
            </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setActivePage('relationship')}
                  style={{
                    background: '#F1F5F9',
                    color: '#0F172A',
                    border: '1px solid #CBD5E1',
                    padding: '12px 20px',
                    borderRadius: '9999px',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Network size={16} />
                  <span>Relationship Engine</span>
                </button>

                <button
                  onClick={() => setActivePage('timeline')}
                  style={{
                    background: '#0F172A',
                    color: '#FFFFFF',
                    border: '1px solid #1E293B',
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.16)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>View Timeline Page</span>
                  <ArrowRight size={16} />
                </button>
              </div>
          </div>

        </div>
      )}

      {/* PAGE 2: DEDICATED GROWTH TIMELINE PAGE */}
      {activePage === 'timeline' && (
        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start', width: '100%' }} className="animate-fade-in">
          
          {/* Refined Sidepanel with Slider Controls */}
          <Sidepanel
            documents={documents}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            yearFilter={yearFilter}
            onYearFilterChange={setYearFilter}
            minConfidence={minConfidence}
            onConfidenceChange={setMinConfidence}
          />

          {/* Timeline Spine Canvas */}
          <main style={{ flex: 1, minWidth: 0, width: '100%' }}>
            <TimelineHero
              documents={filteredDocs}
              studentProfile={studentProfile}
              activeCategory={activeCategory}
              onOpenGraphModal={() => setIsGraphModalOpen(true)}
              onSelectDoc={setSelectedDoc}
            />
          </main>

        </div>
      )}

      {/* PAGE 3: DEDICATED RELATIONSHIP ENGINE GRAPH PAGE */}
      {activePage === 'relationship' && (
        <div style={{ width: '100%' }} className="animate-fade-in">
          <RelationshipGraph 
            items={documents} 
            onSelectFile={(doc) => setSelectedDoc(doc)} 
          />
        </div>
      )}

      {/* Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        documents={documents}
        onSelectDoc={handleSelectDocFromSearch}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocUploaded={handleDocUploaded}
      />

      <KnowledgeGraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
        documents={documents}
      />

      {/* Module 5: Smart Retrieval RAG Chatbot */}
      <SmartRetrievalChatbot
        documents={documents}
        studentProfile={studentProfile}
      />

    </div>
  );
}
