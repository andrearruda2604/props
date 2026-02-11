import React from 'react';
import { TimelineItem } from '../types';
import { GripVertical, Trash2, PlusCircle, Clock } from 'lucide-react';

interface TimelineEditorProps {
  items: TimelineItem[];
  onChange: (items: TimelineItem[]) => void;
}

const TimelineEditor: React.FC<TimelineEditorProps> = ({ items, onChange }) => {
  const handleAdd = () => {
    const newItem: TimelineItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nova Etapa',
      days: 1,
    };
    onChange([...items, newItem]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: string, field: keyof TimelineItem, value: string | number) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="text-primary w-6 h-6" />
          <h3 className="text-[#151316] text-lg font-bold">Cronograma (Etapas)</h3>
        </div>
        <button
          onClick={handleAdd}
          className="text-primary text-sm font-bold flex items-center gap-1 hover:underline focus:outline-none"
          type="button"
        >
          <PlusCircle size={18} />
          Adicionar Etapa
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 border border-primary/10 rounded-lg bg-background-light/50 group hover:border-primary/30 transition-colors"
          >
            <GripVertical className="text-gray-400 cursor-move" size={20} />
            
            <div className="flex-1 grid grid-cols-12 gap-3 items-center">
              <input
                className="col-span-12 sm:col-span-8 bg-transparent border-none focus:ring-0 text-[#151316] font-medium p-0 focus:outline-none placeholder-gray-400"
                value={item.title}
                onChange={(e) => handleUpdate(item.id, 'title', e.target.value)}
                placeholder="Nome da etapa"
              />
              
              <div className="col-span-12 sm:col-span-4 flex items-center justify-end gap-2">
                <input
                  type="number"
                  min="0"
                  className="w-16 text-center bg-white border border-primary/20 rounded-md py-1 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={item.days}
                  onChange={(e) => handleUpdate(item.id, 'days', parseInt(e.target.value) || 0)}
                />
                <span className="text-xs text-gray-500 uppercase font-bold w-8">dias</span>
                
                <button
                  onClick={() => handleRemove(item.id)}
                  className="ml-2 text-red-400 hover:text-red-600 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1"
                  type="button"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
            Nenhuma etapa definida
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineEditor;