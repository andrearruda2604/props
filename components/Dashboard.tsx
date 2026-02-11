import React from 'react';
import { ProposalData, ProposalStatus } from '../types';
import { FileText, Calendar, DollarSign, Edit, Trash2, CheckCircle2, XCircle, Send, FileEdit } from 'lucide-react';

interface DashboardProps {
  proposals: ProposalData[];
  onEdit: (proposal: ProposalData) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: ProposalStatus) => void;
}

const statusColors: Record<ProposalStatus, string> = {
  'Rascunho': 'bg-gray-100 text-gray-600',
  'Enviado': 'bg-blue-100 text-blue-700',
  'Aprovado': 'bg-green-100 text-green-700',
  'Rejeitado': 'bg-red-100 text-red-700'
};

const Dashboard: React.FC<DashboardProps> = ({ proposals, onEdit, onDelete, onUpdateStatus }) => {
  const stats = {
    total: proposals.length,
    approved: proposals.filter(p => p.status === 'Aprovado').length,
    pending: proposals.filter(p => p.status === 'Enviado' || p.status === 'Rascunho').length,
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full text-primary"><FileText size={24} /></div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total de Propostas</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full text-green-600"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Aprovadas</p>
            <p className="text-2xl font-bold text-gray-800">{stats.approved}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-full text-yellow-600"><Calendar size={24} /></div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Em Negociação</p>
            <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Propostas Recentes</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Número</th>
                  <th className="px-6 py-4">Cliente / Título</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {proposals.length === 0 ? (
                   <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Nenhuma proposta criada ainda.
                    </td>
                  </tr>
                ) : (
                  proposals.map((prop) => (
                    <tr key={prop.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{prop.number}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">{prop.title}</span>
                          <span className="text-gray-500 text-xs">{prop.contactName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">R$ {prop.value}</td>
                      <td className="px-6 py-4">
                        <div className="relative group inline-block">
                          <button className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[prop.status]} cursor-pointer`}>
                            {prop.status}
                          </button>
                          <div className="absolute top-full left-0 mt-1 w-32 bg-white shadow-xl rounded-lg overflow-hidden hidden group-hover:block z-20 border border-gray-100">
                            {(['Rascunho', 'Enviado', 'Aprovado', 'Rejeitado'] as ProposalStatus[]).map(s => (
                              <button 
                                key={s}
                                onClick={() => onUpdateStatus(prop.id, s)}
                                className="block w-full text-left px-4 py-2 hover:bg-primary/5 text-gray-700 text-xs"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(prop.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => onEdit(prop)}
                            className="p-1.5 hover:bg-primary/10 rounded text-primary transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => onDelete(prop.id)}
                            className="p-1.5 hover:bg-red-50 rounded text-red-400 hover:text-red-600 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
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
    </div>
  );
};

export default Dashboard;