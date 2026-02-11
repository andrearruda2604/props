-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Clients Table
create table clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  cnpj text,
  contact_person text,
  role text,
  phone text,
  website text,
  email text,
  discount_rules text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Price Items Table
create table price_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  description text,
  standard_price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Proposals Table
create table proposals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null default auth.uid(),
  client_id uuid references clients(id),
  status text check (status in ('Rascunho', 'Enviado', 'Aprovado', 'Rejeitado')) default 'Rascunho',
  number text,
  title text,
  description text,
  effort_estimation text,
  logo_url text,
  cover_url text,
  value numeric, -- Stored as numeric, handle formatting in frontend
  payment_terms text,
  warranties text,
  contact_name text,
  contact_role text,
  contact_phone text,
  contact_website text,
  timeline jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Company Settings Table
create table company_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null default auth.uid(),
  company_name text,
  logo_url text,
  primary_color text,
  default_scope_text text,
  default_payment_terms text,
  default_warranties text,
  default_contact_name text,
  default_contact_role text,
  default_contact_phone text,
  default_contact_website text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Row Level Security (RLS)
alter table clients enable row level security;
alter table price_items enable row level security;
alter table proposals enable row level security;
alter table company_settings enable row level security;

-- RLS Policies (Allow access to own data)
create policy "Users can view their own clients" on clients for select using (auth.uid() = user_id);
create policy "Users can insert their own clients" on clients for insert with check (auth.uid() = user_id);
create policy "Users can update their own clients" on clients for update using (auth.uid() = user_id);
create policy "Users can delete their own clients" on clients for delete using (auth.uid() = user_id);

create policy "Users can view their own price items" on price_items for select using (auth.uid() = user_id);
create policy "Users can insert their own price items" on price_items for insert with check (auth.uid() = user_id);
create policy "Users can update their own price items" on price_items for update using (auth.uid() = user_id);
create policy "Users can delete their own price items" on price_items for delete using (auth.uid() = user_id);

create policy "Users can view their own proposals" on proposals for select using (auth.uid() = user_id);
create policy "Users can insert their own proposals" on proposals for insert with check (auth.uid() = user_id);
create policy "Users can update their own proposals" on proposals for update using (auth.uid() = user_id);
create policy "Users can delete their own proposals" on proposals for delete using (auth.uid() = user_id);

create policy "Users can view their own settings" on company_settings for select using (auth.uid() = user_id);
create policy "Users can insert their own settings" on company_settings for insert with check (auth.uid() = user_id);
create policy "Users can update their own settings" on company_settings for update using (auth.uid() = user_id);
create policy "Users can delete their own settings" on company_settings for delete using (auth.uid() = user_id);

-- Storage (Optional - if you want to use Supabase Storage for buckets, enable manually)
