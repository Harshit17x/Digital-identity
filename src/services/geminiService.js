/**
 * Gemini 2.5 API Integration Service
 * 
 * Provides automated multi-modal document ingestion, category classification,
 * skill extraction, confidence scoring, relationship mapping, and Smart Retrieval RAG Chatbot
 * using Google Gemini 2.5 Flash API with local rule engine fallback.
 */

import { parseDocumentContent, extractEntitiesAndMetadata } from './aiEngine';

// Reads VITE_GEMINI_API_KEY from environment variables (.env.local or process.env)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * System prompt instructing Gemini 2.5 to act as an expert academic identity parser
 * and output strictly structured JSON adhering to the platform's Data Model.
 */
const INGESTION_SYSTEM_PROMPT = `
You are an expert AI Digital Identity System parser.
Given a document's filename, text content, or title, analyze the content and return a strict JSON object with zero markdown formatting outside the JSON block.

The JSON MUST match this exact schema:
{
  "title": "Descriptive, concise document title",
  "category": "Projects" | "Skills" | "Certifications" | "Internships" | "Achievements" | "Academics" | "Other",
  "confidence": 0.95, // Float between 0.80 and 0.99 indicating extraction certainty
  "issuer_or_organization": "Issuing institution, company, or platform name",
  "doc_date": "YYYY-MM-DD",
  "timeline_year": 2026, // Integer year extracted from content or current year
  "skills_mentioned": ["Skill 1", "Skill 2", "Skill 3"], // Array of extracted technical/academic skills
  "summary": "1-2 sentence concise executive summary of the document",
  "notes": "Key takeaway or personal note inferred from document context",
  "relationships": [
    {
      "relation_type": "implies" | "builds_on" | "validates" | "anchors",
      "target_category": "Skills" | "Projects" | "Certifications" | "Academics",
      "target_description": "Clear description of the connected growth node (e.g. 'Skill: PyTorch Mastery')"
    }
  ]
}
`;

/**
 * Parses an uploaded document using Gemini 2.5 API.
 * Falls back cleanly to intelligent client-side parser if GEMINI_API_KEY is not configured yet.
 * 
 * @param {File} file - Uploaded File object
 * @param {string} textContent - Optional extracted plain text from PDF/TXT
 * @returns {Promise<Object>} Formatted Document Data Model entry
 */
