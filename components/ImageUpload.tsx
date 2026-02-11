import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    currentUrl?: string;
    onUpload: (url: string) => void;
    label?: string;
    className?: string;
}

export default function ImageUpload({ currentUrl, onUpload, label = "Upload Imagem", className = "" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            setUploading(true);

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('company-assets')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('company-assets')
                .getPublicUrl(filePath);

            onUpload(data.publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Erro ao fazer upload da imagem.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && <label className="block text-sm font-bold text-gray-700">{label}</label>}

            <div className="flex items-start gap-4">
                {/* Preview Area */}
                <div className="relative group shrink-0">
                    <div className="h-24 w-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                        {currentUrl ? (
                            <img
                                src={currentUrl}
                                alt="Preview"
                                className="h-full w-full object-contain"
                            />
                        ) : (
                            <ImageIcon className="text-gray-300 h-8 w-8" />
                        )}
                    </div>
                    {currentUrl && (
                        <button
                            onClick={() => onUpload('')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remover imagem"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="flex-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                    />

                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors w-fit"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    Selecionar Arquivo
                                </>
                            )}
                        </button>
                        <p className="text-xs text-gray-500">
                            Recomendado: JPG, PNG ou WEBP. Máx 2MB.
                        </p>
                    </div>

                    {/* Fallback URL Input (optional, keeps existing functionality accessible) */}
                    <div className="mt-3">
                        <input
                            type="text"
                            value={currentUrl || ''}
                            onChange={(e) => onUpload(e.target.value)}
                            placeholder="Ou cole uma URL externa..."
                            className="text-xs w-full p-2 rounded border border-gray-200 focus:border-primary/50 outline-none text-gray-600 placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
