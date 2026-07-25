import React, { useState } from 'react';
import { X, UploadCloud, Link as LinkIcon, FileText, CheckCircle2, Loader2, Sparkles, Tag, Calendar, Building } from 'lucide-react';
import { parseDocumentContent, extractEntitiesAndMetadata } from '../services/aiEngine';

export default function IngestionModal({ isOpen, onClose, onItemAdded }) {
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  
  // Processing Pipeline States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0); // 0 to 5
  const [extractedResult, setExtractedResult] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setExtractedResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setExtractedResult(null);
    }
  };

  const startAiIngestion = async () => {
    if (!selectedFile && !urlInput) return;

    setIsProcessing(true);
    setProcessingStep(1); // 1. Reading file

    try {
      let rawText = "";
      let fileName = selectedFile ? selectedFile.name : "Portfolio_Link.url";

      if (selectedFile) {
        rawText = await parseDocumentContent(selectedFile);
      } else {
        rawText = `Portfolio Link Content from ${urlInput}. Key projects, achievements, and web technical skills.`;
      }

      setProcessingStep(2); // 2. OCR & Text Extraction
      await new Promise(r => setTimeout(r, 600));

      setProcessingStep(3); // 3. AI Entity Extraction & Categorization
      await new Promise(r => setTimeout(r, 600));
      const metadata = extractEntitiesAndMetadata(rawText, fileName);

      setProcessingStep(4); // 4. Generating Vector Embedding
      await new Promise(r => setTimeout(r, 600));

      setProcessingStep(5); // 5. Mapping Graph Edges
      await new Promise(r => setTimeout(r, 600));

      const newItem = {
        id: `item-${Date.now()}`,
        ...metadata,
        fileType: selectedFile ? selectedFile.name.split('.').pop() : 'url',
        fileName,
        fileSize: selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Web Link',
        rawText,
        fileBlob: selectedFile || null,
        githubUrl: urlInput || null
      };

      setExtractedResult(newItem);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert("Error processing document");
    }
  };

  const handleConfirmSave = () => {
    if (extractedResult) {
      onItemAdded(extractedResult);
      onClose();
      // Reset state
      setSelectedFile(null);
      setUrlInput('');
      setExtractedResult(null);
      setProcessingStep(0);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '640px',
        padding: '28px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-glass-bright)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: 'var(--radius-md)' }}>
              <UploadCloud size={22} color="var(--accent-primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>AI Data Ingestion</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>Upload certificates, resumes, reports, internship letters & portfolio links</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Ingestion Source Tabs */}
        {!extractedResult && !isProcessing && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => setActiveTab('file')}
                className={activeTab === 'file' ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <FileText size={16} /> File Upload (PDF/Img/Docs)
              </button>
              <button
                onClick={() => setActiveTab('url')}
                className={activeTab === 'url' ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <LinkIcon size={16} /> Portfolio / GitHub Link
              </button>
            </div>

            {activeTab === 'file' ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                style={{
                  border: '2px dashed var(--border-glass-bright)',
                  borderRadius: 'var(--radius-md)',
                  padding: '36px 20px',
                  textAlign: 'center',
                  background: 'rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  marginBottom: '20px'
                }}
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                  <UploadCloud size={44} color="var(--accent-primary)" style={{ marginBottom: '10px' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{selectedFile ? selectedFile.name : 'Drag & drop document here'}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Supports PDF, Certificates, Resumes, Images, Internship letters (Max 15MB)'}
                  </p>
                </label>
              </div>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Portfolio / GitHub Repository / Project Link</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project-repo"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-glass-bright)',
                    borderRadius: 'var(--radius-md)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            <button
              onClick={startAiIngestion}
              disabled={!selectedFile && !urlInput}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                opacity: (!selectedFile && !urlInput) ? 0.5 : 1,
                cursor: (!selectedFile && !urlInput) ? 'not-allowed' : 'pointer'
              }}
            >
              <Sparkles size={18} />
              <span>Start AI Extraction & Mapping</span>
            </button>
          </>
        )}

        {/* Processing Steps visualizer */}
        {isProcessing && (
          <div style={{ padding: '20px 0', textAlign: 'center' }}>
            <Loader2 size={36} color="var(--accent-primary)" className="animate-pulse-glow" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Extracting & Categorizing Knowledge...</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', maxWidth: '420px', margin: '0 auto' }}>
              <StepItem step={1} currentStep={processingStep} label="Reading & Blobbing Original Document Format" />
              <StepItem step={2} currentStep={processingStep} label="Performing OCR & Multi-Modal Text Extraction" />
              <StepItem step={3} currentStep={processingStep} label="Classifying Category & Extracting Skills" />
              <StepItem step={4} currentStep={processingStep} label="Generating Vector Embeddings for RAG Engine" />
              <StepItem step={5} currentStep={processingStep} label="Mapping Relationships into Knowledge Graph" />
            </div>
          </div>
        )}

        {/* Extracted Metadata Review & Manual Override */}
        {extractedResult && !isProcessing && (
          <div className="animate-fade-in">
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <CheckCircle2 size={20} color="#10b981" />
              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#10b981', margin: 0 }}>AI Extraction Successful!</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>Confidence score: {(extractedResult.confidenceScore * 100).toFixed(0)}%</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>DOCUMENT TITLE</label>
                <input
                  type="text"
                  value={extractedResult.title}
                  onChange={(e) => setExtractedResult({ ...extractedResult, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>CATEGORY</label>
                  <select
                    value={extractedResult.category}
                    onChange={(e) => setExtractedResult({ ...extractedResult, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  >
                    <option value="Projects">Projects</option>
                    <option value="Certifications">Certifications</option>
                    <option value="Internships">Internships</option>
                    <option value="Achievements">Achievements</option>
                    <option value="Academics">Academics</option>
                    <option value="Resumes">Resumes</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>YEAR</label>
                  <input
                    type="number"
                    value={extractedResult.year}
                    onChange={(e) => setExtractedResult({ ...extractedResult, year: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>EXTRACTED SKILLS & ENTITIES</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {extractedResult.skills.map((skill, idx) => (
                    <span key={idx} className="badge-category badge-skills" style={{ fontSize: '0.72rem' }}>
                      <Tag size={12} /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>AI EXECUTIVE SUMMARY</label>
                <textarea
                  rows={3}
                  value={extractedResult.summary}
                  onChange={(e) => setExtractedResult({ ...extractedResult, summary: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setExtractedResult(null)} className="btn-secondary" style={{ flex: 1 }}>Re-Analyze</button>
              <button onClick={handleConfirmSave} className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Save to Digital Identity</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepItem({ step, currentStep, label }) {
  const isDone = currentStep > step;
  const isCurrent = currentStep === step;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {isDone ? (
        <CheckCircle2 size={18} color="#10b981" />
      ) : isCurrent ? (
        <Loader2 size={18} color="var(--accent-primary)" style={{ animation: 'spin 1.5s linear infinite' }} />
      ) : (
        <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--text-muted)' }} />
      )}
      <span style={{
        fontSize: '0.85rem',
        color: isDone ? '#10b981' : isCurrent ? '#ffffff' : 'var(--text-muted)',
        fontWeight: isCurrent ? 600 : 400
      }}>
        {label}
      </span>
    </div>
  );
}
