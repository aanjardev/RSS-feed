--
-- PostgreSQL database dump
--

\restrict RGoU7a4yuDhweGgNH3R49ZBT6TXL2cY4deME2oFdL4byKCUzoWYo8vevoXcb6s2

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
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: fekusa
--

INSERT INTO public.settings (id, key, value, type, label, description, category, is_public, created_at, updated_at) VALUES (1, 'site_name', 'Tilik Feed', 'string', 'Site Name', 'The name of your website', 'general', true, '2026-01-27 17:55:16.063623', '2026-01-27 17:55:16.063623');
INSERT INTO public.settings (id, key, value, type, label, description, category, is_public, created_at, updated_at) VALUES (2, 'site_description', 'Aggregator RSS Feed Indonesia', 'string', 'Site Description', 'Brief description of your site', 'general', true, '2026-01-27 17:55:16.063623', '2026-01-27 17:55:16.063623');
INSERT INTO public.settings (id, key, value, type, label, description, category, is_public, created_at, updated_at) VALUES (3, 'favicon_url', '/vite.svg', 'file', 'Favicon', 'Site favicon (ICO or PNG, 32x32 recommended)', 'appearance', true, '2026-01-27 17:55:16.063623', '2026-01-27 17:55:16.063623');
INSERT INTO public.settings (id, key, value, type, label, description, category, is_public, created_at, updated_at) VALUES (4, 'logo_url', '', 'file', 'Logo URL', 'Site logo image URL', 'appearance', true, '2026-01-27 17:55:16.063623', '2026-01-27 17:55:16.063623');
INSERT INTO public.settings (id, key, value, type, label, description, category, is_public, created_at, updated_at) VALUES (5, 'primary_color', '#3b82f6', 'string', 'Primary Color', 'Main brand color', 'appearance', true, '2026-01-27 17:55:16.063623', '2026-01-27 17:55:16.063623');
INSERT INTO public.settings (id, key, value, type, label, description, category, is_public, created_at, updated_at) VALUES (6, 'items_per_page', '20', 'number', 'Items Per Page', 'Number of articles per page', 'content', false, '2026-01-27 17:55:16.063623', '2026-01-27 17:55:16.063623');
INSERT INTO public.settings (id, key, value, type, label, description, category, is_public, created_at, updated_at) VALUES (7, 'enable_carousel', 'true', 'boolean', 'Enable Carousel', 'Show featured articles carousel', 'content', true, '2026-01-27 17:55:16.063623', '2026-01-27 17:55:16.063623');
INSERT INTO public.settings (id, key, value, type, label, description, category, is_public, created_at, updated_at) VALUES (8, 'carousel_auto_play', 'true', 'boolean', 'Carousel Auto Play', 'Automatically cycle through carousel items', 'content', true, '2026-01-27 17:55:16.063623', '2026-01-27 17:55:16.063623');
INSERT INTO public.settings (id, key, value, type, label, description, category, is_public, created_at, updated_at) VALUES (9, 'carousel_interval', '5000', 'number', 'Carousel Interval', 'Time between slides (milliseconds)', 'content', true, '2026-01-27 17:55:16.063623', '2026-01-27 17:55:16.063623');
INSERT INTO public.settings (id, key, value, type, label, description, category, is_public, created_at, updated_at) VALUES (10, 'enable_sidebar', 'true', 'boolean', 'Enable Sidebar', 'Show sources sidebar', 'content', true, '2026-01-27 17:55:16.063623', '2026-01-27 17:55:16.063623');
INSERT INTO public.settings (id, key, value, type, label, description, category, is_public, created_at, updated_at) VALUES (11, 'contact_email', '', 'string', 'Contact Email', 'Support email address', 'general', true, '2026-01-27 17:55:16.063623', '2026-01-27 17:55:16.063623');
INSERT INTO public.settings (id, key, value, type, label, description, category, is_public, created_at, updated_at) VALUES (12, 'footer_text', '© 2026 Tilik Feed. All rights reserved.', 'string', 'Footer Text', 'Text displayed in footer', 'general', true, '2026-01-27 17:55:16.063623', '2026-01-27 17:55:16.063623');


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fekusa
--

SELECT pg_catalog.setval('public.settings_id_seq', 12, true);


--
-- PostgreSQL database dump complete
--

\unrestrict RGoU7a4yuDhweGgNH3R49ZBT6TXL2cY4deME2oFdL4byKCUzoWYo8vevoXcb6s2

