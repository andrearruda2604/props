-- Create table for receipts
create table if not exists receipts (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null default auth.uid(),
  number text not null,
  
  contractor_name text not null,
  contractor_role text,
  client_id uuid references clients(id), -- Optional link to client
  contractee_name text not null,
  contractee_doc text, -- CNPJ/CPF
  
  items jsonb not null default '[]'::jsonb, -- Array of {name, hours, rate, subtotal}
  total_value numeric not null default 0,
  
  warranty_days integer default 30,
  warranty_end_date date,
  
  payment_date date,
  status text default 'Rascunho' -- Rascunho, Gerado
);

-- Enable RLS
alter table receipts enable row level security;

-- Create policies
create policy "Users can view their own receipts"
  on receipts for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own receipts"
  on receipts for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own receipts"
  on receipts for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own receipts"
  on receipts for delete
  using ( auth.uid() = user_id );
