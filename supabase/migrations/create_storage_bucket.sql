-- Create a new storage bucket for company assets if it doesn't exist
insert into storage.buckets (id, name, public)
values ('company-assets', 'company-assets', true)
on conflict (id) do nothing;

-- Drop existing policies to avoid conflicts when recreating
drop policy if exists "Authenticated users can upload company assets" on storage.objects;
drop policy if exists "Public access to company assets" on storage.objects;
drop policy if exists "Authenticated users can update company assets" on storage.objects;
drop policy if exists "Authenticated users can delete company assets" on storage.objects;

-- Policy: Allow authenticated users to upload files
create policy "Authenticated users can upload company assets"
on storage.objects for insert
with check (
  bucket_id = 'company-assets' and
  auth.role() = 'authenticated'
);

-- Policy: Allow public access to view files (since it's a public bucket)
create policy "Public access to company assets"
on storage.objects for select
using ( bucket_id = 'company-assets' );

-- Policy: Allow users to update/delete their own files
create policy "Authenticated users can update company assets"
on storage.objects for update
using ( bucket_id = 'company-assets' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete company assets"
on storage.objects for delete
using ( bucket_id = 'company-assets' and auth.role() = 'authenticated' );
