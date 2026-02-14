import React from 'react';
import { CompanySettings } from '../types';
import { Save, Palette, FileText, Building2, UserCircle, Bot, Eye, EyeOff } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface SettingsManagerProps {
  settings: CompanySettings;
  onSave: (settings: CompanySettings) => void;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState<CompanySettings>(settings);

  const [activeTab, setActiveTab] = React.useState<'proposals' | 'receipts' | 'ai'>('proposals');
  const [showApiKey, setShowApiKey] = React.useState(false);

  const handleChange = (field: keyof CompanySettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(localSettings);
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Configurações da Empresa</h2>
          <p className="text-gray-500">Customize a aparência e os textos padrão.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-primary/30"
        >
          <Save size={20} />
          Salvar Alterações
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('proposals')}
          className={`pb-3 px-2 font-bold transition-colors border-b-2 ${activeTab === 'proposals' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Propostas
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`pb-3 px-2 font-bold transition-colors border-b-2 ${activeTab === 'receipts' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Recibos
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`pb-3 px-2 font-bold transition-colors border-b-2 ${activeTab === 'ai' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          IA
        </button>
      </div>

      <div className={activeTab === 'proposals' ? 'space-y-6 block' : 'hidden'}>
        {/* Visual Identity */}
        <section className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Palette className="text-primary" size={24} />
            <h3 className="font-bold text-lg text-gray-800">Identidade Visual & Geral</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100 mb-2">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <span className="bg-blue-200 text-blue-700 text-xs px-2 py-0.5 rounded-full">Novo</span>
                Configuração de Numeração
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Próximo Número (Sequência)</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2.5 rounded-lg border focus:ring-2 ring-primary/20 outline-none"
                    value={localSettings.nextProposalSeq}
                    onChange={(e) => handleChange('nextProposalSeq', parseInt(e.target.value) || 1)}
                  />
                  <p className="text-xs text-gray-500 mt-1">O próximo ID sequencial a ser usado.</p>
                </div>
                <div>
                  <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={localSettings.useDatePrefix}
                      onChange={(e) => {
                        // Must handle boolean change manually because generic handleChange expects string for inputs usually
                        setLocalSettings(prev => ({ ...prev, useDatePrefix: e.target.checked }));
                      }}
                      className="w-5 h-5 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Usar prefixo de Ano/Mês (YYYYMM)</span>
                  </label>
                </div>
                <div className="md:col-span-2 mt-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-bold">Preview:</span> Como ficará a próxima proposta:
                    <span className="ml-2 inline-block px-3 py-1 bg-gray-200 text-gray-800 font-mono rounded-md font-bold">
                      {localSettings.useDatePrefix ? new Date().toISOString().slice(0, 4) + new Date().toISOString().slice(5, 7) : ''}{String(localSettings.nextProposalSeq).padStart(4, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Cor Principal (Tema)</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={localSettings.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="h-12 w-20 p-1 rounded border cursor-pointer"
                />
                <span className="text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded">{localSettings.primaryColor}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Esta cor será usada em botões, bordas e detalhes do PDF.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Empresa</label>
              <input
                className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none"
                value={localSettings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Minha Agência Digital"
              />
            </div>

            <div className="md:col-span-2">
              <ImageUpload
                label="Logo da Empresa"
                currentUrl={localSettings.logoUrl}
                onUpload={(url) => handleChange('logoUrl', url)}
              />
            </div>
          </div>
        </section>

        {/* Default Texts */}
        <section className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <FileText className="text-primary" size={24} />
            <h3 className="font-bold text-lg text-gray-800">Textos Padrão (Propostas)</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Escopo Padrão</label>
              <textarea
                className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none min-h-[100px]"
                value={localSettings.defaultScopeText}
                onChange={(e) => handleChange('defaultScopeText', e.target.value)}
                placeholder="Texto padrão para o escopo..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Condições de Pagamento Padrão</label>
              <input
                className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none"
                value={localSettings.defaultPaymentTerms}
                onChange={(e) => handleChange('defaultPaymentTerms', e.target.value)}
                placeholder="Ex: 50% Entrada..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Garantias e Condições Gerais Padrão</label>
              <textarea
                className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none min-h-[100px]"
                value={localSettings.defaultWarranties}
                onChange={(e) => handleChange('defaultWarranties', e.target.value)}
                placeholder="Texto legal e garantias..."
              />
            </div>
          </div>
        </section>

        {/* Default Footer Contact */}
        <section className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <UserCircle className="text-primary" size={24} />
            <h3 className="font-bold text-lg text-gray-800">Rodapé e Contato Padrão</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Responsável</label>
              <input
                className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none"
                value={localSettings.defaultContactName}
                onChange={(e) => handleChange('defaultContactName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Cargo</label>
              <input
                className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none"
                value={localSettings.defaultContactRole}
                onChange={(e) => handleChange('defaultContactRole', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Telefone</label>
              <input
                className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none"
                value={localSettings.defaultContactPhone}
                onChange={(e) => handleChange('defaultContactPhone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
              <input
                className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none"
                value={localSettings.defaultContactWebsite}
                onChange={(e) => handleChange('defaultContactWebsite', e.target.value)}
              />
            </div>
          </div>
        </section>
      </div>

      {/* RECEIPTS TAB */}
      <div className={activeTab === 'receipts' ? 'space-y-6 block' : 'hidden'}>
        <section className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <FileText className="text-primary" size={24} />
            <h3 className="font-bold text-lg text-gray-800">Textos Padrão (Recibos)</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Termos e Condições de Manutenção</label>
              <textarea
                className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none min-h-[150px]"
                value={localSettings.receiptTermText || 'Escopo da Garantia: A garantia cobre exclusivamente a correção de bugs ou falhas de funcionamento dos códigos entregues nesta data.\n\nSolicitações Extra-Garantia: Alterações de lógica, novas funcionalidades ou suporte após o término do prazo acima serão faturados conforme contrato.\n\nQuitação: Este documento serve como recibo de quitação para os valores acima descritos após a confirmação do pagamento.'}
                onChange={(e) => handleChange('receiptTermText', e.target.value)}
                placeholder="Texto legal que aparece no final do recibo..."
              />
              <p className="text-xs text-gray-500 mt-1">Este texto aparecerá na seção "3. Termos e Condições de Manutenção".</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Rodapé / Observações do Recibo</label>
              <textarea
                className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none min-h-[80px]"
                value={localSettings.receiptFooterText || ''}
                onChange={(e) => handleChange('receiptFooterText', e.target.value)}
                placeholder="Texto extra para o rodapé do recibo (opcional)..."
              />
            </div>
          </div>
        </section>
      </div>

      {/* AI TAB */}
      <div className={activeTab === 'ai' ? 'space-y-6 block' : 'hidden'}>
        <section className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Bot className="text-primary" size={24} />
            <h3 className="font-bold text-lg text-gray-800">Configurações de IA</h3>
          </div>

          <div className="space-y-6">
            {/* API Key */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Chave da API (API Key)</label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  className="w-full p-3 pr-12 rounded-lg border focus:ring-2 ring-primary/20 outline-none font-mono"
                  value={localSettings.aiApiKey || ''}
                  onChange={(e) => handleChange('aiApiKey', e.target.value)}
                  placeholder="Cole sua API Key aqui..."
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  title={showApiKey ? 'Ocultar' : 'Mostrar'}
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Sua chave da API do Google Gemini. Ela será salva de forma segura.</p>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Modelo</label>
              <select
                className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none bg-white"
                value={localSettings.aiModel || 'gemini-2.0-flash'}
                onChange={(e) => handleChange('aiModel', e.target.value)}
              >
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Rápido)</option>
                <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite (Mais leve)</option>
                <option value="gemini-2.5-flash-preview-05-20">Gemini 2.5 Flash (Preview)</option>
                <option value="gemini-2.5-pro-preview-05-06">Gemini 2.5 Pro (Preview)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">O modelo que será usado para gerar o escopo com IA.</p>
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Prompt de Geração</label>
              <textarea
                className="w-full p-3 rounded-lg border focus:ring-2 ring-primary/20 outline-none min-h-[150px] font-mono text-sm"
                value={localSettings.aiPrompt || 'Escreva uma descrição de escopo de projeto comercial profissional, detalhada e persuasiva para um projeto com o título: "{title}". Foque nos entregáveis e valor agregado. Limite a 3 parágrafos.'}
                onChange={(e) => handleChange('aiPrompt', e.target.value)}
                placeholder="Prompt que será enviado para a IA..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Use <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{title}'}</code> para inserir o título do projeto automaticamente no prompt.
              </p>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default SettingsManager;