import React, { useState } from 'react';
import { UploadCloud, X, FileText, CheckCircle2, Loader2, Sparkles, Cpu } from 'lucide-react';
import { parseDocumentWithGemini } from '../services/geminiService';

export default function UploadModal({ isOpen, onClose, onDocUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const startUpload = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      // Parse + auto-classify (normalizeDocumentClassification runs in App.jsx)
      const parsedDoc = await parseDocumentWithGemini(selectedFile);
      setIsProcessing(false);
      onDocUploaded(parsedDoc);
      onClose();
      setSelectedFile(null);
    } catch (err) {
      console.error('Error during document parsing:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '28px',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'rgba(37, 99, 235, 0.08)',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}>
              <Cpu size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A', letterSpacing: '-0.02em' }}>
                Gemini 2.5 Multi-Modal Ingestion
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                Upload certificates, resumes, or project reports
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{
              background: '#F1F5F9',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              color: '#64748B',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {isProcessing ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Loader2 size={40} color="#2563EB" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '16px', margin: '0 auto 16px auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
              Gemini 2.5 Flash is analyzing your document...
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              Extracting verified skills, evaluating category confidence & mapping growth timeline relationships.
            </p>
          </div>
        ) : (
          <>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              style={{
                border: '2px dashed #CBD5E1',
                borderRadius: '20px',
                padding: '36px 20px',
                textAlign: 'center',
                background: '#F8FAFC',
                cursor: 'pointer',
                marginBottom: '24px',
                transition: 'all 0.15s ease'
              }}
            >
              <input
                type="file"
                id="modal-file-input"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
              />
              <label htmlFor="modal-file-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <UploadCloud size={44} color="#2563EB" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                  {selectedFile ? selectedFile.name : "Drop file here or click to browse"}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "PDF, PNG, DOCX up to 25MB"}
                </p>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  padding: '10px 20px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>

              <button
                onClick={startUpload}
                disabled={!selectedFile}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: selectedFile ? 'pointer' : 'not-allowed',
                  opacity: selectedFile ? 1 : 0.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: selectedFile ? '0 4px 14px rgba(37, 99, 235, 0.28)' : 'none'
                }}
              >
                <Sparkles size={16} />
                <span>Parse with Gemini 2.5</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
