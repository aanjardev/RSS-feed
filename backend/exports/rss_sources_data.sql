--
-- PostgreSQL database dump
--

\restrict 3b1GF820ZT2T8KW61HaoNyhZOjyCeRr1Q0Jmk03cuRIEDFxStQ4FdJnZt7d47KM

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
-- Data for Name: rss_sources; Type: TABLE DATA; Schema: public; Owner: fekusa
--

INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (27, 'CNN Ekonomi', 'https://www.cnnindonesia.com/ekonomi/rss', 'Business', false, '2026-01-27 13:47:30.747729', '2026-01-27 17:01:37.828207', '/assets/logos/cnn-ekonomi.png', 'CNN Indonesia | Berita Terkini Ekonomi', 2);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (19, 'Detik News', 'https://news.detik.com/berita/rss', 'News', false, '2026-01-27 13:47:30.738573', '2026-01-27 17:01:40.004398', '/assets/logos/detik-news.png', 'Berita - Detikcom', 1);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (12, 'Liputan 6', 'https://feed.liputan6.com/rss/news', 'News', false, '2026-01-27 13:47:30.729701', '2026-01-27 17:01:43.325093', '/assets/logos/liputan-6.jpeg', 'Liputan6.com Politik', 1);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (20, 'Detik Finance', 'https://finance.detik.com/rss', 'Business', false, '2026-01-27 13:47:30.739576', '2026-01-27 17:01:38.942839', '/assets/logos/detik-finance.png', 'Finance - Detikcom', 2);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (17, 'Okezone', 'https://sindikasi.okezone.com/index.php/rss/0/RSS2.0', 'Business', false, '2026-01-27 13:47:30.736252', '2026-01-27 17:01:45.359269', '/assets/logos/okezone.png', 'Sindikasi economy.okezone.com', 2);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (22, 'Kumparan', 'https://lapi.kumparan.com/v2.0/rss/', 'News', false, '2026-01-27 13:47:30.742074', '2026-01-27 17:01:44.163306', '/assets/logos/kumparan.png', 'kumparan - #kumparanAdalahJawaban', 1);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (11, 'Tempo Bisnis', 'https://rss.tempo.co/bisnis', 'Business', false, '2026-01-27 13:47:30.727938', '2026-01-27 17:01:54.373564', '/assets/logos/tempo-bisnis.png', 'Tempo.co Berita Bisnis Terkini Indonesia dan Dunia RSS', 2);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (14, 'CNBC Market', 'https://www.cnbcindonesia.com/market/rss/', 'Business', false, '2026-01-27 13:47:30.732258', '2026-01-27 17:01:28.385325', '/assets/logos/cnbc-market.png', 'Market - Berita Terkini Market, Saham, Reksadana - CNBC Indonesia', 2);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (29, 'Tribunnews Papua', 'https://papua.tribunnews.com/rss', 'News', true, '2026-01-27 17:34:14.345073', '2026-01-27 17:35:06.572758', 'https://rss.fekusadev.com/assets/logos/tribunnews.png', '', NULL);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (30, 'iNews Papua', 'https://papua.inews.id/feed', 'News', true, '2026-01-27 17:36:46.71761', '2026-01-27 17:36:46.71761', 'https://static.inews.co.id/img/iNews@2x.png', NULL, NULL);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (28, 'Antara', 'https://www.antaranews.com/rss/top-news', 'News', false, '2026-01-27 13:47:30.748826', '2026-01-27 17:36:51.969713', '/assets/logos/antara.png', 'Berita Top News - ANTARA News', 1);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (31, 'iNews Jayapura', 'https://jayapura.inews.id/rss', 'News', true, '2026-01-27 17:37:28.304312', '2026-01-27 17:37:28.304312', 'https://static.inews.co.id/img/iNews@2x.png', NULL, NULL);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (32, 'Jubi', 'https://jubi.id/feed/', 'News', true, '2026-01-27 17:38:07.939978', '2026-01-27 17:39:06.696683', 'https://jubi.id/wp-content/uploads/2024/08/logo-24-PTjubi1.png', 'Jujur Bicara', NULL);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (33, 'Antaranews Papua', 'https://papua.antaranews.com/rss/terkini.xml', 'News', true, '2026-01-27 17:40:44.901477', '2026-01-27 17:40:44.901477', 'https://papua.antaranews.com/img/www.antarapapua.com.png', 'Berita Papua', NULL);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (16, 'Republika', 'https://www.republika.co.id/rss', 'News', false, '2026-01-27 13:47:30.735024', '2026-01-27 17:01:46.1862', '/assets/logos/republika.png', 'Republika Online RSS Feed', 1);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (24, 'SindoNews', 'https://www.sindonews.com/feed', 'News', false, '2026-01-27 13:47:30.744482', '2026-01-27 17:01:47.029097', '/assets/logos/sindonews.png', 'Berita Terkini dan Informasi Terbaru Hari Ini - SINDOnews', 1);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (34, 'https://www.papuapos.com/feed/', 'https://www.papuapos.com/feed/', 'News', true, '2026-01-27 17:43:42.459828', '2026-01-27 17:43:42.459828', 'https://www.papuapos.com/wp-content/uploads/2020/10/djoe-logo-papua-pos-1.png', 'Berita & Opini', NULL);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (23, 'Suara Pembaharuan', 'https://www.suarapembaharuan.com/feeds/posts/default', 'News', false, '2026-01-27 13:47:30.743544', '2026-01-27 17:01:47.922611', '/assets/logos/suara-pembaharuan.png', 'Suara Pembaharuan', 1);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (21, 'Viva', 'https://www.viva.co.id/get/all', 'News', false, '2026-01-27 13:47:30.740795', '2026-01-27 17:01:50.073051', '/assets/logos/viva.png', 'VIVA - Berita Harian Terkini, Terpopuler, Terbaru', 1);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (13, 'Tribunnews', 'https://www.tribunnews.com/rss', 'News', false, '2026-01-27 13:47:30.730842', '2026-01-27 17:01:51.097296', '/assets/logos/tribunnews.png', 'Tribunnews.com', 1);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (18, 'Tirto', 'https://tirto.id/sitemap/r/google-discover', 'News', false, '2026-01-27 13:47:30.737413', '2026-01-27 17:01:51.853825', '/assets/logos/tirto.png', 'tirto.id', 1);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (15, 'Tempo Nasional', 'https://rss.tempo.co/nasional', 'News', false, '2026-01-27 13:47:30.73365', '2026-01-27 17:01:52.929791', '/assets/logos/tempo-nasional.png', 'Tempo.co Berita Nasional Terbaru Indonesia Hari Ini RSS', 1);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (35, 'https://tvpapua.com/feed/', 'https://tvpapua.com/feed/', 'News', true, '2026-01-27 17:44:45.338565', '2026-01-27 17:44:45.338565', 'http://tvpapua.com/wp-content/uploads/2017/02/new1TVpapua.png', NULL, NULL);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (26, 'CNN Nasional', 'https://www.cnnindonesia.com/nasional/rss', 'News', false, '2026-01-27 13:47:30.746619', '2026-01-27 17:01:32.900187', '/assets/logos/cnn-nasional.png', 'CNN Indonesia | Berita Terkini Nasional', 1);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (25, 'CNBC News', 'https://www.cnbcindonesia.com/news/rss', 'News', false, '2026-01-27 13:47:30.745448', '2026-01-27 17:01:37.182271', '/assets/logos/cnbc-news.png', 'News - Berita Terkini Indonesia dan Dunia - CNBC Indonesia', 1);
INSERT INTO public.rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES (36, 'https://cenderawasihpos.jawapos.com/feed/', 'https://cenderawasihpos.jawapos.com/feed/', 'News', true, '2026-01-27 17:45:54.153204', '2026-01-27 17:45:54.153204', 'https://static.promediateknologi.id/promedia-2/network/199/desktop/images/logo.png?v=65', NULL, NULL);


--
-- Name: rss_sources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fekusa
--

SELECT pg_catalog.setval('public.rss_sources_id_seq', 36, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 3b1GF820ZT2T8KW61HaoNyhZOjyCeRr1Q0Jmk03cuRIEDFxStQ4FdJnZt7d47KM

