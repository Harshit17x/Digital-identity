import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Tag, Plus, Building2, Calendar, FileText, ShieldCheck } from 'lucide-react';

export default function IngestionReviewModal({ isOpen, onClose, parsedDoc, onConfirm }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Projects');
  const [issuer, setIssuer] = useState('');
  const [docDate, setDocDate] = useState('');
  const [timelineYear, setTimelineYear] = useState(new Date().getFullYear());
  const [skills, setSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (parsedDoc) {
      setTitle(parsedDoc.title || parsedDoc.filename || '');
      setCategory(parsedDoc.category || 'Projects');
      setIssuer(parsedDoc.issuer_or_organization || 'Verified Institution');
      setDocDate(parsedDoc.doc_date || new Date().toISOString().split('T')[0]);
      setTimelineYear(parsedDoc.timeline_year || new Date().getFullYear());
      setSkills(Array.isArray(parsedDoc.skills_mentioned) ? [...parsedDoc.skills_mentioned] : []);
      setSummary(parsedDoc.summary || '');
    }
  }, [parsedDoc]);

  if (!isOpen || !parsedDoc) return null;

  const handleAddSkill = (e) => {
    e.preventDefault();
    const tag = newSkillInput.trim();
    if (tag && !skills.includes(tag)) {
      setSkills([...skills, tag]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = () => {
    const finalDoc = {
      ...parsedDoc,
      title: title.trim() || parsedDoc.filename,
      category,
      issuer_or_organization: issuer.trim() || 'Verified Institution',
      doc_date: docDate,
      timeline_year: parseInt(timelineYear, 10) || new Date().getFullYear(),
      skills_mentioned: skills,
      summary: summary.trim() || `Verified ${category} entry in digital identity.`
    };
    onConfirm(finalDoc);
    onClose();
  };

  const categories = ['Academics', 'Projects', 'Certifications', 'Internships', 'Achievements', 'Other'];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '20px'
    }} className="animate-fade-in">
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '28px',
        width: '560px',
        maxWidth: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)',
        padding: '32px',
        position: 'relative'
      }}>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#F0F9FF',
              border: '1px solid #BAE6FD',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              color: '#0284C7'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Verify Extracted Document Details
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '2px 0 0 0' }}>
                Rule engine & OCR parsed {parsedDoc.filename}. Review & edit details before saving.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '50%'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* 1. Document Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Harshit Bisht — Software & AI Engineer Resume"
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '0.92rem',
                color: '#0F172A',
                fontWeight: 600,
                outline: 'none'
              }}
            />
          </div>

          {/* 2. Category Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Category Classification
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    background: category === cat ? '#0F172A' : '#F1F5F9',
                    color: category === cat ? '#FFFFFF' : '#475569',
                    border: '1px solid #CBD5E1',
                    padding: '7px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.84rem',
                    fontWeight: category === cat ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Issuer / Organization & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Issuer / Institution
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Stanford University / Coursera"
                  style={{
                    width: '100%',
                    padding: '11px 16px 11px 36px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    color: '#0F172A',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
                <Building2 size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Document Date / Year
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  value={docDate}
                  onChange={(e) => {
                    setDocDate(e.target.value);
                    if (e.target.value) {
                      setTimelineYear(new Date(e.target.value).getFullYear());
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '11px 16px 11px 36px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    color: '#0F172A',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
                <Calendar size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>
          </div>

          {/* 4. Extracted Skills Editor */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Extracted Skills & Competencies
            </label>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: '#F0F9FF',
                    color: '#0284C7',
                    border: '1px solid #BAE6FD',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {skill}
                  <X
                    size={14}
                    style={{ cursor: 'pointer', opacity: 0.7 }}
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </span>
              ))}
            </div>

            <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add custom skill tag (e.g. PyTorch, React, GeoAI)"
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.86rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#F1F5F9',
                  color: '#0F172A',
                  border: '1px solid #CBD5E1',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={15} />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* 5. Summary Text Box */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Executive Summary
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Concise summary of document contents and key takeaways..."
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '0.86rem',
                color: '#0F172A',
                outline: 'none',
                resize: 'none',
                lineHeight: 1.5
              }}
            />
          </div>

        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
          <button
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              color: '#475569',
              border: '1px solid #CBD5E1',
              padding: '11px 22px',
              borderRadius: '9999px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              border: '1px solid #1E293B',
              padding: '11px 26px',
              borderRadius: '9999px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.2)'
            }}
          >
            <Check size={16} />
            <span>Confirm & Add to Digital Identity</span>
          </button>
        </div>

      </div>
    </div>
  );
}
