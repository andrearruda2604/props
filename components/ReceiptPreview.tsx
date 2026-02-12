import React from 'react';
import { ReceiptData, ProposalData } from '../types';
import { X, Printer } from 'lucide-react';

interface ReceiptPreviewProps {
    data: ReceiptData;
    proposals: ProposalData[];
    isOpen: boolean;
    onClose: () => void;
}

export default function ReceiptPreview({ data, proposals, isOpen, onClose }: ReceiptPreviewProps) {
    if (!isOpen) return null;

    const linkedProposal = data.proposalId ? proposals.find(p => p.id === data.proposalId) : undefined;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'DD/MM/AAAA';
        // Fix timezone offset for display if date is YYYY-MM-DD
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    const getFullDate = () => {
        const date = new Date();
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 print:p-0 print:bg-white print:static print:z-auto">
            <div className="bg-white w-full max-w-4xl h-[90vh] rounded-xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 print:shadow-none print:w-full print:h-auto print:rounded-none print:max-w-none">

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
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50 print:p-0 print:bg-white print:overflow-visible">
                    <div className="bg-white max-w-[210mm] mx-auto min-h-[297mm] shadow-lg p-12 text-black font-sans leading-relaxed print:shadow-none print:m-0 print:p-8 print:w-full">

                        {/* 1. Header Spec */}
                        <div className="mb-8 text-center border-b-2 border-black pb-4">
                            <h1 className="text-xl font-bold uppercase tracking-wide">Recibo de Prestação de Serviços Técnicos</h1>
                            <p className="text-lg font-bold mt-2">Nº {data.number || '[00X/2026]'}</p>
                            {linkedProposal && (
                                <p className="text-sm mt-1">Ref. Proposta: {linkedProposal.number} - {linkedProposal.title}</p>
                            )}
                        </div>

                        {/* Parties */}
                        <div className="mb-8 text-sm">
                            <p className="mb-2"><span className="font-bold">CONTRATADO:</span> {data.contractorName} {data.contractorDoc && `(${data.contractorDoc})`}</p>
                            <p><span className="font-bold">CONTRATANTE:</span> {data.contracteeName} {data.contracteeDoc && `(CNPJ: ${data.contracteeDoc})`}</p>
                        </div>

                        {/* 1. Objeto */}
                        <div className="mb-6">
                            <h2 className="text-base font-bold mb-2">1. Objeto da Entrega e Cobrança</h2>
                            <p className="mb-4 text-justify">
                                Recebi da empresa <span className="font-bold">{data.contracteeName}</span> a importância de <span className="font-bold">R$ {data.totalValue.toFixed(2)}</span>,
                                referente aos serviços de desenvolvimento técnico detalhados abaixo:
                            </p>

                            <table className="w-full border-collapse border border-black text-sm mb-4">
                                <thead>
                                    <tr className="bg-gray-200 print:bg-gray-200">
                                        <th className="border border-black p-2 text-left">Item / Funcionalidade</th>
                                        <th className="border border-black p-2 text-center w-24">Esforço (h)</th>
                                        <th className="border border-black p-2 text-center w-28">Valor Hora</th>
                                        <th className="border border-black p-2 text-right w-28">Subtotal</th>
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
                                    <tr className="font-bold bg-gray-100 print:bg-gray-100">
                                        <td className="border border-black p-2 text-right" colSpan={3}>TOTAL DO RECIBO</td>
                                        <td className="border border-black p-2 text-right">R$ {data.totalValue.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 2. Cronograma de Garantia */}
                        <div className="mb-6">
                            <h2 className="text-base font-bold mb-2">2. Cronograma de Garantia Técnica</h2>
                            <p className="mb-2 text-justify">
                                Os módulos listados neste documento possuem garantia técnica de {data.warrantyDays} dias contra erros (bugs) ou falhas funcionais:
                            </p>
                            <ul className="list-none space-y-1 pl-4 mb-4 font-medium">
                                <li>Data da Entrega: <span className="font-normal">{formatDate(data.deliveryDate)}</span></li>
                                <li>Início da Garantia: <span className="font-normal">{formatDate(data.warrantyStartDate)}</span></li>
                                <li>Término da Garantia: <span className="font-normal">{formatDate(data.warrantyEndDate)}</span></li>
                            </ul>
                        </div>

                        {/* 3. Termos */}
                        <div className="mb-8">
                            <h2 className="text-base font-bold mb-2">3. Termos e Condições de Manutenção</h2>
                            <div className="space-y-3 text-justify text-sm">
                                <p>
                                    <span className="font-bold">Escopo da Garantia:</span> A garantia cobre exclusivamente a correção de bugs ou falhas de funcionamento dos códigos entregues nesta data.
                                </p>
                                <p>
                                    <span className="font-bold">Solicitações Extra-Garantia:</span> Alterações de lógica, novas funcionalidades ou suporte após o término do prazo acima serão faturados pelo valor de <span className="font-bold">R$ {data.extraWarrantyRate.toFixed(2)}/h</span>, conforme estabelecido na Cláusula 7.1 do contrato principal.
                                </p>
                                <p>
                                    <span className="font-bold">Infraestrutura:</span> Reitera-se que o funcionamento pleno depende da manutenção de planos adequados de infraestrutura e serviços de terceiros (IA/Hospedagem) pela Contratante.
                                </p>
                                <p>
                                    <span className="font-bold">Quitação:</span> Este documento serve como recibo de quitação para os valores acima descritos após a confirmação do pagamento.
                                </p>
                            </div>
                        </div>

                        {/* Signatures */}
                        <div className="mt-16 pt-8">
                            <p className="mb-12 text-center">{data.location || 'Curitiba/PR'}, {getFullDate()}.</p>

                            <div className="flex flex-col items-center justify-center">
                                <div className="w-64 border-t border-black mb-2"></div>
                                <p className="font-bold uppercase">{data.contractorName}</p>
                                <p className="text-sm">(Assinatura do Contratado)</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
