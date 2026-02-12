import React from 'react';
import { ReceiptData, ProposalData, CompanySettings } from '../types';
import { X, Printer } from 'lucide-react';

interface ReceiptPreviewProps {
    data: ReceiptData;
    proposals: ProposalData[];
    settings: CompanySettings;
    isOpen: boolean;
    onClose: () => void;
}

export default function ReceiptPreview({ data, proposals, settings, isOpen, onClose }: ReceiptPreviewProps) {
    if (!isOpen) return null;

    const linkedProposal = data.proposalId ? proposals.find(p => p.id === data.proposalId) : undefined;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'DD/MM/AAAA';
        // Handle YYYY-MM-DD to avoid timezone issues by treating as UTC
        if (dateStr.includes('-')) {
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
        }
        // Fallback for other formats
        return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    const getFullDate = () => {
        const date = new Date();
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 print:p-0 print:bg-white print:static print:z-auto print:block print:animate-none print:inset-auto print:w-full print:h-full">
            <div className="bg-white w-full max-w-4xl h-[90vh] rounded-xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 print:shadow-none print:w-full print:h-auto print:rounded-none print:max-w-none print:block print:animate-none print:border-none">

                {/* Header Actions (No Print) */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 print:hidden">
                    <h3 className="font-bold text-lg text-gray-800">Visualização do Recibo</h3>
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
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50 print:p-0 print:bg-white print:overflow-visible print:block print:h-auto">
                    <div id="printable-receipt" className="bg-white max-w-[210mm] mx-auto min-h-[297mm] shadow-lg p-12 text-black font-sans leading-relaxed flex flex-col print:shadow-none print:m-0 print:p-12 md:print:p-16 print:w-full print:min-h-screen">

                        {/* Main Content Area - Pushes Footer Down */}
                        <div className="flex-1">
                            {/* 1. Header Spec */}
                            <div className="mb-10 text-center border-b-2 border-black pb-6">
                                <h1 className="text-xl font-bold uppercase tracking-wide">Recibo de Prestação de Serviços Técnicos</h1>
                                <p className="text-lg font-bold mt-2">Nº {data.number || '[00X/2026]'}</p>
                                {linkedProposal && (
                                    <p className="text-sm mt-1 text-gray-700">Ref. Proposta: {linkedProposal.number} - {linkedProposal.title}</p>
                                )}
                            </div>

                            {/* Parties */}
                            <div className="mb-10 text-sm space-y-1">
                                <p><span className="font-bold">CONTRATADO:</span> {data.contractorName} {data.contractorDoc && `(${data.contractorDoc})`}</p>
                                <p><span className="font-bold">CONTRATANTE:</span> {data.contracteeName} {data.contracteeDoc && `(CNPJ: ${data.contracteeDoc})`}</p>
                            </div>

                            {/* 1. Objeto */}
                            <div className="mb-8">
                                <h2 className="text-base font-bold mb-3 uppercase border-b border-gray-300 inline-block pb-1">1. Objeto da Entrega e Cobrança</h2>
                                <p className="mb-4 text-justify leading-relaxed">
                                    Recebi da empresa <span className="font-bold">{data.contracteeName}</span> a importância de <span className="font-bold">R$ {data.totalValue.toFixed(2)}</span>,
                                    referente aos serviços de desenvolvimento técnico detalhados abaixo:
                                </p>

                                <table className="w-full border-collapse border border-black text-sm mb-6">
                                    <thead>
                                        <tr className="bg-gray-100 print:bg-gray-100">
                                            <th className="border border-black p-3 text-left">Item / Funcionalidade</th>
                                            <th className="border border-black p-3 text-center w-24">Esforço (h)</th>
                                            <th className="border border-black p-3 text-center w-28">Valor Hora</th>
                                            <th className="border border-black p-3 text-right w-28">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="border border-black p-2">{item.description}</td>
                                                <td className="border border-black p-2 text-center">{item.hours} h</td>
                                                <td className="border border-black p-2 text-center">R$ {item.rate.toFixed(2)}</td>
                                                <td className="border border-black p-2 text-right">R$ {item.subtotal.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        <tr className="font-bold bg-gray-50 print:bg-gray-50">
                                            <td className="border border-black p-2 text-right" colSpan={3}>TOTAL DO RECIBO</td>
                                            <td className="border border-black p-2 text-right">R$ {data.totalValue.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 2. Cronograma de Garantia */}
                            <div className="mb-8">
                                <h2 className="text-base font-bold mb-3 uppercase border-b border-gray-300 inline-block pb-1">2. Cronograma de Garantia Técnica</h2>
                                <p className="mb-3 text-justify">
                                    Os módulos listados neste documento possuem garantia técnica de <span className="font-bold">{data.warrantyDays} dias</span> contra erros (bugs) ou falhas funcionais:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4 text-sm print:grid-cols-3">
                                    <div><span className="font-bold block text-gray-600">Data da Entrega:</span> {formatDate(data.deliveryDate)}</div>
                                    <div><span className="font-bold block text-gray-600">Início da Garantia:</span> {formatDate(data.warrantyStartDate)}</div>
                                    <div><span className="font-bold block text-gray-600">Término da Garantia:</span> {formatDate(data.warrantyEndDate)}</div>
                                </div>
                            </div>

                            {/* 3. Termos */}
                            <div className="mb-6">
                                <h2 className="text-base font-bold mb-3 uppercase border-b border-gray-300 inline-block pb-1">3. Termos e Condições</h2>
                                <div className="space-y-3 text-justify text-sm whitespace-pre-wrap leading-relaxed text-gray-800">
                                    {settings.receiptTermText || `Escopo da Garantia: A garantia cobre exclusivamente a correção de bugs ou falhas de funcionamento dos códigos entregues nesta data.

Solicitações Extra-Garantia: Alterações de lógica, novas funcionalidades ou suporte após o término do prazo acima serão faturados pelo valor de R$ ${data.extraWarrantyRate.toFixed(2)}/h, conforme contrato.

Quitação: Este documento serve como recibo de quitação para os valores acima descritos após a confirmação do pagamento.`}
                                </div>
                            </div>
                        </div>

                        {/* Footer Section - Pushed to Bottom */}
                        <div className="mt-8 print:mt-auto">
                            {/* Notes */}
                            {settings.receiptFooterText && (
                                <div className="mb-12 text-sm text-center italic text-gray-500 border-t border-gray-100 pt-4 px-8">
                                    "{settings.receiptFooterText}"
                                </div>
                            )}

                            {/* Signatures */}
                            <div className="pt-4 pb-4">
                                <p className="mb-16 text-center text-gray-800">{data.location || 'Curitiba/PR'}, {getFullDate()}.</p>

                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-72 border-t border-black mb-3"></div>
                                    <p className="font-bold uppercase tracking-wide">{data.contractorName}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">Assinatura do Contratado</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
