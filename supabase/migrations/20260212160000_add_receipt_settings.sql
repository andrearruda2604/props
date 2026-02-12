-- Add receipt settings columns to company_settings table
alter table company_settings 
add column if not exists receipt_term_text text default 'Escopo da Garantia: A garantia cobre exclusivamente a correção de bugs ou falhas de funcionamento dos códigos entregues nesta data.

Solicitações Extra-Garantia: Alterações de lógica, novas funcionalidades ou suporte após o término do prazo acima serão faturados conforme contrato.

Quitação: Este documento serve como recibo de quitação para os valores acima descritos após a confirmação do pagamento.',
add column if not exists receipt_footer_text text default '';
