import { createClient } from '@supabase/supabase-js';

// Reads Supabase environment variables from Vite .env.local
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://utvxvnafevoeqkxyjcsk.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dnh2bmFmZXZvZXFreHlqY3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5Nzk4NTAsImV4cCI6MjEwMDU1NTg1MH0.9K7COmqkJ0AW1KaduvG3rvihMi5EgKL7CZbHVUxuK4A';

// Initialize Supabase Client instance (or null if credentials pending)
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/**
 * Fetches all student documents from Supabase PostgreSQL database table.
 * @returns {Promise<Array|null>} Array of document objects or null if unconfigured
 */
export async function fetchDocumentsFromSupabase() {
  if (!supabase) {
    console.info('Supabase client unconfigured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY pending).');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('doc_date', { ascending: false });

    if (error) {
      console.error('Error fetching documents from Supabase:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Supabase fetch exception:', err);
    return null;
  }
}

/**
 * Inserts a newly parsed document entry into Supabase PostgreSQL table.
 * @param {Object} doc - Document object adhering to data model
 * @returns {Promise<Object|null>} Inserted document record
 */
export async function insertDocumentToSupabase(doc) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        id: doc.id,
        filename: doc.filename,
        file_url: doc.file_url,
        category: doc.category,
        confidence: doc.confidence,
        title: doc.title,
        issuer_or_organization: doc.issuer_or_organization,
        doc_date: doc.doc_date,
        skills_mentioned: doc.skills_mentioned,
        summary: doc.summary,
        timeline_year: doc.timeline_year,
        notes: doc.notes,
        relationships: doc.relationships
      }])
      .select();

    if (error) {
      console.error('Error inserting document into Supabase:', error);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error('Supabase insert exception:', err);
    return null;
  }
}

/**
 * Uploads a raw document file (PDF, PNG, DOCX) to Supabase Storage bucket ('documents-bucket').
 * @param {File} file - Raw File object
 * @returns {Promise<string|null>} Public URL of uploaded file
 */
export async function uploadFileToSupabaseStorage(file) {
  if (!supabase) return null;

  try {
    const filePath = `user_files/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('documents-bucket')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading file to Supabase Storage:', error);
      return null;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('documents-bucket')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error('Supabase storage upload exception:', err);
    return null;
  }
}
