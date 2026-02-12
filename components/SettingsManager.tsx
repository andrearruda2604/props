import React from 'react';
import { CompanySettings } from '../types';
import { Save, Palette, FileText, Building2, UserCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface SettingsManagerProps {
  settings: CompanySettings;
  onSave: (settings: CompanySettings) => void;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState<CompanySettings>(settings);

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
          <p className="text-gray-500">Customize a aparência e os textos padrão das suas propostas.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-primary/30"
        >
          <Save size={20} />
          Salvar Alterações
        </button>
      </div>

      {/* Visual Identity */}
      <section className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <Palette className="text-primary" size={24} />
          <h3 className="font-bold text-lg text-gray-800">Identidade Visual</h3>
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
          <h3 className="font-bold text-lg text-gray-800">Textos Padrão (Templates)</h3>
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
  );
};

export default SettingsManager;