-- Survey config (singleton — admin toggles)
create table if not exists survey_config (
  id               uuid default gen_random_uuid() primary key,
  is_enabled       boolean not null default false,
  custom_link_url  text,
  custom_link_label text,
  show_qr_code     boolean not null default true,
  updated_by       uuid references users(id),
  updated_at       timestamptz not null default now()
);

-- Survey responses
create table if not exists survey_responses (
  id                uuid default gen_random_uuid() primary key,
  name              text not null,
  email             text,
  experience_type   text not null,
  experience_level  text not null,
  experience_value  real not null,
  answers           jsonb not null default '{}',
  awareness_score   integer not null default 0,
  created_at        timestamptz not null default now()
);

create index if not exists survey_responses_created_idx
  on survey_responses (created_at);

-- RLS policies
alter table survey_config enable row level security;
alter table survey_responses enable row level security;

-- Anyone can read survey_config (needed for the header button visibility)
create policy "survey_config_select_all"
  on survey_config for select
  using (true);

-- Only admins can modify survey_config
create policy "survey_config_admin_all"
  on survey_config for all
  using (
    exists (
      select 1 from users
      where users.id = auth.uid()
        and users.role in ('moderator', 'admin', 'superadmin')
    )
  );

-- Anyone can insert survey responses (public form, no auth required)
create policy "survey_responses_insert_anon"
  on survey_responses for insert
  with check (true);

-- Only admins/moderators can read survey responses
create policy "survey_responses_select_admin"
  on survey_responses for select
  using (
    exists (
      select 1 from users
      where users.id = auth.uid()
        and users.role in ('moderator', 'admin', 'superadmin')
    )
  );

-- Seed a default config row (survey disabled by default)
insert into survey_config (id, is_enabled, show_qr_code)
values ('00000000-0000-0000-0000-000000000001', false, true)
on conflict (id) do nothing;
