import React, { useEffect, useRef, useState } from 'react';
import { Network as VisNetwork } from 'vis-network';
import { Network, Sparkles, Filter, Info, ArrowRight, Tag, X } from 'lucide-react';
import { buildDynamicKnowledgeGraph } from '../services/aiEngine';

export default function RelationshipGraph({ items, onSelectFile }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (!containerRef.current) return;

    // Build Graph Data from items
    const { nodes, edges } = buildDynamicKnowledgeGraph(items);

    // Apply Filter if active
    let filteredNodes = nodes;
    if (activeFilter !== 'all') {
      filteredNodes = nodes.filter(n => n.group === activeFilter || n.group === 'hub');
    }

    // Color map for SaaS Light Theme nodes
    const lightThemeNodes = filteredNodes.map(n => {
      let nodeBg = '#0F172A';
      let fontColor = '#FFFFFF';

      if (n.group === 'certifications') {
        nodeBg = '#9333EA';
      } else if (n.group === 'projects') {
        nodeBg = '#2563EB';
      } else if (n.group === 'skills') {
        nodeBg = '#16A34A';
      } else if (n.group === 'internships') {
        nodeBg = '#D97706';
      }

      return {
        ...n,
        color: {
          background: nodeBg,
          border: '#FFFFFF',
          highlight: { background: nodeBg, border: '#0F172A' }
        },
        font: { color: fontColor, face: 'Inter', size: 13, weight: '700' }
      };
    });

    const data = {
      nodes: lightThemeNodes,
      edges: edges.map(e => ({
        ...e,
        color: { color: '#CBD5E1', highlight: '#0F172A' }
      }))
    };

    const options = {
      nodes: {
        shape: 'box',
        shadow: true,
        borderWidth: 2,
        margin: 10,
        borderRadius: 8
      },
      edges: {
        width: 1.5,
        smooth: {
          type: 'continuous'
        },
        font: {
          color: '#64748B',
          size: 11,
          face: 'Inter'
        }
      },
      physics: {
        barnesHut: {
          gravitationalConstant: -3000,
          centralGravity: 0.3,
          springLength: 120
        },
        stabilization: { iterations: 100 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true
      }
    };

    const network = new VisNetwork(containerRef.current, data, options);
    networkRef.current = network;

    // Node click handler
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const clickedNode = nodes.find(n => n.id === nodeId);
        
        const connectedNodeIds = network.getConnectedNodes(nodeId);
        const connectedNodes = nodes.filter(n => connectedNodeIds.includes(n.id));

        setSelectedNode({
          ...clickedNode,
          connectedNodes
        });
      } else {
        setSelectedNode(null);
      }
    });

    return () => {
      network.destroy();
    };
  }, [items, activeFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }} className="animate-fade-in">
      
      {/* Header Panel */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '24px',
        padding: '24px 32px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
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
            <Network size={24} color="#0F172A" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Relationship Engine
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#64748B', margin: '2px 0 0 0' }}>
              Interactive knowledge graph mapping connections between certifications, skills, projects, and career paths.
            </p>
          </div>
        </div>

        {/* Node Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>Filter Nodes:</span>
          {['all', 'item', 'skill', 'hub'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                background: activeFilter === f ? '#0F172A' : '#F1F5F9',
                color: activeFilter === f ? '#FFFFFF' : '#475569',
                border: '1px solid #CBD5E1',
                padding: '5px 14px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: activeFilter === f ? 700 : 600,
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {f === 'all' ? 'All Nodes' : f === 'item' ? 'Documents' : f === 'skill' ? 'Skills' : 'Hub Categories'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Canvas & Sidebar Split Container */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedNode ? '1fr 340px' : '1fr', gap: '20px' }}>
        
        {/* Graph Container */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '24px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
          position: 'relative',
          height: '620px',
          overflow: 'hidden'
        }}>
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
          
          {/* Legend Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #E2E8F0',
            padding: '10px 16px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.78rem',
            fontWeight: 600,
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#9333EA' }} /> Certifications
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563EB' }} /> Projects
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#16A34A' }} /> Skills
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#D97706' }} /> Internships
            </span>
          </div>
        </div>

        {/* Selected Node Detail Sidebar Drawer */}
        {selectedNode && (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            padding: '24px',
            height: '620px',
            overflowY: 'auto'
          }} className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#0F172A',
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                padding: '3px 10px',
                borderRadius: '9999px',
                textTransform: 'uppercase'
              }}>
                Node Details
              </span>
              <button 
                onClick={() => setSelectedNode(null)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <X size={16} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
              {selectedNode.fullTitle || selectedNode.label}
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: '20px' }}>
              Type: <strong style={{ color: '#0F172A', textTransform: 'capitalize' }}>{selectedNode.group}</strong>
            </p>

            {/* Connected Nodes List */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={15} color="#0F172A" /> Connected Nodes ({selectedNode.connectedNodes?.length || 0})
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedNode.connectedNodes?.map(conn => (
                  <div
                    key={conn.id}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      padding: '12px',
                      borderRadius: '14px',
                      fontSize: '0.84rem'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>{conn.fullTitle || conn.label}</div>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Category: {conn.group}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* View Source Document Button */}
            {selectedNode.group === 'item' && (
              <button
                onClick={() => {
                  const targetItem = items.find(i => i.id === selectedNode.id);
                  if (targetItem) onSelectFile(targetItem);
                }}
                style={{
                  width: '100%',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  border: '1px solid #1E293B',
                  padding: '12px',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.16)'
                }}
              >
                <span>Inspect Source Document</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
