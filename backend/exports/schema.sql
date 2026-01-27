--
-- PostgreSQL database dump
--

\restrict NZWTn6sh9NuFVflncfgM3lpmop6veYOxDh8A1CHbirwHWx3j8i1PDXURpjzjRi4

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: fekusa
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    icon character varying(50),
    color character varying(20),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO fekusa;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: fekusa
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO fekusa;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fekusa
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: rss_articles; Type: TABLE; Schema: public; Owner: fekusa
--

CREATE TABLE public.rss_articles (
    id integer NOT NULL,
    source_id integer,
    title text NOT NULL,
    link text NOT NULL,
    description text,
    pub_date timestamp without time zone,
    content text,
    image_url text,
    author character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rss_articles OWNER TO fekusa;

--
-- Name: rss_articles_id_seq; Type: SEQUENCE; Schema: public; Owner: fekusa
--

CREATE SEQUENCE public.rss_articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rss_articles_id_seq OWNER TO fekusa;

--
-- Name: rss_articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fekusa
--

ALTER SEQUENCE public.rss_articles_id_seq OWNED BY public.rss_articles.id;


--
-- Name: rss_sources; Type: TABLE; Schema: public; Owner: fekusa
--

CREATE TABLE public.rss_sources (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    url text NOT NULL,
    category character varying(100),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    logo text,
    description text,
    category_id integer
);


ALTER TABLE public.rss_sources OWNER TO fekusa;

--
-- Name: rss_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: fekusa
--

CREATE SEQUENCE public.rss_sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rss_sources_id_seq OWNER TO fekusa;

--
-- Name: rss_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fekusa
--

ALTER SEQUENCE public.rss_sources_id_seq OWNED BY public.rss_sources.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: fekusa
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    key character varying(100) NOT NULL,
    value text,
    type character varying(50) DEFAULT 'string'::character varying,
    label character varying(255),
    description text,
    category character varying(100) DEFAULT 'general'::character varying,
    is_public boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.settings OWNER TO fekusa;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: fekusa
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.settings_id_seq OWNER TO fekusa;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fekusa
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: rss_articles id; Type: DEFAULT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.rss_articles ALTER COLUMN id SET DEFAULT nextval('public.rss_articles_id_seq'::regclass);


--
-- Name: rss_sources id; Type: DEFAULT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.rss_sources ALTER COLUMN id SET DEFAULT nextval('public.rss_sources_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: rss_articles rss_articles_link_key; Type: CONSTRAINT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.rss_articles
    ADD CONSTRAINT rss_articles_link_key UNIQUE (link);


--
-- Name: rss_articles rss_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.rss_articles
    ADD CONSTRAINT rss_articles_pkey PRIMARY KEY (id);


--
-- Name: rss_sources rss_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.rss_sources
    ADD CONSTRAINT rss_sources_pkey PRIMARY KEY (id);


--
-- Name: rss_sources rss_sources_url_key; Type: CONSTRAINT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.rss_sources
    ADD CONSTRAINT rss_sources_url_key UNIQUE (url);


--
-- Name: settings settings_key_key; Type: CONSTRAINT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_key_key UNIQUE (key);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: idx_articles_pub_date; Type: INDEX; Schema: public; Owner: fekusa
--

CREATE INDEX idx_articles_pub_date ON public.rss_articles USING btree (pub_date DESC);


--
-- Name: idx_articles_source_id; Type: INDEX; Schema: public; Owner: fekusa
--

CREATE INDEX idx_articles_source_id ON public.rss_articles USING btree (source_id);


--
-- Name: idx_settings_category; Type: INDEX; Schema: public; Owner: fekusa
--

CREATE INDEX idx_settings_category ON public.settings USING btree (category);


--
-- Name: idx_settings_key; Type: INDEX; Schema: public; Owner: fekusa
--

CREATE INDEX idx_settings_key ON public.settings USING btree (key);


--
-- Name: idx_settings_public; Type: INDEX; Schema: public; Owner: fekusa
--

CREATE INDEX idx_settings_public ON public.settings USING btree (is_public);


--
-- Name: idx_sources_active; Type: INDEX; Schema: public; Owner: fekusa
--

CREATE INDEX idx_sources_active ON public.rss_sources USING btree (is_active);


--
-- Name: rss_articles rss_articles_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.rss_articles
    ADD CONSTRAINT rss_articles_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.rss_sources(id) ON DELETE CASCADE;


--
-- Name: rss_sources rss_sources_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fekusa
--

ALTER TABLE ONLY public.rss_sources
    ADD CONSTRAINT rss_sources_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict NZWTn6sh9NuFVflncfgM3lpmop6veYOxDh8A1CHbirwHWx3j8i1PDXURpjzjRi4

