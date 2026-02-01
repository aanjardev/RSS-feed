-- Migration 012: Add page content settings for About and Terms pages
-- These settings allow editing About and Terms pages from dashboard

-- Add about page content setting
INSERT INTO settings (key, value, type, label, description, category, is_public) 
VALUES (
  'about_content', 
  '<h2>Tentang Papua.News</h2><p>Papua.News adalah portal berita agregator yang menyajikan informasi terkini dari berbagai sumber berita terpercaya di Papua.</p><p>Kami mengumpulkan berita dari berbagai media untuk memberikan Anda akses mudah ke informasi terbaru tentang Papua dalam satu tempat.</p>', 
  'text', 
  'About Page Content', 
  'Content for About Us page (supports HTML)', 
  'content', 
  true
)
ON CONFLICT (key) DO UPDATE 
SET 
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_public = EXCLUDED.is_public;

-- Add terms page content setting
INSERT INTO settings (key, value, type, label, description, category, is_public) 
VALUES (
  'terms_content', 
  '<h2>Syarat dan Ketentuan</h2><p>Dengan mengakses dan menggunakan situs web Papua.News, Anda setuju untuk terikat dengan syarat dan ketentuan berikut:</p><h3>1. Penggunaan Konten</h3><p>Semua konten yang ditampilkan di situs ini dikumpulkan dari sumber berita publik dan tetap menjadi milik penerbit aslinya.</p><h3>2. Tautan Eksternal</h3><p>Situs ini berisi tautan ke situs web eksternal. Kami tidak bertanggung jawab atas konten atau kebijakan privasi situs tersebut.</p><h3>3. Perubahan Ketentuan</h3><p>Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.</p>', 
  'text', 
  'Terms Page Content', 
  'Content for Terms & Conditions page (supports HTML)', 
  'content', 
  true
)
ON CONFLICT (key) DO UPDATE 
SET 
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_public = EXCLUDED.is_public;
