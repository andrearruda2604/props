import React, { useState } from 'react';
import { PriceItem } from '../types';
import { Plus, Trash2, Edit2, Tag } from 'lucide-react';

interface PriceManagerProps {
  items: PriceItem[];
  onAdd: (item: PriceItem) => void;
  onDelete: (id: string) => void;
  onUpdate: (item: PriceItem) => void;
}

const PriceManager: React.FC<PriceManagerProps> = ({ items, onAdd, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Omit<PriceItem, 'id'>>({
    name: '',
    description: '',
    standardPrice: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      ...newItem,
    });
    setNewItem({ name: '', description: '', standardPrice: 0 });
  };

  const handleUpdateField = (id: string, field: keyof PriceItem, value: any) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      onUpdate({ ...item, [field]: value });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tabela de Preços Padrão</h2>
          <p className="text-gray-500">Gerencie os serviços e valores base para suas propostas</p>
        </div>
      </div>

      {/* Add New Item Form */}
      <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
          <Plus size={20} /> Adicionar Novo Item
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="text-xs font-bold text-gray-500 uppercase">Nome do Serviço</label>
            <input
              required
              placeholder="Ex: Hora Técnica Sênior"
              className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>
          <div className="md:col-span-4">
            <label className="text-xs font-bold text-gray-500 uppercase">Descrição (Opcional)</label>
            <input
              placeholder="Detalhes..."
              className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Preço Padrão (R$)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none"
              value={newItem.standardPrice || ''}
              onChange={(e) => setNewItem({ ...newItem, standardPrice: parseFloat(e.target.value) })}
            />
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full p-3 bg-primary text-white rounded-lg hover:bg-primary-dark flex justify-center items-center"
            >
              <Plus size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4 group"
          >
            <div className="p-3 bg-primary/5 rounded-full text-primary">
              <Tag size={24} />
            </div>
            
            <div className="flex-1 w-full">
              {editingId === item.id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    className="p-2 border rounded"
                    value={item.name}
                    onChange={(e) => handleUpdateField(item.id, 'name', e.target.value)}
                  />
                  <input
                    className="p-2 border rounded"
                    value={item.description || ''}
                    placeholder="Descrição"
                    onChange={(e) => handleUpdateField(item.id, 'description', e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                  {item.description && <p className="text-gray-500 text-sm">{item.description}</p>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between">
              <div className="text-right">
                <p className="text-xs text-gray-400 font-medium uppercase">Preço Padrão</p>
                {editingId === item.id ? (
                  <input
                    type="number"
                    className="w-32 p-1 border rounded text-right font-bold text-primary"
                    value={item.standardPrice}
                    onChange={(e) => handleUpdateField(item.id, 'standardPrice', parseFloat(e.target.value))}
                  />
                ) : (
                  <p className="text-xl font-bold text-primary">
                    R$ {item.standardPrice.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    editingId === item.id 
                      ? 'bg-green-100 text-green-600' 
                      : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                  }`}
                  title={editingId === item.id ? "Salvar" : "Editar"}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-500 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            Nenhum item na tabela de preços.
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceManager;