-- =================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR AI DIGITAL IDENTITY SYSTEM
-- Paste this script directly into Supabase SQL Editor to set up:
-- 1. `documents` table with JSONB skills & relationships
-- 2. `pgvector` extension for AI RAG embeddings
-- 3. `documents-bucket` storage policies
-- =================================================================

-- 1. Enable pgvector extension for RAG semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  file_url TEXT,
  category TEXT NOT NULL,
  confidence DOUBLE PRECISION DEFAULT 0.95,
  title TEXT NOT NULL,
  issuer_or_organization TEXT,
  doc_date DATE,
  timeline_year INT,
  skills_mentioned JSONB DEFAULT '[]'::jsonb,
  summary TEXT,
  notes TEXT,
  relationships JSONB DEFAULT '[]'::jsonb,
  embedding vector(768), -- Optional vector embeddings for RAG search
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast category & year filtering
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_timeline_year ON public.documents(timeline_year);

-- 3. Enable Row Level Security (RLS) & Allow Public Read/Write for Hackathon Demo
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on documents"
  ON public.documents FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access on documents"
  ON public.documents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access on documents"
  ON public.documents FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access on documents"
  ON public.documents FOR DELETE
  USING (true);

-- 4. Create Supabase Storage Bucket Policy for `documents-bucket`
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents-bucket', 'documents-bucket', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read access on storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents-bucket');

CREATE POLICY "Allow public upload access on storage"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents-bucket');
