# Receipt Management Module Walkthrough

I have implemented the new Receipt Management Module ("Gestão de Recibos"). This module allows you to create, manage, and print service receipts following the strict format provided.

## Changes Implemented

### 1. Database
- **New Table**: `receipts` created to store receipt data.
- **New Column**: `proposal_id` added to link receipts to proposals.
- **New Column**: `extra_warranty_rate` added for warranty calculations.
- **RLS**: Policies added to ensure users only access their own receipts.
- **Migration Files**: 
    - `supabase/migrations/20260212140000_add_receipts_table.sql`
    - `supabase/migrations/20260212143000_add_proposal_id_to_receipts.sql`
    - `supabase/migrations/20260212150000_add_extra_warranty_rate.sql`

> [!IMPORTANT]
> You must run the SQL migrations in your Supabase project's SQL Editor for the module to work.

### 2. User Interface
- **Receipt Manager**: A new dashboard view to list, search, and manage receipts.
- **Receipt Editor**: A comprehensive form to create and edit receipts, including:
    - **Flexible Time Input**: Support for "90 min", "1h 30m", "1:30" formats.
    - **Proposal Linking**: Select a proposal to link and reference in the receipt.
    - **Auto Dates**: Warranty dates are automatically calculated based on delivery date.
    - Automatic total calculation.
    - Dynamic item list management.
    - Client selection (integrated with existing clients).
- **Receipt Preview**: A print-optimized view matching your specific text format.
    - Displays "Ref. Proposta: ..." if a proposal is linked.

### 3. Application Integration
- **Sidebar**: Added "Recibos" menu item.
- **App Logic**: Integrated routing and state management for the new module.

## Verification

### Automated Checks
- **Type Check**: Passed (`npx tsc --noEmit`)
- **Build**: Passed (`npm run build`)

### Manual Verification Steps
1.  **Run Database Migrations**: 
    - Execute `supabase/migrations/20260212140000_add_receipts_table.sql`
    - Execute `supabase/migrations/20260212143000_add_proposal_id_to_receipts.sql`
    - Execute `supabase/migrations/20260212150000_add_extra_warranty_rate.sql`
    - **New**: Execute `supabase/migrations/20260212153000_add_missing_date_columns.sql`
2.  **Start App**: Run `npm run dev`.
3.  **Navigate**: Click "Recibos" in the sidebar.
4.  **Create Receipt**:
    - Click "Novo Recibo".
    - **New Input**: Try typing "1h 30m" or "90 min" in the "Tempo/Esforço" field and verify it converts to decimal hours (1.5).
    - Select a "Proposta Referência" and verify it's linked.
    - Set "Data de Entrega" and verify "Início da Garantia" and "Término da Garantia" are auto-calculated.
    - Fill in other details and save.
5.  **Print/Preview**:
    - Click the printer icon on the receipt in the list.
    - **Verify**: Dates are displayed correctly (DD/MM/YYYY).
    - **Verify**: The "Infraestrutura" paragraph is removed from the "Termos" section.
    - Verify the text matches your requirements exactly, including the proposal reference.
    - Try "Imprimir" (or Ctrl+P) to see the print layout.

## Technical Verification
- **Architecture**: `ReceiptData` type matches the DB schema and UI form.
- **Type Safety**: Ran `tsc --noEmit` and confirmed no errors were introduced.
- **Build**: Ran `npm run build` and confirmed the project builds successfully for production.
