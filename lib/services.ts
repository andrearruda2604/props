import { supabase } from './supabase';
import { Client, ProposalData, PriceItem, CompanySettings } from '../types';

export const ClientService = {
    // Mapper: DB -> Frontend
    mapToClient(row: any): Client {
        return {
            id: row.id,
            name: row.name,
            cnpj: row.cnpj,
            contactPerson: row.contact_person,
            role: row.role,
            phone: row.phone,
            website: row.website,
            email: row.email,
            discountRules: row.discount_rules,
            priceOverrides: row.price_overrides,
        };
    },

    // Mapper: Frontend -> DB
    mapToDb(client: Partial<Client>): any {
        const dbObj: any = {};
        if (client.name !== undefined) dbObj.name = client.name;
        if (client.cnpj !== undefined) dbObj.cnpj = client.cnpj;
        if (client.contactPerson !== undefined) dbObj.contact_person = client.contactPerson;
        if (client.role !== undefined) dbObj.role = client.role;
        if (client.phone !== undefined) dbObj.phone = client.phone;
        if (client.website !== undefined) dbObj.website = client.website;
        if (client.email !== undefined) dbObj.email = client.email;
        if (client.discountRules !== undefined) dbObj.discount_rules = client.discountRules;
        if (client.priceOverrides !== undefined) dbObj.price_overrides = client.priceOverrides;
        return dbObj;
    },

    async getAll() {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(this.mapToClient);
    },

    async create(client: Omit<Client, 'id'>) {
        const dbData = this.mapToDb(client);
        const { data, error } = await supabase
            .from('clients')
            .insert(dbData)
            .select()
            .single();

        if (error) throw error;
        return this.mapToClient(data);
    },

    async update(id: string, client: Partial<Client>) {
        const dbData = this.mapToDb(client);
        const { data, error } = await supabase
            .from('clients')
            .update(dbData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return this.mapToClient(data);
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
    mapToProposal(row: any): ProposalData {
        return {
            id: row.id,
            status: row.status,
            createdAt: row.created_at,
            clientId: row.client_id,
            number: row.number,
            title: row.title,
            description: row.description,
            effortEstimation: row.effort_estimation,
            logoUrl: row.logo_url,
            coverUrl: row.cover_url,
            timeline: row.timeline, // jsonb matches
            value: row.value?.toString() || '', // numeric to string
            paymentTerms: row.payment_terms,
            warranties: row.warranties,
            contactName: row.contact_name,
            contactRole: row.contact_role,
            contactPhone: row.contact_phone,
            contactWebsite: row.contact_website,
        };
    },

    mapToDb(proposal: Partial<ProposalData>): any {
        const dbObj: any = {};
        if (proposal.status !== undefined) dbObj.status = proposal.status;
        // createdAt usually managed by DB, but if frontend sends it and we want to preserve:
        // dbObj.created_at = proposal.createdAt; 
        if (proposal.clientId !== undefined) dbObj.client_id = proposal.clientId;
        if (proposal.number !== undefined) dbObj.number = proposal.number;
        if (proposal.title !== undefined) dbObj.title = proposal.title;
        if (proposal.description !== undefined) dbObj.description = proposal.description;
        if (proposal.effortEstimation !== undefined) dbObj.effort_estimation = proposal.effortEstimation;
        if (proposal.logoUrl !== undefined) dbObj.logo_url = proposal.logoUrl;
        if (proposal.coverUrl !== undefined) dbObj.cover_url = proposal.coverUrl;
        if (proposal.timeline !== undefined) dbObj.timeline = proposal.timeline;
        if (proposal.value !== undefined) dbObj.value = parseFloat(proposal.value.replace(/[^\d.-]/g, '')) || 0; // cleanup string for numeric
        if (proposal.paymentTerms !== undefined) dbObj.payment_terms = proposal.paymentTerms;
        if (proposal.warranties !== undefined) dbObj.warranties = proposal.warranties;
        if (proposal.contactName !== undefined) dbObj.contact_name = proposal.contactName;
        if (proposal.contactRole !== undefined) dbObj.contact_role = proposal.contactRole;
        if (proposal.contactPhone !== undefined) dbObj.contact_phone = proposal.contactPhone;
        if (proposal.contactWebsite !== undefined) dbObj.contact_website = proposal.contactWebsite;
        return dbObj;
    },

    async getAll() {
        const { data, error } = await supabase
            .from('proposals')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(this.mapToProposal);
    },

    async create(proposal: Omit<ProposalData, 'id'>) {
        const dbData = this.mapToDb(proposal);
        // Ensure status default if missing
        if (!dbData.status) dbData.status = 'Rascunho';

        const { data, error } = await supabase
            .from('proposals')
            .insert(dbData)
            .select()
            .single();

        if (error) throw error;
        return this.mapToProposal(data);
    },

    async update(id: string, proposal: Partial<ProposalData>) {
        const dbData = this.mapToDb(proposal);
        const { data, error } = await supabase
            .from('proposals')
            .update(dbData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return this.mapToProposal(data);
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
    mapToPrice(row: any): PriceItem {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            standardPrice: row.standard_price
        };
    },

    async getAll() {
        const { data, error } = await supabase
            .from('price_items')
            .select('*')
            .order('name');

        if (error) throw error;
        return (data || []).map(this.mapToPrice);
    },

    async create(item: Omit<PriceItem, 'id'>) {
        const { data, error } = await supabase
            .from('price_items')
            .insert({
                name: item.name,
                description: item.description,
                standard_price: item.standardPrice
            })
            .select()
            .single();

        if (error) throw error;
        return this.mapToPrice(data);
    },

    async update(id: string, item: Partial<PriceItem>) {
        const updateData: any = {};
        if (item.name !== undefined) updateData.name = item.name;
        if (item.description !== undefined) updateData.description = item.description;
        if (item.standardPrice !== undefined) updateData.standard_price = item.standardPrice;

        const { data, error } = await supabase
            .from('price_items')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return this.mapToPrice(data);
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
            .maybeSingle();

        if (error) throw error;
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
            const { data, error } = await supabase
                .from('company_settings')
                .update(dbData)
                .neq('id', '00000000-0000-0000-0000-000000000000') // Updating all matching RLS
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
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
