-- EduGuard AI: run this migration in the Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  external_student_id text not null unique,
  name text,
  course text not null,
  module text not null,
  education_level text,
  hours_studied numeric check (hours_studied is null or hours_studied >= 0),
  attendance numeric check (attendance is null or attendance between 0 and 100),
  previous_scores numeric check (previous_scores is null or previous_scores between 0 and 100),
  risk_level text check (risk_level is null or risk_level in ('LOW', 'MEDIUM', 'HIGH')),
  risk_probability numeric check (risk_probability is null or risk_probability between 0 and 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.risk_predictions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  risk_level text not null check (risk_level in ('LOW', 'MEDIUM', 'HIGH')),
  probability numeric not null check (probability between 0 and 1),
  model_version text,
  input_features jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists students_risk_level_idx on public.students(risk_level);
create index if not exists students_course_module_idx on public.students(course, module);
create index if not exists risk_predictions_student_created_idx on public.risk_predictions(student_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists students_set_updated_at on public.students;
create trigger students_set_updated_at before update on public.students for each row execute function public.set_updated_at();

alter table public.students enable row level security;
alter table public.risk_predictions enable row level security;

-- These policies intentionally require Supabase Auth. The prototype's
-- sessionStorage login is not authentication and cannot access these tables.
create policy "authenticated faculty can read students" on public.students for select to authenticated using (true);
create policy "authenticated faculty can update students" on public.students for update to authenticated using (true) with check (true);
create policy "authenticated faculty can read predictions" on public.risk_predictions for select to authenticated using (true);
create policy "authenticated faculty can insert predictions" on public.risk_predictions for insert to authenticated with check (true);
