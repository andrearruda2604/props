-- Add proposal_id column to receipts table
alter table receipts 
add column if not exists proposal_id uuid references proposals(id);

-- Create index for better performance
create index if not exists idx_receipts_proposal_id on receipts(proposal_id);
