import React from 'react';
import { LayoutDashboard, Users, FilePlus2, FileStack, Tags, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'clients' | 'editor' | 'prices' | 'settings';
  onNavigate: (view: 'dashboard' | 'clients' | 'editor' | 'prices' | 'settings') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'prices', label: 'Tabela de Preços', icon: Tags },
    { id: 'editor', label: 'Nova Proposta', icon: FilePlus2 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="w-20 md:w-64 bg-white border-r border-primary/10 flex-shrink-0 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-primary/5">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold transition-colors">
          <FileStack size={18} />
        </div>
        <span className="font-bold text-lg text-primary hidden md:block">Prop.OS</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-gray-500 hover:bg-primary/5 hover:text-primary'
              }`}
            >
              <Icon size={22} />
              <span className={`font-medium hidden md:block ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary/5">
        <div className="bg-gradient-to-br from-primary/5 to-purple-100/50 p-4 rounded-xl hidden md:block">
          <p className="text-xs font-bold text-primary mb-1">Versão Pro</p>
          <p className="text-[10px] text-gray-500">Gerencie todas as suas propostas em um só lugar.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;