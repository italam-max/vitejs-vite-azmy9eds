// ARCHIVO: src/components/ui/InputGroup.tsx
import React from 'react';
import { HelpCircle } from 'lucide-react';

interface InputGroupProps {
  label: string;
  helpText?: string;
  children: React.ReactNode;
  error?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, helpText, children, error }) => (
  <div className="flex flex-col gap-1.5 relative mb-4">
    <div className="flex items-center gap-2">
      <label className={`text-sm font-bold ${error ? 'text-red-600' : 'text-gray-700'}`}>{label}</label>
      {helpText && (
        <div className="group relative">
          <HelpCircle size={14} className="text-gray-400 cursor-help hover:text-blue-600" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
            {helpText}
          </div>
        </div>
      )}
    </div>
    {children}
    {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
  </div>
);