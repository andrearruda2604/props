import React from 'react';
import { ProposalData } from '../types';
import { X, Printer } from 'lucide-react';

interface PreviewModalProps {
  data: ProposalData;
  isOpen: boolean;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ data, isOpen, onClose }) => {
  if (!isOpen) return null;

  const totalDays = data.timeline.reduce((acc, curr) => acc + curr.days, 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-800">Visualização de Impressão</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              <Printer size={16} />
              Imprimir
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="bg-white max-w-[210mm] mx-auto min-h-[297mm] shadow-lg p-12 text-[#151316] print:shadow-none print:m-0 print:w-full">
            
            {/* Header / Brand */}
            <div className="flex justify-between items-start mb-12 border-b-2 border-primary/10 pb-8">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">{data.title}</h1>
                <p className="text-gray-500 font-medium">{data.number}</p>
              </div>
              {data.logoUrl && (
                <img 
                  src={data.logoUrl} 
                  alt="Logo" 
                  className="h-16 w-auto object-contain rounded-lg" 
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
            </div>

            {/* Cover Image (Optional) */}
            {data.coverUrl && (
              <div className="mb-10 w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src={data.coverUrl} 
                  alt="Capa" 
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            )}

            {/* Description / Scope */}
            <div className="mb-8">
              <h4 className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-3">Sobre o Projeto</h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{data.description || "Sem descrição."}</p>
            </div>

            {/* Effort Estimation (New) */}
            {data.effortEstimation && (
              <div className="mb-10 bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
                <h4 className="text-sm uppercase tracking-wider text-primary font-bold mb-2">Estimativa de Esforço</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{data.effortEstimation}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="mb-10">
              <h4 className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-4">Cronograma Estimado ({totalDays} dias)</h4>
              <div className="space-y-0">
                {data.timeline.map((step, idx) => (
                  <div key={step.id} className="flex gap-4 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mt-2"></div>
                      {idx !== data.timeline.length - 1 && (
                        <div className="w-0.5 bg-gray-200 flex-1 my-1"></div>
                      )}
                    </div>
                    <div className="pb-6">
                      <h5 className="font-bold text-gray-800 text-lg">{step.title}</h5>
                      <p className="text-gray-500 text-sm mt-1">{step.days} dias úteis</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment */}
            <div className="mb-10 bg-primary/5 p-6 rounded-xl border border-primary/10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-primary font-bold text-lg mb-1">Investimento Total</h4>
                  <p className="text-gray-600 text-sm">{data.paymentTerms}</p>
                </div>
                <div className="text-3xl font-bold text-primary">
                  R$ {data.value}
                </div>
              </div>
            </div>

            {/* Warranties & Conditions (New) */}
            {data.warranties && (
              <div className="mb-12">
                <h4 className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-3">Garantias e Condições Gerais</h4>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap border border-gray-100 p-4 rounded-lg">
                  {data.warranties}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-end text-sm text-gray-500">
              <div>
                <p className="font-bold text-gray-900 text-base mb-1">{data.contactName}</p>
                <p>{data.contactRole}</p>
                <p>{data.contactPhone}</p>
              </div>
              <div className="text-right">
                <p className="text-primary">{data.contactWebsite}</p>
                <p>Gerado em {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;