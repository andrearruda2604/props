import { supabase } from './supabase';
import { Client, ProposalData, PriceItem, CompanySettings } from '../types';

export const ClientService = {
    async getAll() {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Client[];
    },

    async create(client: Omit<Client, 'id'>) {
        const { data, error } = await supabase
            .from('clients')
            .insert(client)
            .select()
            .single();

        if (error) throw error;
        return data as Client;
    },

    async update(id: string, client: Partial<Client>) {
        const { data, error } = await supabase
            .from('clients')
            .update(client)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Client;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

export const ProposalService = {
    async getAll() {
        const { data, error } = await supabase
            .from('proposals')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as ProposalData[];
    },

    async create(proposal: Omit<ProposalData, 'id'>) {
        const { data, error } = await supabase
            .from('proposals')
            .insert(proposal)
            .select()
            .single();

        if (error) throw error;
        return data as ProposalData;
    },

    async update(id: string, proposal: Partial<ProposalData>) {
        const { data, error } = await supabase
            .from('proposals')
            .update(proposal)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as ProposalData;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('proposals')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

export const PriceService = {
    async getAll() {
        const { data, error } = await supabase
            .from('price_items')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as PriceItem[];
    },

    async create(item: Omit<PriceItem, 'id'>) {
        const { data, error } = await supabase
            .from('price_items')
            .insert({
                name: item.name,
                description: item.description,
                standard_price: item.standardPrice // Mapping camelCase to snake_case
            })
            .select()
            .single();

        if (error) throw error;
        return {
            ...data,
            standardPrice: data.standard_price
        } as PriceItem;
    },

    async update(id: string, item: Partial<PriceItem>) {
        const updateData: any = { ...item };
        if (item.standardPrice !== undefined) {
            updateData.standard_price = item.standardPrice;
            delete updateData.standardPrice;
        }

        const { data, error } = await supabase
            .from('price_items')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return {
            ...data,
            standardPrice: data.standard_price
        } as PriceItem;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('price_items')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

export const SettingsService = {
    async get() {
        const { data, error } = await supabase
            .from('company_settings')
            .select('*')
            .single(); // Returns null if no rows found

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Row not found"

        if (!data) return null;

        return {
            companyName: data.company_name,
            logoUrl: data.logo_url,
            primaryColor: data.primary_color,
            defaultScopeText: data.default_scope_text,
            defaultPaymentTerms: data.default_payment_terms,
            defaultWarranties: data.default_warranties,
            defaultContactName: data.default_contact_name,
            defaultContactRole: data.default_contact_role,
            defaultContactPhone: data.default_contact_phone,
            defaultContactWebsite: data.default_contact_website
        } as CompanySettings;
    },

    async save(settings: CompanySettings) {
        // Check if settings exist for user
        const current = await this.get();

        const dbData = {
            company_name: settings.companyName,
            logo_url: settings.logoUrl,
            primary_color: settings.primaryColor,
            default_scope_text: settings.defaultScopeText,
            default_payment_terms: settings.defaultPaymentTerms,
            default_warranties: settings.defaultWarranties,
            default_contact_name: settings.defaultContactName,
            default_contact_role: settings.defaultContactRole,
            default_contact_phone: settings.defaultContactPhone,
            default_contact_website: settings.defaultContactWebsite
        };

        if (current) {
            // Update
            const { data, error } = await supabase
                .from('company_settings')
                .update(dbData)
                .neq('id', '00000000-0000-0000-0000-000000000000') // Dummy condition to update all (RLS restricts to user)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            // Create
            const { data, error } = await supabase
                .from('company_settings')
                .insert(dbData)
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    }
};
