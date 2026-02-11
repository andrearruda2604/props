-- Create a new storage bucket for company assets
insert into storage.buckets (id, name, public)
values ('company-assets', 'company-assets', true);

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

-- Policy: Allow users to update/delete their own files (optional, but good practice)
-- For simplicity, we'll allow authenticated users to update/delete for now, or refine based on user_id path
create policy "Authenticated users can update company assets"
on storage.objects for update
using ( bucket_id = 'company-assets' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete company assets"
on storage.objects for delete
using ( bucket_id = 'company-assets' and auth.role() = 'authenticated' );
