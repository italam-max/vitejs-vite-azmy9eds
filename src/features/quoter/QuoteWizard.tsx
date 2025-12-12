// ARCHIVO: src/features/quoter/QuoteWizard.tsx
import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Save, Users, Settings, Activity, MoveVertical, Box, Shield, Package, DollarSign, Info, Truck, FileText } from 'lucide-react';
import { QuoteData } from '../../types';
import { INITIAL_FORM_STATE, ELEVATOR_MODELS, CONTROL_GROUPS, CAPACITIES, SPEEDS, TRACTIONS, SHAFT_TYPES, YES_NO, CABIN_MODELS, FLOOR_FINISHES, DOOR_TYPES, NORMS, DISPLAYS } from '../../data/constants';
import { calculateMaterials } from '../../services/calculations';
import { InputGroup } from '../../components/ui/InputGroup';
import { SectionTitle } from '../../components/ui/SectionTitle';

interface QuoteWizardProps {
  initialData?: QuoteData;
  onSave: (data: QuoteData) => void;
  onExit: () => void;
  onUpdate: (data: QuoteData) => void;
  onViewPreview: () => void;
  onOpenOpsCalculator: () => void;
}

export default function QuoteWizard({ initialData, onSave, onExit, onUpdate, onViewPreview, onOpenOpsCalculator }: QuoteWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuoteData>(initialData || INITIAL_FORM_STATE);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Manejo seguro para 'type' que no existe en HTMLSelectElement estándar
    const inputType = (e.target as HTMLInputElement).type; 
    const newData = { ...formData, [name]: inputType === 'number' ? Number(value) : value };
    setFormData(newData);
    onUpdate(newData);
  };

  const materials = useMemo(() => calculateMaterials(formData), [formData]);

  const renderStep = () => {
    switch(step) {
      case 1: 
        return (
          <div className="animate-fadeIn">
            <SectionTitle title="Datos de Contacto" icon={Users} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Cliente"><input name="clientName" value={formData.clientName} onChange={handleChange} className="form-input" /></InputGroup>
              <InputGroup label="Referencia"><input name="projectRef" value={formData.projectRef} onChange={handleChange} className="form-input" /></InputGroup>
              <InputGroup label="Teléfono"><input name="clientPhone" value={formData.clientPhone} onChange={handleChange} className="form-input" /></InputGroup>
              <InputGroup label="Email"><input name="clientEmail" value={formData.clientEmail} onChange={handleChange} className="form-input" /></InputGroup>
            </div>
            
            <SectionTitle title="Configuración Principal" icon={Settings} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <InputGroup label="Cantidad">
                  <input type="number" min="1" name="quantity" value={formData.quantity} onChange={handleChange} className="form-input font-bold text-blue-900" />
               </InputGroup>
               <InputGroup label="Modelo de Equipo">
                  <select name="model" value={formData.model} onChange={handleChange} className="form-select">
                    {ELEVATOR_MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
               </InputGroup>
               <InputGroup label="Tipo de Grupo">
                  <select name="controlGroup" value={formData.controlGroup} onChange={handleChange} className="form-select">
                    {CONTROL_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
               </InputGroup>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fadeIn space-y-6 h-full overflow-auto pr-2">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <SectionTitle title="1. Máquina y Desempeño" icon={Activity} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* ... Inputs de capacidad, personas, velocidad, tracción ... */}
                    <InputGroup label="Capacidad (kg)">
                        <select name="capacity" value={formData.capacity} onChange={handleChange} className="form-select">
                            {CAPACITIES.map(c => <option key={c} value={c}>{c} kg</option>)}
                        </select>
                    </InputGroup>
                    {/* ... Copia el resto de inputs del paso 2 aquí ... */}
                </div>
            </div>
            {/* ... Resto de secciones del paso 2 (Cubo, Cabina, Normativa) ... */}
          </div>
        );
      case 3:
        return (
          <div className="animate-fadeIn h-full flex flex-col gap-6">
             {/* ... Encabezado y Tabla de Materiales (BOM) ... */}
             <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h3 className="text-2xl font-black text-blue-900 flex items-center gap-2">
                  <Package className="text-yellow-500" /> Lista de Materiales (BOM)
                </h3>
             </div>
             
             <div className="flex-1 flex gap-6 overflow-hidden">
                 <div className="flex-1 overflow-auto border rounded-xl bg-white shadow-sm">
                    <table className="w-full text-xs">
                       <thead className="bg-gray-50 text-gray-700 sticky top-0 z-10 font-bold uppercase tracking-wider">
                          <tr>
                             <th className="p-3 text-left w-1/4">Item</th>
                             <th className="p-3 text-left w-1/2">Descripción Técnica</th>
                             <th className="p-3 text-center w-1/4">Cant.</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {Object.entries(materials).map(([cat, data]: any) => (
                              <React.Fragment key={cat}>
                                 <tr className={`${data.color}`}>
                                    <td colSpan={3} className="p-2 px-4 font-bold border-y border-white/50 flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-current opacity-50"></div> {cat}
                                    </td>
                                 </tr>
                                 {data.items.map((item:any, idx:number) => (
                                     <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                         <td className="p-3 font-bold text-gray-800 border-r border-gray-50">{item.product}</td>
                                         <td className="p-3 text-gray-600 leading-relaxed">{item.desc}</td>
                                         <td className="p-3 text-center">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-blue-900 font-mono font-bold">
                                              {item.qty} <span className="text-[10px] text-gray-400 font-sans">{item.unit}</span>
                                            </span>
                                         </td>
                                     </tr>
                                 ))}
                              </React.Fragment>
                          ))}
                       </tbody>
                    </table>
                 </div>

                 <div className="w-80 flex-shrink-0 flex flex-col gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                          <DollarSign size={18} className="text-green-600"/> Costos Estimados
                        </h4>
                        <div className="space-y-4">
                           <button 
                             onClick={onOpenOpsCalculator}
                             className="w-full py-3 bg-blue-100 text-blue-800 rounded-lg font-bold shadow-sm hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 text-sm border border-blue-200"
                           >
                              <Truck size={18}/> Calculadora de Costos Operativos
                           </button>
                        </div>
                    </div>
                    {/* ... Botón de vista previa ... */}
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-xs text-yellow-900 space-y-2">
                       <p className="font-bold flex items-center gap-2"><Info size={14}/> Siguiente Paso</p>
                       <button onClick={onViewPreview} className="w-full mt-2 py-2 bg-blue-900 text-white rounded font-bold shadow hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                          <FileText size={16}/> Generar Vista Previa
                       </button>
                    </div>
                 </div>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b flex justify-between items-center bg-gray-50">
         <div className="flex items-center gap-3">
             <button onClick={onExit} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><ArrowLeft size={20}/></button>
             <div>
                <h2 className="text-xl font-bold text-blue-900">{formData.id ? 'Editar Cotización' : 'Nueva Cotización'}</h2>
                <p className="text-xs text-gray-500">Paso {step} de 3</p>
             </div>
         </div>
         <div className="flex gap-2">
             {[1, 2, 3].map(n => <div key={n} className={`w-3 h-3 rounded-full transition-colors ${step >= n ? 'bg-blue-600' : 'bg-gray-300'}`} />)}
         </div>
      </div>
      <div className="flex-1 p-8 overflow-hidden flex flex-col">{renderStep()}</div>
      <div className="p-6 border-t bg-gray-50 flex justify-between">
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="btn-secondary disabled:opacity-50">Anterior</button>
          {step < 3 ? <button onClick={() => setStep(s => s + 1)} className="btn-primary">Siguiente <ArrowRight size={18}/></button> : <button onClick={() => onSave(formData)} className="btn-primary bg-green-600 hover:bg-green-700 text-white"><Save size={18}/> Guardar</button>}
      </div>
    </div>
  );
}