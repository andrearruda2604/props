-- Add numbering settings to company_settings
alter table company_settings add column next_proposal_seq integer default 1;
alter table company_settings add column use_date_prefix boolean default true;

-- Update the generation function to use these settings
create or replace function generate_proposal_number()
returns text
language plpgsql
as $$
declare
  settings record;
  new_number text;
  year_month text;
  seq_str text;
begin
  -- Get settings (assuming single row or taking the first one if multiple, though RLS usually limits to 1)
  -- For safety, we can order by created_at or id.
  select * into settings from company_settings limit 1;
  
  -- If no settings found, fallback to old logic or default
  if not found then
     return 'N. ' || to_char(now(), 'YYYY') || lpad((floor(random() * 1000)::text), 3, '0');
  end if;

  -- Prepare parts
  if settings.use_date_prefix then
    year_month := to_char(now(), 'YYYYMM');
  else
    year_month := '';
  end if;
  
  seq_str := lpad(settings.next_proposal_seq::text, 4, '0');
  
  new_number := year_month || seq_str;
  
  -- Increment sequence for next time
  update company_settings
  set next_proposal_seq = next_proposal_seq + 1
  where id = settings.id;
  
  return new_number;
end;
$$;
