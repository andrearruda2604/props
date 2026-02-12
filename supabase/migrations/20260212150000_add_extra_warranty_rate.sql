-- Add extra_warranty_rate column to receipts table
alter table receipts 
add column if not exists extra_warranty_rate numeric default 180;
