import React, { useState, useEffect } from 'react';
import { ReceiptData, ReceiptItem, Client } from '../types';
import { ArrowLeft, Save, Plus, Trash2, Users, Calendar } from 'lucide-react';

interface ReceiptEditorProps {
    data: ReceiptData;
    clients: Client[];
    onSave: (data: ReceiptData) => void;
    onCancel: () => void;
}

export default function ReceiptEditor({ data, clients, onSave, onCancel }: ReceiptEditorProps) {
    const [formData, setFormData] = useState<ReceiptData>(data);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);

    useEffect(() => {
        setFormData(data);
    }, [data]);

    const updateField = (field: keyof ReceiptData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddItem = () => {
        const newItem: ReceiptItem = {
            id: Math.random().toString(36).substr(2, 9),
            description: '',
            hours: 0,
            rate: 180,
            subtotal: 0
        };
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, newItem]
        }));
    };

    const updateItem = (id: string, field: keyof ReceiptItem, value: any) => {
        setFormData(prev => {
            const newItems = prev.items.map(item => {
                if (item.id === id) {
                    const updated = { ...item, [field]: value };
                    if (field === 'hours' || field === 'rate') {
                        updated.subtotal = updated.hours * updated.rate;
                    }
                    return updated;
                }
                return item;
            });

            const totalValue = newItems.reduce((acc, curr) => acc + curr.subtotal, 0);
            return { ...prev, items: newItems, totalValue };
        });
    };

    const deleteItem = (id: string) => {
        setFormData(prev => {
            const newItems = prev.items.filter(item => item.id !== id);
            const totalValue = newItems.reduce((acc, curr) => acc + curr.subtotal, 0);
            return { ...prev, items: newItems, totalValue };
        });
    };

    const handleSelectClient = (client: Client) => {
        setFormData(prev => ({
            ...prev,
            clientId: client.id,
            contracteeName: client.name,
            contracteeDoc: client.cnpj || ''
        }));
        setIsClientModalOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-background-light pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-primary/10 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-primary">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">
                        {formData.id ? 'Editar Recibo' : 'Novo Recibo'}
                    </h2>
                </div>
                <button
                    onClick={() => onSave(formData)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90"
                >
                    <Save size={18} />
                    Salvar
                </button>
            </header>

            <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-6">

                {/* Info Básica */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 space-y-4">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <h3 className="font-bold text-lg text-gray-800">Informações do Recibo</h3>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Valor Total</p>
                            <p className="text-2xl font-bold text-primary">R$ {formData.totalValue.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-600">Número</span>
                            <input
                                value={formData.number}
                                onChange={e => updateField('number', e.target.value)}
                                placeholder="Ex: 001/2026"
                                className="input-field"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-600">Status</span>
                            <select
                                value={formData.status}
                                onChange={e => updateField('status', e.target.value)}
                                className="input-field"
                            >
                                <option value="Rascunho">Rascunho</option>
                                <option value="Emitido">Emitido</option>
                            </select>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 relative">
                            <span className="text-sm font-medium text-gray-600 flex justify-between">
                                Contratante (Cliente)
                                <button onClick={() => setIsClientModalOpen(true)} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                                    <Users size={12} /> Buscar
                                </button>
                            </span>
                            <input
                                value={formData.contracteeName}
                                onChange={e => updateField('contracteeName', e.target.value)}
                                className="input-field"
                                placeholder="Nome do Cliente"
                            />
                        </div>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-600">CNPJ/CPF</span>
                            <input
                                value={formData.contracteeDoc || ''}
                                onChange={e => updateField('contracteeDoc', e.target.value)}
                                className="input-field"
                                placeholder="00.000.000/0000-00"
                            />
                        </label>
                    </div>
                </section>

                {/* Itens */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-bold text-lg text-gray-800">Itens / Funcionalidades</h3>
                        <button onClick={handleAddItem} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg flex items-center gap-1 text-sm font-bold">
                            <Plus size={16} /> Adicionar Item
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.items.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-12 gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="col-span-12 md:col-start-1 md:col-end-6">
                                    <label className="text-xs font-bold text-gray-400 block mb-1">Descrição</label>
                                    <input
                                        value={item.description}
                                        onChange={e => updateItem(item.id, 'description', e.target.value)}
                                        className="w-full text-sm bg-white border border-gray-200 rounded px-2 py-1.5"
                                        placeholder="Nome da Demanda"
                                    />
                                </div>
                                <div className="col-span-4 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 block mb-1">Horas</label>
                                    <input type="number"
                                        value={item.hours}
                                        onChange={e => updateItem(item.id, 'hours', parseFloat(e.target.value) || 0)}
                                        className="w-full text-sm bg-white border border-gray-200 rounded px-2 py-1.5"
                                    />
                                </div>
                                <div className="col-span-4 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 block mb-1">Valor Hora</label>
                                    <input type="number"
                                        value={item.rate}
                                        onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                        className="w-full text-sm bg-white border border-gray-200 rounded px-2 py-1.5"
                                    />
                                </div>
                                <div className="col-span-3 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 block mb-1">Subtotal</label>
                                    <div className="text-sm font-bold pt-1.5">R$ {item.subtotal.toFixed(2)}</div>
                                </div>
                                <div className="col-span-1 flex justify-end pt-6">
                                    <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {formData.items.length === 0 && (
                            <p className="text-center text-gray-400 text-sm py-4">Nenhum item adicionado.</p>
                        )}
                    </div>
                </section>

                {/* Garantia e Datas */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 space-y-4">
                    <h3 className="font-bold text-lg text-gray-800 border-b pb-2">Datas e Garantia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-600">Data de Entrega</span>
                            <input type="date"
                                value={formData.deliveryDate || ''}
                                onChange={e => updateField('deliveryDate', e.target.value)}
                                className="input-field"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-600">Dias de Garantia</span>
                            <input type="number"
                                value={formData.warrantyDays}
                                onChange={e => updateField('warrantyDays', parseInt(e.target.value))}
                                className="input-field"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-600">Valor Hora Extra</span>
                            <input type="number"
                                value={formData.extraWarrantyRate}
                                onChange={e => updateField('extraWarrantyRate', parseFloat(e.target.value))}
                                className="input-field"
                            />
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-600">Início da Garantia</span>
                            <input type="date"
                                value={formData.warrantyStartDate || ''}
                                onChange={e => updateField('warrantyStartDate', e.target.value)}
                                className="input-field"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-600">Término da Garantia</span>
                            <input type="date"
                                value={formData.warrantyEndDate || ''}
                                onChange={e => updateField('warrantyEndDate', e.target.value)}
                                className="input-field"
                            />
                        </label>
                    </div>
                </section>
            </main>

            {/* Client Modal */}
            {isClientModalOpen && (
                <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="font-bold text-lg mb-4">Selecione um Cliente</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {clients.map(client => (
                                <button
                                    key={client.id}
                                    onClick={() => handleSelectClient(client)}
                                    className="w-full text-left p-3 hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/10 transition-all"
                                >
                                    <div className="font-bold text-gray-800">{client.name}</div>
                                    <div className="text-xs text-gray-500">{client.cnpj}</div>
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-end">
                            <button
                                onClick={() => setIsClientModalOpen(false)}
                                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
