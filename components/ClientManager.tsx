import React, { useState } from 'react';
import { Client, PriceItem, ClientPriceOverride } from '../types';
import { Plus, Search, Trash2, UserSquare2, Globe, Phone, Mail, X, Tag, Percent, Building2 } from 'lucide-react';

interface ClientManagerProps {
  clients: Client[];
  priceList: PriceItem[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

const ClientManager: React.FC<ClientManagerProps> = ({ clients, priceList, onAddClient, onUpdateClient, onDeleteClient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'commercial'>('info');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for adding a new override in the modal
  const [selectedPriceId, setSelectedPriceId] = useState('');
  const [overrideValue, setOverrideValue] = useState('');

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient({ ...client });
    } else {
      setEditingClient({
        name: '',
        cnpj: '',
        contactPerson: '',
        role: '',
        phone: '',
        website: '',
        email: '',
        discountRules: '',
        priceOverrides: []
      });
    }
    setActiveTab('info');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient?.name) return;

    const clientToSave = {
      ...editingClient,
      id: editingClient.id || Math.random().toString(36).substr(2, 9),
    } as Client;

    if (editingClient.id) {
      onUpdateClient(clientToSave);
    } else {
      onAddClient(clientToSave);
    }
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleAddOverride = () => {
    if (!selectedPriceId || !overrideValue || !editingClient) return;

    const newOverrides = [
      ...(editingClient.priceOverrides || []).filter(o => o.priceItemId !== selectedPriceId),
      { priceItemId: selectedPriceId, customPrice: parseFloat(overrideValue) }
    ];

    setEditingClient({ ...editingClient, priceOverrides: newOverrides });
    setSelectedPriceId('');
    setOverrideValue('');
  };

  const handleRemoveOverride = (priceItemId: string) => {
    if (!editingClient) return;
    const newOverrides = (editingClient.priceOverrides || []).filter(o => o.priceItemId !== priceItemId);
    setEditingClient({ ...editingClient, priceOverrides: newOverrides });
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Clientes</h2>
          <p className="text-gray-500">Cadastre e gerencie sua base de contatos e tabelas específicas</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          Novo Cliente
        </button>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-gray-800">
                {editingClient.id ? 'Editar Cliente' : 'Novo Cliente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="flex border-b border-gray-100 px-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Dados Gerais
              </button>
              <button
                onClick={() => setActiveTab('commercial')}
                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'commercial' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Condições Comerciais
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === 'info' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    placeholder="Nome da Empresa *"
                    className="p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none w-full"
                    value={editingClient.name}
                    onChange={e => setEditingClient({...editingClient, name: e.target.value})}
                  />
                  <input
                    placeholder="CNPJ"
                    className="p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none w-full"
                    value={editingClient.cnpj || ''}
                    onChange={e => setEditingClient({...editingClient, cnpj: e.target.value})}
                  />
                  <input
                    placeholder="Nome do Responsável *"
                    className="p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none w-full"
                    value={editingClient.contactPerson}
                    onChange={e => setEditingClient({...editingClient, contactPerson: e.target.value})}
                  />
                  <input
                    placeholder="Cargo"
                    className="p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none w-full"
                    value={editingClient.role}
                    onChange={e => setEditingClient({...editingClient, role: e.target.value})}
                  />
                  <input
                    placeholder="Telefone / WhatsApp"
                    className="p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none w-full"
                    value={editingClient.phone}
                    onChange={e => setEditingClient({...editingClient, phone: e.target.value})}
                  />
                  <input
                    placeholder="Website"
                    className="p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none w-full"
                    value={editingClient.website}
                    onChange={e => setEditingClient({...editingClient, website: e.target.value})}
                  />
                  <input
                    placeholder="Email"
                    className="p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none w-full"
                    value={editingClient.email}
                    onChange={e => setEditingClient({...editingClient, email: e.target.value})}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Discount Rules */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Percent size={16} /> Regras de Desconto Específicas
                    </label>
                    <textarea
                      className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none min-h-[80px]"
                      placeholder="Ex: 10% de desconto para pagamentos à vista. Isenção de setup para contratos anuais."
                      value={editingClient.discountRules || ''}
                      onChange={e => setEditingClient({...editingClient, discountRules: e.target.value})}
                    />
                  </div>

                  <hr className="border-gray-100" />

                  {/* Price Overrides */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Tag size={16} /> Tabela de Preços Específica
                    </label>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Sobrescrever preço padrão:</p>
                      <div className="flex gap-2">
                        <select
                          className="flex-1 p-2 rounded border outline-none text-sm"
                          value={selectedPriceId}
                          onChange={(e) => setSelectedPriceId(e.target.value)}
                        >
                          <option value="">Selecione um serviço...</option>
                          {priceList.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name} (Padrão: R$ {item.standardPrice})
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Novo valor"
                          className="w-28 p-2 rounded border outline-none text-sm"
                          value={overrideValue}
                          onChange={(e) => setOverrideValue(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={handleAddOverride}
                          disabled={!selectedPriceId || !overrideValue}
                          className="bg-primary text-white px-3 py-2 rounded text-sm disabled:opacity-50"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {editingClient.priceOverrides && editingClient.priceOverrides.length > 0 ? (
                        editingClient.priceOverrides.map(override => {
                          const originalItem = priceList.find(i => i.id === override.priceItemId);
                          return (
                            <div key={override.priceItemId} className="flex justify-between items-center p-3 bg-white border rounded-lg shadow-sm">
                              <div>
                                <span className="font-medium text-gray-800">
                                  {originalItem?.name || 'Item Removido'}
                                </span>
                                <div className="text-xs text-gray-400">
                                  Padrão: <span className="line-through">R$ {originalItem?.standardPrice}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-bold text-primary">R$ {override.customPrice}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOverride(override.priceItemId)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center text-sm text-gray-400 py-4 italic">
                          Este cliente usa a tabela padrão completa.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleSave}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all"
              >
                Salvar Cliente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          placeholder="Buscar por nome ou empresa..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white shadow-sm focus:ring-2 ring-primary/20 outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Client List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative flex flex-col h-full">
            <div className="absolute top-4 right-4 flex gap-2">
               <button 
                onClick={() => handleOpenModal(client)}
                className="text-gray-300 hover:text-primary transition-colors"
                title="Editar"
              >
                 <UserSquare2 size={18} />
              </button>
               <button 
                onClick={() => onDeleteClient(client.id)}
                className="text-gray-300 hover:text-red-500 transition-colors"
                title="Excluir"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {client.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{client.name}</h4>
                <p className="text-sm text-gray-500">{client.contactPerson}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
              <div className="flex items-center gap-2">
                <UserSquare2 size={14} className="text-primary/60" />
                <span>{client.role || 'Cargo não informado'}</span>
              </div>
              {client.cnpj && (
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-primary/60" />
                  <span className="font-mono text-xs">{client.cnpj}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary/60" />
                <span>{client.phone || '-'}</span>
              </div>
               <div className="flex items-center gap-2">
                <Mail size={14} className="text-primary/60" />
                <span>{client.email || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-primary/60" />
                <a href={client.website} target="_blank" className="text-primary hover:underline truncate">
                  {client.website || '-'}
                </a>
              </div>
            </div>

            {/* Price Tags Indicator */}
            {(client.discountRules || (client.priceOverrides && client.priceOverrides.length > 0)) && (
              <div className="pt-3 border-t border-gray-100 flex gap-2">
                {client.priceOverrides && client.priceOverrides.length > 0 && (
                   <span className="text-xs bg-purple-50 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                     <Tag size={12} /> Tabela Específica
                   </span>
                )}
                {client.discountRules && (
                   <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                     <Percent size={12} /> Descontos
                   </span>
                )}
              </div>
            )}
          </div>
        ))}
        {filteredClients.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-400">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManager;