# Digital Identity — AI Academic & Career Journey Platform 🚀

An AI-native, multi-modal digital identity platform designed to index, structure, and visualize academic credentials, projects, certifications, and career milestones into an interconnected knowledge graph with **RAG semantic search**.

![Digital Identity Banner](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-blue?style=for-the-badge&logo=google)
![Vector Search](https://img.shields.io/badge/Database-Supabase%20pgvector-green?style=for-the-badge&logo=supabase)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)

---

## 🌟 Key Features

### 1. 📄 Multi-Modal Document Ingestion & NLP Parsing
- **Automatic Entity Extraction**: Upload PDF resumes, certificates, internship letters, or project reports. The AI engine automatically extracts titles, issuers, dates, categories, and verified skills from a 60+ domain skill taxonomy.
- **Weighted Classification Engine**: Rules-based weighted scoring combined with Gemini 2.5 Multi-Modal parsing assigns AI confidence metrics (`0.85 – 0.99`).

### 2. 🔍 Instant Command Palette Search (Cmd + K)
- **High-Contrast Dark Command Palette**: Press `Cmd + K` or `Ctrl + K` to trigger an instant fuzzy & vector search.
- **Match Rationale**: Displays exact match explanations (e.g., *Category Match*, *Extracted Skill*, *Title Keyword Match*).

### 3. 💬 Smart Retrieval RAG Chatbot
- **Grounded Conversational Assistance**: Ask natural language questions like *"What ML certifications did I earn in 2024?"* or *"Where did I complete my internships?"*.
- **RAG Architecture**: Injects your structured digital identity repository context into Gemini 2.5 Flash to generate precise answers with original document citations.

### 4. 🕸️ Interactive Knowledge & Relationship Graph
- **Network Visualizer**: Dynamic visual node graph linking documents to category hubs (`Certifications`, `Projects`, `Academics`, `Internships`) and acquired technical skills.
- **Cross-Domain Connections**: Connects projects and credentials sharing overlapping skill clusters.

### 5. 🗓️ Growth Timeline & Interactive Filtering
- **Chronological Spine**: Explore your progress year-by-year.
- **Sliders & Controls**: Filter documents by minimum AI confidence threshold or specific year ranges.

---

## 🛠️ Technology Stack

- **Core Frontend**: React 18, Vite
- **Styling**: Modern SaaS Vanilla CSS Design System with Glassmorphic Modals & High-Contrast Dark Palette
- **AI & NLP Engine**: Google Gemini 2.5 API (Multimodal & Flash RAG), Client-side TF-IDF / N-Gram Vectorizer & Cosine Similarity Engine
- **Database & Storage**: Supabase PostgreSQL + `pgvector` extension, Supabase Storage (`documents-bucket`)
- **Icons**: Lucide React

---

## 📁 Repository Structure

```
Digital-identity/
├── src/
│   ├── components/
│   │   ├── CommandPalette.jsx       # Cmd+K Instant RAG Search Modal
│   │   ├── Header.jsx               # Navigation Bar & Page Controls
│   │   ├── LandingPage.jsx          # Public Hero & Feature Presentation
│   │   ├── RelationshipGraph.jsx    # Vis.js Dynamic Knowledge Graph
│   │   ├── Sidepanel.jsx            # Timeline Filters & Sliders
│   │   ├── SmartRetrievalChatbot.jsx# RAG AI Chatbot Assistant
│   │   ├── TimelineHero.jsx         # Chronological Timeline Spine
│   │   ├── UploadHeroSection.jsx    # Drag-and-Drop Ingestion Zone
│   │   └── UploadModal.jsx          # Modal File Ingestion Trigger
│   ├── data/
│   │   └── mockProfile.js           # Default Initial Credentials & Documents
│   ├── services/
│   │   ├── aiEngine.js              # NLP Entity Extractor, Vector Embeddings & Cosine Similarity
│   │   ├── geminiService.js         # Gemini 2.5 API Multi-Modal & RAG Service
│   │   └── supabaseClient.js        # Supabase PostgreSQL & Storage Sync
│   ├── App.jsx                      # Main Application Router & State Manager
│   ├── index.css                    # Design System Tokens & Animations
│   └── main.jsx                     # Application Entry Point
├── supabase_schema.sql              # Supabase PostgreSQL Table & pgvector Setup Script
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **yarn**

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Harshit17x/Digital-identity.git
cd Digital-identity
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Google Gemini 2.5 API Key (Required for AI Parsing & RAG Chatbot)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Credentials (Optional for cloud vector persistence)
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Running Locally

Start the Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Setup (Supabase pgvector)

To enable cloud vector storage and persistence:

1. Open your [Supabase Dashboard](https://supabase.com/).
2. Go to the **SQL Editor**.
3. Paste and run the contents of [`supabase_schema.sql`](file:///Users/harshitbisht/Desktop/memory%20verse/supabase_schema.sql):
   - Enables `vector` extension (`CREATE EXTENSION IF NOT EXISTS vector;`)
   - Creates `documents` table with `embedding vector(768)`
   - Configures storage policies for `documents-bucket`

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.
