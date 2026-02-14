-- Add AI settings columns to company_settings table
alter table company_settings
  add column if not exists ai_api_key text default '',
  add column if not exists ai_model text default 'gemini-2.0-flash',
  add column if not exists ai_prompt text default 'Escreva uma descrição de escopo de projeto comercial profissional, detalhada e persuasiva para um projeto com o título: "{title}". Foque nos entregáveis e valor agregado. Limite a 3 parágrafos.';
