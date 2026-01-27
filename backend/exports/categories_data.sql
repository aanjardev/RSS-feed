--
-- PostgreSQL database dump
--

\restrict gkG90v6d3q4NcgBOubACeYMdo7LFAoA1eoTnSOVmcOhUHosAcN4fNbVp0thC6j5

-- Dumped from database version 17.7 (Debian 17.7-3.pgdg13+1)
-- Dumped by pg_dump version 17.7 (Debian 17.7-3.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: fekusa
--

INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (1, 'News', 'news', 'General news articles', '📰', '#3b82f6', true, '2026-01-27 17:09:13.992636', '2026-01-27 17:09:13.992636');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (2, 'Business', 'business', 'Business and economy news', '💼', '#10b981', true, '2026-01-27 17:09:13.992636', '2026-01-27 17:09:13.992636');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (3, 'Technology', 'technology', 'Tech and innovation news', '💻', '#8b5cf6', true, '2026-01-27 17:09:13.992636', '2026-01-27 17:09:13.992636');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (4, 'Sports', 'sports', 'Sports and athletics news', '⚽', '#f59e0b', true, '2026-01-27 17:09:13.992636', '2026-01-27 17:09:13.992636');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (5, 'Entertainment', 'entertainment', 'Entertainment and lifestyle', '🎬', '#ec4899', true, '2026-01-27 17:09:13.992636', '2026-01-27 17:09:13.992636');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (16, 'Lokal', 'lokal', 'Berita lokal dan daerah', '🏘️', '#06b6d4', true, '2026-01-27 17:34:06.895397', '2026-01-27 17:34:06.895397');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (17, 'Nasional', 'nasional', 'Berita nasional Indonesia', '🇮🇩', '#ef4444', true, '2026-01-27 17:34:06.895397', '2026-01-27 17:34:06.895397');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (18, 'Internasional', 'internasional', 'Berita internasional dan dunia', '🌍', '#8b5cf6', true, '2026-01-27 17:34:06.895397', '2026-01-27 17:34:06.895397');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (19, 'Olahraga', 'olahraga', 'Berita olahraga dan kompetisi', '⚽', '#f59e0b', true, '2026-01-27 17:34:06.895397', '2026-01-27 17:34:06.895397');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (20, 'Hukum', 'hukum', 'Berita hukum dan peradilan', '⚖️', '#64748b', true, '2026-01-27 17:34:06.895397', '2026-01-27 17:34:06.895397');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (21, 'Politik', 'politik', 'Berita politik dan pemerintahan', '🏛️', '#7c3aed', true, '2026-01-27 17:34:06.895397', '2026-01-27 17:34:06.895397');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (22, 'Otonomi Khusus', 'otonomi-khusus', 'Berita otonomi khusus daerah', '🏞️', '#84cc16', true, '2026-01-27 17:34:06.895397', '2026-01-27 17:34:06.895397');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (23, 'Kesehatan', 'kesehatan', 'Berita kesehatan dan medis', '🏥', '#10b981', true, '2026-01-27 17:34:06.895397', '2026-01-27 17:34:06.895397');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (24, 'Opini', 'opini', 'Opini dan editorial', '💭', '#f97316', true, '2026-01-27 17:34:06.895397', '2026-01-27 17:34:06.895397');
INSERT INTO public.categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES (25, 'Artikel', 'artikel', 'Artikel dan feature', '📝', '#06b6d4', true, '2026-01-27 17:34:06.895397', '2026-01-27 17:34:06.895397');


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fekusa
--

SELECT pg_catalog.setval('public.categories_id_seq', 25, true);


--
-- PostgreSQL database dump complete
--

\unrestrict gkG90v6d3q4NcgBOubACeYMdo7LFAoA1eoTnSOVmcOhUHosAcN4fNbVp0thC6j5

