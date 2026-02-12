export type ProposalStatus = 'Rascunho' | 'Enviado' | 'Aprovado' | 'Rejeitado';

export interface PriceItem {
  id: string;
  name: string;
  description?: string;
  standardPrice: number;
}

export interface ClientPriceOverride {
  priceItemId: string;
  customPrice: number;
}

export interface Client {
  id: string;
  name: string; // Empresa/Nome
  cnpj?: string; // Novo campo
  contactPerson: string; // Responsável
  role: string;
  phone: string;
  website: string;
  email?: string;
  discountRules?: string; // Regras de desconto específicas
  priceOverrides?: ClientPriceOverride[]; // Preços específicos que sobrescrevem o padrão
}

export interface CompanySettings {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  defaultScopeText: string;
  defaultPaymentTerms: string;
  defaultWarranties: string;
  defaultContactName: string;
  defaultContactRole: string;
  defaultContactPhone: string;
  defaultContactWebsite: string;

  // Custom Numbering
  nextProposalSeq: number;
  useDatePrefix: boolean;
}

export interface ReceiptItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
  subtotal: number;
}

export interface ReceiptData {
  id: string;
  createdAt: string;
  number: string;

  contractorName: string;
  contractorRole?: string;
  contractorDoc?: string; // CPF/CNPJ if needed

  clientId?: string;
  contracteeName: string;
  contracteeDoc?: string; // CNPJ

  items: ReceiptItem[];
  totalValue: number;

  deliveryDate?: string;
  warrantyDays: number;
  warrantyStartDate?: string;
  warrantyEndDate?: string;

  extraWarrantyRate: number; // 180 default

  paymentDate?: string;

  location?: string; // Curitiba/PR

  status: 'Rascunho' | 'Emitido';
}

export const INITIAL_RECEIPT: ReceiptData = {
  id: '',
  createdAt: new Date().toISOString(),
  number: '', // Generated
  contractorName: 'André Luis Santos de Arruda',
  contracteeName: '',
  items: [],
  totalValue: 0,
  warrantyDays: 30,
  extraWarrantyRate: 180,
  location: 'Curitiba/PR',
  status: 'Rascunho'
};

export interface TimelineItem {
  id: string;
  title: string;
  days: number;
}

export interface ProposalData {
  id: string; // Unique ID for the system
  status: ProposalStatus;
  createdAt: string;
  revision: number;
  clientId?: string; // Link to client

  // Proposal Content
  number: string;
  title: string;
  description: string;
  effortEstimation: string;
  logoUrl: string;
  coverUrl: string;
  timeline: TimelineItem[];
  value: string;
  paymentTerms: string;
  warranties: string;
  contactName: string;
  contactRole: string;
  contactPhone: string;
  contactWebsite: string;
}

export const INITIAL_DATA: ProposalData = {
  id: '1',
  status: 'Rascunho',
  createdAt: new Date().toISOString(),
  revision: 0,
  number: "N. 2026001",
  title: "Redesign Plataforma E-commerce",
  description: "Descreva os entregáveis e objetivos do projeto. O escopo inclui o redesign completo da interface, otimização da experiência do usuário (UX) e implementação de novas funcionalidades de checkout.",
  effortEstimation: "A estimativa total de esforço para este projeto é de aproximadamente 160 horas técnicas, divididas entre design, desenvolvimento frontend, backend e testes de qualidade.",
  logoUrl: "https://picsum.photos/100/100",
  coverUrl: "",
  timeline: [
    { id: "1", title: "Proposta e Negociação", days: 2 },
    { id: "2", title: "Assinatura de Contrato", days: 5 },
    { id: "3", title: "Reunião de Alinhamento (Kickoff)", days: 1 },
  ],
  value: "12.500,00",
  paymentTerms: "50% entrada + 50% entrega",
  warranties: "O serviço prestado possui garantia de 3 meses para correção de bugs críticos após a entrega final.\n\nO pagamento deverá ser efetuado via transferência bancária ou boleto mediante emissão de Nota Fiscal.",
  contactName: "Carlos Silva",
  contactRole: "Diretor Comercial",
  contactPhone: "(11) 99999-9999",
  contactWebsite: "www.empresa.com.br",
};

export const INITIAL_PRICES: PriceItem[] = [
  { id: '1', name: 'Hora Técnica - Desenvolvimento', standardPrice: 150 },
  { id: '2', name: 'Hora Técnica - Design/UX', standardPrice: 180 },
  { id: '3', name: 'Consultoria (Diária)', standardPrice: 1200 },
  { id: '4', name: 'Setup de Servidor', standardPrice: 800 },
];

export const INITIAL_SETTINGS: CompanySettings = {
  companyName: "Minha Empresa",
  logoUrl: "https://picsum.photos/100/100",
  primaryColor: "#5e3582",
  defaultScopeText: "Descreva os entregáveis e objetivos do projeto aqui.",
  defaultPaymentTerms: "50% na aprovação e 50% na entrega.",
  defaultWarranties: "Garantia de 3 meses contra bugs.",
  defaultContactName: "Seu Nome",
  defaultContactRole: "Gerente",
  defaultContactPhone: "(00) 0000-0000",
  defaultContactWebsite: "www.seusite.com.br",
  nextProposalSeq: 1,
  useDatePrefix: true
};