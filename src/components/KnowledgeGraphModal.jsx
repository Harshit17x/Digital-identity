import React, { useEffect, useRef } from 'react';
import { Network as VisNetwork } from 'vis-network';
import { X, Network, Sparkles } from 'lucide-react';

export default function KnowledgeGraphModal({ isOpen, onClose, documents }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    // Build Graph data nodes and edges from documents and relationships
    const nodesMap = new Map();
    const edges = [];

    // Hub Nodes
    const categories = ["Projects", "Skills", "Certifications", "Internships", "Achievements", "Academics", "Other"];
    categories.forEach(cat => {
      nodesMap.set(`hub-${cat}`, {
        id: `hub-${cat}`,
        label: cat,
        group: 'hub',
        color: '#5C7A5C',
        shape: 'ellipse',
        font: { color: '#FFFFFF', face: 'Inter', size: 14 }
      });
    });

    documents.forEach(doc => {
      // Document node
      nodesMap.set(doc.id, {
        id: doc.id,
        label: doc.title.length > 20 ? doc.title.slice(0, 18) + "..." : doc.title,
        group: 'doc',
        color: '#C9A24B',
        shape: 'box',
        font: { color: '#0E1116', face: 'Source Serif 4', size: 13 }
      });

      // Hub edge
      edges.push({
        from: `hub-${doc.category}`,
        to: doc.id,
        dashes: true,
        color: { color: 'rgba(255, 255, 255, 0.2)' }
      });

      // Skills nodes & edges
      (doc.skills_mentioned || []).forEach(skill => {
        const skillId = `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`;
        if (!nodesMap.has(skillId)) {
          nodesMap.set(skillId, {
            id: skillId,
            label: `⚡ ${skill}`,
            group: 'skill',
            color: '#161B22',
            shape: 'diamond',
            font: { color: '#5C7A5C', face: 'Inter', size: 12 }
          });
        }
        edges.push({
          from: doc.id,
          to: skillId,
          color: { color: 'rgba(92, 122, 92, 0.4)' }
        });
      });
    });

    const data = {
      nodes: Array.from(nodesMap.values()),
      edges
    };

    const options = {
      nodes: { borderWidth: 2, shadow: true },
      physics: {
        barnesHut: { gravitationalConstant: -2500, springLength: 100 }
      },
      interaction: { hover: true, zoomView: true }
    };

    const network = new VisNetwork(containerRef.current, data, options);

    return () => network.destroy();
  }, [isOpen, documents]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(14, 17, 22, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '1000px',
          height: '80vh',
          background: '#161B22',
          border: '1px solid var(--chrome-border-bright)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--chrome-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Network size={20} color="var(--gold-thread)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#FFF' }}>
              Full Interconnected Knowledge Map (Opt-In Surface)
            </h3>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--chrome-text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  );
}
