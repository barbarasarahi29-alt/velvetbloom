import React, { useState } from 'react';
import { X, Copy, Check, Database, ExternalLink, Code2 } from 'lucide-react';
import { SUPABASE_SETUP_SQL } from '../../lib/supabaseSql.ts';

interface SupabaseSqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSqlModal: React.FC<SupabaseSqlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-[#381058]/10 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#381058]/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3ECF8E]/15 border border-[#3ECF8E]/30 flex items-center justify-center text-[#1fa66b]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#381058]">
                Script SQL para Supabase
              </h2>
              <p className="text-xs text-[#6B5B7E]">
                Crea la tabla <code className="font-mono text-[#8668D8] font-bold">products</code> y el bucket de almacenamiento <code className="font-mono text-[#8668D8] font-bold">product-images</code>.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="py-4 space-y-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#381058]/10 text-xs text-[#381058] space-y-1.5">
            <p className="font-semibold text-sm flex items-center gap-1.5 text-[#381058]">
              <span>Pasos sencillos para inicializar Supabase:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700 pl-1">
              <li>Haz clic en el botón verde <strong>"Copiar Script SQL"</strong> abajo.</li>
              <li>
                Abre el{' '}
                <a
                  href="https://supabase.com/dashboard/project/eaortvuyhraehgoymohh/sql"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#8668D8] font-semibold underline inline-flex items-center gap-0.5"
                >
                  Editor SQL de Supabase <ExternalLink className="w-3 h-3" />
                </a>{' '}
                en tu navegador.
              </li>
              <li>Pega el código copiado en una nueva consulta y presiona <strong>"Run"</strong>.</li>
              <li>¡Listo! Tu base de datos y almacenamiento de imágenes quedarán 100% operativos en tiempo real.</li>
            </ol>
          </div>
        </div>

        {/* Code Block Container */}
        <div className="relative flex-1 overflow-hidden rounded-2xl border border-gray-800 bg-[#1E1E2E] shadow-inner flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
              <Code2 className="w-4 h-4 text-[#C3A6FF]" />
              <span>velvet_bloom_supabase.sql</span>
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#381058] hover:bg-[#4d1877] text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Script SQL</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 overflow-y-auto font-mono text-xs text-emerald-300/90 leading-relaxed whitespace-pre selection:bg-[#C3A6FF]/30 selection:text-white flex-1">
            {SUPABASE_SETUP_SQL}
          </pre>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#381058]/10 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-gray-500">
            Proyecto: <strong className="font-mono text-[#381058]">eaortvuyhraehgoymohh</strong>
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#381058] text-white text-xs font-semibold hover:bg-[#4d1877]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
