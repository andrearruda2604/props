-- Add revision column to proposals
alter table proposals add column revision integer default 0;

-- Function to generate the next proposal number
-- Format: N. YYYYNNN (e.g. N. 2024001)
create or replace function generate_proposal_number()
returns text
language plpgsql
as $$
declare
  current_year text;
  next_seq integer;
  new_number text;
begin
  current_year := to_char(now(), 'YYYY');
  
  -- Count existing proposals for the current year (excluding revisions, strictly speaking mostly distinct numbers)
  -- Or simpler: just count all proposals starting with "N. YYYY" and add 1.
  -- To make it robust against deletions, we should ideally use a sequence, but counting is "okay" for this scope if we want strictly sequential user-visible numbers.
  -- A better approach for "N. YYYYXXX":
  
  select count(*) + 1 into next_seq
  from proposals
  where number like 'N. ' || current_year || '%'
  and revision = 0; -- Only count original proposals to determine the next "ID" sequence? 
  -- Actually, if we have revisions, they typically share the same number.
  -- So we should count *distinct* numbers.
  
  select count(distinct number) + 1 into next_seq
  from proposals
  where number like 'N. ' || current_year || '%';

  new_number := 'N. ' || current_year || lpad(next_seq::text, 3, '0');
  
  return new_number;
end;
$$;
