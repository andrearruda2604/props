-- Add price_overrides column to clients table
alter table clients add column price_overrides jsonb default '[]'::jsonb;

-- Comment on column
comment on column clients.price_overrides is 'List of custom prices for specific items overrides: [{priceItemId: uuid, customPrice: number}]';