export async function parseDocumentWithGemini(file, textContent = '') {
  const filename = file.name;
  const fileUrl = URL.createObjectURL(file);

  if (GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GEMINI_API_KEY}`
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: INGESTION_SYSTEM_PROMPT },
                  { text: `Document Filename: ${filename}\nDocument Content Preview: ${textContent || filename}` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (rawText) {
          const parsedJSON = JSON.parse(rawText);
          return {
            id: `doc-gemini-${Date.now()}`,
            filename,
            file_url: fileUrl,
            category: parsedJSON.category || 'Projects',
            confidence: parsedJSON.confidence || 0.96,
            title: parsedJSON.title || filename,
            issuer_or_organization: parsedJSON.issuer_or_organization || 'Academic Institution',
            doc_date: parsedJSON.doc_date || new Date().toISOString().split('T')[0],
            skills_mentioned: parsedJSON.skills_mentioned || ['System Design'],
            summary: parsedJSON.summary || `Parsed via Gemini 2.5 Flash API.`,
            timeline_year: parsedJSON.timeline_year || new Date().getFullYear(),
            notes: parsedJSON.notes || 'Parsed and indexed via Gemini 2.5 multi-modal inference.',
            relationships: parsedJSON.relationships || [
              {
                source_doc_id: `doc-gemini-${Date.now()}`,
                relation_type: 'implies',
                target_category: 'Skills',
                target_description: `Skill: ${parsedJSON.category || 'Technical'} Growth`
              }
            ]
          };
        }
      }
    } catch (err) {
      console.warn('Gemini 2.5 API ingestion call fallback:', err);
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // AUTOMATIC LOCAL FALLBACK: reads actual file content + weighted rule engine
  // ────────────────────────────────────────────────────────────────────────────

  // Step 1: Extract real text from the file (PDF binary scan, TXT read, etc.)
  const extractedText = await parseDocumentContent(file);

  // Step 2: Run weighted category classifier + skill matcher + issuer detector
  const entities = extractEntitiesAndMetadata(extractedText, filename);

  return {
    id: `doc-${Date.now()}`,
    filename,
    file_url: fileUrl,
    category: entities.category,
    confidence: entities.confidenceScore,
    title: entities.title,
    issuer_or_organization: entities.issuer,
    doc_date: entities.date,
    skills_mentioned: entities.skills,
    summary: entities.summary,
    timeline_year: entities.year,
    notes: `Auto-classified via local rule engine. Content preview: ${entities.contentPreview.slice(0, 120)}`,
    relationships: [
      {
        source_doc_id: `doc-${Date.now()}`,
        relation_type: 'implies',
        target_category: 'Skills',
        target_description: `Skill: ${entities.skills[0] || 'Technical Growth'}`
      }
    ]
  };
}

/**
 * MODULE 5: SMART RETRIEVAL SYSTEM CHATBOT SERVICE
 * Enables natural language RAG search over original documents using Gemini 2.5 API.
 * 
 * @param {string} userQuery - Natural language question from user
 * @param {Array} documents - Current list of indexed student documents
 * @param {Object} studentProfile - Student profile data
 * @returns {Promise<{ answerText: string, matchingDocs: Array }>}
 */
export async function querySmartRetrievalWithGemini(userQuery, documents = [], studentProfile = {}) {
  const queryTrimmed = userQuery.trim().toLowerCase();

  // 1. Instant Conversational Greetings Handler
  const GREETINGS = ['hi', 'hello', 'hey', 'hi there', 'greetings', 'who are you', 'help'];
  if (GREETINGS.includes(queryTrimmed)) {
    return {
      answerText: `Hello! 👋 I am your **Smart Retrieval Bot** assistant.\n\nI have indexed **${documents.length} entries** across Projects, Certifications, Internships, and Academics in your Digital Identity repository.\n\nYou can ask me natural questions like:\n• *"What certifications did I earn in 2024?"*\n• *"Show my PyTorch and ML projects"*\n• *"Where did I complete my internships?"*\n\nWhat would you like to locate today?`,
      matchingDocs: []
    };
  }

  // Format Knowledge Repository context for RAG injection
  const repositoryContext = documents.map((doc, idx) => `
[Document #${idx + 1}]
ID: ${doc.id}
Title: "${doc.title}"
Category: ${doc.category}
Timeline Year: ${doc.timeline_year} (Date: ${doc.doc_date})
Issuer/Organization: ${doc.issuer_or_organization}
Confidence Score: ${(doc.confidence * 100).toFixed(0)}%
Skills Mentioned: ${doc.skills_mentioned ? doc.skills_mentioned.join(', ') : 'None'}
Summary: ${doc.summary}
Personal Notes: ${doc.notes || 'None'}
Original File: ${doc.filename} (${doc.file_url})
  `).join('\n');

  const systemInstruction = `
You are the Smart Retrieval Bot AI Assistant for ${studentProfile.name || 'Alex Rivers'}'s Digital Identity Knowledge Repository.
Your job is to enable instant, context-aware access to original student data using natural language search.

Here is the student's complete indexed document repository context:
${repositoryContext}

Instructions:
1. Answer the user's question directly and concisely based on the provided repository context.
2. Highlight exact document titles, dates, skills, and categories relevant to their query.
3. Keep tone helpful, professional, and clear.
`;

  // 2. Call Gemini 2.5 API if configured
  if (GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GEMINI_API_KEY}`
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: systemInstruction },
                  { text: `User Search Query: "${userQuery}"` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 600
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const answerText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (answerText) {
          // Identify matching document objects for quick action chips
          const searchWords = queryTrimmed.split(/\s+/).filter(w => w.length > 2);
          const matchingDocs = documents.filter(d => 
            searchWords.some(term => 
              d.title.toLowerCase().includes(term) ||
              d.category.toLowerCase().includes(term) ||
              d.skills_mentioned.some(s => s.toLowerCase().includes(term)) ||
              d.issuer_or_organization.toLowerCase().includes(term)
            )
          ).slice(0, 3);

          return { answerText, matchingDocs };
        }
      } else {
        console.warn(`Gemini API HTTP Error Status: ${response.status}`);
      }
    } catch (err) {
      console.warn('Gemini Smart Retrieval RAG query failed, fallback used:', err);
    }
  }

  // 3. Fallback Smart Keyword Search Engine
  const searchTerms = queryTrimmed.split(/\s+/).filter(w => w.length > 2);
  const matched = documents.filter(d => {
    if (searchTerms.length === 0) return false;
    return searchTerms.some(term => 
      d.title.toLowerCase().includes(term) ||
      d.category.toLowerCase().includes(term) ||
      d.skills_mentioned.some(s => s.toLowerCase().includes(term)) ||
      d.summary.toLowerCase().includes(term) ||
      d.issuer_or_organization.toLowerCase().includes(term) ||
      d.timeline_year.toString().includes(term)
    );
  });

  let fallbackAnswer = "";
  if (matched.length > 0) {
    fallbackAnswer = `Found **${matched.length} matching document(s)** in your Digital Identity repository for "${userQuery}":\n\n` +
      matched.map(d => `• **${d.title}** (${d.category}, ${d.timeline_year}) — Issued by *${d.issuer_or_organization}*. Verified skills: ${d.skills_mentioned.slice(0, 3).join(', ')}.`).join('\n\n');
  } else {
    fallbackAnswer = `I searched your Digital Identity repository for "${userQuery}". You currently have ${documents.length} entries indexed across Projects, Certifications, Internships, and Academics.\n\nTry searching by skill (e.g. *PyTorch*, *AWS*), category, or year (*2024*, *2025*).`;
  }

  return { answerText: fallbackAnswer, matchingDocs: matched.slice(0, 3) };
}
