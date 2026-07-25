import React from 'react';
import { Sparkles, Award, TrendingUp, Target, ShieldCheck, Zap, ArrowRight, BrainCircuit } from 'lucide-react';

export default function CareerAnalytics({ items, studentProfile }) {
  // Extract all unique skills across repository
  const allSkills = Array.from(new Set(items.flatMap(i => i.skills || [])));

  // Calculate category readiness
  const totalProjects = items.filter(i => i.category === 'Projects').length;
  const totalCerts = items.filter(i => i.category === 'Certifications').length;
  const totalInternships = items.filter(i => i.category === 'Internships').length;

  const readinessScore = Math.min(96, 65 + (totalProjects * 5) + (totalCerts * 6) + (totalInternships * 8));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Target Career Trajectory Card */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Target size={22} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Career Trajectory Alignment
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px 0' }}>
              {studentProfile.targetCareer}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
              Knowledge repository demonstrates strong mastery in Deep Learning, Computer Vision, and Cloud Infrastructure.
            </p>
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '16px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass-bright)' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800 }} className="gradient-text">{readinessScore}%</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Career Readiness Score</div>
          </div>
        </div>
      </div>

      {/* Skills Matrix & Competency Bars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* Extracted Skill Frequency */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BrainCircuit size={18} color="var(--accent-primary)" /> Top Competency Domains
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <SkillProgressBar label="Artificial Intelligence & PyTorch" percentage={92} color="#10b981" count="3 Projects • 2 Certifications" />
            <SkillProgressBar label="AWS Cloud & Microservices" percentage={88} color="#3b82f6" count="1 Cert • 1 Internship" />
            <SkillProgressBar label="Computer Vision & Medical AI" percentage={85} color="#a855f7" count="2 Projects" />
            <SkillProgressBar label="LLMs, RAG & Multi-Agent" percentage={80} color="#f59e0b" count="1 Internship • 2 Repos" />
            <SkillProgressBar label="Robotics & ROS2" percentage={74} color="#ec4899" count="1 Award Project" />
          </div>
        </div>

        {/* AI Growth Recommendations */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#f59e0b" /> AI Recommended Next Milestones
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <MilestoneRecommendationItem
              title="AWS Solutions Architect Associate"
              description="Extends your AWS Cloud Practitioner credential to full architecture mastery."
              impact="High Priority (+6% Readiness)"
            />
            <MilestoneRecommendationItem
              title="Publish NeuroVision AI Paper Preprint"
              description="Upload your 3D U-Net segmentation paper to bioRxiv or arXiv literature database."
              impact="Research Boost (+8% Readiness)"
            />
            <MilestoneRecommendationItem
              title="Docker Container Security Badge"
              description="Ingest container hardening certificate to validate production deployment skills."
              impact="DevOps Strength (+4% Readiness)"
            />
          </div>
        </div>

      </div>

      {/* All Indexed Skills Cloud */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>All Synthesized Skills ({allSkills.length})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {allSkills.map((sk, idx) => (
            <span key={idx} className="badge-category badge-skills" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
              ⚡ {sk}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}

function SkillProgressBar({ label, percentage, color, count }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
        <span style={{ fontWeight: 600, color: '#fff' }}>{label}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{count}</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

function MilestoneRecommendationItem({ title, description, impact }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border-glass)',
      padding: '12px 16px',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    }}>
      <div>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 600, margin: '0 0 2px 0', color: '#fff' }}>{title}</h4>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>{description}</p>
      </div>
      <span style={{ fontSize: '0.72rem', color: '#f59e0b', background: 'rgba(245,158,11,0.12)', padding: '4px 8px', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}>
        {impact}
      </span>
    </div>
  );
}
