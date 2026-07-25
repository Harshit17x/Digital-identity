import React, { useState } from 'react';
import { UploadCloud, Sparkles, Cpu, CheckCircle2, Loader2, FileText, ArrowRight } from 'lucide-react';
import { parseDocumentWithGemini } from '../services/geminiService';

export default function UploadHeroSection({ onDocUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const processUpload = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      // Parse + auto-classify document (normalizeDocumentClassification runs in App.jsx)
      const parsedDoc = await parseDocumentWithGemini(selectedFile);
      setIsProcessing(false);
      onDocUploaded(parsedDoc);
      setSelectedFile(null);
    } catch (err) {
      console.error('Error processing document:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '28px',
      padding: '32px 36px',
      boxShadow: '0 10px 35px rgba(15, 23, 42, 0.05)',
      marginBottom: '32px'
    }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <UploadCloud size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Upload & Ingest Document
              </h2>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#0F172A',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                padding: '2px 10px',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Cpu size={12} /> Gemini 2.5 AI
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#64748B', margin: '2px 0 0 0' }}>
              Drop your certificates, resumes, internship letters, or project reports to automatically index into your digital identity.
            </p>
          </div>
        </div>
      </div>

      {/* Main Drag and Drop File Zone */}
      {isProcessing ? (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          background: '#F8FAFC',
          borderRadius: '20px',
          border: '2px dashed #0F172A'
        }}>
          <Loader2 size={44} color="#0F172A" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 16px auto' }} />
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
            Gemini 2.5 Flash is processing your document...
          </h4>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
            Extracting skills, determining category confidence & mapping growth timeline connections.
          </p>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive ? '2px dashed #0F172A' : '2px dashed #CBD5E1',
            background: dragActive ? 'rgba(15, 23, 42, 0.04)' : '#F8FAFC',
            borderRadius: '20px',
            padding: '36px 24px',
            textAlign: 'center',
            transition: 'all 0.15s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <input
            type="file"
            id="main-page-file-input"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
          />

          <label 
            htmlFor="main-page-file-input"
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)'
            }}>
              <FileText size={26} color="#0F172A" />
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: '4px 0 0 0' }}>
              {selectedFile ? selectedFile.name : "Drag & drop your document here, or click to browse"}
            </h3>

            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
              {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB ready for AI analysis` : "Supports PDF, PNG, JPG, DOCX, and TXT files up to 25MB"}
            </p>
          </label>

          {selectedFile && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                onClick={() => setSelectedFile(null)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>

              <button
                onClick={processUpload}
                style={{
                  background: '#0F172A',
                  color: '#FFFFFF',
                  border: '1px solid #1E293B',
                  padding: '8px 24px',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.16)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Sparkles size={16} />
                <span>Upload & Parse Document</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
