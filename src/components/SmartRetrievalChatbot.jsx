import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, FileText, ExternalLink, Loader2, RefreshCw, MessageSquare, Database } from 'lucide-react';
import { querySmartRetrievalWithGemini } from '../services/geminiService';

export default function SmartRetrievalChatbot({ documents, studentProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello! I am your **Smart Retrieval Bot** assistant powered by **Gemini 2.5 Flash**. Ask me anything about your certificates, internships, projects, or verified skills!`,
      matchingDocs: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || queryInput.trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setQueryInput('');
    setIsLoading(true);

    try {
      // Query Gemini 2.5 RAG Search Engine
      const { answerText, matchingDocs } = await querySmartRetrievalWithGemini(text, documents, studentProfile);
      
      const aiMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: answerText,
        matchingDocs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error querying Gemini RAG:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'ai',
          text: 'Sorry, I encountered an issue retrieving your documents. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "What certifications did I earn in 2024?",
    "Show my PyTorch & Machine Learning projects",
    "Where did I complete my internships?",
    "What is my GPA from Stanford?"
  ];

  return (
    <>
      {/* 1. FLOATING CHATBOT TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '28px',
            zIndex: 1500,
            background: '#0F172A',
            color: '#FFFFFF',
            border: '1px solid #1E293B',
            padding: '12px 22px',
            borderRadius: '9999px',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.25)',
            transition: 'transform 0.2s ease, boxShadow 0.2s ease'
          }}
        >
          <Sparkles size={18} />
          <span>Smart Retrieval Bot</span>
        </button>
      )}

      {/* 2. CHATBOT DRAWER / MODAL WINDOW */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '28px',
            width: '400px',
            maxWidth: 'calc(100vw - 32px)',
            height: '560px',
            maxHeight: 'calc(100vh - 40px)',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            boxShadow: '0 25px 60px rgba(15, 23, 42, 0.2)',
            zIndex: 1600,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            background: '#0F172A',
            color: '#FFFFFF',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <Sparkles size={18} color="#FFFFFF" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                  Smart Retrieval Bot
                </h4>
                <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: 0 }}>
                  Gemini 2.5 RAG Search Engine
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            background: '#FAFAFA'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '88%',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  background: msg.sender === 'user' ? '#0F172A' : '#FFFFFF',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                  border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                  boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(15, 23, 42, 0.16)' : '0 2px 8px rgba(15, 23, 42, 0.04)',
                  fontSize: '0.86rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}

                  {/* Matching Document Quick Action Chips */}
                  {msg.matchingDocs && msg.matchingDocs.length > 0 && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        Source Documents ({msg.matchingDocs.length}):
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {msg.matchingDocs.map((doc) => (
                          <a
                            key={doc.id}
                            href={doc.file_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              textDecoration: 'none',
                              color: '#0F172A',
                              fontSize: '0.78rem',
                              fontWeight: 600
                            }}
                          >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>
                              📄 {doc.title}
                            </span>
                            <ExternalLink size={12} color="#0F172A" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <span style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '4px', padding: '0 4px' }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '10px 14px', borderRadius: '16px', border: '1px solid #E2E8F0', width: 'fit-content' }}>
                <Loader2 size={16} color="#0F172A" style={{ animation: 'spin 1.5s linear infinite' }} />
                <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 500 }}>
                  Gemini 2.5 searching repository context...
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Bar */}
          <div style={{ padding: '8px 12px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', overflowX: 'auto', display: 'flex', gap: '6px' }}>
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  color: '#334155',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{ padding: '12px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your data..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '9999px',
                border: '1px solid #CBD5E1',
                fontSize: '0.86rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!queryInput.trim() || isLoading}
              style={{
                background: queryInput.trim() ? '#0F172A' : '#CBD5E1',
                color: '#FFFFFF',
                border: 'none',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: queryInput.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease'
              }}
            >
              <Send size={16} />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
