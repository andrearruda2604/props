-- Add missing date columns to receipts table
alter table receipts 
add column if not exists delivery_date date,
add column if not exists warranty_start_date date;
