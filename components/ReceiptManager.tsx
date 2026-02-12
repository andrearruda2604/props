import React, { useState } from 'react';
import { ReceiptData } from '../types';
import { Plus, Edit2, Trash2, Printer, Search } from 'lucide-react';

interface ReceiptManagerProps {
    receipts: ReceiptData[];
    onAdd: () => void;
    onEdit: (receipt: ReceiptData) => void;
    onDelete: (id: string) => void;
    onPrint: (receipt: ReceiptData) => void;
}

export default function ReceiptManager({ receipts, onAdd, onEdit, onDelete, onPrint }: ReceiptManagerProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredReceipts = receipts.filter(r =>
        r.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.contracteeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-background-light p-6 md:p-12 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-primary/10 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-primary/5 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Recibos</h1>
                            <p className="text-gray-500 mt-1">Gerencie seus recibos de prestação de serviços</p>
                        </div>
                        <button
                            onClick={onAdd}
                            className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus size={20} />
                            Novo Recibo
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar recibos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">Número</th>
                                <th className="px-6 py-4 text-left">Cliente (Contratante)</th>
                                <th className="px-6 py-4 text-left">Data</th>
                                <th className="px-6 py-4 text-left">Valor Total</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredReceipts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Nenhum recibo encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredReceipts.map((receipt) => (
                                    <tr key={receipt.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {receipt.number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {receipt.contracteeName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {new Date(receipt.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">
                                            R$ {receipt.totalValue.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${receipt.status === 'Emitido'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {receipt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onPrint(receipt)}
                                                    title="Imprimir/Visualizar"
                                                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                >
                                                    <Printer size={18} />
                                                </button>
                                                <button
                                                    onClick={() => onEdit(receipt)}
                                                    title="Editar"
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(receipt.id)}
                                                    title="Excluir"
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
