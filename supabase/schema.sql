-- Supabase schema for Travel with Kabir
-- Run this in the Supabase SQL Editor

-- Optional: ensure pgcrypto is available for gen_random_uuid()
-- (Usually enabled by default in Supabase)
-- create extension if not exists "pgcrypto";

-- ===============
-- Tables
-- ===============

create table if not exists public.places (
  id text primary key,
  name text not null,
  short_description text,
  charges text,
  duration text,
  traveling_allowance text,
  routes text[],
  facilities text[],
  thumbnail_url text,
  is_active boolean not null default true,
  sort_order int,
  created_at timestamptz not null default now()
);

create index if not exists places_is_active_idx on public.places (is_active);
create index if not exists places_sort_order_idx on public.places (sort_order nulls last);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  place_id text references public.places(id) on delete set null,
  full_name text not null,
  phone text not null,
  email text,
  seats int not null check (seats > 0),
  start_date date not null,
  status text not null default 'pending', -- pending | confirmed | cancelled
  notes text
);

create index if not exists bookings_place_id_idx on public.bookings (place_id);
create index if not exists bookings_start_date_idx on public.bookings (start_date);
create index if not exists bookings_created_at_idx on public.bookings (created_at);
create index if not exists bookings_status_idx on public.bookings (status);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  review text,
  rating int check (rating between 1 and 5),
  image_url text,   -- full public URL if you use public bucket URLs
  image_path text,  -- storage path like 'reviews/abc.jpg' if you prefer storage paths
  is_published boolean not null default true
);

create index if not exists reviews_published_created_idx on public.reviews (is_published, created_at desc);

-- ===============
-- Row Level Security (RLS)
-- ===============

alter table public.places enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;

-- Places: public read, no public writes
drop policy if exists "Public can read places" on public.places;
create policy "Public can read places" on public.places
  for select
  using (true);

-- Bookings: allow anyone (anon) to create bookings; restrict reading to authenticated users
drop policy if exists "Anyone can create bookings" on public.bookings;
create policy "Anyone can create bookings" on public.bookings
  for insert
  to anon
  with check (true);

drop policy if exists "Authenticated can read bookings" on public.bookings;
create policy "Authenticated can read bookings" on public.bookings
  for select
  to authenticated
  using (true);

drop policy if exists "Public can read bookings" on public.bookings;
create policy "Public can read bookings" on public.bookings
  for select
  to anon
  using (true);

-- Reviews: public can read published reviews; only authenticated can write
drop policy if exists "Public can read published reviews" on public.reviews;
create policy "Public can read published reviews" on public.reviews
  for select
  using (is_published);

drop policy if exists "Authenticated can insert reviews" on public.reviews;
create policy "Authenticated can insert reviews" on public.reviews
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update reviews" on public.reviews;
create policy "Authenticated can update reviews" on public.reviews
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete reviews" on public.reviews;
create policy "Authenticated can delete reviews" on public.reviews
  for delete
  to authenticated
  using (true);

-- ===============
-- ===============
insert into storage.buckets (id, name, public)
values ('reviews', 'reviews', true)
on conflict (id) do nothing;

-- Storage RLS: public can read objects in 'reviews'; only authenticated can write
drop policy if exists "Public can view review images" on storage.objects;
create policy "Public can view review images" on storage.objects
  for select
  using (bucket_id = 'reviews');

drop policy if exists "Authenticated can upload review images" on storage.objects;
create policy "Authenticated can upload review images" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'reviews');

drop policy if exists "Authenticated can update review images" on storage.objects;
create policy "Authenticated can update review images" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'reviews')
  with check (bucket_id = 'reviews');

drop policy if exists "Authenticated can delete review images" on storage.objects;
create policy "Authenticated can delete review images" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'reviews');

-- ===============
-- Seed examples (optional): Uncomment to insert a few places
-- ===============
-- insert into public.places (id, name, short_description, charges, duration, traveling_allowance, routes, facilities, thumbnail_url, sort_order)
-- values
-- ('hunza', 'Hunza', 'Karimabad, Attabad Lake, and Passu Cones with breathtaking vistas.', 'PKR 35,000 per person', '5D/4N', 'Included', '{Islamabad,"Naran/Kaghan",Chilas,Gilgit,Hunza}', '{Transport,Hotel,Breakfast,Guide}', null, 10),
-- ('skardu', 'Skardu', 'Deosai Plains, Shangrila Resort, and Upper Kachura Lake.', 'PKR 40,000 per person', '5D/4N', 'Included', '{Islamabad,"Babusar Top (seasonal)",Chilas,Skardu}', '{Transport,Hotel,Breakfast,Guide}', null, 20);
