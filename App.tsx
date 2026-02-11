import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ProposalData, INITIAL_DATA, Client, ProposalStatus, PriceItem, INITIAL_PRICES, CompanySettings, INITIAL_SETTINGS } from './types';
import TimelineEditor from './components/TimelineEditor';
import PreviewModal from './components/PreviewModal';
import Sidebar from './components/Sidebar';
import ClientManager from './components/ClientManager';
import Dashboard from './components/Dashboard';
import PriceManager from './components/PriceManager';
import SettingsManager from './components/SettingsManager';
import {
  ArrowLeft,
  Eye,
  FileText,
  Layout,
  DollarSign,
  CreditCard,
  UserSquare2,
  Link as LinkIcon,
  Image as ImageIcon,
  Save,
  Sparkles,
  Timer,
  ShieldCheck,
  Loader2,
  Users,
  LogOut
} from 'lucide-react';
import Auth from './components/Auth';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { ClientService, ProposalService, PriceService, SettingsService } from './lib/services';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth />;
  }


  // Navigation State
  const [currentView, setCurrentView] = useState<'dashboard' | 'clients' | 'editor' | 'prices' | 'settings'>('dashboard');

  // Data State
  const [clients, setClients] = useState<Client[]>([]);
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [priceList, setPriceList] = useState<PriceItem[]>([]);
  const [settings, setSettings] = useState<CompanySettings>(INITIAL_SETTINGS);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch Data on Session Change
  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        setLoadingData(true);
        try {
          const [clientsData, proposalsData, pricesData, settingsData] = await Promise.all([
            ClientService.getAll(),
            ProposalService.getAll(),
            PriceService.getAll(),
            SettingsService.get()
          ]);

          setClients(clientsData);
          setProposals(proposalsData);
          setPriceList(pricesData);
          if (settingsData) setSettings(settingsData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [session]);

  // Editor State
  const [editorData, setEditorData] = useState<ProposalData>(INITIAL_DATA);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  // Helper: Get next proposal number
  const getNextProposalNumber = () => {
    const year = new Date().getFullYear();
    const count = proposals.length + 1;
    return `N. ${year}${String(count).padStart(3, '0')}`;
  };

  // Actions
  const handleNavigate = (view: 'dashboard' | 'clients' | 'editor' | 'prices' | 'settings') => {
    if (view === 'editor') {
      // Check if we are editing an existing proposal or creating a new one
      // If navigating directly to 'editor' via menu, implies new proposal.
      // Reset editor for new proposal with company defaults
      setEditorData({
        ...INITIAL_DATA,
        id: '', // Empty ID indicates new proposal
        createdAt: new Date().toISOString(),
        status: 'Rascunho',
        number: getNextProposalNumber(),
        // Apply company defaults
        logoUrl: settings.logoUrl,
        description: settings.defaultScopeText,
        paymentTerms: settings.defaultPaymentTerms,
        warranties: settings.defaultWarranties,
        contactName: settings.defaultContactName,
        contactRole: settings.defaultContactRole,
        contactPhone: settings.defaultContactPhone,
        contactWebsite: settings.defaultContactWebsite
      });
    }
    setCurrentView(view);
  };

  const handleEditProposal = (proposal: ProposalData) => {
    setEditorData(proposal);
    setCurrentView('editor');
  };

  const handleSaveProposal = async () => {
    try {
      if (editorData.createdAt === INITIAL_DATA.createdAt && !editorData.id) {
        // Should not happen as we set ID in handleNavigate
      }

      const exists = proposals.find(p => p.id === editorData.id);

      let savedProposal: ProposalData;

      // Preparing data for DB (removing id for create if needed, but we generate UUIDs in frontend or DB?
      // The service expects Omit<ProposalData, 'id'> for create, but we generated a random ID in handleNavigate.
      // We should probably let Supabase generate IDs or use UUIDs.
      // For now, let's assume we use the ID we generated if it's a valid UUID, but Math.random is not.
      // Let's rely on Service to handle ID generation or use a UUID library.
      // Since I don't have uuid lib installed, I will change the logic to NOT generate ID in handleNavigate
      // and let the backend generate it, OR I will continue to use the ID if we strictly use UUIDs.
      // The SQL uses `default uuid_generate_v4()`.

      // FIX: handleNavigate sets a random ID. This will fail UUID validation in Postgres.
      // I should update handleNavigate to NOT set ID or set null/undefined.

      const proposalToSave = { ...editorData };

      if (exists) {
        await ProposalService.update(editorData.id, proposalToSave);
        savedProposal = editorData; // Optimistic update or use return from service
      } else {
        // It's a new proposal. The ID 'random...' is invalid.
        // We need to remove ID and let Supabase generate it.
        const { id, ...newProposal } = proposalToSave;
        const created = await ProposalService.create(newProposal);
        savedProposal = created;
      }

      setProposals(prev => {
        if (exists) {
          return prev.map(p => p.id === savedProposal.id ? savedProposal : p);
        }
        return [savedProposal, ...prev];
      });

      // Return to dashboard after save
      setCurrentView('dashboard');
    } catch (error) {
      console.error("Error saving proposal:", error);
      alert("Erro ao salvar proposta.");
    }
  };

  const handleDeleteProposal = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta proposta?')) {
      try {
        await ProposalService.delete(id);
        setProposals(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting proposal:", error);
        alert("Erro ao excluir proposta.");
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: ProposalStatus) => {
    try {
      await ProposalService.update(id, { status });
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSelectClient = (client: Client) => {
    setEditorData(prev => ({
      ...prev,
      clientId: client.id,
      contactName: client.contactPerson,
      contactRole: client.role,
      contactPhone: client.phone,
      contactWebsite: client.website,
      // Optional: auto-set title based on client
      title: prev.title === INITIAL_DATA.title ? `Projeto para ${client.name}` : prev.title
    }));
    setIsClientModalOpen(false);
  };

  const updateEditorField = (field: keyof ProposalData, value: any) => {
    setEditorData((prev) => ({ ...prev, [field]: value }));
  };

  const generateScopeWithAI = async () => {
    if (!process.env.API_KEY) {
      alert("API Key não configurada.");
      return;
    }
    if (!editorData.title) {
      alert("Por favor, preencha o título do projeto antes de gerar o escopo.");
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Escreva uma descrição de escopo de projeto comercial profissional, detalhada e persuasiva para um projeto com o título: "${editorData.title}". Foque nos entregáveis e valor agregado. Limite a 3 parágrafos.`,
      });

      if (response.text) {
        updateEditorField('description', response.text);
      }
    } catch (error) {
      console.error("Erro ao gerar escopo:", error);
      alert("Erro ao gerar o escopo com IA. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    // Inject dynamic CSS variable for primary color
    <div
      className="flex flex-col md:flex-row min-h-screen bg-background-light"
      style={{ '--color-primary': settings.primaryColor } as React.CSSProperties}
    >
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <div className="flex-1 overflow-x-hidden">
        {currentView === 'clients' && (
          <ClientManager
            clients={clients}
            priceList={priceList}
            onAddClient={async (c) => {
              try {
                const { id, ...newClient } = c;
                const created = await ClientService.create(newClient);
                setClients([...clients, created]);
              } catch (e) { console.error(e); alert('Erro ao criar cliente'); }
            }}
            onUpdateClient={async (c) => {
              try {
                const updated = await ClientService.update(c.id, c);
                setClients(clients.map(client => client.id === c.id ? updated : client));
              } catch (e) { console.error(e); alert('Erro ao atualizar cliente'); }
            }}
            onDeleteClient={async (id) => {
              try {
                await ClientService.delete(id);
                setClients(clients.filter(c => c.id !== id));
              } catch (e) { console.error(e); alert('Erro ao excluir cliente'); }
            }}
          />
        )}

        {currentView === 'prices' && (
          <PriceManager
            items={priceList}
            onAdd={async (item) => {
              try {
                const { id, ...newItem } = item;
                const created = await PriceService.create(newItem);
                setPriceList([...priceList, created]);
              } catch (e) { console.error(e); alert('Erro ao criar item de preço'); }
            }}
            onUpdate={async (item) => {
              try {
                const updated = await PriceService.update(item.id, item);
                setPriceList(priceList.map(i => i.id === item.id ? updated : i));
              } catch (e) { console.error(e); alert('Erro ao atualizar item de preço'); }
            }}
            onDelete={async (id) => {
              try {
                await PriceService.delete(id);
                setPriceList(priceList.filter(i => i.id !== id));
              } catch (e) { console.error(e); alert('Erro ao excluir item de preço'); }
            }}
          />
        )}

        {currentView === 'settings' && (
          <SettingsManager
            settings={settings}
            onSave={async (newSettings) => {
              try {
                await SettingsService.save(newSettings);
                setSettings(newSettings);

                const fresh = await SettingsService.get();
                if (fresh) setSettings(fresh);

                alert('Configurações salvas!');
              } catch (e) { console.error(e); alert('Erro ao salvar configurações'); }
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            proposals={proposals}
            onEdit={handleEditProposal}
            onDelete={handleDeleteProposal}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {currentView === 'editor' && (
          <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light pb-32">
            {/* Editor Header */}
            <header className="sticky top-0 z-40 flex items-center bg-white border-b border-primary/10 p-4 justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="text-primary flex size-10 items-center justify-center rounded-full hover:bg-primary/10 cursor-pointer transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h2 className="text-[#151316] text-lg font-bold leading-tight">
                    {proposals.find(p => p.id === editorData.id) ? 'Editar Proposta' : 'Nova Proposta'}
                  </h2>
                  <p className="text-xs text-gray-500">{editorData.number}</p>
                </div>

              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreview(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors text-sm"
                >
                  <Eye size={18} />
                  Visualizar PDF
                </button>
              </div>
            </header>

            <main className="max-w-4xl mx-auto w-full p-4 md:p-6 space-y-6">
              {/* Basic Info Section */}
              <section className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="text-primary w-6 h-6" />
                    <h3 className="text-[#151316] text-lg font-bold">Informações Básicas</h3>
                  </div>
                  <button
                    onClick={() => setIsClientModalOpen(true)}
                    className="flex items-center gap-2 text-sm text-primary font-bold hover:underline"
                  >
                    <Users size={16} />
                    Importar Cliente
                  </button>
                </div>

                {/* Client Selection Modal Overlay */}
                {isClientModalOpen && (
                  <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                      <h3 className="font-bold text-lg mb-4">Selecione um Cliente</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {clients.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">Nenhum cliente cadastrado.</p>
                        ) : (
                          clients.map(client => (
                            <button
                              key={client.id}
                              onClick={() => handleSelectClient(client)}
                              className="w-full text-left p-3 hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/10 transition-all"
                            >
                              <div className="font-bold text-gray-800">{client.name}</div>
                              <div className="text-xs text-gray-500">{client.contactPerson}</div>
                            </button>
                          ))
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-end">
                        <button
                          onClick={() => setIsClientModalOpen(false)}
                          className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        >
                          Fechar
                        </button>
                        <button
                          onClick={() => {
                            setIsClientModalOpen(false);
                            setCurrentView('clients');
                          }}
                          className="ml-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                          Novo Cliente
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col flex-1">
                    <p className="text-[#151316] text-sm font-medium pb-2">Número da Proposta</p>
                    <input
                      className="flex w-full rounded-lg text-[#151316] focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-primary/20 bg-white focus:border-primary h-12 px-4 text-base font-normal placeholder-gray-400 transition-shadow"
                      value={editorData.number}
                      onChange={(e) => updateEditorField('number', e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col flex-1">
                    <p className="text-[#151316] text-sm font-medium pb-2">Título do Projeto</p>
                    <input
                      className="flex w-full rounded-lg text-[#151316] focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-primary/20 bg-white focus:border-primary h-12 px-4 text-base font-normal placeholder-gray-400 transition-shadow"
                      placeholder="Ex: Consultoria ABC"
                      value={editorData.title}
                      onChange={(e) => updateEditorField('title', e.target.value)}
                    />
                  </label>
                </div>
              </section>

              {/* Branding & Images */}
              <section className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="text-primary w-6 h-6" />
                  <h3 className="text-[#151316] text-lg font-bold">Imagens e Branding</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <label className="flex flex-col flex-1">
                    <div className="flex items-center justify-between pb-2">
                      <p className="text-[#151316] text-sm font-medium">Link do Logo (URL)</p>
                      <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">Link Direto</span>
                    </div>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        className="flex w-full rounded-lg text-[#151316] focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-primary/20 bg-white focus:border-primary h-12 pl-12 pr-4 text-base font-normal placeholder-gray-400 transition-shadow"
                        placeholder="https://suaempresa.com/logo.png"
                        value={editorData.logoUrl}
                        onChange={(e) => updateEditorField('logoUrl', e.target.value)}
                      />
                    </div>
                  </label>
                  <label className="flex flex-col flex-1">
                    <div className="flex items-center justify-between pb-2">
                      <p className="text-[#151316] text-sm font-medium">Link da Capa (Opcional)</p>
                      <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">Link Direto</span>
                    </div>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        className="flex w-full rounded-lg text-[#151316] focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-primary/20 bg-white focus:border-primary h-12 pl-12 pr-4 text-base font-normal placeholder-gray-400 transition-shadow"
                        placeholder="https://exemplo.com/banner.jpg"
                        value={editorData.coverUrl}
                        onChange={(e) => updateEditorField('coverUrl', e.target.value)}
                      />
                    </div>
                  </label>
                </div>
              </section>

              {/* Scope Section */}
              <section className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Layout className="text-primary w-6 h-6" />
                    <h3 className="text-[#151316] text-lg font-bold">Escopo do Projeto</h3>
                  </div>
                  <button
                    onClick={generateScopeWithAI}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-primary to-purple-600 text-white px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        Gerar com IA
                      </>
                    )}
                  </button>
                </div>
                <label className="flex flex-col flex-1">
                  <p className="text-[#151316] text-sm font-medium pb-2">Descrição Detalhada</p>
                  <textarea
                    className="flex w-full min-w-0 flex-1 resize-y rounded-lg text-[#151316] focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-primary/20 bg-white focus:border-primary min-h-36 p-4 text-base font-normal leading-relaxed placeholder-gray-400 transition-shadow"
                    placeholder="Descreva os entregáveis e objetivos do projeto..."
                    value={editorData.description}
                    onChange={(e) => updateEditorField('description', e.target.value)}
                  />
                </label>
              </section>

              {/* Effort Estimation */}
              <section className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="text-primary w-6 h-6" />
                  <h3 className="text-[#151316] text-lg font-bold">Estimativa de Esforço</h3>
                </div>
                <label className="flex flex-col flex-1">
                  <p className="text-[#151316] text-sm font-medium pb-2">Detalhes do Esforço Técnico</p>
                  <textarea
                    className="flex w-full min-w-0 flex-1 resize-y rounded-lg text-[#151316] focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-primary/20 bg-white focus:border-primary min-h-24 p-4 text-base font-normal leading-relaxed placeholder-gray-400 transition-shadow"
                    placeholder="Ex: Total de 120 horas divididas entre Design, Desenvolvimento e Testes..."
                    value={editorData.effortEstimation}
                    onChange={(e) => updateEditorField('effortEstimation', e.target.value)}
                  />
                </label>
              </section>

              {/* Timeline Builder */}
              <TimelineEditor
                items={editorData.timeline}
                onChange={(items) => updateEditorField('timeline', items)}
              />

              {/* Investment Section */}
              <section className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-primary w-6 h-6" />
                  <h3 className="text-[#151316] text-lg font-bold">Investimento e Pagamento</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col flex-1">
                    <p className="text-[#151316] text-sm font-medium pb-2">Valor Total</p>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">R$</span>
                      <input
                        className="flex w-full rounded-lg text-[#151316] focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-primary/20 bg-white focus:border-primary h-12 pl-12 pr-4 text-base font-normal placeholder-gray-400 transition-shadow"
                        placeholder="0,00"
                        value={editorData.value}
                        onChange={(e) => updateEditorField('value', e.target.value)}
                      />
                    </div>
                  </label>
                  <label className="flex flex-col flex-1">
                    <p className="text-[#151316] text-sm font-medium pb-2">Condição de Pagamento</p>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        className="flex w-full rounded-lg text-[#151316] focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-primary/20 bg-white focus:border-primary h-12 pl-12 pr-4 text-base font-normal placeholder-gray-400 transition-shadow"
                        placeholder="Ex: À vista ou Parcelado"
                        value={editorData.paymentTerms}
                        onChange={(e) => updateEditorField('paymentTerms', e.target.value)}
                      />
                    </div>
                  </label>
                </div>
              </section>

              {/* Warranties & Conditions */}
              <section className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="text-primary w-6 h-6" />
                  <h3 className="text-[#151316] text-lg font-bold">Garantias e Condições Gerais</h3>
                </div>
                <label className="flex flex-col flex-1">
                  <p className="text-[#151316] text-sm font-medium pb-2">Termos Detalhados</p>
                  <textarea
                    className="flex w-full min-w-0 flex-1 resize-y rounded-lg text-[#151316] focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-primary/20 bg-white focus:border-primary min-h-24 p-4 text-base font-normal leading-relaxed placeholder-gray-400 transition-shadow"
                    placeholder="Garantias e condições..."
                    value={editorData.warranties}
                    onChange={(e) => updateEditorField('warranties', e.target.value)}
                  />
                </label>
              </section>

              {/* Footer & Signature Section */}
              <section className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserSquare2 className="text-primary w-6 h-6" />
                  <h3 className="text-[#151316] text-lg font-bold">Assinatura e Contato</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <p className="text-[#151316] text-sm font-medium pb-2">Responsável</p>
                    <input
                      className="flex w-full rounded-lg border border-primary/20 bg-white focus:border-primary h-12 px-4 text-base outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Nome Completo"
                      value={editorData.contactName}
                      onChange={(e) => updateEditorField('contactName', e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col">
                    <p className="text-[#151316] text-sm font-medium pb-2">Cargo</p>
                    <input
                      className="flex w-full rounded-lg border border-primary/20 bg-white focus:border-primary h-12 px-4 text-base outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Ex: CEO"
                      value={editorData.contactRole}
                      onChange={(e) => updateEditorField('contactRole', e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col">
                    <p className="text-[#151316] text-sm font-medium pb-2">Telefone</p>
                    <input
                      className="flex w-full rounded-lg border border-primary/20 bg-white focus:border-primary h-12 px-4 text-base outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="(00) 00000-0000"
                      value={editorData.contactPhone}
                      onChange={(e) => updateEditorField('contactPhone', e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col">
                    <p className="text-[#151316] text-sm font-medium pb-2">Website/Link</p>
                    <input
                      className="flex w-full rounded-lg border border-primary/20 bg-white focus:border-primary h-12 px-4 text-base outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="www.exemplo.com.br"
                      value={editorData.contactWebsite}
                      onChange={(e) => updateEditorField('contactWebsite', e.target.value)}
                    />
                  </label>
                </div>
              </section>
            </main>

            {/* Fixed Action Bar for Editor */}
            <footer className="fixed bottom-0 left-0 right-0 md:left-20 lg:left-64 bg-white border-t border-primary/10 p-4 shadow-2xl z-50">
              <div className="max-w-4xl mx-auto flex gap-3 md:gap-4">
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-all text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <Eye size={20} />
                  <span className="hidden sm:inline">Visualizar PDF</span>
                  <span className="sm:hidden">Preview</span>
                </button>
                <button
                  onClick={handleSaveProposal}
                  className="flex-[1.5] flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 shadow-lg shadow-primary/30 transition-all text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Save size={20} />
                  Salvar Proposta
                </button>
              </div>
            </footer>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <PreviewModal
        data={editorData}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
}