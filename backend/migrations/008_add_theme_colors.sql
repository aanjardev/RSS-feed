-- Migration: Add theme color settings
-- Created: 2026-01-31

-- Add theme color columns to settings table
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS slider_colors JSONB DEFAULT '[
  "bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500",
  "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500",
  "bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500",
  "bg-gradient-to-br from-blue-400 via-cyan-400 to-sky-500",
  "bg-gradient-to-br from-violet-400 via-fuchsia-400 to-pink-500",
  "bg-gradient-to-br from-amber-400 via-lime-400 to-green-500",
  "bg-gradient-to-br from-red-400 via-rose-400 to-pink-500",
  "bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500",
  "bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500",
  "bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-500",
  "bg-gradient-to-br from-fuchsia-400 via-purple-400 to-violet-500",
  "bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500"
]'::jsonb,
ADD COLUMN IF NOT EXISTS card_colors JSONB DEFAULT '[
  "bg-pink-100",
  "bg-yellow-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-purple-100",
  "bg-orange-100",
  "bg-teal-100",
  "bg-indigo-100",
  "bg-rose-100",
  "bg-lime-100",
  "bg-cyan-100",
  "bg-amber-100",
  "bg-emerald-100",
  "bg-sky-100",
  "bg-violet-100",
  "bg-fuchsia-100",
  "bg-red-100",
  "bg-slate-100",
  "bg-stone-100",
  "bg-zinc-100"
]'::jsonb;

-- Update existing settings row if exists
UPDATE settings 
SET 
  slider_colors = '[
    "bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500",
    "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500",
    "bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500",
    "bg-gradient-to-br from-blue-400 via-cyan-400 to-sky-500",
    "bg-gradient-to-br from-violet-400 via-fuchsia-400 to-pink-500",
    "bg-gradient-to-br from-amber-400 via-lime-400 to-green-500",
    "bg-gradient-to-br from-red-400 via-rose-400 to-pink-500",
    "bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500",
    "bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500",
    "bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-500",
    "bg-gradient-to-br from-fuchsia-400 via-purple-400 to-violet-500",
    "bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500"
  ]'::jsonb,
  card_colors = '[
    "bg-pink-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-purple-100",
    "bg-orange-100",
    "bg-teal-100",
    "bg-indigo-100",
    "bg-rose-100",
    "bg-lime-100",
    "bg-cyan-100",
    "bg-amber-100",
    "bg-emerald-100",
    "bg-sky-100",
    "bg-violet-100",
    "bg-fuchsia-100",
    "bg-red-100",
    "bg-slate-100",
    "bg-stone-100",
    "bg-zinc-100"
  ]'::jsonb
WHERE slider_colors IS NULL OR card_colors IS NULL;
